import React, { useEffect, useState, memo, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const { isDarkMode } = useTheme();

    // 1. Position Tracking (High performance refs for zero react-cycle overhead)
    const mouseX = useRef(-100);
    const mouseY = useRef(-100);

    // 2. Trailing Positions (Using refs to maintain state outside React)
    const haloX = useRef(-100);
    const haloY = useRef(-100);
    const ghostX = useRef(-100);
    const ghostY = useRef(-100);

    // 3. DOM Refs for direct style injection (Smoothest possible updates)
    const dotRef = useRef(null);
    const haloRef = useRef(null);
    const ghostRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.current = e.clientX;
            mouseY.current = e.clientY;
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

        let rafId;
        const render = () => {
            // Target coordinates
            const tx = mouseX.current;
            const ty = mouseY.current;

            // Direct DOM update for Precision Core (Atomic 1:1 follow)
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
            }

            // High-Precision Linear Interpolation (Lerp) for Butter Smooth Trail
            // Factor 0.15 makes it feel liquid and organic but never "heavy"
            haloX.current += (tx - haloX.current) * 0.15;
            haloY.current += (ty - haloY.current) * 0.15;
            if (haloRef.current) {
                haloRef.current.style.transform = `translate3d(${haloX.current}px, ${haloY.current}px, 0) translate(-50%, -50%)`;
            }

            // Secondary ghost trail with a different factor for complexity
            ghostX.current += (tx - ghostX.current) * 0.08;
            ghostY.current += (ty - ghostY.current) * 0.08;
            if (ghostRef.current) {
                ghostRef.current.style.transform = `translate3d(${ghostX.current}px, ${ghostY.current}px, 0) translate(-50%, -50%)`;
            }

            rafId = requestAnimationFrame(render);
        };
        rafId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(rafId);
        };
    }, [isHovering]);

    const [isTouchDevice, setIsTouchDevice] = useState(false);
    useEffect(() => {
        setIsTouchDevice(('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
    }, []);

    if (isTouchDevice) return null;

    const primaryColor = isDarkMode ? '#22d3ee' : '#4f46e5';
    const auraColor = isDarkMode ? 'rgba(34, 211, 238, 0.15)' : 'rgba(79, 70, 229, 0.15)';

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* 1. LIQUID HALO (High-End Trailing) */}
            <motion.div
                ref={haloRef}
                className="absolute rounded-full border-2 transform-gpu"
                style={{
                    width: 40,
                    height: 40,
                    borderColor: primaryColor,
                    willChange: 'transform',
                    left: 0,
                    top: 0,
                }}
                animate={{
                    scale: isHovering ? 1.6 : [1, 1.05, 1],
                    borderRadius: isHovering ? "35%" : "50%",
                    borderStyle: isHovering ? 'dashed' : 'solid',
                }}
                transition={{
                    scale: { repeat: isHovering ? 0 : Infinity, duration: 3, ease: "easeInOut" },
                    borderRadius: { duration: 0.5 },
                    default: { type: 'spring', stiffness: 200, damping: 30 }
                }}
            />

            {/* 2. GHOST PULSE (The "Liquid Layer") */}
            <motion.div
                ref={ghostRef}
                className="absolute rounded-full transform-gpu"
                style={{
                    width: 40,
                    height: 40,
                    backgroundColor: auraColor,
                    willChange: 'transform',
                    left: 0,
                    top: 0,
                }}
                animate={{
                    scale: [1, 2],
                    opacity: [0.3, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
            />

            {/* 3. ZERO-LAG CORE POINT */}
            <div
                ref={dotRef}
                className="absolute rounded-full z-10 transform-gpu"
                style={{
                    width: 6,
                    height: 6,
                    backgroundColor: primaryColor,
                    boxShadow: isDarkMode ? '0 0 12px #22d3ee' : '0 0 10px #4f46e5',
                    left: 0,
                    top: 0,
                    willChange: 'transform',
                }}
            />
        </div>
    );
};

export default memo(CustomCursor);
