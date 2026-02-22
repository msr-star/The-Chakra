import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const EclipseToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div
            className="relative w-16 h-8 rounded-full cursor-pointer overflow-hidden border border-white/20 glass-panel hover:border-white/40 transition-colors"
            onClick={toggleTheme}
            style={{ backgroundColor: isDark ? 'rgba(2, 6, 23, 0.5)' : 'rgba(255, 255, 255, 0.5)' }}
        >
            {/* Color bleed background transition */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-300"
                initial={false}
                animate={{
                    opacity: isDark ? 0 : 1,
                    scale: isDark ? 0.8 : 1.5,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
            />

            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-slate-900 to-indigo-950"
                initial={false}
                animate={{
                    opacity: isDark ? 1 : 0,
                    scale: isDark ? 1.5 : 0.8,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
            />

            {/* The physical celestial body (Sun/Moon) */}
            <motion.div
                className="absolute top-1 bottom-1 w-6 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10 flex items-center justify-center"
                layout
                initial={false}
                animate={{
                    x: isDark ? 4 : 36,
                    backgroundColor: isDark ? "#e2e8f0" : "#fef08a",
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1
                }}
            >
                {/* Craters for moon */}
                {isDark && (
                    <>
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-slate-300/50 top-1 right-1" />
                        <div className="absolute w-1 h-1 rounded-full bg-slate-300/50 bottom-1 left-2" />
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default EclipseToggle;
