import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Award, Target, Code } from 'lucide-react';

const FloatingCard = ({ style, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.7, ease: 'easeOut' }}
        className="glass-card rounded-2xl px-4 py-3 pointer-events-none select-none absolute"
        style={{ ...style, animation: `floatSlow ${6 + delay}s ease-in-out infinite` }}
    >
        {children}
    </motion.div>
);

const HeroSection = () => {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 600], [0, 180]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);



    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden" style={{ background: '#120803' }}>

            {/* Mesh & Orbs Area */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-30 animate-pulse-slow"
                    style={{ background: 'radial-gradient(circle, rgba(255,90,0,0.4) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full opacity-20 animate-pulse-slow"
                    style={{ background: 'radial-gradient(circle, rgba(255,157,0,0.3) 0%, transparent 70%)', filter: 'blur(80px)' }} />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,157,0,0.03) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,157,0,0.03) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }} />

            {/* ── Floating cards ── */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block">
                <FloatingCard delay={0.8} style={{ top: '22%', left: '4%' }}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                            style={{ background: 'rgba(255,90,0,0.2)' }}>🚀</div>
                        <div>
                            <p className="text-xs text-gray-400">Top Match</p>
                            <p className="text-sm font-semibold text-white">Software Engineer</p>
                        </div>
                    </div>
                </FloatingCard>

                <FloatingCard delay={1.0} style={{ top: '18%', right: '5%' }}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                            style={{ background: 'rgba(255,157,0,0.2)' }}>📊</div>
                        <div>
                            <p className="text-xs text-gray-400">Assessment Score</p>
                            <p className="text-sm font-semibold text-white">94% Match</p>
                        </div>
                    </div>
                </FloatingCard>

                <FloatingCard delay={1.2} style={{ bottom: '25%', left: '5%' }}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                            style={{ background: 'rgba(255,90,0,0.2)' }}>🏆</div>
                        <div>
                            <p className="text-xs text-gray-400">Career Path</p>
                            <p className="text-sm font-semibold text-white">Data Science</p>
                        </div>
                    </div>
                </FloatingCard>

                <FloatingCard delay={1.4} style={{ bottom: '28%', right: '4%' }}>
                    <div className="flex items-center gap-2.5">
                        <span className="text-green-400 font-bold text-lg">✓</span>
                        <p className="text-sm font-semibold text-white">Assessment Complete!</p>
                    </div>
                </FloatingCard>

                <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[20%] right-[10%] hidden lg:flex items-center gap-3 p-4 rounded-2xl border"
                    style={{ background: 'rgba(31,14,5,0.6)', borderColor: 'rgba(255,157,0,0.2)', backdropFilter: 'blur(12px)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF9D00, #FF5A00)' }}>
                        <Code size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">New Skill</p>
                        <p className="text-sm font-semibold text-white">Python Programming</p>
                    </div>
                </motion.div>
            </div>

            {/* ── Main Content ── */}
            <motion.div
                style={{ y: heroY, opacity: heroOpacity }}
                className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="inline-flex items-center gap-2 chip chip-primary mb-8"
                >
                    <Sparkles size={12} />
                    AI-Powered Career Assessment Platform
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                    <span className="text-white">Discover Your</span>
                    <br />
                    <span style={{
                        background: 'linear-gradient(135deg, #FF9D00, #FF5A00)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        animation: 'gradient-shift 4s ease infinite',
                    }}>
                        True Career Path
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.45 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
                >
                    Take personality tests, career assessments, and skills evaluations
                    designed to match you with your perfect career.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.65 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-14"
                >
                    <Link to="/register" className="btn-primary text-base px-7 py-3.5 flex items-center gap-2">
                        Start For Free
                        <ArrowRight size={16} />
                    </Link>
                    <Link to="/assessment" className="btn-secondary text-base px-7 py-3.5">
                        Take Assessment
                    </Link>
                </motion.div>


            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            >
                <span className="text-xs text-gray-600 tracking-widest uppercase">Scroll</span>
                <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1 h-2 rounded-full"
                        style={{ background: 'linear-gradient(180deg, #7C3AFF, #00D4C8)' }}
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
