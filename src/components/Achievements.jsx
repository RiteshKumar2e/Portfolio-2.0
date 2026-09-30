import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    FaTrophy, FaMedal, FaStar, FaAward, FaCertificate,
    FaCode, FaGraduationCap, FaLightbulb, FaUsers, FaChartLine,
    FaRocket, FaHandshake, FaUserTie, FaBrain, FaClock, FaSmile,
    FaServer, FaBolt, FaTachometerAlt, FaPlug, FaLandmark, FaBookOpen, FaRedoAlt
} from 'react-icons/fa';
import { Trophy as LTrophy, Target as LTarget, FolderGit2 as LFolder, Briefcase as LBriefcase, Crown as LCrown, Zap as LZap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Achievements = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [activeTab, setActiveTab] = useState('achievements');
    const [openRow, setOpenRow] = useState(0);

    const achievementsData = {
        achievements: [
            {
                icon: FaBookOpen,
                title: 'First-Author Research Paper',
                description: 'SteelSense-BiLSTM, with K. K. Singh — under review at Discover Computing (Springer Nature), 2026.',
                color: 'from-indigo-600 to-violet-600',
                gradient: 'bg-gradient-to-br from-indigo-600/10 to-violet-600/10',
                category: 'Achievements'
            },
            {
                icon: FaRocket,
                title: 'AutonomousHacks ’26 Finalist',
                description: 'Offline finalist from 2,000+ participants in the Agentic AI track, organized by GDG Gandhinagar.',
                color: 'from-indigo-600 to-violet-600',
                gradient: 'bg-gradient-to-br from-indigo-600/10 to-violet-600/10',
                category: 'Achievements'
            },
            {
                icon: FaTrophy,
                title: '98.61 Percentile',
                description: 'Awarded Merit Certificate in Naukri Campus Young Turks - Round 1 (2025)',
                color: 'from-orange-500 to-amber-500',
                gradient: 'bg-gradient-to-br from-orange-500/10 to-amber-500/10',
                category: 'Achievements'
            },
            {
                icon: FaRocket,
                title: 'IBM Hackathon 2025',
                description: 'National Finalist — Cleared IBM HackerRank challenge and competed in 24-hour national hackathon',
                color: 'from-blue-500 to-indigo-500',
                gradient: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
                category: 'Achievements'
            },
            {
                icon: FaMedal,
                title: '2nd Place CodeFest',
                description: 'Secured 2nd place at CodeFest, Arka Jain University during Engineering Day competition',
                color: 'from-purple-500 to-pink-500',
                gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
                category: 'Achievements'
            },
            {
                icon: FaCertificate,
                title: 'NPTEL DBMS Certificate',
                description: 'Earned Certificate in Database Management Systems through NPTEL online learning platform',
                color: 'from-pink-500 to-rose-500',
                gradient: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
                category: 'Achievements'
            },
            {
                icon: FaHandshake,
                title: 'Organized Hack Horizon 1.0 (2025)',
                description: 'University-level hackathon fostering innovation and collaboration among tech enthusiasts',
                color: 'from-indigo-500 to-purple-500',
                gradient: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10',
                category: 'Achievements'
            },
              {
                icon: FaHandshake,
                title: 'Organized Hack Horizon 2.0(2026)',
                description: 'National-level hackathon fostering innovation and collaboration among tech enthusiasts with 170+ teams and 750+ participants.',
                color: 'from-indigo-500 to-purple-500',
                gradient: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10',
                category: 'Achievements'
            }
        ],
        strengths: [
            {
                icon: FaBrain,
                title: 'Analytical Thinking',
                description: 'Skilled in identifying patterns, interpreting data, and solving problems logically',
                color: 'from-cyan-500 to-blue-600',
                gradient: 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10',
                category: 'Strengths'
            },
            {
                icon: FaLightbulb,
                title: 'Critical Reasoning',
                description: 'Strong ability to assess complex issues and make effective decisions',
                color: 'from-amber-500 to-orange-600',
                gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-600/10',
                category: 'Strengths'
            },
            {
                icon: FaUsers,
                title: 'Teamwork & Collaboration',
                description: 'Excellent at working within diverse teams to achieve shared goals',
                color: 'from-emerald-500 to-teal-600',
                gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/10',
                category: 'Strengths'
            },
            {
                icon: FaClock,
                title: 'Time Management',
                description: 'Efficient in prioritizing tasks and meeting deadlines consistently',
                color: 'from-violet-500 to-purple-600',
                gradient: 'bg-gradient-to-br from-violet-500/10 to-purple-600/10',
                category: 'Strengths'
            },
            {
                icon: FaSmile,
                title: 'Professional Attitude',
                description: 'Maintain an optimistic and adaptable mindset fostering continuous learning',
                color: 'from-rose-500 to-pink-600',
                gradient: 'bg-gradient-to-br from-rose-500/10 to-pink-600/10',
                category: 'Strengths'
            }
        ],
        leadership: [
            {
                icon: FaUserTie,
                title: 'Gen. Secretary & President — CCS',
                description: 'General Secretary and President of the Code & Compute Society, coordinating with faculty and driving coding culture on campus',
                color: 'from-green-600 to-emerald-600',
                gradient: 'bg-gradient-to-br from-green-600/10 to-emerald-600/10',
                category: 'Leadership'
            },
            {
                icon: FaUsers,
                title: 'Community Lead - GDG',
                description: 'GDG on Campus AJU — Organizing tech events, workshops, and peer-learning sessions',
                color: 'from-red-600 to-rose-600',
                gradient: 'bg-gradient-to-br from-red-600/10 to-rose-600/10',
                category: 'Leadership'
            },
            {
                icon: FaStar,
                title: 'Class Representative',
                description: 'Bridge between faculty and students, ensuring effective communication and academic coordination',
                color: 'from-orange-600 to-amber-600',
                gradient: 'bg-gradient-to-br from-orange-600/10 to-amber-600/10',
                category: 'Leadership'
            },
            {
                icon: FaBrain,
                title: 'Gate Club Member',
                description: 'Organizing workshops and discussions to support GATE exam preparation and peer learning',
                color: 'from-teal-600 to-cyan-600',
                gradient: 'bg-gradient-to-br from-teal-600/10 to-cyan-600/10',
                category: 'Leadership'
            }
        ],
        technical: [
            {
                icon: FaServer,
                title: '99.67% on NEU-DET',
                description: 'SteelSense-BiLSTM reached 99.67% ± 0.23 on NEU-DET and 99.02% ± 0.40 on SteelDefectX across 5 seeds, beating XGBoost, Random Forest, SVM, MobileNetV3 and ShuffleNetV2',
                color: 'from-amber-600 to-orange-600',
                gradient: 'bg-gradient-to-br from-amber-600/10 to-orange-600/10',
                category: 'Technical'
            },
            {
                icon: FaBolt,
                title: '2.5 s → 0.5 s Responses',
                description: 'Cut QuickFix API response time from 2.5 s to ~0.5 s with an in-memory cache for repeated queries, behind a 3-tier LLM fallback: Groq LLaMA 3.3 → Gemini 2.0 Flash → local TF-IDF/TextBlob',
                color: 'from-yellow-500 to-amber-600',
                gradient: 'bg-gradient-to-br from-yellow-500/10 to-amber-600/10',
                category: 'Technical'
            },
            {
                icon: FaRedoAlt,
                title: '3-Tier LLM Fallback',
                description: 'QuickFix keeps processing complaints when a cloud API fails or hits its rate limit: Groq LLaMA 3.3 → Gemini 2.0 Flash (multi-key rotation) → local TF-IDF/TextBlob',
                color: 'from-emerald-600 to-teal-600',
                gradient: 'bg-gradient-to-br from-emerald-600/10 to-teal-600/10',
                category: 'Technical'
            },
            {
                icon: FaTachometerAlt,
                title: 'Sub-100 ms Lookups',
                description: 'SOEIT portal\u2019s stateless REST backend uses SQL indexes for sub-100 ms lookups on 10k+ records',
                color: 'from-emerald-600 to-teal-600',
                gradient: 'bg-gradient-to-br from-emerald-600/10 to-teal-600/10',
                category: 'Technical'
            },
            {
                icon: FaPlug,
                title: '27 REST Endpoints',
                description: 'Community AI\u2019s async FastAPI backend: background email tasks, connection pooling, indexed queries, JWT + bcrypt auth, Pydantic validation and rate limiting',
                color: 'from-blue-600 to-indigo-600',
                gradient: 'bg-gradient-to-br from-blue-600/10 to-indigo-600/10',
                category: 'Technical'
            },
            {
                icon: FaLandmark,
                title: '50+ Government Schemes',
                description: 'Community AI puts 50+ government schemes, courses, and jobs in front of 100+ active users, with an AI assistant answering in 5 Indian languages',
                color: 'from-violet-600 to-purple-600',
                gradient: 'bg-gradient-to-br from-violet-600/10 to-purple-600/10',
                category: 'Technical'
            },
            {
                icon: FaAward,
                title: '10+ Projects',
                description: 'Successfully delivered major projects: Community AI, QuickFix, the SOEIT Achievement Portal, and steel-defect research at NIT Jamshedpur',
                color: 'from-rose-600 to-red-600',
                gradient: 'bg-gradient-to-br from-rose-600/10 to-red-600/10',
                category: 'Technical'
            },
            {
                icon: FaCode,
                title: 'Full Stack Developer',
                description: 'FastAPI, Node.js and Express on the backend; React and React Router on the front; PostgreSQL, MySQL, Turso and MongoDB for data',
                color: 'from-indigo-600 to-violet-600',
                gradient: 'bg-gradient-to-br from-indigo-600/10 to-violet-600/10',
                category: 'Technical'
            }
        ]
    };

    const chapters = [
        { id: 'achievements', numeral: 'I', label: 'Achievements', items: achievementsData.achievements },
        { id: 'strengths', numeral: 'II', label: 'Strengths', items: achievementsData.strengths },
        { id: 'leadership', numeral: 'III', label: 'Leadership', items: achievementsData.leadership },
        { id: 'technical', numeral: 'IV', label: 'Technical', items: achievementsData.technical }
    ];
    const total = chapters.reduce((n, c) => n + c.items.length, 0);
    const chapter = chapters.find((c) => c.id === activeTab) ?? chapters[0];

    const selectChapter = (id) => {
        setActiveTab(id);
        setOpenRow(0);
    };

    const muted = isDarkMode ? 'text-[#c5b79e]' : 'text-slate-600';
    const rule = isDarkMode ? 'border-[#c5b79e]/20' : 'border-slate-300/70';

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <section id="achievements" className="relative py-24">
            <motion.div
                ref={ref}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12"
            >
                {/* Editorial header */}
                <motion.div variants={fadeUp} className={`flex flex-wrap items-center justify-between gap-3 eyebrow ${muted}`}>
                    <span>Recognition</span>
                    <span>{total} entries · {chapters.length} chapters</span>
                </motion.div>
                <motion.div variants={fadeUp} className="hairline mt-4" />

                <div className="grid md:grid-cols-12 gap-6 md:gap-10 mt-8 md:mt-10 mb-12 md:mb-16 items-end">
                    <motion.h2
                        variants={fadeUp}
                        className="md:col-span-8 text-6xl sm:text-8xl lg:text-[9rem] leading-[0.85] tracking-[-0.06em]"
                        style={{ fontWeight: 500 }}
                    >
                        The Honours <span className="italic text-bronze-700 dark:text-bronze-400">Ledger.</span>
                    </motion.h2>
                    <motion.p variants={fadeUp} className={`md:col-span-4 text-lg leading-relaxed ${muted}`}>
                        Awards, leadership, strengths and technical wins — kept like an index. Pick a chapter, open any line.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-12 gap-8 md:gap-12">
                    {/* Chapters */}
                    <motion.nav variants={fadeUp} className="min-w-0 md:col-span-4 lg:col-span-3" aria-label="Chapters">
                        <ol className="flex md:flex-col gap-2 md:gap-0 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:sticky md:top-28">
                            {chapters.map((c) => {
                                const active = c.id === activeTab;
                                return (
                                    <li key={c.id} className="shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => selectChapter(c.id)}
                                            aria-pressed={active}
                                            className={`relative w-full flex items-baseline gap-3 text-left px-4 py-2.5 md:px-0 md:py-4 rounded-full md:rounded-none border md:border-0 md:border-b transition-colors ${rule} ${active
                                                ? 'text-bronze-700 dark:text-bronze-300 border-bronze-400/60'
                                                : `${muted} hover:text-bronze-700 dark:hover:text-bronze-300`}`}
                                        >
                                            <span className="font-mono text-[10px] tracking-[0.2em] w-7">{c.numeral}</span>
                                            <span className="text-lg md:text-2xl tracking-tight">{c.label}</span>
                                            <span className="font-mono text-[10px] ml-auto pl-3">{String(c.items.length).padStart(2, '0')}</span>
                                            {active && (
                                                <motion.span
                                                    layoutId="ledger-chapter"
                                                    className="hidden md:block absolute -bottom-px left-0 right-0 h-[2px] bg-bronze-500"
                                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </motion.nav>

                    {/* Index of entries */}
                    <motion.div variants={fadeUp} className="min-w-0 md:col-span-8 lg:col-span-9">
                        <div className={`flex items-baseline justify-between eyebrow pb-3 border-b ${rule} ${muted}`}>
                            <span>Chapter {chapter.numeral} — {chapter.label}</span>
                            <span className="hidden sm:inline">Tap a line to read</span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.ol
                                key={chapter.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {chapter.items.map((item, index) => {
                                    const open = openRow === index;
                                    return (
                                        <li key={item.title} className={`border-b ${rule}`}>
                                            <button
                                                type="button"
                                                onClick={() => setOpenRow(open ? null : index)}
                                                aria-expanded={open}
                                                className="group w-full flex items-center gap-3 sm:gap-5 py-4 md:py-5 text-left"
                                            >
                                                <span className={`font-mono text-[10px] w-6 shrink-0 ${muted}`}>{String(index + 1).padStart(2, '0')}</span>
                                                <span className={`w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-colors duration-300 ${open
                                                    ? 'bg-bronze-400 border-bronze-400 text-ink-950'
                                                    : 'border-bronze-400/40 text-bronze-700 dark:text-bronze-300 group-hover:border-bronze-400'}`}
                                                >
                                                    <item.icon className="text-sm" />
                                                </span>
                                                <span className={`text-lg md:text-2xl tracking-tight leading-snug transition-colors ${open ? 'text-bronze-700 dark:text-bronze-300' : 'group-hover:text-bronze-700 dark:group-hover:text-bronze-300'}`}>
                                                    {item.title}
                                                </span>
                                                <span className={`hidden sm:block flex-1 min-w-[2rem] border-b border-dotted translate-y-1 ${rule}`} aria-hidden="true" />
                                                <span className={`ml-auto sm:ml-0 shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-lg leading-none transition-transform duration-300 ${open ? 'rotate-45' : ''} ${muted}`} aria-hidden="true">+</span>
                                            </button>
                                            <AnimatePresence initial={false}>
                                                {open && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className={`pl-[4.5rem] sm:pl-[5.5rem] pr-10 pb-5 text-base md:text-lg leading-relaxed max-w-3xl ${muted}`}>
                                                            {item.description}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    );
                                })}
                            </motion.ol>
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Key figures — one quiet strip instead of six cards */}
                <motion.div
                    variants={fadeUp}
                    className={`mt-16 md:mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px border-y ${rule} ${isDarkMode ? 'bg-[#c5b79e]/20' : 'bg-slate-300/70'}`}
                >
                    {[
                        { number: '98.61%', label: 'Naukri Score', icon: LTrophy },
                        { number: '99.67%', label: 'Best Accuracy', icon: LTarget },
                        { number: '10+', label: 'Projects', icon: LFolder },
                        { number: '4', label: 'Internships', icon: LBriefcase },
                        { number: '4', label: 'Lead Roles', icon: LCrown },
                        { number: '5', label: 'Strengths', icon: LZap }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className={`px-4 py-6 md:py-8 ${isDarkMode ? 'bg-[#29251d]' : 'bg-[#f4ecdd]'}`}
                        >
                            <div className={`flex items-center gap-2 eyebrow ${muted}`}>
                                <stat.icon size={13} strokeWidth={1.5} className="text-bronze-600 dark:text-bronze-400" />
                                {stat.label}
                            </div>
                            <div className="mt-3 text-4xl md:text-5xl tracking-[-0.04em] text-bronze-700 dark:text-bronze-300">{stat.number}</div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Achievements;
