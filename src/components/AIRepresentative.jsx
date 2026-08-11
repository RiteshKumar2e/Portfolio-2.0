import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDown, ArrowRight, Bot, Check, Download, History, Languages, ShieldAlert,
    Mic, Plus, RotateCcw, Send, Square, UserRound,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { checkHealth } from '../lib/aiClient';
import {
    isIdentityComplete, isValidEmail, loadIdentity, saveIdentity, syncIdentityReset,
} from '../lib/visitor';
import ChatBubble from './ai/ChatBubble';
import { conversationTitle, useChat } from './ai/useChat';
import { useSpeech, useSpeechInput } from './ai/speech';

const STARTERS = [
    'Tell me about this candidate.',
    'Walk me through his strongest project.',
    'How much real ML experience does he have?',
    'What has he shipped to production?',
    'Why should we hire him?',
];

const AIRepresentative = () => {
    const { isDarkMode } = useTheme();
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('auto');
    const [health, setHealth] = useState({ state: 'checking' });
    const [pinned, setPinned] = useState(true);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [identityOpen, setIdentityOpen] = useState(false);
    const [identity, setIdentity] = useState(loadIdentity);
    // A question typed before we know who is asking: held here while the
    // introduction card is up, then sent the moment it is filled in.
    const [pendingQuestion, setPendingQuestion] = useState(null);

    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const historyRef = useRef(null);
    const identityRef = useRef(null);

    const {
        messages,
        isStreaming,
        blocked,
        warning,
        send,
        stop,
        retryLast,
        history,
        activeId,
        newChat,
        openConversation,
        clearConversations,
    } = useChat({
        language,
        onServerMeta: (payload) => applyIdentityReset(payload?.identity_reset_at),
    });
    const { speak, speakingId, supported: ttsSupported } = useSpeech();
    const {
        isListening,
        supported: micSupported,
        toggle: toggleMic,
    } = useSpeechInput({
        onResult: (transcript) => setInput(transcript),
        language: language === 'hi' ? 'hi-IN' : 'en-IN',
    });

    /**
     * The owner wiped the chat log from /admin.html. Nothing this browser
     * remembers exists anywhere any more, so it all goes: the visitor is asked
     * who they are again, and the leftover threads in the history menu — the
     * last trace of a record that has been erased — are cleared with it.
     */
    const applyIdentityReset = useCallback(
        (serverResetAt) => {
            if (!syncIdentityReset(serverResetAt)) return;
            setIdentity(loadIdentity());
            clearConversations();
        },
        [clearConversations]
    );

    // -- backend status ----------------------------------------------------
    useEffect(() => {
        let cancelled = false;

        const poll = () =>
            checkHealth()
                .then((data) => {
                    if (cancelled) return;
                    setHealth(
                        data.llm_configured
                            ? { state: 'online', model: data.model }
                            : { state: 'unconfigured' }
                    );
                    applyIdentityReset(data.identity_reset_at);
                })
                .catch(() => !cancelled && setHealth({ state: 'offline' }));

        poll();

        // Coming back to a tab left open across a wipe counts as a fresh look.
        const onVisible = () => document.visibilityState === 'visible' && poll();
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            cancelled = true;
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [applyIdentityReset]);

    // -- close the popovers on outside click / Escape -----------------------
    useEffect(() => {
        if (!historyOpen && !identityOpen) return undefined;

        const onPointerDown = (event) => {
            if (historyOpen && !historyRef.current?.contains(event.target)) setHistoryOpen(false);
            if (identityOpen && !identityRef.current?.contains(event.target)) setIdentityOpen(false);
        };
        const onKeyDown = (event) => {
            if (event.key !== 'Escape') return;
            setHistoryOpen(false);
            setIdentityOpen(false);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [historyOpen, identityOpen]);

    // -- auto-scroll, unless the visitor has scrolled up to read ------------
    const handleScroll = useCallback(() => {
        const element = scrollRef.current;
        if (!element) return;
        const distanceFromBottom =
            element.scrollHeight - element.scrollTop - element.clientHeight;
        setPinned(distanceFromBottom < 80);
    }, []);

    useLayoutEffect(() => {
        if (!pinned) return;
        const element = scrollRef.current;
        if (element) element.scrollTop = element.scrollHeight;
    }, [messages, pinned]);

    const scrollToBottom = () => {
        const element = scrollRef.current;
        if (element) element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
        setPinned(true);
    };

    // -- sending -----------------------------------------------------------
    const submit = (text) => {
        const value = (text ?? input).trim();
        if (!value || isStreaming || blocked) return;

        // Ask who's asking — once per browser, before the first answer.
        if (!isIdentityComplete(identity)) {
            setInput('');
            setPendingQuestion(value);
            setHistoryOpen(false);
            setIdentityOpen(false);
            return;
        }

        setInput('');
        setPinned(true);
        send(value);
    };

    /** The introduction is filled in: save it and release the held question. */
    const completeIntroduction = (details) => {
        setIdentity(saveIdentity(details));
        const question = pendingQuestion;
        setPendingQuestion(null);
        if (question) {
            setPinned(true);
            setTimeout(() => send(question), 0);
        }
    };

    /** Backed out of the introduction: give them their question back. */
    const cancelIntroduction = () => {
        setInput((current) => current || pendingQuestion || '');
        setPendingQuestion(null);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
        }
    };

    // -- export ------------------------------------------------------------
    const exportTranscript = () => {
        if (!messages.length) return;

        const rows = messages
            .map((message) => {
                const who = message.role === 'user' ? 'You' : "Ritesh's AI";
                const body = message.content
                    .split('\n')
                    .map((line) => `<p>${escapeHtml(line)}</p>`)
                    .join('');
                return `<article class="${message.role}"><h3>${who}</h3>${body}</article>`;
            })
            .join('');

        const printWindow = window.open('', '_blank', 'width=820,height=900');
        if (!printWindow) return;

        printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8">
<title>Chat with Ritesh Kumar's AI — ${new Date().toLocaleDateString()}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 720px; margin: 40px auto; color: #1e293b; line-height: 1.6; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .meta { color: #64748b; font-size: 13px; margin-bottom: 28px; }
  article { border-left: 3px solid #e2e8f0; padding: 4px 0 4px 16px; margin-bottom: 22px; }
  article.user { border-left-color: #6366f1; }
  h3 { font-size: 11px; text-transform: uppercase; letter-spacing: .12em; color: #6366f1; margin: 0 0 6px; }
  article.assistant h3 { color: #64748b; }
  p { margin: 0 0 8px; }
  footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
</style></head><body>
<h1>Chat with Ritesh Kumar's AI representative</h1>
<div class="meta">Exported ${new Date().toLocaleString()} · riteshkr.info</div>
${rows}
<footer>Answers are generated from Ritesh Kumar's structured profile. riteshkumar90359@gmail.com</footer>
</body></html>`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
    };

    // -- styling helpers ---------------------------------------------------
    const identified = isIdentityComplete(identity);

    const surface = isDarkMode
        ? 'bg-slate-900/60 border-white/10'
        : 'bg-white border-slate-200 shadow-sm';

    const statusMeta = {
        checking: { dot: 'bg-slate-400', label: 'Connecting…' },
        online: { dot: 'bg-emerald-500', label: 'AI online' },
        unconfigured: { dot: 'bg-amber-500', label: 'API key not configured' },
        offline: { dot: 'bg-rose-500', label: 'Backend offline' },
    }[health.state];

    return (
        <section id="ai" className="py-24 relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-6 border ${
                            isDarkMode
                                ? 'bg-white/5 text-indigo-300 border-white/10'
                                : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}
                    >
                        <Bot size={13} /> Ask my AI
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-4xl sm:text-6xl md:text-7xl font-black mb-5 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                    >
                        Don't read the resume. <br className="hidden sm:block" />
                        <span className="text-gradient">Interrogate it.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-base md:text-lg font-medium max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                    >
                        This AI answers only from Ritesh's verified profile — and says
                        "I don't know" when the answer isn't in it.
                    </motion.p>
                </div>

                {/* Tabs + status */}
                <div className="flex flex-wrap items-center justify-end gap-4 mb-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span className={`w-2 h-2 rounded-full ${statusMeta.dot} ${health.state === 'online' ? 'animate-pulse' : ''}`} />
                        {statusMeta.label}
                    </div>
                </div>

                {/* Chat panel */}
                <div className={`rounded-[2rem] border overflow-hidden ${surface}`}>
                        {/* Toolbar */}
                        <div
                            className={`flex items-center justify-between gap-3 px-5 sm:px-6 py-3 border-b ${
                                isDarkMode ? 'border-white/10' : 'border-slate-100'
                            }`}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-indigo-600 grid place-items-center text-white shrink-0">
                                    <Bot size={15} />
                                </div>
                                <div className="min-w-0">
                                    <div className={`text-[13px] font-black truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        Ritesh's AI representative
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
                                        Grounded from profile
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <ToolbarButton
                                    label={language === 'hi' ? 'Hindi' : language === 'en' ? 'English' : 'Auto'}
                                    icon={Languages}
                                    onClick={() =>
                                        setLanguage((current) =>
                                            current === 'auto' ? 'en' : current === 'en' ? 'hi' : 'auto'
                                        )
                                    }
                                    isDarkMode={isDarkMode}
                                    showLabel
                                />
                                <ToolbarButton
                                    label="Export chat"
                                    icon={Download}
                                    onClick={exportTranscript}
                                    disabled={!messages.length}
                                    isDarkMode={isDarkMode}
                                />
                                <ToolbarButton
                                    label="New chat"
                                    icon={Plus}
                                    onClick={() => {
                                        setHistoryOpen(false);
                                        newChat();
                                        setPinned(true);
                                    }}
                                    disabled={!messages.length}
                                    isDarkMode={isDarkMode}
                                />

                                {/* History menu */}
                                <div className="relative" ref={historyRef}>
                                    <ToolbarButton
                                        label="Chat history"
                                        icon={History}
                                        onClick={() => setHistoryOpen((open) => !open)}
                                        isDarkMode={isDarkMode}
                                        active={historyOpen}
                                        badge={history.length}
                                    />

                                    <AnimatePresence>
                                        {historyOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                                transition={{ duration: 0.15 }}
                                                className={`absolute right-0 top-11 z-30 w-[min(20rem,calc(100vw-3rem))] rounded-2xl border shadow-xl overflow-hidden ${
                                                    isDarkMode
                                                        ? 'bg-slate-900 border-white/10 shadow-black/50'
                                                        : 'bg-white border-slate-200 shadow-slate-300/40'
                                                }`}
                                            >
                                                <div
                                                    className={`px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] border-b ${
                                                        isDarkMode
                                                            ? 'text-slate-400 border-white/10'
                                                            : 'text-slate-500 border-slate-100'
                                                    }`}
                                                >
                                                    Previous chats
                                                </div>

                                                {history.length === 0 ? (
                                                    <p className="px-4 py-6 text-sm text-slate-500 text-center">
                                                        No saved chats yet.
                                                    </p>
                                                ) : (
                                                    <ul
                                                        className="max-h-72 overflow-y-auto overscroll-contain py-1"
                                                        data-lenis-prevent
                                                    >
                                                        {history.map((conversation) => (
                                                            <li key={conversation.id}>
                                                                <div
                                                                    className={`flex items-center gap-2 px-2 mx-2 my-0.5 rounded-xl transition-colors ${
                                                                        conversation.id === activeId
                                                                            ? isDarkMode
                                                                                ? 'bg-indigo-500/15'
                                                                                : 'bg-indigo-50'
                                                                            : isDarkMode
                                                                              ? 'hover:bg-white/5'
                                                                              : 'hover:bg-slate-50'
                                                                    }`}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            openConversation(conversation.id);
                                                                            setHistoryOpen(false);
                                                                            setPinned(true);
                                                                        }}
                                                                        className="flex-1 min-w-0 text-left py-2.5 px-1.5"
                                                                    >
                                                                        <span
                                                                            className={`block text-[13px] font-bold truncate ${
                                                                                conversation.id === activeId
                                                                                    ? 'text-indigo-500'
                                                                                    : isDarkMode
                                                                                      ? 'text-slate-200'
                                                                                      : 'text-slate-700'
                                                                            }`}
                                                                        >
                                                                            {conversationTitle(conversation)}
                                                                        </span>
                                                                        <span className="block text-[11px] text-slate-500 mt-0.5">
                                                                            {conversation.messages.length} messages ·{' '}
                                                                            {timeAgo(conversation.updatedAt)}
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {history.length > 0 && (
                                                    <p
                                                        className={`px-4 py-3 text-[11px] leading-relaxed border-t ${
                                                            isDarkMode
                                                                ? 'border-white/10 text-slate-500'
                                                                : 'border-slate-100 text-slate-400'
                                                        }`}
                                                    >
                                                        Chats are kept so Ritesh can see what people
                                                        ask. They clear when he clears the log.
                                                    </p>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Optional "who's asking" card */}
                                <div className="relative" ref={identityRef}>
                                    <ToolbarButton
                                        label={identified ? `Asking as ${identity.name || identity.email}` : 'Introduce yourself'}
                                        icon={UserRound}
                                        onClick={() => setIdentityOpen((open) => !open)}
                                        isDarkMode={isDarkMode}
                                        active={identityOpen}
                                        dot={identified}
                                    />

                                    <AnimatePresence>
                                        {identityOpen && (
                                            <IdentityCard
                                                identity={identity}
                                                isDarkMode={isDarkMode}
                                                onSave={(next) => {
                                                    setIdentity(saveIdentity(next));
                                                    setIdentityOpen(false);
                                                }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="relative">
                            {/* data-lenis-prevent-wheel: the page uses Lenis
                                smooth scrolling, which otherwise swallows the
                                wheel here and scrolls the page instead of the
                                chat. Touch is deliberately left alone so phones
                                keep native scrolling.

                                Overscroll: contained on desktop (the pointer can
                                just leave the box), but chained on touch — once
                                the list hits its end a swipe keeps scrolling the
                                page, the way every other site behaves. */}
                            <div
                                ref={scrollRef}
                                onScroll={handleScroll}
                                data-lenis-prevent-wheel
                                className="h-[min(55vh,400px)] sm:h-[min(60vh,520px)] overflow-y-auto touch-pan-y overscroll-y-auto sm:overscroll-y-contain px-5 sm:px-6 py-6 space-y-6"
                                role="log"
                                aria-live="polite"
                            >
                                {messages.length === 0 ? (
                                    <div className="min-h-full flex flex-col items-center justify-center text-center gap-6 py-6">
                                        <div className="w-14 h-14 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 grid place-items-center text-indigo-500">
                                            <Bot size={24} />
                                        </div>
                                        <div>
                                            <p className={`font-black text-lg mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                Ask me anything about Ritesh
                                            </p>
                                            <p className="text-sm text-slate-500 max-w-sm">
                                                Projects, stack decisions, metrics, availability — ask anything.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                                            {STARTERS.map((question) => (
                                                <button
                                                    key={question}
                                                    type="button"
                                                    onClick={() => submit(question)}
                                                    className={`px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all ${
                                                        isDarkMode
                                                            ? 'bg-white/5 border-white/10 text-slate-300 hover:border-indigo-500/40 hover:text-white'
                                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-slate-900'
                                                    }`}
                                                >
                                                    {question}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <ChatBubble
                                            key={message.id}
                                            message={message}
                                            onSpeak={speak}
                                            isSpeaking={speakingId === message.id}
                                            speechSupported={ttsSupported}
                                        />
                                    ))
                                )}

                                {messages.some((m) => m.failed) && !isStreaming && (
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={retryLast}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                                        >
                                            <RotateCcw size={13} /> Retry
                                        </button>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {!pinned && messages.length > 0 && !pendingQuestion && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        type="button"
                                        onClick={scrollToBottom}
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-indigo-600 text-white grid place-items-center shadow-lg shadow-indigo-600/30"
                                        aria-label="Scroll to latest message"
                                    >
                                        <ArrowDown size={16} />
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* One-time introduction, standing in front of the
                                first answer rather than interrupting later. */}
                            <AnimatePresence>
                                {pendingQuestion && (
                                    <IntroductionGate
                                        question={pendingQuestion}
                                        identity={identity}
                                        isDarkMode={isDarkMode}
                                        onSubmit={completeIntroduction}
                                        onCancel={cancelIntroduction}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Composer */}
                        <div className={`px-5 sm:px-6 py-4 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-100'}`}>
                            {(blocked || warning) && (
                                <div
                                    role="alert"
                                    className={`flex items-start gap-3 mb-3 p-4 rounded-2xl border ${
                                        blocked
                                            ? isDarkMode
                                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                                                : 'bg-rose-50 border-rose-200 text-rose-700'
                                            : isDarkMode
                                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                                              : 'bg-amber-50 border-amber-200 text-amber-800'
                                    }`}
                                >
                                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-black uppercase tracking-widest mb-1">
                                            {blocked ? 'Chat disabled' : 'Warning'}
                                        </p>
                                        <p className="text-[13px] leading-relaxed font-medium">
                                            {blocked || warning}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div
                                className={`flex items-end gap-2 rounded-2xl border p-2 transition-colors focus-within:border-indigo-400/60 ${
                                    isDarkMode ? 'bg-slate-950/50 border-white/10' : 'bg-slate-50 border-slate-200'
                                }`}
                            >
                                <textarea
                                    ref={inputRef}
                                    rows={1}
                                    value={input}
                                    onChange={(event) => {
                                        setInput(event.target.value);
                                        const element = event.target;
                                        element.style.height = 'auto';
                                        element.style.height = `${Math.min(element.scrollHeight, 140)}px`;
                                    }}
                                    onKeyDown={handleKeyDown}
                                    disabled={Boolean(blocked)}
                                    placeholder={
                                        blocked
                                            ? 'Chatting has been disabled.'
                                            : isListening
                                              ? 'Listening…'
                                              : 'Ask about projects, skills, availability…'
                                    }
                                    aria-label="Your question"
                                    data-lenis-prevent-wheel
                                    className={`flex-1 bg-transparent resize-none outline-none px-3 py-2.5 text-[15px] max-h-[140px] overflow-y-auto touch-pan-y overscroll-y-auto sm:overscroll-y-contain ${
                                        isDarkMode
                                            ? 'text-slate-200 placeholder:text-slate-600'
                                            : 'text-slate-800 placeholder:text-slate-400'
                                    }`}
                                />

                                {micSupported && (
                                    <button
                                        type="button"
                                        onClick={toggleMic}
                                        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                                        className={`shrink-0 w-10 h-10 rounded-xl grid place-items-center transition-all ${
                                            isListening
                                                ? 'bg-rose-500 text-white animate-pulse'
                                                : isDarkMode
                                                  ? 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                                        }`}
                                    >
                                        <Mic size={17} />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => (isStreaming ? stop() : submit())}
                                    disabled={Boolean(blocked) || (!isStreaming && !input.trim())}
                                    aria-label={isStreaming ? 'Stop generating' : 'Send message'}
                                    className="shrink-0 w-10 h-10 rounded-xl grid place-items-center bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20"
                                >
                                    {isStreaming ? <Square size={15} /> : <Send size={16} />}
                                </button>
                            </div>

                            <p className="mt-2.5 text-[11px] text-slate-500 text-center">
                                <kbd className="font-sans font-bold">Enter</kbd> to send ·{' '}
                                <kbd className="font-sans font-bold">Shift + Enter</kbd> for a new line · answers
                                come only from Ritesh's profile data
                            </p>
                        </div>
                </div>
            </div>
        </section>
    );
};

const ToolbarButton = ({
    label,
    icon: Icon,
    onClick,
    disabled,
    isDarkMode,
    showLabel,
    active,
    badge,
    dot,
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={label}
        aria-label={label}
        aria-expanded={active === undefined ? undefined : active}
        className={`relative inline-flex items-center gap-1.5 h-9 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
            active
                ? isDarkMode
                    ? 'text-indigo-300 bg-white/10'
                    : 'text-indigo-600 bg-indigo-50'
                : isDarkMode
                  ? 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
        }`}
    >
        <Icon size={15} />
        {showLabel && <span className="hidden sm:inline">{label}</span>}
        {badge > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-indigo-600 text-white text-[9px] font-black grid place-items-center tabular-nums">
                {badge > 9 ? '9+' : badge}
            </span>
        )}
        {dot && (
            <span
                className={`absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ${
                    isDarkMode ? 'ring-slate-900' : 'ring-white'
                }`}
            />
        )}
    </button>
);

/**
 * Name and email, plus an optional company. Shared by the one-time gate and
 * the toolbar popover, so both validate identically.
 *
 * Errors only appear once a field has been left or the form submitted —
 * scolding someone mid-keystroke for an incomplete email is obnoxious.
 */
const IdentityFields = ({ draft, setDraft, touched, setTouched, isDarkMode, autoFocus }) => {
    const invalid = {
        name: draft.name.trim().length < 2,
        email: !isValidEmail(draft.email),
    };

    const field = (key) =>
        `w-full px-3 h-10 rounded-xl text-[13px] border outline-none transition-colors ${
            touched[key] && invalid[key]
                ? 'border-rose-400 focus:border-rose-400'
                : isDarkMode
                  ? 'border-white/10 focus:border-indigo-400'
                  : 'border-slate-200 focus:border-indigo-400'
        } ${
            isDarkMode
                ? 'bg-slate-950/60 text-slate-200 placeholder:text-slate-600'
                : 'bg-slate-50 text-slate-800 placeholder:text-slate-400'
        }`;

    const labelClass = `block text-[10px] font-black uppercase tracking-[0.16em] mb-1.5 ${
        isDarkMode ? 'text-slate-400' : 'text-slate-500'
    }`;

    const update = (key) => (event) => setDraft({ ...draft, [key]: event.target.value });
    const blur = (key) => () => setTouched((prev) => ({ ...prev, [key]: true }));

    return (
        <div className="space-y-3">
            <div>
                <label className={labelClass} htmlFor="visitor-name">
                    Name <span className="text-indigo-500">*</span>
                </label>
                <input
                    id="visitor-name"
                    className={field('name')}
                    placeholder="Your name"
                    value={draft.name}
                    maxLength={120}
                    autoFocus={autoFocus}
                    autoComplete="name"
                    aria-invalid={touched.name && invalid.name}
                    onChange={update('name')}
                    onBlur={blur('name')}
                />
                {touched.name && invalid.name && (
                    <p className="mt-1 text-[11px] text-rose-500">Please enter your name.</p>
                )}
            </div>

            <div>
                <label className={labelClass} htmlFor="visitor-email">
                    Email <span className="text-indigo-500">*</span>
                </label>
                <input
                    id="visitor-email"
                    className={field('email')}
                    type="email"
                    placeholder="you@company.com"
                    value={draft.email}
                    maxLength={180}
                    autoComplete="email"
                    aria-invalid={touched.email && invalid.email}
                    onChange={update('email')}
                    onBlur={blur('email')}
                />
                {touched.email && invalid.email && (
                    <p className="mt-1 text-[11px] text-rose-500">
                        Please enter a valid email address.
                    </p>
                )}
            </div>

            <div>
                <label className={labelClass} htmlFor="visitor-company">
                    Company / role <span className="font-bold normal-case tracking-normal text-slate-400">(optional)</span>
                </label>
                <input
                    id="visitor-company"
                    className={field('company')}
                    placeholder="Acme — Engineering Manager"
                    value={draft.company}
                    maxLength={180}
                    autoComplete="organization"
                    onChange={update('company')}
                />
            </div>
        </div>
    );
};

/** Shared submit guard: mark everything touched, bail if anything is invalid. */
function tryComplete(draft, setTouched, onSubmit) {
    setTouched({ name: true, email: true });
    if (!isIdentityComplete(draft)) return;
    onSubmit(draft);
}

/**
 * The one-time gate. It stands in front of the first answer — the question is
 * already typed and waiting behind it — and is never shown again on this
 * browser once name and email are in.
 */
const IntroductionGate = ({ question, identity, isDarkMode, onSubmit, onCancel }) => {
    const [draft, setDraft] = useState(identity);
    const [touched, setTouched] = useState({ name: false, email: false });

    const submit = () => tryComplete(draft, setTouched, onSubmit);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-label="Introduce yourself before asking"
            className={`absolute inset-0 z-20 grid place-items-center px-5 py-6 backdrop-blur-sm ${
                isDarkMode ? 'bg-slate-950/70' : 'bg-white/80'
            }`}
            onKeyDown={(event) => {
                if (event.key === 'Escape') onCancel();
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className={`w-full max-w-sm rounded-3xl border p-5 shadow-2xl overflow-y-auto max-h-full ${
                    isDarkMode
                        ? 'bg-slate-900 border-white/10 shadow-black/50'
                        : 'bg-white border-slate-200 shadow-slate-400/20'
                }`}
                data-lenis-prevent
            >
                <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 grid place-items-center text-indigo-500 shrink-0">
                        <UserRound size={17} />
                    </div>
                    <div>
                        <p className={`text-[15px] font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Before I answer — who's asking?
                        </p>
                        <p className="text-[11px] text-slate-500">Asked once, then never again.</p>
                    </div>
                </div>

                <div
                    className={`rounded-2xl border px-3 py-2.5 mb-4 ${
                        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 mb-1">
                        Your question
                    </p>
                    <p className={`text-[13px] line-clamp-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {question}
                    </p>
                </div>

                <IdentityFields
                    draft={draft}
                    setDraft={setDraft}
                    touched={touched}
                    setTouched={setTouched}
                    isDarkMode={isDarkMode}
                    autoFocus
                />

                <button
                    type="button"
                    onClick={submit}
                    className="w-full mt-4 inline-flex items-center justify-center gap-2 h-11 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
                >
                    Continue <ArrowRight size={14} />
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full mt-2 h-9 rounded-xl text-[11px] font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                    Back
                </button>

                <p className="mt-3 text-[11px] text-slate-500 text-center leading-relaxed">
                    Used only so Ritesh knows who was interested and can follow up.
                </p>
            </motion.div>
        </motion.div>
    );
};

/** Toolbar popover for changing the details later. */
const IdentityCard = ({ identity, isDarkMode, onSave }) => {
    const [draft, setDraft] = useState(identity);
    const [touched, setTouched] = useState({ name: false, email: false });

    return (
        <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-11 z-30 w-[min(19rem,calc(100vw-3rem))] rounded-2xl border shadow-xl p-4 ${
                isDarkMode
                    ? 'bg-slate-900 border-white/10 shadow-black/50'
                    : 'bg-white border-slate-200 shadow-slate-300/40'
            }`}
        >
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Who's asking?
            </p>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                So Ritesh knows who was interested and can follow up.
            </p>

            <IdentityFields
                draft={draft}
                setDraft={setDraft}
                touched={touched}
                setTouched={setTouched}
                isDarkMode={isDarkMode}
            />

            <button
                type="button"
                onClick={() => tryComplete(draft, setTouched, onSave)}
                className="w-full mt-3 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-colors"
            >
                <Check size={13} /> Save
            </button>
        </motion.div>
    );
};

/** "3m ago" / "2h ago" / "5d ago" — enough context to find an old chat. */
function timeAgo(timestamp) {
    const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
    if (seconds < 60) return 'just now';
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    return days < 7 ? `${days}d ago` : new Date(timestamp).toLocaleDateString();
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export default AIRepresentative;
