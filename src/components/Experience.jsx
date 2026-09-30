import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBriefcase, FaCalendar, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { Microscope, Code2, BarChart3, BrainCircuit, Briefcase, CalendarClock, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Experience = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const internships = [
            {
            title: 'Research Intern',
            company: 'Machine Vision and Intelligence Lab, NIT Jamshedpur',
            duration: 'May 2025 - Present',
            location: 'Jamshedpur (On-Site)',
            description: [
                'AMFF-CNN (MobileNetV2 + FPN): designed a 3.4M-parameter CNN that fuses multi-scale features with channel/spatial attention and learned cross-scale weights — 92.95% macro-F1 on a leakage-free held-out split, Grad-CAM weak localization, 118 ms CPU inference, and a 6-variant ablation across 3 seeds (TensorFlow).',
                'TinySteelLLM: turned ~30 handcrafted OpenCV descriptors (edges, GLCM texture, FFT, region stats) into short text prompts and classified them with a 2-layer, 4-head Transformer trained from scratch — no pretrained weights or external APIs (PyTorch).',
                'SteelSense-BiLSTM: scaled to 92 descriptors (~94 tokens) and a 1.75M-parameter BiLSTM with attention/max/mean pooling — 99.67% ± 0.23 on NEU-DET and 99.02% ± 0.40 on SteelDefectX (5 seeds), benchmarked against XGBoost, Random Forest, SVM, MobileNetV3 and ShuffleNetV2. First-author paper under review.'
            ],
            skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'MobileNetV2', 'FPN', 'Transformer', 'BiLSTM', 'Grad-CAM'],
            icon: Microscope,
            color: 'from-purple-500 to-pink-600'
        },
        {
            title: 'Web Development Intern',
            company: 'TechMantra Global',
            duration: 'May 2024 - July 2024',
            location: 'Noida (Remote)',
            description: [
                'Developed the backend for a recipe discovery app with 5 REST endpoints for search, lookup, and auth (Node.js, Express).',
                'Architected a hybrid search layer that queries an in-memory catalog, merges it with the external TheMealDB API, and caps results at 50 per query; lookups check local data first and fall back to the external API.',
                'Authored a seeding script that generates 2,500+ recipes in TheMealDB\u2019s schema with a separate ID range, so local and external results share one format and never collide.',
                'Secured the API with stateless JWT auth (1-hour expiry), bcrypt hashing, duplicate-account checks, and email/phone login.',
                'Built the React 19 + Vite frontend with React Router (7 pages), protected dashboard and profile routes, and a Context API auth store that keeps users logged in across reloads.'
            ],
            skills: ['Node.js', 'Express', 'React 19', 'React Router', 'Vite', 'JWT', 'bcrypt', 'REST API'],
            icon: Code2,
            color: 'from-blue-500 to-indigo-600'
        },
    
        {
            title: 'Data Science Intern',
            company: 'AICTE–Slash Mark',
            duration: 'Dec 2024 - Jan 2025',
            location: 'Remote',
            description: [
                'Mastered data cleaning and exploratory data analysis (EDA).',
                'Built mini-projects for real-world data problems.',
                'Utilized Pandas and Seaborn for advanced visualizations.'
            ],
            skills: ['Python', 'Pandas', 'Jupyter', 'EDA'],
            icon: BarChart3,
            color: 'from-emerald-500 to-teal-600'
        },
        {
            title: 'ML Intern',
            company: 'AICTE–Slash Mark',
            duration: 'May 2024 - July 2024',
            location: 'Remote',
            description: [
                'Implemented Regression, Decision Trees, and K-Means.',
                'Processed large datasets for model training.',
                'Analyzed overfitting and bias-variance trade-offs.'
            ],
            skills: ['Python', 'scikit-learn', 'NumPy', 'ML Algorithms'],
            icon: BrainCircuit,
            color: 'from-orange-500 to-red-600'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <section id="experience" className="container-custom relative overflow-hidden">
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <div className="text-center mb-16 px-4">
                    <motion.div variants={itemVariants} className={`inline-block px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border mb-4 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                        Career Trajectory
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="text-5xl sm:text-7xl md:text-8xl font-black mb-4 tracking-tighter"
                    >
                        Professional <span className="text-gradient">Experience</span>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className={`text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                    >
                        My journey through internships and industrial exposure in backend dev, ML, and Data Science.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 px-4">
                    {internships.map((internship, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`relative group rounded-[2.5rem] p-8 transition-all duration-500 border ${isDarkMode
                                ? 'bg-slate-900/95 border-white/10 hover:border-indigo-500/40 shadow-2xl shadow-black/50'
                                : 'bg-white border-slate-100 hover:border-indigo-200 shadow-xl shadow-slate-200/50'
                                }`}
                        >
                            {/* Accent Glow */}
                            <div className={`absolute -inset-0.5 rounded-[2.6rem] bg-gradient-to-br ${internship.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />

                            <div className="relative z-10">
                                {/* Header Section */}
                                <div className="flex flex-col gap-5 mb-8">
                                    {/* Title + company */}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-3xl bg-gradient-to-br ${internship.color} p-0.5 flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3`}>
                                            <div className="w-full h-full bg-slate-900/10 rounded-[1.4rem] flex items-center justify-center text-2xl sm:text-3xl backdrop-blur-sm">
                                                <internship.icon className="w-7 h-7 sm:w-9 sm:h-9 text-[#fbf6ee] drop-shadow" strokeWidth={1.4} />
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className={`text-xl sm:text-2xl font-black tracking-tight mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {internship.title}
                                            </h3>
                                            <div className="flex items-start gap-2">
                                                <span className={`h-1 w-5 mt-1.5 shrink-0 rounded-full bg-gradient-to-r ${internship.color}`} />
                                                <p className="text-indigo-500 font-bold text-[11px] leading-snug tracking-[0.12em] uppercase">
                                                    {internship.company}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Meta pills — wrap, never overflow */}
                                    <div className="flex flex-wrap gap-2">
                                        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                                            }`}>
                                            <FaCalendar className="text-indigo-500 text-sm shrink-0" />
                                            {internship.duration}
                                        </div>
                                        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                                            }`}>
                                            <FaMapMarkerAlt className="text-rose-500 text-sm shrink-0" />
                                            {internship.location}
                                        </div>
                                    </div>
                                </div>

                                {/* Project Description Points */}
                                <div className="space-y-4 mb-10">
                                    {internship.description.map((point, idx) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="flex-none mt-2.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/10" />
                                            </div>
                                            <p className={`text-[15px] font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                {point}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Tech Stack Tags - Enhanced Pills */}
                                <div className={`flex flex-wrap gap-2.5 pt-8 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                                    {internship.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] border transition-all duration-300 ${isDarkMode
                                                ? 'bg-white/5 text-indigo-300 border-white/5 group-hover:border-indigo-500/30'
                                                : 'bg-indigo-50 text-indigo-700 border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white'
                                                }`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Summary Badges */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap justify-center gap-4 mt-20 max-w-4xl mx-auto px-4"
                >
                    {[
                        { number: '4', label: 'Internships', icon: Briefcase },
                        { number: '12+', label: 'Months Active', icon: CalendarClock },
                        { number: '99.67%', label: 'Accuracy', icon: Target }
                    ].map((stat, index) => (
                        <div key={index} className={`group/stat px-6 py-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${isDarkMode ? 'bg-slate-900/40 border-white/10 cyber-card-glow text-white' : 'bg-white border-slate-100 shadow-sm hover:shadow-md text-slate-800'}`}>
                            <span className="w-10 h-10 rounded-full border border-bronze-400/40 flex items-center justify-center text-bronze-700 dark:text-bronze-300 transition-colors duration-300 group-hover/stat:bg-bronze-400 group-hover/stat:text-ink-950 group-hover/stat:border-bronze-400"><stat.icon size={18} strokeWidth={1.5} /></span>
                            <div className="text-left">
                                <div className="text-xl font-black">{stat.number}</div>
                                <div className={`text-[10px] uppercase font-bold tracking-tighter ${isDarkMode ? 'text-indigo-400/80' : 'text-slate-400'}`}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Experience;
