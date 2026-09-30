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
                delayChildren: 0.2,
                staggerChildren: 0.12
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
                damping: 18
            }
        }
    };

    // Each letter rises out of a clipped line, like type set into a page.
    const letterVariants = {
        hidden: { y: '105%' },
        visible: { y: '0%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
    };

    const lineVariants = (delay) => ({
        hidden: {},
        visible: { transition: { staggerChildren: 0.045, delayChildren: delay } }
    });

    const letters = (word) => Array.from(word).map((char, index) => (
        <motion.span key={index} className="inline-block" variants={letterVariants}>
            {char}
        </motion.span>
    ));

    const muted = isDarkMode ? 'text-[#c5b79e]' : 'text-slate-600';

    return (
        <section id="home" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Masthead */}
                    <motion.div variants={itemVariants} className={`flex flex-wrap items-center justify-between gap-3 eyebrow ${muted}`}>
                        <span>Portfolio</span>
                        <span className="inline-flex items-center gap-2 text-bronze-700 dark:text-bronze-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-bronze-500 animate-pulse" />
                            Available for new opportunities
                        </span>
                        <span className="hidden md:inline">Engineering · AI / ML · Research</span>
                    </motion.div>
                    <motion.div variants={itemVariants} className="hairline mt-4" />

                    {/* Oversized editorial heading */}
                    <h1 className="display-heading mt-8 md:mt-10 text-ink-900 dark:text-[#eee2ca]" aria-label="Ritesh Kumar">
                        <motion.span className="block overflow-hidden pt-[0.14em] -mt-[0.14em] pb-[0.06em]" variants={lineVariants(0.35)} aria-hidden="true">
                            {letters('Ritesh')}
                        </motion.span>
                        <motion.span
                            className="block overflow-hidden pt-[0.1em] -mt-[0.1em] pb-[0.1em] pl-[0.12em] md:pl-[0.9em] italic text-bronze-700 dark:text-bronze-400"
                            variants={lineVariants(0.6)}
                            aria-hidden="true"
                        >
                            {letters('Kumar.')}
                        </motion.span>
                    </h1>

                    <motion.div variants={itemVariants} className="hairline mt-4 md:mt-8" />

                    {/* Editorial columns */}
                    <div className="grid gap-10 md:grid-cols-12 mt-8 md:mt-10">
                        <motion.div variants={itemVariants} className="md:col-span-7 space-y-5">
                            <div className="text-2xl sm:text-3xl md:text-[2.4rem] leading-tight tracking-tight min-h-[1.3em]">
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
                                    className="italic"
                                />
                            </div>
                            <p className={`text-lg md:text-xl leading-relaxed max-w-2xl text-balance ${muted}`}>
                                I build full-stack web platforms and <span className="text-bronze-700 dark:text-bronze-300">AI/ML systems</span> — from FastAPI backends to deep-learning models that ship to real users.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <motion.a
                                    href="#projects"
                                    className="btn-premium flex items-center justify-center gap-3 tracking-wide"
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    View projects <span aria-hidden="true">→</span>
                                </motion.a>
                                <motion.button
                                    onClick={handleDownloadCV}
                                    className="btn-outline flex items-center justify-center gap-3 tracking-wide"
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Download CV
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Numbered index — real numbers up front */}
                        <motion.div variants={itemVariants} className="md:col-span-5 md:pl-8 md:border-l border-[#c5b79e]/25">
                            <ol className="divide-y divide-[#c5b79e]/25">
                                {[
                                    ['04', 'Internships'],
                                    ['10+', 'Projects shipped'],
                                    ['99.67%', 'Steel-defect accuracy'],
                                    ['Finalist', 'National hackathon']
                                ].map(([value, label], index) => (
                                    <li key={index} className="flex items-baseline gap-4 py-3">
                                        <span className={`eyebrow ${muted}`}>{String(index + 1).padStart(2, '0')}</span>
                                        <span className="flex-1 text-lg">{label}</span>
                                        <span className="text-2xl md:text-3xl tracking-tight text-bronze-700 dark:text-bronze-300">{value}</span>
                                    </li>
                                ))}
                            </ol>

                            {/* Social Links */}
                            <div className="flex gap-3 mt-6">
                                {[
                                    // Brand colors are raw hex: the Tailwind blue/red/lime families are remapped to the earth palette.
                                    { icon: FaGithub, href: 'https://github.com/RiteshKumar2e', label: 'GitHub', color: isDarkMode ? 'text-[#f0f6fc] hover:bg-[#f0f6fc] hover:text-[#181717] hover:border-[#f0f6fc]' : 'text-[#181717] hover:bg-[#181717] hover:text-white hover:border-[#181717]' },
                                    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/riteshkumar-tech', label: 'LinkedIn', color: 'text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]' },
                                    { icon: FaEnvelope, href: 'mailto:riteshkumar90359@gmail.com', label: 'Email', color: 'text-[#EA4335] hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335]' },
                                    { icon: SiOrcid, href: 'https://orcid.org/0009-0009-0057-6839', label: 'ORCID', color: 'text-[#A6CE39] hover:bg-[#A6CE39] hover:text-white hover:border-[#A6CE39]' }
                                ].map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-11 h-11 rounded-full flex items-center justify-center text-lg transition-colors duration-300 border ${isDarkMode ? 'border-[#eee2ca]/15 bg-white/5' : 'border-slate-300 bg-white/60'} ${social.color}`}
                                        whileHover={{ y: -3 }}
                                        whileTap={{ scale: 0.92 }}
                                        aria-label={social.label}
                                    >
                                        <social.icon />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
