import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    SiReact, SiJavascript, SiNodedotjs, SiMongodb, SiHtml5, SiCss3,
    SiPython, SiTensorflow, SiCplusplus, SiPytorch, SiPandas, SiNumpy,
    SiMysql, SiGit, SiGithub, SiGooglecloud, SiJupyter, SiOpencv,
    SiExpress, SiScikitlearn, SiKeras, SiFastapi, SiPostgresql,
    SiJsonwebtokens, SiSqlalchemy
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { FaLaptopCode, FaServer, FaDatabase, FaBrain, FaTools, FaCloud } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const SkillCategory = ({ title, icon: Icon, skills, index }) => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`rounded-3xl p-6 md:p-8 border transition-all duration-300 hover:-translate-y-1 ${isDarkMode
                ? 'bg-slate-900/40 border-white/10 cyber-card-glow hover:border-indigo-500/30'
                : 'bg-white border-slate-100 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10'
                }`}
        >
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${isDarkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                    <Icon />
                </div>
                <h3 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            </div>

            <div className="flex flex-wrap gap-3">
                {skills.map((skill, idx) => (
                    <div
                        key={idx}
                        className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${isDarkMode
                            ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-indigo-500/50'
                            : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-md'
                            }`}
                    >
                        {skill.icon && (
                            <span className={`text-lg transition-transform duration-300 group-hover:scale-110 ${skill.color}`}>
                                <skill.icon />
                            </span>
                        )}
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                            {skill.name}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const SkillsAdvanced = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const skillCategories = [
        {
            title: "Frontend Development",
            icon: FaLaptopCode,
            skills: [
                { name: "React.js", icon: SiReact, color: "text-[#61DAFB]" },
                { name: "JavaScript", icon: SiJavascript, color: "text-[#F7DF1E]" },
                { name: "HTML5", icon: SiHtml5, color: "text-[#E34F26]" },
                { name: "CSS3", icon: SiCss3, color: "text-[#1572B6]" }
            ]
        },
        {
            title: "Backend Development",
            icon: FaServer,
            skills: [
                { name: "Node.js", icon: SiNodedotjs, color: "text-[#339933]" },
                { name: "FastAPI", icon: SiFastapi, color: "text-[#009688]" },
                { name: "Express.js", icon: SiExpress, color: "text-white" },
                { name: "Python", icon: SiPython, color: "text-[#3776AB]" },
                { name: "JWT", icon: SiJsonwebtokens, color: "text-[#D63AFF]" },
                { name: "C++", icon: SiCplusplus, color: "text-[#00599C]" }
            ]
        },
        {
            title: "Database & Cloud",
            icon: FaCloud,
            skills: [
                { name: "PostgreSQL", icon: SiPostgresql, color: "text-[#336791]" },
                { name: "MongoDB", icon: SiMongodb, color: "text-[#47A248]" },
                { name: "MySQL", icon: SiMysql, color: "text-[#4479A1]" },
                { name: "SQLAlchemy", icon: SiSqlalchemy, color: "text-[#D71F00]" },
                { name: "GCP Cloud", icon: SiGooglecloud, color: "text-[#4285F4]" },
                { name: "GitHub Pages", icon: SiGithub, color: "text-white" }
            ]
        },
        {
            title: "Data Science & AI",
            icon: FaBrain,
            skills: [
                { name: "Deep Learning", icon: FaBrain, color: "text-[#FF6F00]" },
                { name: "TensorFlow", icon: SiTensorflow, color: "text-[#FF6F00]" },
                { name: "PyTorch", icon: SiPytorch, color: "text-[#EE4C2C]" },
                { name: "CNN", icon: SiKeras, color: "text-[#D00000]" },
                { name: "OpenCV", icon: SiOpencv, color: "text-[#5C3EE8]" },
                { name: "Scikit-learn", icon: SiScikitlearn, color: "text-[#F7931E]" },
                { name: "Pandas", icon: SiPandas, color: "text-[#150458]" },
                { name: "NumPy", icon: SiNumpy, color: "text-[#013243]" }
            ]
        },
        {
            title: "Developer Tools",
            icon: FaTools,
            skills: [
                { name: "Git", icon: SiGit, color: "text-[#F05032]" },
                { name: "GitHub", icon: SiGithub, color: "text-white" },
                { name: "VS Code", icon: VscVscode, color: "text-[#007ACC]" },
                { name: "Jupyter", icon: SiJupyter, color: "text-[#F37626]" }
            ]
        }
    ];

    const coursework = [
        "Data Structures & Algorithms",
        "Object-Oriented Programming"
    ];

    return (
        <section id="skills" className="py-24 relative overflow-hidden">
            {/* Background Matrix */}
            <div className={`absolute inset-0 pointer-events-none -z-10 ${isDarkMode ? 'opacity-30' : 'opacity-5'}`}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
                    >
                        Technical Arsenal
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`text-5xl md:text-7xl font-black mb-8 tracking-tighter ${isDarkMode ? 'text-white text-glow' : 'text-slate-900'}`}
                    >
                        Skills & <span className="gradient-text">Expertise</span>
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {skillCategories.map((category, index) => (
                        <SkillCategory
                            key={index}
                            title={category.title}
                            icon={category.icon}
                            skills={category.skills}
                            index={index}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <div className={`inline-flex flex-wrap justify-center gap-4 p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-100 shadow-lg'}`}>
                        <span className={`text-sm font-black uppercase tracking-widest py-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Core Coursework:
                        </span>
                        {coursework.map((course, idx) => (
                            <span key={idx} className={`px-4 py-2 rounded-xl text-sm font-bold ${isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'}`}>
                                {course}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SkillsAdvanced;
