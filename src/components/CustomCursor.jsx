import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // High-performance MotionValues for direct DOM manipulation
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Liquid-smooth spring follower config
    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const updateMousePosition = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            if (!target || !(target instanceof HTMLElement)) return;

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

        window.addEventListener('mousemove', updateMousePosition, { passive: true });
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

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
            {/* Ultra-Responsive Inner Dot */}
            <motion.div
                className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />

            {/* Premium Liquid Follower */}
            <motion.div
                className="absolute w-10 h-10 border-[1.5px] border-cyan-400/40 rounded-full flex items-center justify-center mix-blend-screen"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovering ? 1.6 : (isClicked ? 0.8 : 1),
                    backgroundColor: isHovering ? 'rgba(34, 211, 238, 0.15)' : 'rgba(34, 211, 238, 0)',
                    borderColor: isHovering ? 'rgba(255, 255, 255, 0.9)' : 'rgba(34, 211, 238, 0.4)',
                }}
                transition={{
                    scale: { type: "spring", stiffness: 400, damping: 20 },
                    backgroundColor: { duration: 0.15 },
                    borderColor: { duration: 0.15 }
                }}
            >
                {/* Secondary Orbit Dot */}
                <div className={`absolute -right-1 -top-1 w-1 h-1 bg-cyan-400 rounded-full opacity-30 ${isHovering ? 'hidden' : 'block'}`} />
            </motion.div>
        </div>
    );
};

export default CustomCursor;

