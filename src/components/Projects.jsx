import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
    Code2, Globe, Github as LucidGithub,
    Bot, Cpu, FileCheck, LayoutDashboard, ShoppingBag,
    ScanSearch, User, Zap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SectionLabel = ({ children }) => {
    const { isDarkMode } = useTheme();
    return (
        <span className={`block text-[10px] font-black uppercase tracking-[0.25em] mb-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {children}
        </span>
    );
};

const ProjectCard = ({ project, index }) => {
    const { isDarkMode } = useTheme();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Optimized spring settings for performance (lower stiffness/damping to reduce frequent updates)
    const mouseXSpring = useSpring(x, { stiffness: 40, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 40, damping: 25 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

    const handleMouseMove = (e) => {
        if (window.innerWidth < 1024) return; // Disable for tablets & mobile
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="group relative perspective-1000"
        >
            <div className={`relative rounded-3xl overflow-hidden border transition-all duration-500 h-full flex flex-col group/card ${isDarkMode
                ? 'bg-slate-900/70 border-white/10 hover:border-indigo-500/30 shadow-xl shadow-black/30'
                : 'bg-white border-slate-200/70 shadow-soft hover:border-indigo-200 hover:shadow-premium'
                }`}>
                {/* Subtle hover wash */}
                <div className="absolute -inset-1 bg-indigo-500/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

                {/* Media Header Area */}
                <a
                    href={project.demo !== '#' ? project.demo : undefined}
                    target={project.demo !== '#' ? "_blank" : undefined}
                    rel={project.demo !== '#' ? "noopener noreferrer" : undefined}
                    className={`relative h-56 sm:h-64 overflow-hidden flex items-center justify-center ${project.image
                        ? 'bg-slate-100 dark:bg-slate-800'
                        : `bg-gradient-to-br ${project.gradient}`
                        } ${project.demo !== '#' ? 'cursor-pointer' : 'cursor-default'}`}
                >
                    <div className={`relative z-10 ${project.image ? 'w-full h-full' : 'scale-110'}`}>
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-white drop-shadow-2xl opacity-90">{project.icon}</div>
                        )}
                    </div>

                    {/* Status badge — surface live/impact up front */}
                    <div className="absolute top-5 left-5 z-20">
                        <div className={`px-3.5 py-1.5 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border shadow-sm flex items-center gap-2 ${project.demo !== '#'
                            ? 'bg-emerald-600/90 border-emerald-400/50 text-white'
                            : 'bg-slate-900/80 border-white/10 text-slate-200'
                            }`}>
                            {project.demo !== '#' ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
                                </>
                            ) : (
                                <>Case Study</>
                            )}
                        </div>
                    </div>
                </a>

                {/* Content — structured as a scannable case study (Rule 9) */}
                <div className="p-8 sm:p-10 flex-1 flex flex-col relative z-10">
                    {/* Title + Role (Rule 7: write your role clearly) */}
                    <div className="mb-6">
                        <h3 className={`text-3xl font-black mb-3 tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {project.title}
                        </h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                            <User size={11} className="text-indigo-500" /> {project.role}
                        </div>
                        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-transparent mt-4" />
                    </div>

                    {/* Problem first (Rules 1 & 5) */}
                    <div className="mb-5">
                        <SectionLabel>The Problem</SectionLabel>
                        <p className={`text-[15px] leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {project.problem}
                        </p>
                    </div>

                    {/* What I built (Rule 15: show how, not just claims) */}
                    <div className="mb-6 flex-1">
                        <SectionLabel>What I Built</SectionLabel>
                        <p className={`text-[15px] leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {project.approach}
                        </p>
                    </div>

                    {/* Impact / outcome (Rules 13 & 14: numbers make it believable) */}
                    {project.impact?.length > 0 && (
                        <div className="mb-6">
                            <SectionLabel>Impact</SectionLabel>
                            <div className="flex flex-wrap gap-2.5">
                                {project.impact.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-[11px] font-black border ${isDarkMode
                                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            }`}
                                    >
                                        <Zap size={12} /> {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* High-Contrast Tech Pills */}
                    <div className="flex flex-wrap gap-2.5 mb-10">
                        {project.tech.map((tech, idx) => (
                            <span
                                key={idx}
                                className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${isDarkMode
                                    ? 'bg-slate-800/40 text-indigo-300 border-white/5 hover:border-indigo-500/30'
                                    : 'bg-indigo-50 text-indigo-700 border-indigo-100/50'
                                    }`}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Interactive Actions */}
                    <div className="flex items-center gap-4">
                        <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LucidGithub size={18} /> CODE
                        </motion.a>

                        {project.demo !== '#' && (
                            <motion.a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl border font-black text-[11px] uppercase tracking-widest transition-all ${isDarkMode
                                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
                                    }`}
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Globe size={18} /> LIVE
                            </motion.a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    const { isDarkMode } = useTheme();

    // Each project leads with the problem, my role, and the outcome — reworded
    // from real project data only (no invented metrics).
    const projects = [
        {
            title: 'Community AI Platform',
            role: 'Full-Stack Developer',
            problem: 'Underserved communities struggle to discover and access government resources and opportunities meant for them.',
            approach: 'Built an AI ecosystem on async FastAPI + SQLAlchemy with JWT security, featuring context-aware multilingual chat assistance and deep-learning driven recommendations.',
            impact: ['Live in production', 'Multilingual AI chat', 'DL recommendations'],
            tech: ['FastAPI', 'React', 'SQLAlchemy', 'JWT', 'Pydantic'],
            gradient: 'from-violet-600 via-indigo-600 to-purple-600',
            github: 'https://github.com/RiteshKumar2e/Community-Empowering-2.0',
            demo: 'https://communityai.co.in',
            image: '/projects/community-ai.png',
            icon: <Globe className="w-16 h-16 text-white" />
        },
        {
            title: 'QuickFix AI Customer Agent',
            role: 'Solo Developer',
            problem: 'Support teams are slow and inconsistent at resolving complex customer complaints across many policy edge-cases.',
            approach: 'Built an agentic system of 30+ specialized AI agents using RAG for policy-aware intelligence, returning smart, empathetic resolutions.',
            impact: ['30+ AI agents', 'Sub-second resolutions', 'RAG policy-aware'],
            tech: ['FastAPI', 'React 19', 'Gemini 2.0', 'Groq LLaMA', 'MariaDB'],
            gradient: 'from-indigo-600 via-indigo-500 to-purple-600',
            github: 'https://github.com/RiteshKumar2e/customer-complaint-agent_new',
            demo: 'https://riteshkr.online',
            image: '/projects/Quickfix.png',
            icon: <Bot className="w-16 h-16 text-white" />
        },
        {
            title: 'Steel Surface Defect Detection',
            role: 'ML Research · NIT Jamshedpur',
            problem: 'Manual quality control on steel surfaces is slow and inconsistent for spotting fine defects on the production line.',
            approach: 'Built a lightweight detector using a MobileNetV2 backbone, Feature Pyramid Network, and attention-based multi-scale feature fusion (AMFF-CNN) to classify steel surface defects for industrial quality control.',
            impact: ['98.33% accuracy', '0.85 mAP', 'Edge-deployment ready'],
            tech: ['Python', 'PyTorch', 'OpenCV', 'MobileNetV2', 'FPN'],
            gradient: 'from-blue-600 via-blue-500 to-cyan-500',
            github: 'https://github.com/RiteshKumar2e/Steel_Surface_Defect_NEU_DET-DATASET',
            demo: '#',
            icon: <ScanSearch className="w-16 h-16 text-white" />
        },
        {
            title: 'Age Gender Prediction',
            role: 'Solo Developer',
            problem: 'Biometric identification needs fast, accurate age and gender estimation from a live camera feed.',
            approach: 'Built a real-time deep-learning app using CNNs and Haarcascade classifiers for on-the-fly face detection and prediction.',
            impact: ['Real-time inference'],
            tech: ['Deep Learning', 'PyTorch', 'Computer Vision'],
            gradient: 'from-emerald-500 via-teal-500 to-teal-600',
            github: 'https://github.com/RiteshKumar2e/AGE_GENDER_PREDECTION',
            demo: '#',
            icon: <Cpu className="w-16 h-16 text-white" />
        },
        {
            title: 'Combat Online Plagiarism',
            role: 'Solo Developer',
            problem: 'Exact-match checks miss paraphrased or reworded content, letting plagiarism slip through.',
            approach: 'Built an NLP system that flags duplicated content using cosine similarity over vector embeddings rather than literal text matching.',
            impact: [],
            tech: ['NLP', 'Python', 'ML', 'Transformers'],
            gradient: 'from-rose-500 via-pink-500 to-pink-600',
            github: 'https://github.com/RiteshKumar2e/Combat-Online-Plagiarism-with-AI',
            demo: '#',
            icon: <FileCheck className="w-16 h-16 text-white" />
        },
        {
            title: 'Sentiment Analysis Pipeline',
            role: 'Solo Developer',
            problem: 'Teams need to read sentiment across large volumes of text quickly and see it, not just score it.',
            approach: 'Built an end-to-end sentiment scoring pipeline using VADER with dynamic Plotly visualizations for fast, readable results.',
            impact: ['High-speed processing'],
            tech: ['Python', 'VADER', 'Plotly', 'ML'],
            gradient: 'from-amber-500 via-orange-500 to-orange-600',
            github: 'https://github.com/RiteshKumar2e/Sentiment-Analysis',
            demo: '#',
            icon: <LayoutDashboard className="w-16 h-16 text-white" />
        },
        {
            title: 'Black Friday Sales Model',
            role: 'Solo Developer',
            problem: 'Retailers need to forecast customer spending to plan inventory and campaigns ahead of high-demand sales.',
            approach: 'Built a prediction engine using XGBoost and LightGBM to forecast customer spending behavior from historical sales data.',
            impact: [],
            tech: ['XGBoost', 'LightGBM', 'Data Analysis'],
            gradient: 'from-blue-500 via-indigo-500 to-indigo-600',
            github: 'https://github.com/RiteshKumar2e/Black-Friday-Sales-Prediction',
            demo: '#',
            icon: <ShoppingBag className="w-16 h-16 text-white" />
        }
    ];

    return (
        <section id="projects" className="py-24 relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-[120px] pointer-events-none -z-10 ${isDarkMode ? 'bg-indigo-900/10' : 'bg-indigo-50/30'}`} />

            <div className="relative z-10 px-4">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] mb-6 border ${isDarkMode ? 'bg-white/5 text-indigo-300 border-white/10' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}
                    >
                        Selected Work
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                    >
                        Featured <span className="gradient-text">Projects</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-base md:text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                    >
                        Each project leads with the problem, my role, and the outcome — built to be scanned in seconds, not decoded.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} index={index} />
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
                        className={`group inline-flex items-center gap-4 px-10 py-5 rounded-3xl border transition-all duration-700 ${isDarkMode ? 'bg-slate-900/60 border-white/10 hover:bg-slate-900 shadow-2xl' : 'bg-white border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2'}`}
                    >
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white border border-white/10">
                            <Code2 size={24} />
                        </div>
                        <div className="text-left">
                            <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Source Control</div>
                            <div className={`text-lg font-black transition-colors ${isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-slate-800 group-hover:text-indigo-600'}`}>Explore GitHub Archive</div>
                        </div>
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
