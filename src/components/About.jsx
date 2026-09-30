import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FolderGit2, Layers, CalendarDays, GraduationCap } from 'lucide-react';
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
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25
            }
        }
    };

    return (
        <section id="about" className={`py-12 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto relative transition-colors duration-300 ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <motion.h2
                    variants={itemVariants}
                    className={`text-5xl sm:text-7xl md:text-8xl font-black text-center mb-16 tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                >
                    About <span className="text-gradient">Me</span>
                </motion.h2>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                    {/* Profile Image */}
                    <motion.div
                        variants={itemVariants}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] max-w-[380px] mx-auto group">
                            {/* Decorative Background Elements */}
                            <div className="absolute inset-0 rounded-[40px] -rotate-2 glass-card shadow-xl" />
                            <div className={`absolute inset-0 rounded-[40px] rotate-2 border transition-colors duration-300 ${isDarkMode ? 'bg-indigo-900/10 border-indigo-500/20' : 'bg-white border-indigo-100'}`} />

                            {/* Main Image Container */}
                            <div className={`relative rounded-[40px] shadow-xl overflow-hidden border-2 transition-colors p-3 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-white bg-[#f3ebdc]'}`}>
                                <div className="w-full h-full rounded-[28px] overflow-hidden">
                                    <img
                                        src="/profile-pic.jpg"
                                        alt="Ritesh Kumar"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                            </div>

                            {/* Tech Stamp */}
                            <div className="absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-2xl p-4 flex items-center justify-center border-4 sm:border-8 rotate-12 transition-all duration-300 group-hover:rotate-0 glass-card">
                                <div className="text-center">
                                    <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 mb-1 text-bronze-600 dark:text-bronze-300" strokeWidth={1.5} />
                                    <div className={`text-[12px] font-black uppercase ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>CSE</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* About Content */}
                    <motion.div variants={itemVariants} className="space-y-10">
                        <div className="space-y-6 text-center lg:text-left">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">My Background</span>
                            <p className={`text-4xl md:text-5xl leading-tight font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Designing <span className="text-gradient">Scalable Solutions</span> with Code & Logic.
                            </p>
                            <p className={`text-lg leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                I'm a <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold`}>Computer Science Engineer</span> on a mission to build software that matters. Currently focused on deep learning architecture and enterprise-ready web platforms.
                            </p>
                            <div className="h-1 w-20 bg-indigo-600 rounded-full mx-auto lg:mx-0" />
                            <p className={`leading-relaxed italic border-l-4 border-indigo-500/20 pl-6 transition-opacity duration-400 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${inView ? 'opacity-100' : 'opacity-0'}`}>
                                "Solving complex problems with simple, elegant code is my primary objective."
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
                            {[
                                { number: '10+', label: 'Projects', icon: FolderGit2 },
                                { number: '5+', label: 'Tech Stack', icon: Layers },
                                { number: '1', label: 'Year Exp', icon: CalendarDays }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="glass-card rounded-[32px] p-6 flex flex-col items-center justify-center gap-2 group/stat"
                                    whileHover={{ y: -8 }}
                                >
                                    <span className="w-10 h-10 mx-auto rounded-full border border-bronze-400/40 flex items-center justify-center text-bronze-700 dark:text-bronze-300 transition-colors duration-300 group-hover/stat:bg-bronze-400 group-hover/stat:text-ink-950 group-hover/stat:border-bronze-400"><stat.icon size={18} strokeWidth={1.5} /></span>
                                    <div className={`text-3xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stat.number}</div>
                                    <div className="text-[9px] uppercase tracking-widest font-black text-slate-500">{stat.label}</div>
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
