import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    FaTrophy, FaMedal, FaStar, FaAward, FaCertificate,
    FaCode, FaGraduationCap, FaLightbulb, FaUsers, FaChartLine,
    FaRocket, FaHandshake, FaUserTie, FaBrain, FaClock, FaSmile
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Achievements = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [activeTab, setActiveTab] = useState('all');

    const achievementsData = {
        achievements: [
            {
                icon: FaTrophy,
                title: '98.61 Percentile',
                description: 'Awarded Merit Certificate in Naukri Campus Young Turks - Round 1 (2025)',
                color: 'from-orange-500 to-amber-500',
                gradient: 'bg-gradient-to-br from-orange-500/10 to-amber-500/10',
                category: 'Achievements'
            },
            {
                icon: FaRocket,
                title: 'IBM Hackathon 2025',
                description: 'National Finalist — Cleared IBM HackerRank challenge and competed in 24-hour national hackathon',
                color: 'from-blue-500 to-indigo-500',
                gradient: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
                category: 'Achievements'
            },
            {
                icon: FaMedal,
                title: '2nd Place CodeFest',
                description: 'Secured 2nd place at CodeFest, Arka Jain University during Engineering Day competition',
                color: 'from-purple-500 to-pink-500',
                gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
                category: 'Achievements'
            },
            {
                icon: FaCertificate,
                title: 'NPTEL DBMS Certificate',
                description: 'Earned Certificate in Database Management Systems through NPTEL online learning platform',
                color: 'from-pink-500 to-rose-500',
                gradient: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
                category: 'Achievements'
            },
            {
                icon: FaHandshake,
                title: 'Organized Hack Horizon 2K25',
                description: 'University-level hackathon fostering innovation and collaboration among tech enthusiasts',
                color: 'from-indigo-500 to-purple-500',
                gradient: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10',
                category: 'Achievements'
            }
        ],
        strengths: [
            {
                icon: FaBrain,
                title: 'Analytical Thinking',
                description: 'Skilled in identifying patterns, interpreting data, and solving problems logically',
                color: 'from-cyan-500 to-blue-600',
                gradient: 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10',
                category: 'Strengths'
            },
            {
                icon: FaLightbulb,
                title: 'Critical Reasoning',
                description: 'Strong ability to assess complex issues and make effective decisions',
                color: 'from-amber-500 to-orange-600',
                gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-600/10',
                category: 'Strengths'
            },
            {
                icon: FaUsers,
                title: 'Teamwork & Collaboration',
                description: 'Excellent at working within diverse teams to achieve shared goals',
                color: 'from-emerald-500 to-teal-600',
                gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/10',
                category: 'Strengths'
            },
            {
                icon: FaClock,
                title: 'Time Management',
                description: 'Efficient in prioritizing tasks and meeting deadlines consistently',
                color: 'from-violet-500 to-purple-600',
                gradient: 'bg-gradient-to-br from-violet-500/10 to-purple-600/10',
                category: 'Strengths'
            },
            {
                icon: FaSmile,
                title: 'Professional Attitude',
                description: 'Maintain an optimistic and adaptable mindset fostering continuous learning',
                color: 'from-rose-500 to-pink-600',
                gradient: 'bg-gradient-to-br from-rose-500/10 to-pink-600/10',
                category: 'Strengths'
            }
        ],
        leadership: [
            {
                icon: FaUserTie,
                title: 'Club President - CCS',
                description: 'Leading Code & Compute Society, coordinating with faculty and driving coding culture on campus',
                color: 'from-green-600 to-emerald-600',
                gradient: 'bg-gradient-to-br from-green-600/10 to-emerald-600/10',
                category: 'Leadership'
            },
            {
                icon: FaUsers,
                title: 'Community Lead - GDG',
                description: 'GDG on Campus AJU — Organizing tech events, workshops, and peer-learning sessions',
                color: 'from-red-600 to-rose-600',
                gradient: 'bg-gradient-to-br from-red-600/10 to-rose-600/10',
                category: 'Leadership'
            },
            {
                icon: FaStar,
                title: 'Class Representative',
                description: 'Bridge between faculty and students, ensuring effective communication and academic coordination',
                color: 'from-orange-600 to-amber-600',
                gradient: 'bg-gradient-to-br from-orange-600/10 to-amber-600/10',
                category: 'Leadership'
            },
            {
                icon: FaBrain,
                title: 'Gate Club Member',
                description: 'Organizing workshops and discussions to support GATE exam preparation and peer learning',
                color: 'from-teal-600 to-cyan-600',
                gradient: 'bg-gradient-to-br from-teal-600/10 to-cyan-600/10',
                category: 'Leadership'
            }
        ],
        technical: [
            {
                icon: FaTrophy,
                title: '99.72% Accuracy',
                description: 'Achieved exceptional accuracy on NEU-DET dataset for steel surface defect detection using AMFF-CNN',
                color: 'from-amber-600 to-orange-600',
                gradient: 'bg-gradient-to-br from-amber-600/10 to-orange-600/10',
                category: 'Technical'
            },
            {
                icon: FaMedal,
                title: '99.31% Accuracy',
                description: 'High accuracy on 7-class steel surface dataset using advanced computer vision techniques',
                color: 'from-blue-600 to-indigo-600',
                gradient: 'bg-gradient-to-br from-blue-600/10 to-indigo-600/10',
                category: 'Technical'
            },
            {
                icon: FaAward,
                title: '10+ Projects',
                description: 'Successfully delivered AI/ML projects: QuickFix AI, Steel Defect Detection, Sentiment Analysis',
                color: 'from-rose-600 to-red-600',
                gradient: 'bg-gradient-to-br from-rose-600/10 to-red-600/10',
                category: 'Technical'
            },
            {
                icon: FaCode,
                title: 'Full Stack Developer',
                description: 'Proficient in React, Node.js, SpringBoot, MongoDB, MySQL with modern web development practices',
                color: 'from-indigo-600 to-violet-600',
                gradient: 'bg-gradient-to-br from-indigo-600/10 to-violet-600/10',
                category: 'Technical'
            }
        ]
    };

    const allItems = [
        ...achievementsData.achievements,
        ...achievementsData.strengths,
        ...achievementsData.leadership,
        ...achievementsData.technical
    ];

    const getFilteredItems = () => {
        if (activeTab === 'all') return allItems;
        if (activeTab === 'achievements') return achievementsData.achievements;
        if (activeTab === 'strengths') return achievementsData.strengths;
        if (activeTab === 'leadership') return achievementsData.leadership;
        if (activeTab === 'technical') return achievementsData.technical;
        return allItems;
    };

    const tabs = [
        { id: 'all', label: 'All', count: allItems.length },
        { id: 'achievements', label: 'Achievements', count: achievementsData.achievements.length },
        { id: 'strengths', label: 'Strengths', count: achievementsData.strengths.length },
        { id: 'leadership', label: 'Leadership', count: achievementsData.leadership.length },
        { id: 'technical', label: 'Technical', count: achievementsData.technical.length }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { scale: 0.8, opacity: 0, y: 20 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 120,
                damping: 12
            }
        }
    };

    return (
        <section id="achievements" className={`section-container relative transition-colors duration-700 ${isDarkMode ? 'bg-transparent' : 'bg-slate-50/50'}`}>
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <motion.h2
                    variants={itemVariants}
                    className={`text-4xl md:text-5xl font-extrabold text-center mb-4 tracking-tighter ${isDarkMode ? 'text-white text-glow' : 'gradient-text'}`}
                >
                    Achievements & Excellence
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className={`text-center mb-10 max-w-3xl mx-auto px-4 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                    Awards, Leadership, Strengths, and Technical Excellence organized for your review.
                </motion.p>

                {/* Tabs - Responsive handling */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12 px-2"
                >
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-bold transition-all shadow-sm ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : isDarkMode ? 'bg-white/5 text-slate-400 border border-white/10 hover:border-indigo-500 hover:text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {tab.label} <span className="text-[10px] md:text-xs opacity-75 ml-1">({tab.count})</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Items Grid */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4"
                    >
                        {getFilteredItems().map((item, index) => (
                            <motion.div
                                key={`${activeTab}-${index}`}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03, duration: 0.3 }}
                                className={`group relative rounded-3xl p-6 border transition-all duration-300 overflow-hidden ${isDarkMode ? 'bg-slate-900/40 border-white/10 cyber-card-glow hover:border-indigo-500/50' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100'}`}
                                whileHover={{ y: -8 }}
                            >
                                {/* Category Badge */}
                                <div className="absolute top-4 right-4 z-20">
                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg transition-colors ${isDarkMode ? 'bg-white/5 text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50'}`}>
                                        {item.category}
                                    </span>
                                </div>

                                {/* Subtle Background Glow */}
                                <div className={`absolute inset-0 ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`} />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon with Circle */}
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-inner group-hover:shadow-lg transition-shadow duration-300`}>
                                        <item.icon className="text-2xl text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-lg font-bold mb-3 transition-colors ${isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-slate-800 group-hover:text-indigo-700'}`}>
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {item.description}
                                    </p>
                                </div>

                                {/* Bottom Accent Line */}
                                <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Key Stats Section */}
                <motion.div
                    variants={itemVariants}
                    className={`mt-20 pt-10 border-t grid grid-cols-2 lg:grid-cols-6 gap-4 max-w-6xl mx-auto px-4 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}
                >
                    {[
                        { number: '98.61%', label: 'Naukri Score', icon: '🏆' },
                        { number: '99.72%', label: 'Best Accuracy', icon: '🎯' },
                        { number: '10+', label: 'Projects', icon: '🚀' },
                        { number: '4', label: 'Internships', icon: '💼' },
                        { number: '4', label: 'Lead Roles', icon: '👑' },
                        { number: '5', label: 'Strengths', icon: '💪' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className={`rounded-2xl p-5 text-center shadow-sm border transition-all border-b-4 border-b-indigo-500 ${isDarkMode ? 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60' : 'bg-white border-slate-50 hover:shadow-md'}`}
                            whileHover={{ y: -5 }}
                        >
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{stat.number}</div>
                            <div className={`text-[10px] uppercase font-bold mt-1 tracking-tight ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Achievements;
