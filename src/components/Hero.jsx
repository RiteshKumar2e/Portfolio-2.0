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
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-60 animate-pulse ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-100'}`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-60 ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-100'}`} />
            </div>

            <div className="section-container relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center lg:text-left"
                    >
                        <motion.div variants={itemVariants} className="mb-6">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border shadow-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                👋 Welcome to my portfolio
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className={`text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9] ${isDarkMode ? 'text-white text-glow' : 'text-slate-900'}`}
                        >
                            <span className="block text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase opacity-50 mb-4">Initialising Protocol:</span>
                            Hello, I'm{' '}
                            <span className="gradient-text">
                                Ritesh Kumar
                            </span>
                        </motion.h1>

                        {/* Mobile Only Avatar Visual - Reverted to Rocket as per user request */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:hidden flex justify-center mb-8"
                        >
                            <div className={`w-32 h-32 rounded-3xl p-4 border transition-all duration-700 ${isDarkMode ? 'bg-slate-900/40 border-white/10 cyber-card-glow' : 'bg-white border-slate-100 shadow-xl'}`}>
                                <div className={`w-full h-full rounded-2xl flex items-center justify-center text-4xl shadow-inner ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                                    🚀
                                </div>
                            </div>
                        </motion.div>

                        <motion.p
                            variants={itemVariants}
                            className={`text-base sm:text-lg md:text-xl mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                        >
                            Computer Science & Engineering Student
                            <br />
                            <span className="text-indigo-600 font-extrabold flex items-center justify-center lg:justify-start gap-2">
                                <span className="w-8 h-[2px] bg-indigo-600" /> Web Developer | AI & ML Enthusiast
                            </span>
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 px-4 sm:px-0"
                        >
                            <motion.a
                                href="#projects"
                                className="btn-primary w-full sm:w-auto text-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                [ EXPLORE ARCHIVE ]
                            </motion.a>
                            <motion.a
                                href="/Ritesh_Kumar_Resume.pdf"
                                download
                                className="btn-secondary w-full sm:w-auto text-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                📄 DOWNLOAD CV
                            </motion.a>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            variants={itemVariants}
                            className="flex gap-4 justify-center lg:justify-start"
                        >
                            {[
                                { icon: FaGithub, href: 'https://github.com/RiteshKumar2e', label: 'GitHub', color: isDarkMode ? 'hover:text-white hover:bg-white/20' : 'hover:text-black hover:bg-black/5' },
                                { icon: FaLinkedin, href: 'https://www.linkedin.com/in/ritesh-kumar-b5a1a0257/', label: 'LinkedIn', color: 'hover:text-white hover:bg-blue-600' },
                                { icon: FaEnvelope, href: 'mailto:riteshkumar90359@gmail.com', label: 'Email', color: 'hover:text-white hover:bg-red-500' }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target={social.href.startsWith('http') ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-white border-slate-100 shadow-sm text-slate-400'} ${social.color}`}
                                    whileHover={{ scale: 1.1, y: -4, rotate: 8 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={social.label}
                                >
                                    <social.icon />
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Reverted to Rocket HUD as per user request */}
                    <div className="relative hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative w-full aspect-square max-w-[550px] mx-auto p-8"
                        >
                            {/* HUD Ring */}
                            <svg className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite] opacity-20" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className={isDarkMode ? 'text-indigo-500' : 'text-indigo-200'} />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1 2" className={isDarkMode ? 'text-purple-500' : 'text-purple-200'} />
                            </svg>

                            {/* Main Interactive HUD Box */}
                            <div className={`group relative z-10 w-full h-full p-1 rounded-[48px] overflow-hidden transition-all duration-700 ${isDarkMode ? 'cyber-card-glow' : 'shadow-2xl'}`}>
                                <div className={`absolute inset-0 transition-opacity duration-700 ${isDarkMode ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`} />

                                <div className={`relative w-full h-full rounded-[47px] backdrop-blur-3xl p-10 flex flex-col items-center justify-center text-center gap-8 border transition-colors ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white/90 border-white'}`}>
                                    {/* Tech Icon with Glow */}
                                    <div className="relative">
                                        <div className={`w-32 h-32 rounded-[32px] flex items-center justify-center text-5xl shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${isDarkMode ? 'bg-slate-800 border-white/10 rotate-3' : 'bg-indigo-50 border-indigo-100'}`}>
                                            🚀
                                        </div>
                                        {/* Scanner Line Animation */}
                                        <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none">
                                            <motion.div
                                                className="w-full h-1 bg-indigo-500/50 blur-[2px]"
                                                animate={{ top: ['0%', '100%', '0%'] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                            CORE OPERATIVE
                                        </h3>
                                        <p className={`text-sm font-bold uppercase tracking-[0.2em] px-4 py-2 border rounded-full transition-colors ${isDarkMode ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5' : 'text-indigo-600 border-indigo-100 bg-indigo-50'}`}>
                                            System Architect & Developer
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        {[
                                            { label: 'Neural Accuracy', val: '99.7%' },
                                            { label: 'System Uptime', val: '100%' }
                                        ].map((stat, i) => (
                                            <div key={i} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                                <div className={`text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
                                                <div className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stat.val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Metadata Labels */}
                            <motion.div
                                className={`absolute top-0 -left-12 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl z-20 ${isDarkMode ? 'bg-slate-900/90 border-indigo-500/30 text-indigo-400' : 'bg-white border-indigo-100 text-indigo-600'}`}
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    AI Engine Live
                                </div>
                            </motion.div>

                            <motion.div
                                className={`absolute bottom-0 -right-12 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl z-20 ${isDarkMode ? 'bg-slate-900/90 border-purple-500/30 text-purple-400' : 'bg-white border-purple-100 text-purple-600'}`}
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    Fullstack Ready
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center p-2">
                    <motion.div
                        className="w-1 h-2 bg-indigo-600 rounded-full"
                        animate={{ y: [0, 14, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
