import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useTheme } from '../context/ThemeContext';

const LoadingScreen = () => {
    const { isDarkMode } = useTheme();

    // Staggered text reveal for "Ritesh."
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div
            className={`fixed inset-0 flex items-center justify-center z-[9999] overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-60 ${isDarkMode ? 'bg-indigo-900/40' : 'bg-indigo-50'}`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-60 ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-50'}`} />
            </div>

            <div className="text-center relative z-10 flex flex-col items-center">
                <motion.div
                    className="relative mb-6"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className={`w-24 h-24 rounded-3xl border flex items-center justify-center shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-white/10 shadow-indigo-500/20' : 'bg-indigo-50 border-indigo-100 shadow-indigo-200/50'}`}>
                        <motion.div
                            className={`absolute inset-0 opacity-20 ${isDarkMode ? 'bg-gradient-to-tr from-cyan-400 to-indigo-500' : 'bg-gradient-to-tr from-indigo-500 to-purple-600'}`}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex"
                        >
                            {Array.from("Ritesh.").map((char, index) => (
                                <motion.span key={index} variants={childVariants} className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex items-center gap-2">
                        <h2 className={`text-xs font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Initializing System</h2>
                        <span className={`text-xs font-black ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            <CountUp end={100} duration={1.8} />%
                        </span>
                    </div>
                    
                    <div className={`w-40 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <motion.div
                            className={`h-full ${isDarkMode ? 'bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500'}`}
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            style={{ width: "100%" }}
                        />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
