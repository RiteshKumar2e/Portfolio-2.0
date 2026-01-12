import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    SiReact, SiJavascript, SiPython, SiTailwindcss, SiNodedotjs,
    SiMongodb, SiMysql, SiTensorflow, SiGit, SiDocker, SiSpringboot, SiCplusplus
} from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';

const SkillsAdvanced = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const skillCategories = [
        {
            category: 'Frontend Development',
            color: 'from-blue-600 to-indigo-600',
            icon: '🎨',
            skills: [
                { name: 'React', icon: SiReact, level: 90, color: '#61DAFB' },
                { name: 'JavaScript', icon: SiJavascript, level: 85, color: '#F7DF1E' },
                { name: 'Tailwind CSS', icon: SiTailwindcss, level: 88, color: '#06B6D4' },
            ]
        },
        {
            category: 'Backend Development',
            color: 'from-indigo-600 to-violet-600',
            icon: '⚙️',
            skills: [
                { name: 'Node.js', icon: SiNodedotjs, level: 80, color: '#339933' },
                { name: 'SpringBoot', icon: SiSpringboot, level: 75, color: '#6DB33F' },
                { name: 'C++', icon: SiCplusplus, level: 82, color: '#00599C' },
            ]
        },
        {
            category: 'AI & Machine Learning',
            color: 'from-purple-600 to-pink-600',
            icon: '🧠',
            skills: [
                { name: 'Python', icon: SiPython, level: 88, color: '#3776AB' },
                { name: 'TensorFlow', icon: SiTensorflow, level: 78, color: '#FF6F00' },
            ]
        },
        {
            category: 'Databases & Tools',
            color: 'from-pink-600 to-rose-600',
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
                staggerChildren: 0.15
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
                        className={`text-4xl md:text-5xl font-black mb-4 ${isDarkMode ? 'text-white text-glow' : 'gradient-text'}`}
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
                            className={`rounded-[32px] p-8 border transition-all duration-500 shine-effect ${isDarkMode ? 'bg-slate-900/40 border-white/10 cyber-card-glow' : 'bg-white border-white shadow-sm'}`}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <span className="text-3xl">{category.icon}</span>
                                <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                    {category.category}
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {category.skills.map((skill, skillIndex) => (
                                    <div key={skillIndex} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <skill.icon className="text-2xl" style={{ color: skill.color }} />
                                                <span className={`font-bold text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{skill.name}</span>
                                            </div>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-400'}`}>{skill.level}%</span>
                                        </div>
                                        <div className={`h-2.5 rounded-full overflow-hidden border p-[1px] ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <motion.div
                                                className="h-full rounded-full relative"
                                                style={{
                                                    background: `linear-gradient(90deg, ${skill.color}cc, ${skill.color})`
                                                }}
                                                initial={{ width: 0 }}
                                                animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: catIndex * 0.1 }}
                                            >
                                                <div className="absolute top-0 right-0 w-4 h-full bg-white/20 blur-[2px]" />
                                            </motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Summary Section */}
                <motion.div
                    variants={itemVariants}
                    className="mt-16 flex flex-wrap justify-center gap-8"
                >
                    {[
                        { label: 'Frontend', value: 'High', color: isDarkMode ? 'bg-blue-900/20 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-white' },
                        { label: 'Backend', value: 'Strong', color: isDarkMode ? 'bg-indigo-900/20 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-white' },
                        { label: 'Cloud/Tools', value: 'Capable', color: isDarkMode ? 'bg-rose-900/20 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-white' },
                        { label: 'AI/ML', value: 'Expertise', color: isDarkMode ? 'bg-amber-900/20 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-white' }
                    ].map((badge, idx) => (
                        <div key={idx} className={`${badge.color} px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm border`}>
                            {badge.label}: {badge.value}
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SkillsAdvanced;
