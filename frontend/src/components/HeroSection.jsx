import React from 'react';
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import ChakraParticles from './ChakraParticles';

const HeroSection = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
    const y2 = useTransform(scrollY, [0, 1000], [0, 200]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
            {/* 3D Canvas Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <color attach="background" args={['#020617']} />
                    <ambientLight intensity={0.5} />
                    <ChakraParticles count={3000} />
                    <Environment preset="city" />
                </Canvas>
            </div>

            {/* Content overlay */}
            <div className="z-10 text-center flex flex-col items-center pointer-events-none mt-20">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-6 px-4 py-2 rounded-full border border-accentLight/30 bg-accentLight/10 text-accentLight text-sm font-semibold tracking-widest uppercase"
                >
                    Career Assessment Platform
                </motion.div>

                <motion.h1
                    style={{ y: y1 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-gray-600 tracking-tighter"
                >
                    Discover Your <br /> True Career Path
                </motion.h1>

                <motion.p
                    style={{ y: y2 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 font-light leading-relaxed px-4"
                >
                    Take career assessments, personality tests, and skills evaluations designed to help you understand your strengths and find the perfect career path.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, type: 'spring' }}
                    className="pointer-events-auto flex gap-4 flex-wrap justify-center"
                >
                    <Link to="/register" className="relative group px-10 py-5 bg-accentLight text-background font-bold rounded-full overflow-hidden inline-block transition-all hover:bg-cyan-300 shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]">
                        <span className="relative z-10 text-lg tracking-wide">Get Started Free</span>
                    </Link>
                    <Link to="/assessment" className="relative group px-10 py-5 bg-white/5 backdrop-blur-md text-white font-semibold rounded-full overflow-hidden inline-block transition-all border border-white/10 hover:border-white/30 hover:bg-white/10 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_-15px_rgba(34,211,238,0.3)]">
                        <span className="relative z-10 text-lg tracking-wide">Start Assessment</span>
                    </Link>
                </motion.div>
            </div>

            {/* Vignette overlay to blend edges */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] z-0 mix-blend-multiply opacity-80" />
        </div>
    );
};

export default HeroSection;
