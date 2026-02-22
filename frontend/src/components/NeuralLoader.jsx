import React from 'react';
import { motion } from 'framer-motion';

const NeuralLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <motion.svg
                width="150"
                height="150"
                viewBox="0 0 200 200"
                className="mb-8"
            >
                {/* Background Grid */}
                <circle cx="100" cy="100" r="80" fill="transparent" stroke="#1e293b" strokeWidth="2" strokeDasharray="5 5" />
                <circle cx="100" cy="100" r="40" fill="transparent" stroke="#1e293b" strokeWidth="2" strokeDasharray="5 5" />

                {/* Neural Paths */}
                <motion.path
                    d="M 20 100 Q 60 20 100 100 T 180 100"
                    fill="transparent"
                    stroke="#22d3ee"
                    strokeWidth="3"
                    initial={{ pathLength: 0, opacity: 0.5 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                        pathLength: { duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
                        opacity: { duration: 1, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
                    }}
                />
                <motion.path
                    d="M 100 20 Q 180 60 100 100 T 100 180"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    initial={{ pathLength: 0, opacity: 0.5 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                        pathLength: { duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
                        opacity: { duration: 1.25, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
                    }}
                />

                {/* Central Node */}
                <motion.circle
                    cx="100"
                    cy="100"
                    r="8"
                    fill="#fff"
                    animate={{ scale: [1, 1.5, 1], filter: ["blur(0px)", "blur(4px)", "blur(0px)"] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Peripheral Nodes */}
                <motion.circle cx="20" cy="100" r="4" fill="#22d3ee" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                <motion.circle cx="180" cy="100" r="4" fill="#22d3ee" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
                <motion.circle cx="100" cy="20" r="4" fill="#f59e0b" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
                <motion.circle cx="100" cy="180" r="4" fill="#f59e0b" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.25 }} />
            </motion.svg>

            <motion.div
                className="text-accentLight font-bold tracking-widest uppercase text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                Calculating Neural Resonance...
            </motion.div>
        </div>
    );
};

export default NeuralLoader;
