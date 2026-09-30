import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '@studio-freight/react-lenis';
import {
    Code2, Globe, Github as LucidGithub,
    Bot, Cpu, FileCheck, LayoutDashboard, ShoppingBag,
    ScanSearch, GraduationCap, X, ArrowUpRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CoverArt, EMBER, seeded } from './BookCovers';

// Cloth bindings for the library — each volume gets its own earth tone.
// `art` is the ink used for the illustrated paper cover.
const CLOTHS = {
    ink: { cover: '#2f2a21', spine: '#26221a', foil: '#c3a47b', art: '#3a3227' },
    bronze: { cover: '#8f6f45', spine: '#7a5d38', foil: '#f3e9d7', art: '#7a5431' },
    sage: { cover: '#4e553b', spine: '#424831', foil: '#dbc39c', art: '#4a5236' },
    clay: { cover: '#7d402f', spine: '#693526', foil: '#eac2b0', art: '#8a4632' },
    ochre: { cover: '#a0722a', spine: '#8a6123', foil: '#fbf6e9', art: '#855b1f' },
    moss: { cover: '#3c4130', spine: '#313527', foil: '#c3a47b', art: '#3c4130' },
    oxblood: { cover: '#5f3226', spine: '#4f291f', foil: '#dbc39c', art: '#6b3226' },
    linen: { cover: '#d9ccb2', spine: '#b9a88a', foil: '#3a382b', art: '#6b5a3e' },
};

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const volume = (index) => String(index + 1).padStart(2, '0');

const TILTS = [-1.6, 1.2, -0.6, 1.8, -1.2, 0.8, -1.8, 1.4];

/* ------------------------------------------------------------------ */
/*  A single cloth-bound book on the shelf                             */
/* ------------------------------------------------------------------ */

const Book = ({ project, index, onOpen }) => {
    const cloth = CLOTHS[project.cloth];

    return (
        <motion.button
            type="button"
            onClick={() => onOpen(index)}
            className="book-trigger group flex flex-col items-center gap-6 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-bronze-400/70 focus-visible:ring-offset-8 focus-visible:ring-offset-transparent"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            aria-label={`Open volume ${volume(index)}: ${project.title}`}
        >
            <div className="book-scene book-float relative" style={{ '--float-delay': `${(index % 4) * -1.3}s` }}>
                <div className="book" style={{ '--tilt': `${TILTS[index % TILTS.length]}deg` }}>
                    {/* Front cover — illustrated paper over cloth boards */}
                    <div
                        className="book-face book-front cover-paper"
                        style={{ color: cloth.art, '--sheen-delay': `${index * 0.9}s` }}
                    >
                        <div className="relative z-[3] h-full flex flex-col items-center text-center px-[12%] pl-[15%] pt-[9%] pb-[7%]">
                            {/* Double frame with corner studs */}
                            <div className="absolute inset-[4%] left-[8%] border-[1.5px] pointer-events-none" style={{ borderColor: cloth.art }} />
                            <div className="absolute inset-[6.5%] left-[10.5%] border pointer-events-none" style={{ borderColor: `${cloth.art}66` }} />
                            {['top-[3%] left-[7%]', 'top-[3%] right-[3%]', 'bottom-[3%] left-[7%]', 'bottom-[3%] right-[3%]'].map((pos) => (
                                <span
                                    key={pos}
                                    className={`absolute ${pos} w-1.5 h-1.5 ${['rotate-45', 'rounded-full', 'rotate-45 bg-transparent border'][index % 3]}`}
                                    style={{ backgroundColor: index % 3 === 2 ? undefined : EMBER, borderColor: EMBER }}
                                />
                            ))}

                            <span className="text-[6.5px] md:text-[8px] tracking-[0.22em] uppercase italic opacity-80">
                                Field Manual · {ROMAN[index] ?? index + 1}
                            </span>
                            <h3 className="mt-1 text-[13px] md:text-lg xl:text-xl leading-[1.02] tracking-[-0.03em]" style={{ fontWeight: 500, color: '#2a211a' }}>
                                {project.title}
                            </h3>
                            <p className="mt-0.5 text-[7.5px] md:text-[10px] italic leading-tight" style={{ fontWeight: 500 }}>{project.subtitle}</p>

                            <div className="flex-1 min-h-0 w-full mt-1">
                                <CoverArt motif={project.motif} index={index} color={cloth.art} />
                            </div>

                            <span className="text-[5.5px] md:text-[7px] tracking-[0.16em] uppercase opacity-80 whitespace-nowrap">{project.tagline}</span>
                        </div>

                        {/* Drifting glints */}
                        {[0, 1, 2, 3, 4].map((g) => {
                            const r = seeded(index * 11 + g);
                            return (
                                <span
                                    key={g}
                                    className="cover-glint"
                                    style={{ left: `${18 + r() * 66}%`, top: `${30 + r() * 55}%`, animationDelay: `${(r() * 4.8).toFixed(2)}s` }}
                                />
                            );
                        })}
                    </div>

                    {/* Spine */}
                    <div className="book-face book-spine flex flex-col items-center justify-between py-3" style={{ backgroundColor: cloth.spine, color: cloth.foil }}>
                        <span className="w-[70%] h-px" style={{ backgroundColor: cloth.foil, opacity: 0.6 }} />
                        <span className="flex-1 my-2 overflow-hidden text-[10px] md:text-xs tracking-[0.04em] whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                            {project.title}
                        </span>
                        <span className="font-mono text-[8px] md:text-[9px]">{volume(index)}</span>
                        <span className="w-[70%] h-px mt-2" style={{ backgroundColor: cloth.foil, opacity: 0.6 }} />
                    </div>

                    {/* Page block + back cover */}
                    <div className="book-face book-pages" />
                    <div className="book-face book-back" style={{ backgroundColor: cloth.spine }} />
                </div>
                <div className="book-shadow" aria-hidden="true" />
            </div>

            <div className="text-center max-w-[170px] md:max-w-[210px]">
                <span className="eyebrow text-slate-500 dark:text-[#c5b79e]">No. {volume(index)}</span>
                <p className="mt-1 text-sm md:text-base leading-snug group-hover:text-bronze-700 dark:group-hover:text-bronze-300 transition-colors">
                    {project.title}
                </p>
            </div>
        </motion.button>
    );
};

/* ------------------------------------------------------------------ */
/*  The opened volume — a two-page spread                              */
/* ------------------------------------------------------------------ */

const PageHeading = ({ children }) => (
    <span className="eyebrow block mb-2 text-bronze-700">{children}</span>
);

const OpenBook = ({ project, index, total, onClose, onStep }) => {
    const closeRef = useRef(null);
    const cloth = CLOTHS[project.cloth];

    useEffect(() => {
        closeRef.current?.focus();
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onStep(1);
            if (e.key === 'ArrowLeft') onStep(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose, onStep]);

    return (
        <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
        >
            <div className="absolute inset-0 bg-[#1d1a15]/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-5xl" style={{ perspective: 2200 }}>
                {/* Cloth board behind the pages */}
                <div className="absolute -inset-2 sm:-inset-3 rounded-lg shadow-2xl" style={{ backgroundColor: cloth.cover }} />

                <div
                    key={index}
                    className="relative grid md:grid-cols-2 max-h-[86vh] overflow-y-auto md:overflow-visible rounded-md"
                    data-lenis-prevent
                >
                    {/* Left page — flips open from the spine */}
                    <motion.div
                        className="page-paper relative p-7 sm:p-10 md:rounded-l-md md:max-h-[86vh] md:overflow-y-auto"
                        style={{ transformOrigin: 'right center' }}
                        initial={{ rotateY: 100, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        data-lenis-prevent
                    >
                        <div className="hidden md:block absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#29251d]/15 to-transparent pointer-events-none" />

                        <div className="flex items-center justify-between eyebrow text-slate-500">
                            <span>Field Manual</span>
                            <span>Vol. {volume(index)}</span>
                        </div>
                        <div className="h-px bg-[#29251d]/15 mt-3" />

                        <h3 className="mt-6 text-4xl sm:text-5xl leading-[0.95] tracking-[-0.04em]" style={{ fontWeight: 500 }}>
                            {project.title}
                        </h3>
                        <p className="mt-3 italic text-lg text-slate-600">{project.role}</p>

                        {project.image && (
                            <figure className="mt-6">
                                <div className="p-1.5 bg-white shadow-md rotate-[-0.6deg]">
                                    <img src={project.image} alt={`${project.title} screenshot`} className="w-full aspect-[16/10] object-cover object-top" />
                                </div>
                            </figure>
                        )}

                        <div className="mt-7">
                            <PageHeading>The Problem</PageHeading>
                            <p className="text-[17px] leading-relaxed text-slate-700">
                                <span className="float-left text-5xl leading-[0.8] mr-2 mt-1 text-bronze-700" style={{ fontWeight: 500 }}>
                                    {project.problem.charAt(0)}
                                </span>
                                {project.problem.slice(1)}
                            </p>
                        </div>

                        <div className="mt-8 text-center font-mono text-[10px] text-slate-500">— {Number(volume(index)) * 2 - 1} —</div>
                    </motion.div>

                    {/* Right page */}
                    <motion.div
                        className="page-paper relative p-7 sm:p-10 md:rounded-r-md md:max-h-[86vh] md:overflow-y-auto border-t md:border-t-0 border-[#29251d]/10"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        data-lenis-prevent
                    >
                        <div className="hidden md:block absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#29251d]/15 to-transparent pointer-events-none" />

                        <div className="flex items-center justify-between eyebrow text-slate-500">
                            <span>{project.demo !== '#' ? 'Live in production' : 'Case study'}</span>
                            <button
                                ref={closeRef}
                                type="button"
                                onClick={onClose}
                                className="w-9 h-9 -my-2 rounded-full flex items-center justify-center border border-[#29251d]/20 hover:bg-[#29251d] hover:text-[#f3ebdc] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-bronze-600"
                                aria-label="Close book"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="h-px bg-[#29251d]/15 mt-3" />

                        <div className="mt-6">
                            <PageHeading>What I Built</PageHeading>
                            <p className="text-[17px] leading-relaxed text-slate-700">{project.approach}</p>
                        </div>

                        {project.impact.length > 0 && (
                            <div className="mt-7">
                                <PageHeading>Impact</PageHeading>
                                <ol className="divide-y divide-[#29251d]/10 border-y border-[#29251d]/10">
                                    {project.impact.map((item, i) => (
                                        <li key={i} className="flex items-baseline gap-4 py-2.5">
                                            <span className="font-mono text-[10px] text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                                            <span className="text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        <div className="mt-7">
                            <PageHeading>Set In</PageHeading>
                            <p className="text-slate-700 italic">{project.tech.join(' · ')}</p>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-[#29251d] text-[#f3ebdc] hover:bg-[#3a382b] transition-colors"
                            >
                                <LucidGithub size={17} /> Read the code
                            </a>
                            {project.demo !== '#' && (
                                <a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full border border-[#29251d]/25 hover:border-[#29251d] transition-colors"
                                >
                                    <Globe size={17} /> Visit live <ArrowUpRight size={15} />
                                </a>
                            )}
                        </div>

                        <div className="mt-8 flex items-center justify-between font-mono text-[10px] text-slate-500">
                            <button type="button" onClick={() => onStep(-1)} className="hover:text-[#29251d] transition-colors">← Prev volume</button>
                            <span>— {Number(volume(index)) * 2} —</span>
                            <button type="button" onClick={() => onStep(1)} className="hover:text-[#29251d] transition-colors">Next volume →</button>
                        </div>
                        <p className="sr-only">Volume {index + 1} of {total}. Use the arrow keys to turn volumes and Escape to close.</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

/* ------------------------------------------------------------------ */

const Projects = () => {
    const { isDarkMode } = useTheme();
    const [openIndex, setOpenIndex] = useState(null);
    const lenis = useLenis();

    // Each project leads with the problem, my role, and the outcome — reworded
    // from real project data only (no invented metrics).
    const projects = [
        {
            title: 'Community AI Platform',
            role: 'Full-Stack Developer',
            problem: 'Underserved communities struggle to discover and access government resources and opportunities meant for them.',
            approach: 'Built a platform where 100+ active users find 50+ government schemes, courses, and jobs, with an AI assistant (Amazon Q → Groq → Gemini fallback) answering in 5 Indian languages. An automated content scanner pulls new schemes and courses from the News and YouTube APIs and emails summaries via Brevo; the backend exposes 27 async REST endpoints with JWT + bcrypt auth, Pydantic validation, and rate limiting.',
            impact: ['100+ active users', '50+ schemes · 5 languages', '27 REST endpoints'],
            tech: ['FastAPI', 'React', 'SQLAlchemy', 'Turso', 'Amazon Q', 'Groq', 'Gemini', 'Brevo'],
            cloth: 'bronze',
            motif: 'globe',
            subtitle: 'The Civic Commons',
            tagline: 'Access · Language · Reach',
            github: 'https://github.com/RiteshKumar2e/Community-Empowering-2.0',
            demo: 'https://communityai.co.in',
            image: '/projects/community-ai.png',
            icon: Globe
        },
        {
            title: 'QuickFix AI Customer Agent',
            role: 'Solo Developer',
            problem: 'Support teams are slow and inconsistent at resolving complex customer complaints across many policy edge-cases.',
            approach: 'An async orchestrator runs category, sentiment, and priority agents in parallel on every complaint, then drafts a policy-grounded reply using RAG — in English, Hindi, and Hinglish. A 3-tier LLM fallback (Groq LLaMA 3.3 → Gemini 2.0 Flash with multi-key rotation → local TF-IDF/TextBlob) keeps complaints moving when a cloud API fails or hits its rate limit, and the REST APIs are guarded by Google OAuth 2.0 + email OTP and JWT-based RBAC.',
            impact: ['2.5 s → ~0.5 s responses', '3-tier LLM fallback', 'English · Hindi · Hinglish'],
            tech: ['FastAPI', 'React 19', 'SQLAlchemy', 'Turso', 'Groq LLaMA 3.3', 'Gemini 2.0 Flash', 'RAG'],
            cloth: 'ink',
            motif: 'arch',
            subtitle: 'The Patient Agent',
            tagline: 'Context · Policy · Care',
            github: 'https://github.com/RiteshKumar2e/customer-complaint-agent_new',
            demo: 'https://riteshkr.online',
            image: '/projects/Quickfix.png',
            icon: Bot
        },
        {
            title: 'SOEIT Student Achievement Portal',
            role: 'Full-Stack Developer',
            problem: 'Student achievements sit scattered across emails, spreadsheets, and paperwork, so faculty lose hours verifying certificates and students lose track of their own record.',
            approach: 'Shipped the achievement portal for Arka Jain University\u2019s School of Engineering & IT: students upload certificates, faculty verify them, and admins manage users and view analytics. Category-based point scoring feeds a weekly leaderboard, alongside a hub of 90+ curated hackathons and one-click ATS resume export (DOCX/PDF). The stateless REST backend uses SQL indexes for sub-100 ms lookups on 10k+ records, with JWT-based RBAC and BLOB storage for certificates.',
            impact: ['Sub-100 ms lookups on 10k+ records', 'Weekly leaderboard', '90+ curated hackathons', 'ATS resume export (DOCX/PDF)'],
            tech: ['Node.js', 'Express 5', 'React 19', 'Turso', 'JWT', 'RBAC'],
            cloth: 'sage',
            motif: 'laurel',
            subtitle: 'The Honour Roll',
            tagline: 'Verify · Rank · Export',
            github: 'https://github.com/RiteshKumar2e/SOEIT-Acheivement-portal',
            demo: 'https://soeit-acheivement-portal.vercel.app',
            image: '/projects/soeit.png',
            icon: GraduationCap
        },
        {
            title: 'Steel Surface Defect Detection',
            role: 'Research Intern · NIT Jamshedpur',
            problem: 'Manual quality control on steel surfaces is slow and inconsistent for spotting fine defects on the production line.',
            approach: 'Three models on NEU-DET and SteelDefectX (1,800 + 1,631 images): AMFF-CNN, a 3.4M-parameter MobileNetV2 + FPN network with channel/spatial attention and learned cross-scale weights; TinySteelLLM, a Transformer trained from scratch on ~30 handcrafted OpenCV descriptors written as text prompts; and SteelSense-BiLSTM, which scales that idea to 92 descriptors and a 1.75M-parameter attention BiLSTM.',
            impact: ['99.67% ± 0.23 on NEU-DET', '99.02% ± 0.40 on SteelDefectX', '92.95% macro-F1 (AMFF-CNN)', 'First-author paper under review'],
            tech: ['TensorFlow', 'PyTorch', 'OpenCV', 'MobileNetV2', 'FPN', 'Transformer', 'BiLSTM'],
            cloth: 'clay',
            motif: 'lens',
            subtitle: 'The Steel Eye',
            tagline: 'Detect · Fuse · Inspect',
            github: 'https://github.com/RiteshKumar2e/Steel_Surface_Defect_NEU_DET-DATASET',
            demo: '#',
            icon: ScanSearch
        },
        {
            title: 'Age Gender Prediction',
            role: 'Solo Developer',
            problem: 'Biometric identification needs fast, accurate age and gender estimation from a live camera feed.',
            approach: 'Built a real-time deep-learning app using CNNs and Haarcascade classifiers for on-the-fly face detection and prediction.',
            impact: ['Real-time inference'],
            tech: ['Deep Learning', 'PyTorch', 'Computer Vision'],
            cloth: 'moss',
            motif: 'eye',
            subtitle: 'The Living Mirror',
            tagline: 'See · Estimate · Predict',
            github: 'https://github.com/RiteshKumar2e/AGE_GENDER_PREDECTION',
            demo: '#',
            icon: Cpu
        },
        {
            title: 'Combat Online Plagiarism',
            role: 'Solo Developer',
            problem: 'Exact-match checks miss paraphrased or reworded content, letting plagiarism slip through.',
            approach: 'Built an NLP system that flags duplicated content using cosine similarity over vector embeddings rather than literal text matching.',
            impact: [],
            tech: ['NLP', 'Python', 'ML', 'Transformers'],
            cloth: 'linen',
            motif: 'docs',
            subtitle: 'The Honest Page',
            tagline: 'Compare · Embed · Flag',
            github: 'https://github.com/RiteshKumar2e/Combat-Online-Plagiarism-with-AI',
            demo: '#',
            icon: FileCheck
        },
        {
            title: 'Sentiment Analysis Pipeline',
            role: 'Solo Developer',
            problem: 'Teams need to read sentiment across large volumes of text quickly and see it, not just score it.',
            approach: 'Built an end-to-end sentiment scoring pipeline using VADER with dynamic Plotly visualizations for fast, readable results.',
            impact: ['High-speed processing'],
            tech: ['Python', 'VADER', 'Plotly', 'ML'],
            cloth: 'ochre',
            motif: 'waves',
            subtitle: 'The Mood Tide',
            tagline: 'Read · Score · Show',
            github: 'https://github.com/RiteshKumar2e/Sentiment-Analysis',
            demo: '#',
            icon: LayoutDashboard
        },
        {
            title: 'Black Friday Sales Model',
            role: 'Solo Developer',
            problem: 'Retailers need to forecast customer spending to plan inventory and campaigns ahead of high-demand sales.',
            approach: 'Built a prediction engine using XGBoost and LightGBM to forecast customer spending behavior from historical sales data.',
            impact: [],
            tech: ['XGBoost', 'LightGBM', 'Data Analysis'],
            cloth: 'oxblood',
            motif: 'cursor',
            subtitle: 'The Forecast Ledger',
            tagline: 'Forecast · Plan · Sell',
            github: 'https://github.com/RiteshKumar2e/Black-Friday-Sales-Prediction',
            demo: '#',
            icon: ShoppingBag
        }
    ];

    // Freeze page scrolling while a volume is open.
    useEffect(() => {
        if (openIndex === null) return undefined;
        lenis?.stop();
        const previous = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        return () => {
            lenis?.start();
            document.documentElement.style.overflow = previous;
        };
    }, [openIndex, lenis]);

    const close = React.useCallback(() => setOpenIndex(null), []);
    const step = React.useCallback((dir) => {
        setOpenIndex((i) => (i === null ? i : (i + dir + projects.length) % projects.length));
    }, [projects.length]);

    return (
        <section id="projects" className="py-24 relative overflow-hidden">
            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                {/* Editorial header */}
                <div className={`flex flex-wrap items-center justify-between gap-3 eyebrow ${isDarkMode ? 'text-[#c5b79e]' : 'text-slate-600'}`}>
                    <span>Selected Work</span>
                    <span>{projects.length} volumes</span>
                </div>
                <div className="hairline mt-4" />

                <div className="grid md:grid-cols-12 gap-6 md:gap-10 mt-8 md:mt-10 mb-16 md:mb-24 items-end">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="md:col-span-8 text-6xl sm:text-8xl lg:text-[9rem] leading-[0.85] tracking-[-0.06em]"
                        style={{ fontWeight: 500 }}
                    >
                        The Field <span className="italic text-bronze-700 dark:text-bronze-400">Library.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className={`md:col-span-4 text-lg leading-relaxed ${isDarkMode ? 'text-[#c5b79e]' : 'text-slate-600'}`}
                    >
                        Every project, bound as a field manual — the problem, what I built, and what it changed. Pick a volume to open it.
                    </motion.p>
                </div>

                {/* The shelf */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-16 md:gap-y-24 justify-items-center">
                    {projects.map((project, index) => (
                        <Book key={project.title} project={project} index={index} onOpen={setOpenIndex} />
                    ))}
                </div>

                <motion.div
                    className="mt-24 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <a
                        href="https://github.com/RiteshKumar2e"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group inline-flex items-center gap-4 px-8 py-4 rounded-full border transition-colors duration-500 ${isDarkMode ? 'border-[#eee2ca]/15 hover:border-bronze-400/60' : 'border-slate-300 hover:border-ink-900'}`}
                    >
                        <Code2 size={20} className="text-bronze-600 dark:text-bronze-400" />
                        <span className="text-lg">Browse the full GitHub archive</span>
                        <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                </motion.div>
            </div>

            {/* Portaled: GSAP leaves a transform on <section>, which would trap position:fixed. */}
            {createPortal(
                <AnimatePresence>
                    {openIndex !== null && (
                        <OpenBook
                            project={projects[openIndex]}
                            index={openIndex}
                            total={projects.length}
                            onClose={close}
                            onStep={step}
                        />
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
};

export default Projects;
