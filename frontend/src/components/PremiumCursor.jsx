import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * PremiumCursor
 * A silky-smooth orange glow dot that follows the mouse using framer-motion springs.
 * - Snaps back elastically (spring physics — no lag)
 * - Scales up on hovering clickable elements
 * - Hidden on touch / mobile devices
 */
const PremiumCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isPointer, setIsPointer] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Tight spring config for zero-lag, elastic feel
    const springConfig = { damping: 22, stiffness: 700, mass: 0.3 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    // Outer ring — slightly laggier for the trailing feel
    const outerSpringConfig = { damping: 28, stiffness: 300, mass: 0.5 };
    const outerX = useSpring(cursorX, outerSpringConfig);
    const outerY = useSpring(cursorY, outerSpringConfig);

    const isTouchDevice = useRef(
        typeof window !== 'undefined' &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );

    useEffect(() => {
        if (isTouchDevice.current) return;

        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const checkPointer = (e) => {
            const el = e.target;
            const isClickable =
                el.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]') !== null ||
                window.getComputedStyle(el).cursor === 'pointer';
            setIsPointer(isClickable);
        };

        const hideCursor = () => setIsVisible(false);
        const showCursor = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor, { passive: true });
        window.addEventListener('mousemove', checkPointer, { passive: true });
        window.addEventListener('mouseleave', hideCursor);
        window.addEventListener('mouseenter', showCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousemove', checkPointer);
            window.removeEventListener('mouseleave', hideCursor);
            window.removeEventListener('mouseenter', showCursor);
        };
    }, [cursorX, cursorY, isVisible]);

    if (isTouchDevice.current) return null;

    return (
        <>
            {/* Outer ring — lags slightly for trail effect */}
            <motion.div
                style={{
                    x: outerX,
                    y: outerY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0,
                    scale: isPointer ? 1.8 : 1,
                }}
                transition={{ scale: { duration: 0.2 } }}
                className="fixed top-0 left-0 z-[9999] pointer-events-none"
            >
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: '1.5px solid rgba(255, 90, 0, 0.45)',
                        background: 'transparent',
                        transition: 'transform 0.2s ease, opacity 0.2s ease',
                    }}
                />
            </motion.div>

            {/* Inner dot — fast, snappy */}
            <motion.div
                style={{
                    x,
                    y,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0,
                    scale: isPointer ? 1.5 : 1,
                }}
                transition={{ scale: { duration: 0.15 } }}
                className="fixed top-0 left-0 z-[9999] pointer-events-none"
            >
                <div
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #FF9D00 0%, #FF5A00 100%)',
                        boxShadow: '0 0 12px rgba(255, 90, 0, 0.8), 0 0 24px rgba(255, 90, 0, 0.4)',
                        transition: 'transform 0.15s ease',
                    }}
                />
            </motion.div>
        </>
    );
};

export default PremiumCursor;
