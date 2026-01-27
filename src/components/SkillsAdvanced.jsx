import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    SiReact, SiJavascript, SiPython, SiTailwindcss, SiNodedotjs, SiMongodb, SiMysql, SiTensorflow, SiGit, SiSpringboot, SiCplusplus
} from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';

const SkillSegment = ({ level, color, isDarkMode, inView, skillIndex }) => {
    return (
        <div className="relative">
            <div className={`h-3 rounded-full overflow-hidden flex gap-1 p-[2px] ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                {[...Array(10)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-inner'}`} />
                ))}
            </div>

            <motion.div
                className="absolute inset-x-0 top-0 h-3 flex gap-1 p-[2px] pointer-events-none"
                initial={{ width: 0 }}
                animate={inView ? { width: `${level}%` } : { width: 0 }}
                transition={{ duration: 1.2, ease: "circOut", delay: 0.2 + (skillIndex * 0.05) }}
            >
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-full shadow-lg"
                        style={{
                            backgroundColor: i < (level / 10) ? color : 'transparent',
                            boxShadow: i < (level / 10) ? `0 0 15px ${color}80` : 'none'
                        }}
                    >
                        {i < (level / 10) && (
                            <div className="w-full h-full bg-white/30 rounded-full animate-pulse" />
                        )}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const SkillsAdvanced = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const skillCategories = [
        {
            category: 'Frontend Development',
            icon: '🎨',
            skills: [
                { name: 'React', icon: SiReact, level: 90, color: '#61DAFB' },
                { name: 'JavaScript', icon: SiJavascript, level: 85, color: '#F7DF1E' },
                { name: 'Tailwind CSS', icon: SiTailwindcss, level: 88, color: '#06B6D4' },
            ]
        },
        {
            category: 'Backend Development',
            icon: '⚙️',
            skills: [
                { name: 'Node.js', icon: SiNodedotjs, level: 80, color: '#339933' },
                { name: 'SpringBoot', icon: SiSpringboot, level: 75, color: '#6DB33F' },
                { name: 'C++', icon: SiCplusplus, level: 82, color: '#00599C' },
            ]
        },
        {
            category: 'AI & Machine Learning',
            icon: '🧠',
            skills: [
                { name: 'Python', icon: SiPython, level: 88, color: '#3776AB' },
                { name: 'TensorFlow', icon: SiTensorflow, level: 78, color: '#FF6F00' },
            ]
        },
        {
            category: 'Databases & Tools',
            icon: '🛠️',
            skills: [
                { name: 'MySQL', icon: SiMysql, level: 80, color: '#4479A1' },
                { name: 'MongoDB', icon: SiMongodb, level: 75, color: '#47A248' },
                { name: 'Git', icon: SiGit, level: 85, color: '#F05032' },
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    return (
        <section id="skills" className="container-custom relative overflow-hidden">
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="space-y-20"
            >
                <div className="text-center space-y-4">
                    <motion.div variants={itemVariants} className={`inline-block px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'}`}>
                        Technology Stack
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter">
                        Technical <span className="text-gradient">Capabilities</span>
                    </motion.h2>
                    <motion.p variants={itemVariants} className={`text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        A comprehensive overview of my technical expertise and proficiency in various modern software development domains.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 px-4">
                    {skillCategories.map((category, catIndex) => (
                        <motion.div
                            key={catIndex}
                            variants={itemVariants}
                            className="glass-card rounded-[48px] p-10 space-y-10 group"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${isDarkMode ? 'bg-slate-800/80 border border-white/10' : 'bg-white border border-slate-200 shadow-xl'}`}>
                                    {category.icon}
                                </div>
                                <h3 className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {category.category}
                                </h3>
                            </div>

                            <div className="space-y-10">
                                {category.skills.map((skill, skillIndex) => (
                                    <div key={skillIndex} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl border transition-colors group-hover:border-indigo-500/20 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white shadow-sm border-slate-100'}`}>
                                                    <skill.icon className="text-2xl" style={{ color: skill.color }} />
                                                </div>
                                                <span className={`font-black uppercase text-xs tracking-[0.2em] ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{skill.name}</span>
                                            </div>
                                            <span className={`text-[10px] font-black tracking-widest ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{skill.level}% POWER</span>
                                        </div>

                                        <SkillSegment
                                            level={skill.level}
                                            color={skill.color}
                                            isDarkMode={isDarkMode}
                                            inView={inView}
                                            skillIndex={skillIndex}
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap justify-center gap-8 pt-10 px-4"
                >
                    {[
                        { label: 'Cloud Architecture', value: 'High Density' },
                        { label: 'System Kernel', value: 'Optimized' },
                        { label: 'Neural Intelligence', value: 'Active' },
                        { label: 'Data Security', value: 'Encrypted' }
                    ].map((badge, idx) => (
                        <div key={idx} className="glass-card px-8 py-5 rounded-3xl flex flex-col items-center gap-1 group hover:border-indigo-500/50">
                            <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400 font-bold'}`}>{badge.label}</span>
                            <span className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{badge.value}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SkillsAdvanced;
