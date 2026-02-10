import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            // Check for clickable elements: links, buttons, inputs, or anything with pointer cursor
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

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Hide default cursor
        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'auto';
        };
    }, []);

    // Strictly hide on touch devices
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const checkTouch = () => {
            return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
        };
        setIsTouchDevice(checkTouch());
    }, []);

    if (isTouchDevice) return null;

    // Only render on devices that support hover (desktop/mouse users)
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99999] overflow-hidden">
            {/* Inner Dot - The precise cursor */}
            <motion.div
                className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
                style={{
                    x: mousePosition.x - 4, // Center the 8px dot (half width)
                    y: mousePosition.y - 4,
                    pointerEvents: 'none'
                }}
            />

            {/* Outer Ring - The follower */}
            <motion.div
                className="absolute w-8 h-8 border-[1.5px] border-cyan-400 rounded-full opacity-60 flex items-center justify-center mix-blend-screen"
                animate={{
                    x: mousePosition.x - 16, // Center the 32px ring
                    y: mousePosition.y - 16,
                    scale: isHovering ? 1.5 : (isClicked ? 0.8 : 1),
                    borderColor: isClicked ? '#22d3ee' : '#22d3ee',
                    backgroundColor: isHovering ? 'rgba(34, 211, 238, 0.1)' : 'transparent'
                }}
                transition={{
                    type: "spring",
                    stiffness: 800,
                    damping: 30,
                    mass: 0.5
                }}
            >
                {/* Optional trailing particles decoration matching the image vibe */}
                <div className={`absolute -right-2 top-0 w-1 h-1 bg-cyan-400 rounded-full opacity-50 ${isHovering ? 'hidden' : 'block'}`} />
                <div className={`absolute -left-1 bottom-1 w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-30 ${isHovering ? 'hidden' : 'block'}`} />
            </motion.div>
        </div>
    );
};

export default CustomCursor;
