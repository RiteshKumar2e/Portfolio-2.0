import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDown, Bot, Briefcase, Download, History, Languages, MessageSquare,
    Mic, Plus, RotateCcw, Send, Square, Trash2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { checkHealth } from '../lib/aiClient';
import ChatBubble from './ai/ChatBubble';
import JobMatchPanel from './ai/JobMatchPanel';
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
    const [tab, setTab] = useState('chat');
    const [input, setInput] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [language, setLanguage] = useState('auto');
    const [health, setHealth] = useState({ state: 'checking' });
    const [pinned, setPinned] = useState(true);
    const [historyOpen, setHistoryOpen] = useState(false);

    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const historyRef = useRef(null);

    const {
        messages,
        isStreaming,
        send,
        stop,
        retryLast,
        history,
        activeId,
        newChat,
        openConversation,
        deleteConversation,
        clearAll,
    } = useChat({
        jobDescription: jobDescription.trim() || null,
        language,
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

    // -- backend status ----------------------------------------------------
    useEffect(() => {
        let cancelled = false;
        checkHealth()
            .then((data) => {
                if (cancelled) return;
                setHealth(
                    data.llm_configured
                        ? { state: 'online', model: data.model }
                        : { state: 'unconfigured' }
                );
            })
            .catch(() => !cancelled && setHealth({ state: 'offline' }));
        return () => {
            cancelled = true;
        };
    }, []);

    // -- close the history menu on outside click / Escape -------------------
    useEffect(() => {
        if (!historyOpen) return undefined;

        const onPointerDown = (event) => {
            if (!historyRef.current?.contains(event.target)) setHistoryOpen(false);
        };
        const onKeyDown = (event) => event.key === 'Escape' && setHistoryOpen(false);

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [historyOpen]);

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
        if (!value || isStreaming) return;
        setInput('');
        setPinned(true);
        send(value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
        }
    };

    const askInChat = (question) => {
        setTab('chat');
        setTimeout(() => submit(question), 60);
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
                        "I don't know" when the answer isn't in it. Paste a job description
                        and it will score the fit, gaps included.
                    </motion.p>
                </div>

                {/* Tabs + status */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                    <div
                        className={`inline-flex p-1 rounded-2xl border ${
                            isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-slate-100 border-slate-200'
                        }`}
                        role="tablist"
                    >
                        {[
                            { id: 'chat', label: 'Chat', icon: MessageSquare },
                            { id: 'match', label: 'Job match', icon: Briefcase },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={tab === id}
                                onClick={() => setTab(id)}
                                className={`inline-flex items-center gap-2 px-5 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                    tab === id
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                        : isDarkMode
                                          ? 'text-slate-400 hover:text-slate-200'
                                          : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Icon size={14} /> {label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span className={`w-2 h-2 rounded-full ${statusMeta.dot} ${health.state === 'online' ? 'animate-pulse' : ''}`} />
                        {statusMeta.label}
                    </div>
                </div>

                {/* Panels */}
                {tab === 'match' ? (
                    <div className={`rounded-[2rem] border p-6 sm:p-8 ${surface}`}>
                        <JobMatchPanel
                            jobDescription={jobDescription}
                            setJobDescription={setJobDescription}
                            onAskInChat={askInChat}
                        />
                    </div>
                ) : (
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
                                        {jobDescription.trim() ? 'Job description in context' : 'Grounded from profile'}
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
                                                                    className={`group flex items-center gap-2 px-2 mx-2 my-0.5 rounded-xl transition-colors ${
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

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteConversation(conversation.id)}
                                                                        aria-label={`Delete chat: ${conversationTitle(conversation)}`}
                                                                        className="shrink-0 w-8 h-8 rounded-lg grid place-items-center text-slate-400 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                                                    >
                                                                        <Trash2 size={13} />
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {history.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            clearAll();
                                                            setHistoryOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest border-t transition-colors ${
                                                            isDarkMode
                                                                ? 'border-white/10 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5'
                                                                : 'border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                                                        }`}
                                                    >
                                                        Delete all chats
                                                    </button>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="relative">
                            {/* data-lenis-prevent: the page uses Lenis smooth
                                scrolling, which otherwise swallows the wheel
                                here and scrolls the page instead of the chat.
                                overscroll-contain stops the page from taking
                                over once this list hits its end. */}
                            <div
                                ref={scrollRef}
                                onScroll={handleScroll}
                                data-lenis-prevent
                                className="h-[min(60vh,520px)] overflow-y-auto overscroll-contain px-5 sm:px-6 py-6 space-y-6"
                                role="log"
                                aria-live="polite"
                            >
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-6">
                                        <div className="w-14 h-14 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 grid place-items-center text-indigo-500">
                                            <Bot size={24} />
                                        </div>
                                        <div>
                                            <p className={`font-black text-lg mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                Ask me anything about Ritesh
                                            </p>
                                            <p className="text-sm text-slate-500 max-w-sm">
                                                Projects, stack decisions, metrics, availability — or paste a JD in the Job match tab.
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
                                {!pinned && messages.length > 0 && (
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
                        </div>

                        {/* Composer */}
                        <div className={`px-5 sm:px-6 py-4 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-100'}`}>
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
                                    placeholder={isListening ? 'Listening…' : 'Ask about projects, skills, availability…'}
                                    aria-label="Your question"
                                    data-lenis-prevent
                                    className={`flex-1 bg-transparent resize-none outline-none px-3 py-2.5 text-[15px] max-h-[140px] overflow-y-auto overscroll-contain ${
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
                                    disabled={!isStreaming && !input.trim()}
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
                )}
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
    </button>
);

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
