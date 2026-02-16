import React, { useEffect, useState, memo } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const { isDarkMode } = useTheme();

    // 1. Direct MotionValues for ZERO-LAG tracking
    // Using MotionValues bypasses React's render cycle for position updates
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // 2. Optimized Spring Physics for "Liquid" smoothness
    // Higher damping and stiffness with lower mass for instant but smooth response
    const springConfig = { damping: 35, stiffness: 400, mass: 0.3 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const updateMousePosition = (e) => {
            // Using requestAnimationFrame is not needed with useMotionValue, 
            // but we ensure direct updates here.
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            if (!target || !(target instanceof HTMLElement)) return;

            // Efficient check for interactive elements
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                window.getComputedStyle(target).cursor === 'pointer'
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseDown = () => setIsClicked(true);
        const handleMouseUp = () => setIsClicked(false);

        // Passive listeners are crucial for performance
        window.addEventListener('mousemove', updateMousePosition, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        window.addEventListener('mousedown', handleMouseDown, { passive: true });
        window.addEventListener('mouseup', handleMouseUp, { passive: true });

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [cursorX, cursorY]);

    const [isTouchDevice, setIsTouchDevice] = useState(false);
    useEffect(() => {
        setIsTouchDevice(('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
    }, []);

    if (isTouchDevice) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
            {/* 1. ULTRA-SMOOTH FOLLOWER (Spring-based) */}
            <motion.div
                className={`absolute rounded-full border border-opacity-30 ${isDarkMode ? 'mix-blend-screen' : 'mix-blend-difference'}`}
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: 40,
                    height: 40,
                    borderColor: isDarkMode ? 'rgba(34, 211, 238, 0.5)' : '#fff',
                }}
                animate={{
                    scale: isHovering ? 1.5 : (isClicked ? 0.8 : 1),
                    backgroundColor: isHovering
                        ? (isDarkMode ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.1)')
                        : 'rgba(34, 211, 238, 0)',
                }}
                transition={{
                    scale: { type: 'spring', stiffness: 400, damping: 25 },
                    backgroundColor: { duration: 0.2 }
                }}
            />

            {/* 2. ZERO-LAG CENTRAL DOT (Direct Tracking) */}
            <motion.div
                className="absolute w-1.5 h-1.5 rounded-full z-10"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: isDarkMode ? '#22d3ee' : '#fff',
                    boxShadow: isDarkMode ? '0 0 10px rgba(34, 211, 238, 0.8)' : 'none',
                    // Disable shadow in light mode for performance
                }}
                animate={{
                    scale: isHovering ? 0 : 1,
                }}
            />

            {/* 3. MINIMALIST CROSSHAIR (Only on Hover) */}
            <AnimatePresence>
                {isHovering && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute flex items-center justify-center"
                        style={{
                            x: cursorX,
                            y: cursorY,
                            translateX: '-50%',
                            translateY: '-50%',
                        }}
                    >
                        <div className={`w-[1px] h-3 absolute ${isDarkMode ? 'bg-cyan-400' : 'bg-white'}`} />
                        <div className={`w-3 h-[1px] absolute ${isDarkMode ? 'bg-cyan-400' : 'bg-white'}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Memoize to prevent unnecessary re-renders
export default memo(CustomCursor);
