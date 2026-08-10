import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { streamChat } from '../../lib/aiClient';
import { visitorContext } from '../../lib/visitor';

const STORAGE_KEY = 'ai-portfolio-chats-v1';
const LEGACY_KEY = 'ai-portfolio-chat-v1'; // single-thread format, pre-history
const MAX_CONVERSATIONS = 20;
const MAX_STORED_MESSAGES = 40;

const newId = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const makeConversation = (messages = []) => ({
    id: newId(),
    messages,
    createdAt: Date.now(),
    updatedAt: Date.now(),
});

/** Conversation title = the visitor's first question, trimmed. */
export function conversationTitle(conversation) {
    const firstUser = conversation.messages.find((m) => m.role === 'user');
    if (!firstUser) return 'New chat';
    const text = firstUser.content.trim().replace(/\s+/g, ' ');
    return text.length > 52 ? `${text.slice(0, 52)}…` : text;
}

function loadInitialState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.conversations?.length) {
                const activeId = parsed.conversations.some((c) => c.id === parsed.activeId)
                    ? parsed.activeId
                    : parsed.conversations[0].id;
                return { activeId, conversations: parsed.conversations };
            }
        }

        // One-time migration: an older build stored a single message array.
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
            const messages = JSON.parse(legacy);
            localStorage.removeItem(LEGACY_KEY);
            if (Array.isArray(messages) && messages.length) {
                const conversation = makeConversation(messages);
                return { activeId: conversation.id, conversations: [conversation] };
            }
        }
    } catch {
        /* corrupt or unavailable storage — start clean rather than crash */
    }

    const conversation = makeConversation();
    return { activeId: conversation.id, conversations: [conversation] };
}

/**
 * Chat state: streaming, conversation memory, and a persisted history of past
 * conversations that the visitor can reopen.
 */
export function useChat({ jobDescription = null, language = 'auto' } = {}) {
    const [state, setState] = useState(loadInitialState);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);

    const abortRef = useRef(null);
    const stateRef = useRef(state);
    stateRef.current = state;

    const { activeId, conversations } = state;

    const messages = useMemo(
        () => conversations.find((c) => c.id === activeId)?.messages ?? [],
        [conversations, activeId]
    );

    /** Past conversations that actually contain something, newest first. */
    const history = useMemo(
        () =>
            conversations
                .filter((c) => c.messages.length > 0)
                .slice()
                .sort((a, b) => b.updatedAt - a.updatedAt),
        [conversations]
    );

    useEffect(() => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    activeId: state.activeId,
                    conversations: state.conversations
                        .filter((c) => c.messages.length > 0 || c.id === state.activeId)
                        .slice(-MAX_CONVERSATIONS)
                        .map((c) => ({ ...c, messages: c.messages.slice(-MAX_STORED_MESSAGES) })),
                })
            );
        } catch {
            /* private mode / quota — persistence is a nicety, not a requirement */
        }
    }, [state]);

    useEffect(() => () => abortRef.current?.abort(), []);

    /** Apply a change to one specific conversation's message list.
     *
     * Targeted by id rather than "whatever is active", because a stream can
     * outlive the visitor switching to another chat — its tokens (and its
     * abort/error handling) must land in the conversation it started in.
     */
    const updateConversation = useCallback((id, updater) => {
        setState((prev) => ({
            ...prev,
            conversations: prev.conversations.map((conversation) =>
                conversation.id === id
                    ? {
                          ...conversation,
                          messages: updater(conversation.messages),
                          updatedAt: Date.now(),
                      }
                    : conversation
            ),
        }));
    }, []);

    const send = useCallback(
        async (rawText) => {
            const text = rawText.trim();
            if (!text || isStreaming) return;

            setError(null);

            // Memory: everything already exchanged goes back to the model, so
            // follow-ups like "which one was the hardest?" resolve correctly.
            const conversationId = stateRef.current.activeId;
            const current =
                stateRef.current.conversations.find((c) => c.id === conversationId)?.messages ?? [];
            const historyPayload = current
                .filter((m) => !m.failed && m.content.trim())
                .map((m) => ({ role: m.role, content: m.content }));

            const assistantId = newId();
            updateConversation(conversationId, (prev) => [
                ...prev,
                { id: newId(), role: 'user', content: text },
                { id: assistantId, role: 'assistant', content: '', pending: true },
            ]);
            setIsStreaming(true);

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                await streamChat({
                    message: text,
                    history: historyPayload,
                    jobDescription,
                    language,
                    // Who asked, which thread, and how far into it — the
                    // backend files this alongside the question.
                    visitor: visitorContext({
                        conversationId,
                        turn: historyPayload.filter((m) => m.role === 'user').length + 1,
                    }),
                    signal: controller.signal,
                    onToken: (chunk) => {
                        updateConversation(conversationId, (prev) =>
                            prev.map((m) =>
                                m.id === assistantId
                                    ? { ...m, content: m.content + chunk, pending: false }
                                    : m
                            )
                        );
                    },
                    onDone: ({ model }) => {
                        updateConversation(conversationId, (prev) =>
                            prev.map((m) => (m.id === assistantId ? { ...m, model } : m))
                        );
                    },
                });
            } catch (err) {
                if (err.name === 'AbortError') {
                    updateConversation(conversationId, (prev) =>
                        prev.map((m) =>
                            m.id === assistantId
                                ? {
                                      ...m,
                                      pending: false,
                                      stopped: true,
                                      content: m.content || 'Generation stopped.',
                                  }
                                : m
                        )
                    );
                } else {
                    const detail =
                        err.message === 'Failed to fetch'
                            ? 'Could not reach the AI backend. It may be starting up (free hosting sleeps after inactivity) — try again in a few seconds.'
                            : err.message;
                    setError(detail);
                    updateConversation(conversationId, (prev) =>
                        prev.map((m) =>
                            m.id === assistantId
                                ? { ...m, pending: false, failed: true, content: detail }
                                : m
                        )
                    );
                }
            } finally {
                setIsStreaming(false);
                abortRef.current = null;
            }
        },
        [isStreaming, jobDescription, language, updateConversation]
    );

    const stop = useCallback(() => abortRef.current?.abort(), []);

    /** Start a fresh conversation; the current one stays in history. */
    const newChat = useCallback(() => {
        abortRef.current?.abort();
        setError(null);
        setState((prev) => {
            const active = prev.conversations.find((c) => c.id === prev.activeId);
            // Already on an empty chat — nothing to archive, nothing to create.
            if (active && active.messages.length === 0) return prev;

            const conversation = makeConversation();
            return {
                activeId: conversation.id,
                conversations: [
                    ...prev.conversations.filter((c) => c.messages.length > 0),
                    conversation,
                ].slice(-MAX_CONVERSATIONS),
            };
        });
    }, []);

    const openConversation = useCallback((id) => {
        abortRef.current?.abort();
        setError(null);
        setState((prev) => {
            if (!prev.conversations.some((c) => c.id === id)) return prev;
            return {
                activeId: id,
                // Drop the empty chat we may be leaving behind.
                conversations: prev.conversations.filter(
                    (c) => c.messages.length > 0 || c.id === id
                ),
            };
        });
    }, []);

    // There is deliberately no delete here. Conversations stay put: the visitor
    // keeps their local copy, and the authoritative record on the server can
    // only be read or erased by the site owner, through /admin.html.

    const retryLast = useCallback(() => {
        const lastUser = [...messages].reverse().find((m) => m.role === 'user');
        if (!lastUser) return;
        updateConversation(activeId, (prev) => {
            const index = prev.findIndex((m) => m.id === lastUser.id);
            return index === -1 ? prev : prev.slice(0, index);
        });
        setTimeout(() => send(lastUser.content), 0);
    }, [activeId, messages, send, updateConversation]);

    return {
        messages,
        isStreaming,
        error,
        send,
        stop,
        retryLast,
        // history
        history,
        activeId,
        newChat,
        openConversation,
    };
}
