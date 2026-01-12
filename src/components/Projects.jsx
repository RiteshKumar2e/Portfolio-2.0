import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub } from 'react-icons/fa';
import { ExternalLink, Code2, Globe, Github as LucidGithub } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ProjectCard = ({ project, index }) => {
    const { isDarkMode } = useTheme();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        if (window.innerWidth < 768) return; // Disable for mobile
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
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
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
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
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-indigo-500 z-30 transition-all duration-500 group-hover:-top-4 group-hover:-left-4 group-hover:w-10 group-hover:h-10 opacity-50" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-purple-500 z-30 transition-all duration-500 group-hover:-bottom-4 group-hover:-right-4 group-hover:w-10 group-hover:h-10 opacity-50" />

            <div className={`relative rounded-[40px] overflow-hidden border transition-all duration-500 h-full flex flex-col ${isDarkMode ? 'bg-slate-900/40 border-white/10 cyber-card-glow' : 'bg-white border-slate-100 shadow-xl'}`}>
                {/* Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700" />

                {/* Header Image/Icon Area */}
                <div className={`relative h-56 bg-gradient-to-br ${project.gradient} p-8 flex items-center justify-center overflow-hidden`}>
                    {/* Data Scanning Animation */}
                    <motion.div
                        className="absolute inset-x-0 h-[2px] bg-white/40 blur-[2px] z-10"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Animated Geometric Decoration */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/30 rotate-45 -translate-x-16 -translate-y-16 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/30 rotate-45 translate-x-16 translate-y-16 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
                    </div>

                    <div className="relative z-10 text-8xl group-hover:scale-110 transition-transform duration-700 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]">
                        {project.icon}
                    </div>

                    {/* Tech Badge Float */}
                    <div className="absolute top-6 left-6">
                        <div className={`px-4 py-1.5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border ${isDarkMode ? 'bg-black/40 border-white/20 text-indigo-400' : 'bg-white/40 border-white/30 text-indigo-700'}`}>
                            ARCHIVE-ID: 0{index + 1}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-10 flex-1 flex flex-col relative z-20">
                    <h3 className={`text-3xl font-black mb-4 tracking-tighter leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {project.title}
                    </h3>

                    <p className={`text-sm leading-relaxed mb-8 flex-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {project.description}
                    </p>

                    {/* Tech Ecosystem */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {project.tech.map((tech, idx) => (
                            <span
                                key={idx}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5 text-slate-400 border border-white/10 group-hover:border-indigo-500 group-hover:text-white' : 'bg-slate-50 text-slate-400 border border-slate-100 group-hover:text-indigo-600 group-hover:bg-indigo-50/50'}`}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Project Actions */}
                    <div className="flex items-center gap-4">
                        <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LucidGithub size={18} /> VIEW SOURCE
                        </motion.a>

                        {project.demo !== '#' && (
                            <motion.a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-center w-16 h-16 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-600' : 'bg-white border-slate-100 text-slate-800 hover:border-indigo-600 hover:text-indigo-600 shadow-md'}`}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ExternalLink size={20} />
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
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const projects = [
        {
            title: 'QuickFix AI Customer Agent',
            description: 'Enterprise-grade AI platform with 7+ specialized agents. Built with Google Gemini AI, FastAPI, and React for millisecond responses.',
            tech: ['Gemini AI', 'FastAPI', 'React', 'PostgreSQL'],
            gradient: 'from-indigo-600 via-indigo-500 to-purple-600',
            github: 'https://github.com/RiteshKumar2e/customer-complaint-agent_new',
            demo: 'https://riteshkr.online',
            icon: '⚡'
        },
        {
            title: 'Steel Surface Defect Detection',
            description: 'AMFF-CNN model achieving 99.65% accuracy in industrial quality control using advanced computer vision pipeline.',
            tech: ['Python', 'TensorFlow', 'OpenCV', 'Keras'],
            gradient: 'from-blue-600 via-blue-500 to-cyan-500',
            github: 'https://github.com/RiteshKumar2e/Steel_Surface_Defect',
            demo: '#',
            icon: '👁️'
        },
        {
            title: 'Age Gender Prediction',
            description: 'Real-time deep learning application for biometric identification using CNNs and Haarcascade classifiers.',
            tech: ['Deep Learning', 'PyTorch', 'Computer Vision'],
            gradient: 'from-emerald-500 via-teal-500 to-teal-600',
            github: 'https://github.com/RiteshKumar2e/AGE_GENDER_PREDECTION',
            demo: '#',
            icon: '🧬'
        },
        {
            title: 'Combat Online Plagiarism',
            description: 'NLP-driven system to identify duplicated content using cosine similarity and vector embeddings.',
            tech: ['NLP', 'Python', 'ML', 'Transformers'],
            gradient: 'from-rose-500 via-pink-500 to-pink-600',
            github: 'https://github.com/RiteshKumar2e/Combat-Online-Plagiarism-with-AI',
            demo: '#',
            icon: '🧠'
        },
        {
            title: 'Sentiment Analysis Pipeline',
            description: 'End-to-end sentiment scoring system with high-speed processing and dynamic Plotly visualizations.',
            tech: ['Python', 'VADER', 'Plotly', 'ML'],
            gradient: 'from-amber-500 via-orange-500 to-orange-600',
            github: 'https://github.com/RiteshKumar2e/Sentiment-Analysis',
            demo: '#',
            icon: '🌍'
        },
        {
            title: 'Black Friday Sales Model',
            description: 'Advanced prediction engine using XGBoost and LightGBM to forecast customer spending behavior.',
            tech: ['XGBoost', 'LightGBM', 'Data Analysis'],
            gradient: 'from-blue-500 via-indigo-500 to-indigo-600',
            github: 'https://github.com/RiteshKumar2e/Black-Friday-Sales-Prediction',
            demo: '#',
            icon: '📉'
        }
    ];

    return (
        <section id="projects" className={`section-container py-24 relative overflow-hidden transition-colors duration-700 ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
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
                        className={`text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter ${isDarkMode ? 'text-white text-glow' : 'text-slate-800'}`}
                    >
                        Pioneering <span className="gradient-text">Digital Futures</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className={`text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                        Exploring the intersection of human intelligence and high-performance engineering through specialized software architectures.
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
                        className={`group inline-flex items-center gap-4 px-10 py-5 rounded-3xl border transition-all duration-500 ${isDarkMode ? 'bg-slate-900/60 border-white/10 hover:bg-slate-900 shadow-2xl' : 'bg-white border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2'}`}
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
