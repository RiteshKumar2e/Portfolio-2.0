import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBriefcase, FaCalendar, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Experience = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const internships = [
        {
            title: 'Backend Intern',
            company: 'TechMantra Global',
            duration: 'May 2024 - July 2024',
            location: 'Remote',
            description: [
                'Gained in-depth understanding of SpringBoot for backend development.',
                'Proficient in designing, deploying, and managing scalable applications.',
                'Implemented responsive UI using modern web standards.'
            ],
            skills: ['SpringBoot', 'HTML', 'CSS', 'Bootstrap', 'JavaScript'],
            icon: '🚀',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            title: 'Machine Learning Intern',
            company: 'NIT Jamshedpur',
            duration: 'May 2025 - Present',
            location: 'Offline',
            description: [
                'Developed AMFF-CNN for steel surface defect detection.',
                'Achieved 99.31% accuracy on a 7-class industry dataset.',
                'Secured 99.72% accuracy on the NEU-DET dataset.'
            ],
            skills: ['Python', 'Computer Vision', 'PyTorch', 'OpenCV'],
            icon: '🤖',
            color: 'from-purple-500 to-pink-600'
        },
        {
            title: 'Data Science Intern',
            company: 'AICTE–Slash Mark',
            duration: 'Dec 2024 - Jan 2025',
            location: 'Remote',
            description: [
                'Mastered data cleaning and exploratory data analysis (EDA).',
                'Built mini-projects for real-world data problems.',
                'Utilized Pandas and Seaborn for advanced visualizations.'
            ],
            skills: ['Python', 'Pandas', 'Jupyter', 'EDA'],
            icon: '📊',
            color: 'from-emerald-500 to-teal-600'
        },
        {
            title: 'ML Intern',
            company: 'AICTE–Slash Mark',
            duration: 'May 2024 - July 2024',
            location: 'Remote',
            description: [
                'Implemented Regression, Decision Trees, and K-Means.',
                'Processed large datasets for model training.',
                'Analyzed overfitting and bias-variance trade-offs.'
            ],
            skills: ['Python', 'scikit-learn', 'NumPy', 'ML Algorithms'],
            icon: '🧠',
            color: 'from-orange-500 to-red-600'
        }
    ];

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
        <section id="experience" className="container-custom relative overflow-hidden">
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <div className="text-center mb-16 px-4">
                    <motion.div variants={itemVariants} className={`inline-block px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border mb-4 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                        Career Trajectory
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="text-5xl sm:text-7xl md:text-8xl font-black mb-4 tracking-tighter"
                    >
                        Professional <span className="text-gradient">Experience</span>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className={`text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                    >
                        My journey through internships and industrial exposure in backend dev, ML, and Data Science.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 px-4">
                    {internships.map((internship, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="glass-card rounded-[40px] p-8 relative group overflow-hidden"
                        >
                            {/* Decorative Background Icon */}
                            <div className="absolute -top-4 -right-4 text-9xl opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
                                {internship.icon}
                            </div>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${internship.color} flex items-center justify-center text-3xl shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                            <span className="text-white drop-shadow-md">{internship.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-2xl font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                                {internship.title}
                                            </h3>
                                            <p className="text-indigo-600 dark:text-indigo-400 font-black text-xs tracking-widest uppercase mt-1">
                                                {internship.company}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start sm:items-end gap-1">
                                        <div className={`px-3 py-1 border rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                            <FaCalendar className="text-indigo-500" />
                                            {internship.duration}
                                        </div>
                                        <div className={`px-3 py-1 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                            <FaMapMarkerAlt className="text-rose-500" />
                                            {internship.location}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-4 mb-10">
                                    {internship.description.map((point, idx) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="mt-2 w-2 h-2 rounded-full bg-indigo-500 shrink-0 shadow-lg shadow-indigo-500/40" />
                                            <p className={`text-base font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>{point}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Skills */}
                                <div className={`flex flex-wrap gap-2 pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                                    {internship.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isDarkMode ? 'bg-white/5 text-slate-300 border-white/10 group-hover:border-indigo-500 group-hover:text-indigo-400' : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:border-indigo-200 group-hover:text-indigo-600'}`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Summary Badges */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap justify-center gap-4 mt-20 max-w-4xl mx-auto px-4"
                >
                    {[
                        { number: '4', label: 'Internships', icon: '💼' },
                        { number: '12+', label: 'Months Active', icon: '⏰' },
                        { number: '99%+', label: 'Accuracy', icon: '🎯' }
                    ].map((stat, index) => (
                        <div key={index} className={`px-6 py-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${isDarkMode ? 'bg-slate-900/40 border-white/10 cyber-card-glow text-white' : 'bg-white border-slate-100 shadow-sm hover:shadow-md text-slate-800'}`}>
                            <span className="text-2xl">{stat.icon}</span>
                            <div className="text-left">
                                <div className="text-xl font-black">{stat.number}</div>
                                <div className={`text-[10px] uppercase font-bold tracking-tighter ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Experience;
