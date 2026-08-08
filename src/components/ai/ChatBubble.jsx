import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, Copy, Sparkles, Square, User, Volume2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import MarkdownLite from './MarkdownLite';

export const TypingDots = () => (
    <span className="inline-flex items-center gap-1.5 py-1" aria-label="Thinking">
        {[0, 1, 2].map((index) => (
            <motion.span
                key={index}
                className="w-2 h-2 rounded-full bg-indigo-500/70"
                animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: index * 0.18 }}
            />
        ))}
    </span>
);

const ChatBubble = ({ message, onSpeak, isSpeaking, speechSupported }) => {
    const { isDarkMode } = useTheme();
    const [copied, setCopied] = useState(false);
    const isUser = message.role === 'user';

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            /* clipboard blocked — nothing useful to show the visitor */
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`flex gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div
                className={`shrink-0 w-9 h-9 rounded-2xl grid place-items-center border shadow-sm ${
                    isUser
                        ? isDarkMode
                            ? 'bg-white/5 border-white/10 text-slate-300'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        : 'bg-indigo-600 border-indigo-500/40 text-white'
                }`}
                aria-hidden="true"
            >
                {isUser ? <User size={16} /> : <Sparkles size={16} />}
            </div>

            <div className={`min-w-0 max-w-[88%] sm:max-w-[78%] ${isUser ? 'items-end' : ''}`}>
                <div
                    className={`rounded-3xl px-5 py-4 text-[15px] border shadow-sm break-words ${
                        isUser
                            ? 'bg-indigo-600 border-indigo-500/40 text-white rounded-tr-lg'
                            : message.failed
                              ? isDarkMode
                                  ? 'bg-rose-500/10 border-rose-500/25 text-rose-200 rounded-tl-lg'
                                  : 'bg-rose-50 border-rose-200 text-rose-700 rounded-tl-lg'
                              : isDarkMode
                                ? 'bg-slate-900/80 border-white/10 text-slate-200 rounded-tl-lg'
                                : 'bg-white border-slate-200 text-slate-700 rounded-tl-lg'
                    }`}
                >
                    {message.failed && (
                        <div className="flex items-center gap-2 mb-2 text-[11px] font-black uppercase tracking-widest">
                            <AlertTriangle size={13} /> Couldn't answer
                        </div>
                    )}

                    {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    ) : message.pending && !message.content ? (
                        <TypingDots />
                    ) : (
                        <MarkdownLite>{message.content}</MarkdownLite>
                    )}
                </div>

                {/* Actions — assistant answers only */}
                {!isUser && !message.pending && message.content && !message.failed && (
                    <div className="flex items-center gap-1 mt-2 px-1">
                        <button
                            type="button"
                            onClick={copy}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                                isDarkMode
                                    ? 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                            aria-label="Copy response"
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>

                        {speechSupported && (
                            <button
                                type="button"
                                onClick={() => onSpeak(message.id, message.content)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                                    isSpeaking
                                        ? 'text-indigo-500'
                                        : isDarkMode
                                          ? 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                                aria-label={isSpeaking ? 'Stop reading aloud' : 'Read response aloud'}
                            >
                                {isSpeaking ? <Square size={12} /> : <Volume2 size={12} />}
                                {isSpeaking ? 'Stop' : 'Listen'}
                            </button>
                        )}

                        {/* Which model answered — the backend fails over between
                            several when one is rate-limited. */}
                        {message.model && (
                            <span
                                className="ml-auto pl-2 text-[10px] font-bold text-slate-500/70 truncate max-w-[45%]"
                                title={`Answered by ${message.model}`}
                            >
                                {message.model.split('/').pop()}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChatBubble;
