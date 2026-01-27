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
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-10 overflow-visible">
            <div className="container-custom relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Centered Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center space-y-8"
                    >
                        <motion.div variants={itemVariants}>
                            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold border transition-all duration-500 uppercase tracking-widest ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                Available for new opportunities
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-4">
                            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.85]">
                                Hello! I'm <br />
                                <span className="text-gradient font-black">
                                    Ritesh Kumar
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            variants={itemVariants}
                            className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium text-balance ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}
                        >
                            A passionate <span className={isDarkMode ? 'text-white font-black' : 'text-slate-900 font-black'}>Computer Science Engineer</span> crafting
                            intelligent digital experiences at the intersection of <span className="text-indigo-600 dark:text-indigo-400 font-bold">Code, Design, & Intelligence.</span>
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-5 justify-center"
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
                            className="flex gap-4 justify-center"
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
                </div>
            </div>
        </section>
    );
};

export default Hero;

