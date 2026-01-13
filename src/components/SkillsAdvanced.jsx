import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    SiReact, SiJavascript, SiPython, SiTailwindcss, SiNodedotjs, SiMongodb, SiMysql, SiTensorflow, SiGit, SiSpringboot, SiCplusplus
} from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';

// Sub-component for performance optimization: Caching segment rendering
const SkillSegment = ({ level, color, isDarkMode, inView, skillIndex }) => {
    return (
        <div className="relative">
            {/* Track Background */}
            <div className={`h-4 rounded-lg overflow-hidden flex gap-1 p-[2px] ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                {[...Array(10)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-[1px] ${isDarkMode ? 'bg-white/5' : 'bg-white'}`} />
                ))}
            </div>

            {/* Active Bar - Segmented Overlay */}
            <motion.div
                className="absolute inset-x-0 top-0 h-4 flex gap-1 p-[2px] pointer-events-none"
                initial={{ width: 0 }}
                animate={inView ? { width: `${level}%` } : { width: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + (skillIndex * 0.05) }}
            >
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-[1px] transition-colors duration-500"
                        style={{
                            backgroundColor: i < (level / 10) ? color : 'transparent',
                            boxShadow: i < (level / 10) ? `0 0 6px ${color}40` : 'none'
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
};

const SkillsAdvanced = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const skillCategories = [
        {
            category: 'Frontend Development',
            color: '#61DAFB',
            icon: '🎨',
            skills: [
                { name: 'React', icon: SiReact, level: 90, color: '#61DAFB' },
                { name: 'JavaScript', icon: SiJavascript, level: 85, color: '#F7DF1E' },
                { name: 'Tailwind CSS', icon: SiTailwindcss, level: 88, color: '#06B6D4' },
            ]
        },
        {
            category: 'Backend Development',
            color: '#339933',
            icon: '⚙️',
            skills: [
                { name: 'Node.js', icon: SiNodedotjs, level: 80, color: '#339933' },
                { name: 'SpringBoot', icon: SiSpringboot, level: 75, color: '#6DB33F' },
                { name: 'C++', icon: SiCplusplus, level: 82, color: '#00599C' },
            ]
        },
        {
            category: 'AI & Machine Learning',
            color: '#FF6F00',
            icon: '🧠',
            skills: [
                { name: 'Python', icon: SiPython, level: 88, color: '#3776AB' },
                { name: 'TensorFlow', icon: SiTensorflow, level: 78, color: '#FF6F00' },
            ]
        },
        {
            category: 'Databases & Tools',
            color: '#F05032',
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
                stiffness: 100
            }
        }
    };

    return (
        <section id="skills" className="section-container relative">
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <div className="text-center mb-16">
                    <motion.h2
                        variants={itemVariants}
                        className={`text-4xl md:text-5xl font-black mb-4 ${isDarkMode ? 'text-white text-glow transition-all duration-300' : 'gradient-text'}`}
                    >
                        Technical Expertise
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className={`text-lg max-w-xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                        My toolbox of technologies and methodologies for building modern, high-performance software.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
                    {skillCategories.map((category, catIndex) => (
                        <motion.div
                            key={catIndex}
                            variants={itemVariants}
                            className={`group relative rounded-[40px] p-8 sm:p-10 border transition-all duration-700 overflow-hidden ${isDarkMode ? 'bg-slate-900/40 border-white/5 cyber-card-glow hover:border-indigo-500/20' : 'bg-white border-slate-100 shadow-xl'}`}
                        >
                            <div className="flex items-center gap-5 mb-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${isDarkMode ? 'bg-white/5' : 'bg-indigo-50'}`}>
                                    {category.icon}
                                </div>
                                <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                    {category.category}
                                </h3>
                            </div>

                            <div className="space-y-8">
                                {category.skills.map((skill, skillIndex) => (
                                    <div key={skillIndex} className="group/skill space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <skill.icon className="text-2xl" style={{ color: skill.color }} />
                                                <span className={`font-black uppercase text-xs tracking-widest ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{skill.name}</span>
                                            </div>
                                            <span className={`text-[10px] font-black tracking-tighter ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{skill.level}% CAPABILITY</span>
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
                    className="mt-20 flex flex-wrap justify-center gap-6 pb-10"
                >
                    {[
                        { label: 'Frontend Architecture', value: 'High Density', color: 'from-blue-600 to-indigo-600' },
                        { label: 'Cloud Infrastructure', value: 'Scalable', color: 'from-purple-600 to-pink-600' },
                        { label: 'Neural Intelligence', value: 'Core Engine', color: 'from-amber-600 to-orange-600' },
                        { label: 'System Kernel', value: 'Optimized', color: 'from-emerald-600 to-teal-600' }
                    ].map((badge, idx) => (
                        <div key={idx} className={`group relative p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-1`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
                            <div className={`relative px-6 py-4 rounded-2xl flex flex-col items-center gap-1 min-w-[200px] backdrop-blur-xl ${isDarkMode ? 'bg-slate-900/90' : 'bg-white/95 border border-slate-100'}`}>
                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{badge.label}</span>
                                <span className={`text-sm font-black transition-colors ${isDarkMode ? 'text-white text-glow-sm' : 'text-slate-800'}`}>{badge.value}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SkillsAdvanced;
