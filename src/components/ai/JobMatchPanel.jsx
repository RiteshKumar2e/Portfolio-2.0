import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle, CheckCircle2, HelpCircle, Loader2, MessageSquareQuote,
    Sparkles, Target, ThumbsDown, ThumbsUp, XCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { generateInterviewQuestions, matchJobDescription } from '../../lib/aiClient';
import { visitorContext } from '../../lib/visitor';

const VERDICTS = {
    strong_match: { label: 'Strong match', tone: 'emerald' },
    good_match: { label: 'Good match', tone: 'indigo' },
    partial_match: { label: 'Partial match', tone: 'amber' },
    weak_match: { label: 'Weak match', tone: 'rose' },
};

const TONES = {
    emerald: { text: 'text-emerald-500', stroke: '#10b981', chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20' },
    indigo: { text: 'text-indigo-500', stroke: '#6366f1', chip: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20' },
    amber: { text: 'text-amber-500', stroke: '#f59e0b', chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20' },
    rose: { text: 'text-rose-500', stroke: '#f43f5e', chip: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20' },
};

const ScoreRing = ({ score, tone }) => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const { isDarkMode } = useTheme();

    return (
        <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle
                    cx="60" cy="60" r={radius} fill="none" strokeWidth="10"
                    stroke={isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)'}
                />
                <motion.circle
                    cx="60" cy="60" r={radius} fill="none" strokeWidth="10" strokeLinecap="round"
                    stroke={TONES[tone].stroke}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                    <div className={`text-4xl font-black tabular-nums ${TONES[tone].text}`}>{score}</div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">/ 100</div>
                </div>
            </div>
        </div>
    );
};

const Chips = ({ title, items, icon: Icon, chipClass, emptyText }) => {
    const { isDarkMode } = useTheme();
    return (
        <div>
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <Icon size={13} /> {title}
            </div>
            {items?.length ? (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                        <span key={index} className={`px-3 py-1.5 rounded-xl text-[12px] font-bold border ${chipClass}`}>
                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-slate-500 italic">{emptyText}</p>
            )}
        </div>
    );
};

const Bullets = ({ title, items, icon: Icon }) => {
    const { isDarkMode } = useTheme();
    if (!items?.length) return null;
    return (
        <div>
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <Icon size={13} /> {title}
            </div>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className={`flex gap-2.5 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full bg-indigo-500/60 shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const JobMatchPanel = ({ jobDescription, setJobDescription, onAskInChat }) => {
    const { isDarkMode } = useTheme();
    const [result, setResult] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [error, setError] = useState(null);

    const tooShort = jobDescription.trim().length < 20;

    const analyse = async () => {
        if (tooShort || loading) return;
        setLoading(true);
        setError(null);
        setResult(null);
        setQuestions(null);
        try {
            setResult(await matchJobDescription(jobDescription.trim(), visitorContext()));
        } catch (err) {
            setError(
                err.message === 'Failed to fetch'
                    ? 'Could not reach the AI backend. It may be waking up — try again in a few seconds.'
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    };

    const askQuestions = async () => {
        if (questionsLoading) return;
        setQuestionsLoading(true);
        setError(null);
        try {
            const data = await generateInterviewQuestions({
                jobDescription: jobDescription.trim() || null,
                focus: 'mixed',
                count: 6,
            });
            setQuestions(data.questions);
        } catch (err) {
            setError(err.message);
        } finally {
            setQuestionsLoading(false);
        }
    };

    const verdict = result ? VERDICTS[result.verdict] ?? VERDICTS.partial_match : null;

    const inputClass = `w-full rounded-2xl border p-4 text-[15px] leading-relaxed resize-y outline-none transition-colors ${
        isDarkMode
            ? 'bg-slate-900/70 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500/50'
            : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-indigo-400'
    }`;

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="jd-input" className={`block text-[10px] font-black uppercase tracking-[0.25em] mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Paste a job description
                </label>
                <textarea
                    id="jd-input"
                    rows={8}
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                    data-lenis-prevent-wheel
                    placeholder="Paste the full JD here — responsibilities, required skills, experience level. The AI will score the fit honestly, including what's missing."
                    className={inputClass}
                />
                <div className="flex flex-wrap items-center gap-3 mt-4">
                    <button
                        type="button"
                        onClick={analyse}
                        disabled={tooShort || loading}
                        className="inline-flex items-center gap-2.5 h-12 px-6 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Target size={16} />}
                        {loading ? 'Analysing…' : 'Score the fit'}
                    </button>

                    <button
                        type="button"
                        onClick={askQuestions}
                        disabled={questionsLoading}
                        className={`inline-flex items-center gap-2.5 h-12 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all disabled:opacity-40 ${
                            isDarkMode
                                ? 'border-white/10 text-slate-300 hover:border-indigo-500/40 hover:text-white'
                                : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-slate-900'
                        }`}
                    >
                        {questionsLoading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquareQuote size={16} />}
                        Interview questions
                    </button>

                    {jobDescription.trim() && (
                        <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            The chat tab now answers with this JD in context.
                        </span>
                    )}
                </div>
            </div>

            {error && (
                <div className={`rounded-2xl border p-4 text-sm font-medium ${isDarkMode ? 'bg-rose-500/10 border-rose-500/25 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                    {error}
                </div>
            )}

            <AnimatePresence mode="wait">
                {result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`rounded-3xl border p-6 sm:p-8 space-y-8 ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
                    >
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <ScoreRing score={result.suitability_score} tone={verdict.tone} />
                            <div className="text-center sm:text-left min-w-0">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-3 ${TONES[verdict.tone].chip}`}>
                                    <Sparkles size={12} /> {verdict.label}
                                </div>
                                <h4 className={`text-2xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {result.role_title}
                                </h4>
                                <p className={`text-[15px] leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {result.summary}
                                </p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <Chips
                                title="Evidenced in the profile"
                                items={result.matching_skills}
                                icon={CheckCircle2}
                                chipClass="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                                emptyText="No direct matches found."
                            />
                            <Chips
                                title="Not evidenced / missing"
                                items={result.missing_skills}
                                icon={XCircle}
                                chipClass="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                                emptyText="Nothing flagged as missing."
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <Bullets title="Strengths for this role" items={result.strengths} icon={ThumbsUp} />
                            <Bullets title="Concerns" items={result.concerns} icon={AlertTriangle} />
                        </div>

                        <div className={`rounded-2xl border p-5 ${result.should_interview ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                            <div className="flex items-center gap-2.5 mb-2">
                                {result.should_interview ? (
                                    <ThumbsUp size={16} className="text-emerald-500" />
                                ) : (
                                    <ThumbsDown size={16} className="text-amber-500" />
                                )}
                                <span className={`text-[11px] font-black uppercase tracking-widest ${result.should_interview ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'}`}>
                                    {result.should_interview ? 'Worth interviewing' : 'Interview not recommended for this role'}
                                </span>
                            </div>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                {result.interview_rationale}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => onAskInChat('Based on this job description, why should we hire this candidate — and what would worry you?')}
                            className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                        >
                            Discuss this in chat →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {questions && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`rounded-3xl border p-6 sm:p-8 ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
                    >
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <HelpCircle size={13} /> Suggested interview questions
                        </div>
                        <ol className="space-y-5">
                            {questions.map((item, index) => (
                                <li key={index} className="flex gap-4">
                                    <span className="shrink-0 w-7 h-7 rounded-xl grid place-items-center text-[11px] font-black bg-indigo-600/10 text-indigo-500 border border-indigo-500/20">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <p className={`font-bold leading-snug mb-1.5 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                            {item.question}
                                        </p>
                                        <p className="text-[13px] text-slate-500 leading-relaxed">
                                            <span className="font-black uppercase tracking-widest text-[10px] text-indigo-500">{item.category}</span>
                                            {' — '}{item.why_it_matters}
                                        </p>
                                        <p className="text-[12px] text-slate-500/80 italic mt-1">From: {item.grounded_in}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobMatchPanel;
