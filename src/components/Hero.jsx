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
                            className={`text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-[1] md:leading-[0.9] ${isDarkMode ? 'text-white text-glow' : 'text-slate-900'}`}
                        >
                            Hello, I'm{' '}
                            <span className="gradient-text">
                                Ritesh Kumar
                            </span>
                        </motion.h1>

                        {/* Mobile Only Avatar Visual */}
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
                            className={`text-base sm:text-lg md:text-xl mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                        >
                            Computer Science & Engineering Student
                            <br />
                            <span className="text-indigo-600 font-bold">
                                Web Developer | AI & ML Enthusiast
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
                                View My Work
                            </motion.a>
                            <motion.a
                                href="/Ritesh_Kumar_Resume.pdf"
                                download
                                className="btn-secondary w-full sm:w-auto text-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                📄 Download Resume
                            </motion.a>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            variants={itemVariants}
                            className="flex gap-4 justify-center lg:justify-start"
                        >
                            {[
                                { icon: FaGithub, href: 'https://github.com/RiteshKumar2e', label: 'GitHub', color: isDarkMode ? 'hover:text-white' : 'hover:text-black' },
                                { icon: FaLinkedin, href: 'https://www.linkedin.com/in/ritesh-kumar-b5a1a0257/', label: 'LinkedIn', color: 'hover:text-blue-500' },
                                { icon: FaEnvelope, href: 'mailto:riteshkumar90359@gmail.com', label: 'Email', color: 'hover:text-red-500' }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target={social.href.startsWith('http') ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    className={`w-14 h-14 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-500 shadow-lg cyber-card-glow' : 'bg-white border-slate-100 shadow-sm text-slate-400'} ${social.color}`}
                                    whileHover={{ scale: 1.1, y: -4 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={social.label}
                                >
                                    <social.icon />
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Clean Interactive Profile Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            {/* Static Decorative Orbs - Light and Fast */}
                            <motion.div
                                className={`absolute top-10 right-10 w-64 h-64 rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-indigo-600/30' : 'bg-indigo-100/60'}`}
                            />
                            <motion.div
                                className={`absolute bottom-10 left-10 w-72 h-72 rounded-full blur-3xl ${isDarkMode ? 'bg-purple-600/30' : 'bg-purple-100/60'}`}
                            />

                            {/* Main Profile Frame - Premium Glassmorphism */}
                            <div className={`relative z-10 w-full h-full p-4 rounded-[60px] border backdrop-blur-md shadow-2xl overflow-hidden shine-effect transition-colors duration-700 ${isDarkMode ? 'bg-slate-900/40 border-white/10 cyber-card-glow' : 'bg-white/20 border-white/60'}`}>
                                <div className={`w-full h-full rounded-[44px] flex items-center justify-center p-12 text-center transition-colors duration-700 ${isDarkMode ? 'bg-slate-900/60 border border-white/5' : 'bg-white/80 border border-white'}`}>
                                    <div className="space-y-6">
                                        <div className={`w-24 h-24 rounded-3xl shadow-lg flex items-center justify-center mx-auto border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-indigo-50 border-indigo-100'}`}>
                                            <span className="text-4xl">🚀</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-3xl font-black mb-2 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Innovating the Digital Frontier.</h3>
                                            <p className={`font-bold text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Deploying scalable AI solutions and modern web architectures with precision.</p>
                                        </div>
                                        <div className="flex justify-center gap-3">
                                            <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">Architect</span>
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>Developer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Tech Insight Labels */}
                            <motion.div
                                className={`absolute -top-4 -right-4 p-5 rounded-[28px] shadow-2xl border z-20 ${isDarkMode ? 'bg-slate-900/90 border-white/10 backdrop-blur-md' : 'bg-white/90 border-white'}`}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Neural Engines Active</span>
                                </div>
                            </motion.div>

                            <motion.div
                                className={`absolute bottom-10 -left-10 p-5 rounded-[28px] shadow-2xl border z-20 ${isDarkMode ? 'bg-slate-900/90 border-white/10 backdrop-blur-md' : 'bg-white/90 border-white'}`}
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Quantum Ops Verified</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
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
