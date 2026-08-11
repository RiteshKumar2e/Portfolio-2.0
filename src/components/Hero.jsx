import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiOrcid } from 'react-icons/si';
import { TypeAnimation } from 'react-type-animation';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
    const { isDarkMode } = useTheme();

    const handleDownloadCV = () => {
        const link = document.createElement('a');
        link.href = '/Ritesh_Kumar_Resume.pdf?v=2';
        link.download = 'Ritesh_Kumar_Resume.pdf';
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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

                        <motion.div variants={itemVariants} className="space-y-3">
                            <div className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <TypeAnimation
                                    sequence={[
                                        'Computer Science Engineer',
                                        2000,
                                        'Full Stack Developer',
                                        2000,
                                        'AI/ML Engineer',
                                        2000,
                                        'Open Source Contributor',
                                        2000
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                    className="text-indigo-600 dark:text-indigo-300"
                                />
                            </div>
                            <p className={`text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium text-balance ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                I build full-stack web platforms and <span className="text-indigo-600 dark:text-indigo-400 font-bold">AI/ML systems</span> — from FastAPI backends to deep-learning models that ship to real users.
                            </p>
                        </motion.div>

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
                            <motion.button
                                onClick={handleDownloadCV}
                                className="btn-outline flex items-center justify-center gap-3 tracking-widest"
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                DOWNLOAD CV
                            </motion.button>
                        </motion.div>

                        {/* Trust strip — real numbers up front (Rules 13, 17, 21) */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap justify-center gap-3"
                        >
                            {[
                                '4 Internships',
                                '10+ Projects',
                                '98.33% Model Accuracy',
                                'National Hackathon Finalist'
                            ].map((stat, index) => (
                                <span
                                    key={index}
                                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors duration-500 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}
                                >
                                    {stat}
                                </span>
                            ))}
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            variants={itemVariants}
                            className="flex gap-4 justify-center"
                        >
                            {[
                                { icon: FaGithub, href: 'https://github.com/RiteshKumar2e', label: 'GitHub', color: isDarkMode ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-slate-900 hover:text-white' },
                                { icon: FaLinkedin, href: 'https://www.linkedin.com/in/riteshkumar-tech', label: 'LinkedIn', color: 'hover:bg-blue-600 hover:text-white' },
                                { icon: FaEnvelope, href: 'mailto:riteshkumar90359@gmail.com', label: 'Email', color: 'hover:bg-red-500 hover:text-white' },
                                { icon: SiOrcid, href: 'https://orcid.org/0009-0009-0057-6839', label: 'ORCID', color: 'hover:bg-[#A6CE39] hover:text-white' }
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

