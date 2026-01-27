import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { useLenis } from '@studio-freight/react-lenis';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const lenis = useLenis();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.5 });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[9999] w-14 h-14 rounded-2xl flex items-center justify-center group border transition-all active:scale-90 shadow-2xl backdrop-blur-md bg-white border-slate-100 dark:bg-slate-900/80 dark:border-white/10"
                    whileHover={{ y: -5 }}
                    aria-label="Scroll to top"
                >
                    {/* Inner Accent */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <FaArrowUp className="text-indigo-600 text-lg md:text-xl group-hover:-translate-y-1 transition-transform relative z-10" />

                    {/* Subtle Badge */}
                    <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-bl-lg" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
