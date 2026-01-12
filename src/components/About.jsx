import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';

const About = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

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
        <section id="about" className={`section-container relative transition-colors duration-700 ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <motion.h2
                    variants={itemVariants}
                    className={`text-4xl sm:text-6xl md:text-8xl font-black text-center mb-16 tracking-tighter ${isDarkMode ? 'text-white text-glow' : 'gradient-text'}`}
                >
                    About Me
                </motion.h2>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Profile Image - Optimized for head visibility */}
                    <motion.div
                        variants={itemVariants}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] max-w-[550px] mx-auto group">
                            {/* Decorative Background Elements */}
                            <div className={`absolute inset-0 rounded-[48px] -rotate-6 border shadow-lg transition-colors duration-700 ${isDarkMode ? 'bg-slate-900/80 border-white/5' : 'bg-white border-slate-100'}`} />
                            <div className={`absolute inset-0 rounded-[48px] rotate-3 border transition-colors duration-700 ${isDarkMode ? 'bg-indigo-900/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`} />

                            {/* Main Image Container - Added padding to prevent top cropping */}
                            <div className={`relative rounded-[48px] shadow-2xl overflow-hidden border-4 h-full transition-colors p-4 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-white bg-slate-50'}`}>
                                <div className="w-full h-full rounded-[36px] overflow-hidden">
                                    <img
                                        src="/Profile Pic.jpg"
                                        alt="Ritesh Kumar"
                                        className="w-full h-full object-cover object-top transform hover:scale-110 transition-transform duration-700 origin-top"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Tech Stamp */}
                            <div className={`absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-2xl p-4 flex items-center justify-center border-4 sm:border-8 rotate-12 transition-all duration-500 group-hover:rotate-0 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-50'}`}>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl mb-1">🎓</div>
                                    <div className="text-[12px] font-black leading-tight tracking-tighter uppercase">CSE</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* About Content */}
                    <motion.div variants={itemVariants} className="space-y-10">
                        <div className="space-y-6">
                            <span className="text-sm font-black uppercase tracking-[0.3em] text-indigo-500">My Background</span>
                            <p className={`text-2xl md:text-4xl leading-tight font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                Designing <span className="gradient-text">Scalable Solutions</span> with Code & Logic.
                            </p>
                            <p className={`text-lg leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                I'm a <span className={`${isDarkMode ? 'text-indigo-400' : 'text-slate-900'} font-bold`}>Computer Science Engineer</span> on a mission to build software that matters. Currently focused on deep learning architecture and enterprise-ready web platforms.
                            </p>
                            <div className="h-1 w-20 bg-indigo-600 rounded-full" />
                            <p className="text-slate-500 leading-relaxed italic">
                                "Solving complex problems with simple, elegant code is my primary objective."
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                            {[
                                { number: '10+', label: 'Projects', color: isDarkMode ? 'bg-indigo-900/40 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-white', icon: '🚀' },
                                { number: '5+', label: 'Tech Stack', color: isDarkMode ? 'bg-purple-900/40 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-white', icon: '💻' },
                                { number: '1', label: 'Year Exp', color: isDarkMode ? 'bg-pink-900/40 text-pink-400 border-pink-500/20' : 'bg-pink-50 text-pink-600 border-white', icon: '📅' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className={`${stat.color} rounded-3xl p-6 border shadow-sm flex flex-col items-center justify-center gap-2 group/card transition-all duration-500`}
                                    whileHover={{ y: -10, boxShadow: isDarkMode ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)" }}
                                >
                                    <span className="text-2xl mb-1 group-hover/card:scale-125 transition-transform">{stat.icon}</span>
                                    <div className="text-3xl font-black">{stat.number}</div>
                                    <div className="text-[10px] uppercase tracking-widest font-black opacity-50">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default About;
