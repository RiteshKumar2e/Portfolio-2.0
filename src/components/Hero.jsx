import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
    const { isDarkMode } = useTheme();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
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
                stiffness: 120,
                damping: 12
            }
        }
    };

    return (
        <section id="home" className="relative min-h-[110vh] flex items-center justify-center pt-20 overflow-visible">
            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center lg:text-left space-y-8"
                    >
                        <motion.div variants={itemVariants}>
                            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold border transition-all duration-500 uppercase tracking-widest ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                Available for new opportunities
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-4">
                            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.85]">
                                <span className={`block text-xl md:text-2xl font-bold tracking-[0.3em] uppercase mb-4 ${isDarkMode ? 'text-indigo-500/60' : 'text-slate-500/60'}`}>
                                    Initialising Protocol:
                                </span>
                                Hello! I'm <br />
                                <span className="text-gradient font-black">
                                    Ritesh Kumar
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            variants={itemVariants}
                            className={`text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium text-balance ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}
                        >
                            A passionate <span className={isDarkMode ? 'text-white font-black' : 'text-slate-900 font-black'}>Computer Science Engineer</span> crafting
                            intelligent digital experiences at the intersection of <span className="text-indigo-600 dark:text-indigo-400 font-bold">Code, Design, & Intelligence.</span>
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                        >
                            <motion.a
                                href="#projects"
                                className="btn-premium flex items-center justify-center gap-3 tracking-widest shadow-premium"
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                VIEW PROJECTS
                            </motion.a>
                            <motion.a
                                href="/Ritesh_Kumar_Resume.pdf"
                                download
                                className="btn-outline flex items-center justify-center gap-3 tracking-widest"
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                DOWNLOAD CV
                            </motion.a>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            variants={itemVariants}
                            className="flex gap-4 justify-center lg:justify-start"
                        >
                            {[
                                { icon: FaGithub, href: 'https://github.com/RiteshKumar2e', label: 'GitHub', color: isDarkMode ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-slate-900 hover:text-white' },
                                { icon: FaLinkedin, href: 'https://www.linkedin.com/in/ritesh-kumar-b5a1a0257/', label: 'LinkedIn', color: 'hover:bg-blue-600 hover:text-white' },
                                { icon: FaEnvelope, href: 'mailto:riteshkumar90359@gmail.com', label: 'Email', color: 'hover:bg-red-500 hover:text-white' }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-500 border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'} ${social.color}`}
                                    whileHover={{ scale: 1.1, y: -4 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={social.label}
                                >
                                    <social.icon />
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Content Visual */}
                    <div className="relative hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative w-full aspect-square max-w-[500px] mx-auto"
                        >
                            {/* Decorative Glows */}
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full animate-pulse-slow" />

                            <div className="magnetic-card w-full h-full flex flex-col items-center justify-center gap-6 group">
                                <div className="relative">
                                    <div className={`w-36 h-36 rounded-[40px] flex items-center justify-center text-6xl shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${isDarkMode ? 'bg-slate-800/80 border border-white/10 shadow-indigo-500/20' : 'bg-white border border-indigo-100 shadow-xl'}`}>
                                        🚀
                                    </div>
                                    <div className="absolute -inset-4 bg-indigo-500/10 blur-xl rounded-full -z-10 animate-spin-slow" />
                                </div>

                                <div className="text-center space-y-2">
                                    <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                        FULLSTACK <span className="text-gradient">OPERATIVE</span>
                                    </h3>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border ${isDarkMode ? 'bg-white/5 border-white/10 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                                        Systems Ready // Archive Online
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                    {[
                                        { label: 'Neural Accuracy', val: '99.9%' },
                                        { label: 'Cloud Uptime', val: '100%' }
                                    ].map((stat, i) => (
                                        <div key={i} className={`p-4 rounded-2xl border text-center transition-colors ${isDarkMode ? 'bg-white/5 border-white/5 group-hover:bg-white/10' : 'bg-slate-50 border-slate-100 group-hover:bg-white group-hover:shadow-md'}`}>
                                            <div className={`text-[9px] font-black uppercase tracking-widest opacity-50 mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
                                            <div className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stat.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating Labels */}
                            <motion.div
                                className={`absolute -top-6 -left-6 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl z-20 ${isDarkMode ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white/90 border-indigo-100 shadow-indigo-500/10'}`}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    AI Engine Live
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700 flex justify-center p-2">
                    <motion.div
                        className="w-1 h-2 bg-indigo-500 rounded-full"
                        animate={{ y: [0, 14, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
