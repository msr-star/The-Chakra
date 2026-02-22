import React, { useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ChakraCard = ({ question, onAnswer, isActive }) => {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    if (!isActive) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={question.id}
                initial={{ y: 500, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -500, opacity: 0, scale: 0.8 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 0.6
                }}
                className="w-full max-w-2xl mx-auto flex flex-col items-center text-center perspective-1000"
                style={{ perspective: 2000 }}
            >
                <motion.div
                    ref={ref}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    className="w-full glass-panel rounded-[2rem] p-10 flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-visible border border-white/5 cursor-crosshair"
                >
                    <div
                        style={{
                            transform: "translateZ(75px)",
                            transformStyle: "preserve-3d",
                        }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* Glow behind the card text */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accentLight/20 blur-[80px] rounded-full pointer-events-none" />

                        <span className="text-xs font-bold tracking-[0.2em] text-[#F59E0B] mb-6 uppercase z-10 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                            {question.category} Chakra
                        </span>

                        <h2 className="text-2xl md:text-3xl font-medium mb-12 text-white z-10 leading-relaxed drop-shadow-2xl">
                            {question.text}
                        </h2>

                        <div className="flex flex-col gap-4 w-full z-10" style={{ transform: "translateZ(50px)" }}>
                            {question.options.map((option, index) => (
                                <motion.button
                                    key={option.id}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)", x: 10, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onAnswer(option.id)}
                                    className="w-full py-4 px-6 rounded-xl border border-white/10 bg-white/5 text-left flex items-center group transition-colors shadow-lg backdrop-blur-md"
                                >
                                    <div className="w-8 h-8 rounded-full bg-background border border-accentLight/30 flex items-center justify-center mr-4 group-hover:border-[#F59E0B] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all">
                                        <span className="text-accentLight text-sm group-hover:text-[#F59E0B] transition-colors">{String.fromCharCode(65 + index)}</span>
                                    </div>
                                    <span className="text-gray-200 group-hover:text-white transition-colors">{option.optionText}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChakraCard;
