import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    SiReact, SiJavascript, SiNodedotjs, SiMongodb, SiTailwindcss,
    SiHtml5, SiCss3, SiPostgresql, SiPython, SiTensorflow,
    SiCplusplus, SiSpringboot, SiFastapi, SiPytorch, SiPandas,
    SiNumpy, SiBootstrap, SiMysql, SiGit
} from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';

const SkillIcon = ({ icon: Icon, color, name, index }) => {
    const { isDarkMode } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
                scale: 1.2,
                rotate: 5,
                transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            transition={{
                delay: index * 0.02,
                type: 'spring',
                stiffness: 260,
                damping: 20
            }}
            className="relative group p-4"
        >
            {/* Hover Name Label */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-top-6 transition-all duration-300 pointer-events-none z-30">
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl border ${isDarkMode ? 'bg-slate-800 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}>
                    {name}
                </div>
                {/* Carrot/Arrow */}
                <div className={`w-2 h-2 rotate-45 mx-auto -mt-1 border-r border-b ${isDarkMode ? 'bg-slate-800 border-white/20' : 'bg-white border-slate-200'
                    }`} />
            </div>

            {/* Glow Aura */}
            <div
                className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                style={{ backgroundColor: color }}
            />

            {/* Card Body */}
            <div className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl border transition-all duration-300 ${isDarkMode
                ? 'bg-slate-900/60 border-white/10 cyber-card-glow group-hover:border-white/30'
                : 'bg-white border-slate-100 shadow-lg group-hover:shadow-xl'
                }`}>
                <Icon
                    className="text-4xl sm:text-5xl transition-transform duration-500 group-hover:scale-110"
                    style={{ color: color }}
                />
            </div>
        </motion.div>
    );
};

const SkillsAdvanced = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const rows = [
        [
            { icon: SiHtml5, color: '#E34F26', name: 'HTML5' },
            { icon: SiCss3, color: '#1572B6', name: 'CSS3' },
            { icon: SiJavascript, color: '#F7DF1E', name: 'JavaScript' },
            { icon: SiReact, color: '#61DAFB', name: 'React' },
            { icon: SiTailwindcss, color: '#06B6D4', name: 'Tailwind' },
            { icon: SiBootstrap, color: '#7952B3', name: 'Bootstrap' },
        ],
        [
            { icon: SiPython, color: '#3776AB', name: 'Python' },
            { icon: SiFastapi, color: '#05998B', name: 'FastAPI' },
            { icon: SiNodedotjs, color: '#339933', name: 'Node.js' },
            { icon: SiCplusplus, color: '#00599C', name: 'C++' },
        ],
        [
            { icon: SiTensorflow, color: '#FF6F00', name: 'TensorFlow' },
            { icon: SiPytorch, color: '#EE4C2C', name: 'PyTorch' },
            { icon: SiPandas, color: '#150458', name: 'Pandas' },
            { icon: SiNumpy, color: '#013243', name: 'NumPy' },
        ],
        [
            { icon: SiPostgresql, color: '#4169E1', name: 'PostgreSQL' },
            { icon: SiMysql, color: '#4479A1', name: 'MySQL' },
            { icon: SiMongodb, color: '#47A248', name: 'MongoDB' },
            { icon: SiGit, color: '#F05032', name: 'Git' },
        ]
    ];

    const allSkills = rows.flat();

    return (
        <section id="skills" className="py-24 relative overflow-hidden">
            {/* Dark Energy / Grid Background */}
            <div className={`absolute inset-0 pointer-events-none -z-10 ${isDarkMode ? 'opacity-40' : 'opacity-5'}`}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] ${isDarkMode ? 'bg-indigo-600/10' : 'bg-indigo-100'}`} />
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
                    >
                        Mastering the Stack
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`text-5xl md:text-8xl font-black mb-8 tracking-tighter transition-all duration-300 ${isDarkMode ? 'text-white text-glow' : 'text-slate-900'}`}
                    >
                        Technical <span className="gradient-text">DNA</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className={`text-lg md:text-xl max-w-2xl mx-auto font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                    >
                        A powerful collection of modern tools and frameworks that I use to bring complex digital visions to life.
                    </motion.p>
                </div>

                {/* Pyramid Layout */}
                <div className="flex flex-col items-center gap-4 sm:gap-8">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
                            {row.map((skill, skillIndex) => (
                                <SkillIcon
                                    key={`${rowIndex}-${skillIndex}`}
                                    icon={skill.icon}
                                    color={skill.color}
                                    name={skill.name}
                                    index={rowIndex * 10 + skillIndex}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Performance HUD */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
                >
                    {[
                        { label: 'Neural Compute', value: 'Optimized', icon: '🧠' },
                        { label: 'Cloud Latency', value: '< 20ms', icon: '⚡' },
                        { label: 'Data Security', value: 'AES-256', icon: '🛡️' },
                        { label: 'Logic Flow', value: 'Async 2.0', icon: '⚙️' }
                    ].map((hud, idx) => (
                        <div key={idx} className={`relative p-6 rounded-3xl border transition-all duration-500 group hover:-translate-y-2 ${isDarkMode ? 'bg-slate-900/40 border-white/5 cyber-card-glow hover:border-indigo-500/50' : 'bg-white border-slate-100 shadow-xl'
                            }`}>
                            <div className="text-2xl mb-3">{hud.icon}</div>
                            <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {hud.label}
                            </div>
                            <div className={`text-lg font-black ${isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-slate-900'}`}>
                                {hud.value}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default SkillsAdvanced;
