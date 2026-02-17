import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    ExternalLink, Code2, Globe, Github as LucidGithub,
    Bot, Cpu, Brain, FileCheck, LayoutDashboard, ShoppingBag,
    ShieldCheck, ScanSearch
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
            {/* Cyber Corner Accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-indigo-500 z-30 transition-all duration-200 group-hover:-top-4 group-hover:-left-4 opacity-50" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-purple-500 z-30 transition-all duration-200 group-hover:-bottom-4 group-hover:-right-4 opacity-50" />

            <div className={`relative rounded-[2.5rem] overflow-hidden border transition-all duration-500 h-full flex flex-col group/card ${isDarkMode
                ? 'bg-slate-900/90 border-white/10 hover:border-indigo-500/40 shadow-2xl shadow-black/50'
                : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/40 hover:border-indigo-200'
                }`}>
                {/* Visual Glass Glow Layer */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

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

                    {/* Meta Archive Badge */}
                    <div className="absolute top-6 left-6 z-20">
                        <div className={`px-4 py-2 backdrop-blur-xl rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-xl ${isDarkMode
                                ? 'bg-black/40 border-white/10 text-cyan-400'
                                : 'bg-indigo-600 border-indigo-500 text-white'
                            }`}>
                            ID // 0{index + 1}
                        </div>
                    </div>
                </a>

                {/* Content Deep Analysis */}
                <div className="p-8 sm:p-10 flex-1 flex flex-col relative z-10">
                    <div className="mb-6">
                        <h3 className={`text-3xl font-black mb-3 tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {project.title}
                        </h3>
                        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-transparent" />
                    </div>

                    <p className={`text-[15px] leading-relaxed mb-8 flex-1 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>
                        {project.description}
                    </p>

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

    const projects = [
        {
            title: 'Community AI Platform',
            description: 'Comprehensive AI ecosystem delivering government resources and opportunities to underserved communities. Engineered with high-performance async FastAPI backends, SQLAlchemy ORM, and JWT security. Features context-aware multilingual AI chat assistance and deep-learning driven recommendations.',
            tech: ['FastAPI', 'React', 'SQLAlchemy', 'JWT', 'Pydantic'],
            gradient: 'from-violet-600 via-indigo-600 to-purple-600',
            github: 'https://github.com/RiteshKumar2e/Community-Empowering-2.0',
            demo: 'https://communityai.co.in',
            image: '/projects/community-ai.png',
            icon: <Globe className="w-16 h-16 text-white" />
        },
        {
            title: 'QuickFix AI Customer Agent',
            description: 'Enterprise-grade AI platform with 7+ specialized agents. Built with Google Gemini AI, FastAPI, and React for millisecond responses.',
            tech: ['Gemini AI', 'FastAPI', 'React', 'PostgreSQL'],
            gradient: 'from-indigo-600 via-indigo-500 to-purple-600',
            github: 'https://github.com/RiteshKumar2e/customer-complaint-agent_new',
            demo: 'https://riteshkr.online',
            image: '/projects/Quickfix.png',
            icon: <Bot className="w-16 h-16 text-white" />
        },
        {
            title: 'Steel Surface Defect Detection',
            description: 'AMFF-CNN model achieving 99.65% accuracy in industrial quality control using advanced computer vision pipeline.',
            tech: ['Python', 'TensorFlow', 'OpenCV', 'Keras'],
            gradient: 'from-blue-600 via-blue-500 to-cyan-500',
            github: 'https://github.com/RiteshKumar2e/Steel_Surface_Defect',
            demo: '#',
            icon: <ScanSearch className="w-16 h-16 text-white" />
        },
        {
            title: 'Age Gender Prediction',
            description: 'Real-time deep learning application for biometric identification using CNNs and Haarcascade classifiers.',
            tech: ['Deep Learning', 'PyTorch', 'Computer Vision'],
            gradient: 'from-emerald-500 via-teal-500 to-teal-600',
            github: 'https://github.com/RiteshKumar2e/AGE_GENDER_PREDECTION',
            demo: '#',
            icon: <Cpu className="w-16 h-16 text-white" />
        },
        {
            title: 'Combat Online Plagiarism',
            description: 'NLP-driven system to identify duplicated content using cosine similarity and vector embeddings.',
            tech: ['NLP', 'Python', 'ML', 'Transformers'],
            gradient: 'from-rose-500 via-pink-500 to-pink-600',
            github: 'https://github.com/RiteshKumar2e/Combat-Online-Plagiarism-with-AI',
            demo: '#',
            icon: <FileCheck className="w-16 h-16 text-white" />
        },
        {
            title: 'Sentiment Analysis Pipeline',
            description: 'End-to-end sentiment scoring system with high-speed processing and dynamic Plotly visualizations.',
            tech: ['Python', 'VADER', 'Plotly', 'ML'],
            gradient: 'from-amber-500 via-orange-500 to-orange-600',
            github: 'https://github.com/RiteshKumar2e/Sentiment-Analysis',
            demo: '#',
            icon: <LayoutDashboard className="w-16 h-16 text-white" />
        },
        {
            title: 'Black Friday Sales Model',
            description: 'Advanced prediction engine using XGBoost and LightGBM to forecast customer spending behavior.',
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
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`inline-block px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border ${isDarkMode ? 'bg-white/5 text-indigo-400 border-white/10' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}
                    >
                        Portfolio Showcase
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter transition-all duration-300 ${isDarkMode ? 'text-white text-glow' : 'text-slate-800'}`}
                    >
                        Pioneering <span className="gradient-text">Digital Futures</span>
                    </motion.h2>
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
