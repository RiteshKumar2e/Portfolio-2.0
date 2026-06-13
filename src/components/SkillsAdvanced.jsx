import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    SiReact, SiJavascript, SiNodedotjs, SiMongodb, SiHtml5, SiCss,
    SiPython, SiTensorflow, SiCplusplus, SiPytorch, SiPandas, SiNumpy,
    SiMysql, SiGit, SiGithub, SiGooglecloud, SiJupyter, SiOpencv,
    SiExpress, SiScikitlearn, SiKeras, SiFastapi, SiPostgresql,
    SiJsonwebtokens, SiSqlalchemy
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { FaLaptopCode, FaServer, FaDatabase, FaBrain, FaTools, FaCloud, FaCodeBranch, FaCube, FaGlobe, FaShapes, FaLayerGroup } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const HoverSkillPill = ({ name, icon: Icon, color, index }) => {
    const { isDarkMode } = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`relative flex items-center justify-center w-20 h-14 md:w-24 md:h-16 rounded-2xl border cursor-pointer transition-all duration-200 ${isDarkMode
                ? 'bg-white/5 border-white/5 hover:border-indigo-400/50 hover:bg-indigo-500/10 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-white hover:shadow-lg'
                }`}
            whileHover={{ scale: 1.15, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => setIsHovered(!isHovered)}
        >
            <div className={`flex items-center justify-center text-2xl md:text-4xl transition-colors duration-200 ${color}`}>
                <Icon />
            </div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.8 }}
                        animate={{ opacity: 1, y: -10, x: "-50%", scale: 1 }}
                        exit={{ opacity: 0, y: 5, x: "-50%", scale: 0.8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={`absolute -top-14 left-1/2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl z-50 border ${isDarkMode
                            ? 'bg-slate-900 border-indigo-500/30 text-white'
                            : 'bg-white border-indigo-100 text-slate-900'
                            }`}
                    >
                        {name}
                        {/* Tooltip Arrow */}
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${isDarkMode
                            ? 'bg-slate-900 border-indigo-500/30'
                            : 'bg-white border-indigo-100'
                            }`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const SkillCategory = ({ title, icon: Icon, skills, index, category }) => {
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
                ? 'bg-slate-900/60 border-white/10 hover:border-indigo-500/30 shadow-xl shadow-black/20'
                : 'bg-white border-slate-200/70 shadow-soft hover:border-indigo-200 hover:shadow-premium'
                }`}
        >
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-colors duration-300 border ${isDarkMode ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                    <Icon />
                </div>
                <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            </div>

            <div className="flex flex-wrap gap-3">
                {skills.map((skill, idx) => (
                    <HoverSkillPill
                        key={idx}
                        name={skill.name}
                        icon={skill.icon}
                        color={skill.color}
                        index={idx}
                    />
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
            color: "cyan",
            skills: [
                { name: "React.js", icon: SiReact, color: "text-[#61DAFB]" },
                { name: "JavaScript", icon: SiJavascript, color: "text-[#F7DF1E]" },
                { name: "HTML5", icon: SiHtml5, color: "text-[#E34F26]" },
                { name: "CSS3", icon: SiCss, color: "text-[#1572B6]" }
            ]
        },
        {
            title: "Backend Development",
            icon: FaServer,
            color: "emerald",
            skills: [
                { name: "Node.js", icon: SiNodedotjs, color: "text-[#339933]" },
                { name: "FastAPI", icon: SiFastapi, color: "text-[#009688]" },
                { name: "Express.js", icon: SiExpress, color: "text-slate-900 dark:text-white" },
                { name: "Python", icon: SiPython, color: "text-[#3776AB]" },
                { name: "JWT", icon: SiJsonwebtokens, color: "text-[#D63AFF]" },
                { name: "C++", icon: SiCplusplus, color: "text-[#00599C]" }
            ]
        },
        {
            title: "Database & Cloud",
            icon: FaCloud,
            color: "amber",
            skills: [
                { name: "PostgreSQL", icon: SiPostgresql, color: "text-[#336791]" },
                { name: "MongoDB", icon: SiMongodb, color: "text-[#47A248]" },
                { name: "MySQL", icon: SiMysql, color: "text-[#4479A1]" },
                { name: "SQLAlchemy", icon: SiSqlalchemy, color: "text-[#D71F00]" },
                { name: "GCP Cloud", icon: SiGooglecloud, color: "text-[#4285F4]" },
                { name: "GitHub Pages", icon: SiGithub, color: "text-slate-900 dark:text-white" }
            ]
        },
        {
            title: "Data Science & AI",
            icon: FaBrain,
            color: "rose",
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
            color: "purple",
            skills: [
                { name: "Git", icon: SiGit, color: "text-[#F05032]" },
                { name: "GitHub", icon: SiGithub, color: "text-slate-900 dark:text-white" },
                { name: "VS Code", icon: VscVscode, color: "text-[#007ACC]" },
                { name: "Jupyter", icon: SiJupyter, color: "text-[#F37626]" }
            ]
        }
    ];

    const coursework = [
        { name: "Data Structures", icon: FaCodeBranch },
        { name: "OOPs", icon: FaCube },
        { name: "DBMS", icon: FaDatabase },
        { name: "Software Eng.", icon: FaShapes }
    ];

    const interests = [
        { name: "Machine Learning", icon: FaBrain },
        { name: "Deep Learning", icon: FaLayerGroup },
        { name: "Web Development", icon: FaGlobe }
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
                        className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] mb-6 border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
                    >
                        Tech Stack
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`text-5xl md:text-7xl font-black mb-8 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                    >
                        Skills & <span className="gradient-text">Tools</span>
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
                            category={category}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 flex flex-col items-center gap-8"
                >
                    {/* Coursework */}
                    <div className={`w-full max-w-4xl p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-100 shadow-lg'}`}>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            <span className={`text-sm font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'text-indigo-400' : 'text-slate-500'}`}>
                                Core Coursework:
                            </span>
                            <div className="flex flex-wrap justify-center gap-3">
                                {coursework.map((course, idx) => (
                                    <HoverSkillPill
                                        key={idx}
                                        name={course.name}
                                        icon={course.icon}
                                        color={isDarkMode ? 'text-white' : 'text-slate-900'}
                                        index={idx}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Interests */}
                    <div className={`w-full max-w-4xl p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-100 shadow-lg'}`}>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            <span className={`text-sm font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'text-indigo-400' : 'text-slate-500'}`}>
                                Key Interests:
                            </span>
                            <div className="flex flex-wrap justify-center gap-3">
                                {interests.map((interest, idx) => (
                                    <HoverSkillPill
                                        key={idx}
                                        name={interest.name}
                                        icon={interest.icon}
                                        color={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
                                        index={idx}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SkillsAdvanced;
