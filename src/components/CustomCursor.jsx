import React, { useEffect, useState, memo, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const { isDarkMode } = useTheme();

    // 1. Position Tracking (Raw Motion Values)
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // 2. High-Response Physics (Ultra-snappy for zero perceived lag)
    // Low mass and high stiffness makes it follow the pointer like it's "glued"
    const springConfig = { damping: 35, stiffness: 450, mass: 0.2 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Refs for direct DOM positioning (even faster than MotionValue binding)
    const dotRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;

            // Update MotionValues (for spring-based halo)
            mouseX.set(clientX);
            mouseY.set(clientY);

            // Direct DOM update for the precision dot (Atomic Zero Lag)
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
            }
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            if (!target) return;

            const isInteractive =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                window.getComputedStyle(target).cursor === 'pointer';

            if (isInteractive !== isHovering) setIsHovering(isInteractive);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [isHovering, mouseX, mouseY]);

    const [isTouchDevice, setIsTouchDevice] = useState(false);
    useEffect(() => {
        setIsTouchDevice(('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
    }, []);

    if (isTouchDevice) return null;

    // Theme Colors
    const primaryColor = isDarkMode ? '#22d3ee' : '#4f46e5';
    const auraColor = isDarkMode ? 'rgba(34, 211, 238, 0.15)' : 'rgba(79, 70, 229, 0.15)';

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* 1. BREATHING OUTER HALO (Modern & Animated) */}
            <motion.div
                className="absolute rounded-full border-2 transform-gpu"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: 40,
                    height: 40,
                    borderColor: primaryColor,
                    willChange: 'transform',
                }}
                animate={{
                    scale: isHovering ? 1.6 : [1, 1.08, 1], // Breathing preserved
                    rotate: isHovering ? 180 : 0,
                    borderRadius: isHovering ? "30%" : "50%", // Morphing preserved
                    borderStyle: isHovering ? 'dashed' : 'solid',
                }}
                transition={{
                    scale: {
                        repeat: isHovering ? 0 : Infinity,
                        duration: 2,
                        ease: "easeInOut"
                    },
                    rotate: { duration: 0.5 },
                    borderRadius: { duration: 0.4 },
                    default: { type: 'spring', stiffness: 300, damping: 25 }
                }}
            />

            {/* 2. CORE PULSE GHOST (The "Animated" part) */}
            <motion.div
                className="absolute rounded-full transform-gpu"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: 40,
                    height: 40,
                    backgroundColor: auraColor,
                    willChange: 'transform',
                }}
                animate={{
                    scale: [1, 1.8],
                    opacity: [0.4, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
            />

            {/* 3. PRECISION SNAP DOT (Direct DOM for Zero Lag) */}
            <div
                ref={dotRef}
                className="absolute rounded-full z-10 transform-gpu"
                style={{
                    width: 6,
                    height: 6,
                    backgroundColor: primaryColor,
                    boxShadow: isDarkMode ? '0 0 10px #22d3ee' : '0 0 8px #4f46e5',
                    left: 0,
                    top: 0,
                    willChange: 'transform',
                }}
            />
        </div>
    );
};

export default memo(CustomCursor);
