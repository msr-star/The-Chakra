import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Flame } from 'lucide-react';

const careers = [
    {
        id: 'engineering',
        title: 'Engineering & Tech',
        description: 'Assess your aptitude for coding, systems thinking, and technical problem-solving.',
        emoji: '💻',
        gradient: 'linear-gradient(135deg, rgba(255,90,0,0.25) 0%, rgba(31,14,5,0.95) 100%)',
        border: 'rgba(255,90,0,0.3)',
        glow: 'rgba(255,90,0,0.25)',
        accent: '#FF8533',
        size: 'large',
        badge: 'Most Popular',
        tags: ['Software Dev', 'Data Eng', 'DevOps'],
    },
    {
        id: 'design',
        title: 'Design & UX',
        description: 'Discover if your creativity aligns with world-class design careers.',
        emoji: '✨',
        gradient: 'linear-gradient(135deg, rgba(255,107,107,0.2) 0%, rgba(31,14,5,0.95) 100%)',
        border: 'rgba(255,107,107,0.25)',
        glow: 'rgba(255,107,107,0.2)',
        accent: '#FF8A8A',
        size: 'medium',
        tags: ['UI Design', 'UX Research'],
    },
    {
        id: 'data',
        title: 'Data Science',
        description: 'Evaluate your analytical skills for data-driven careers.',
        emoji: '📊',
        gradient: 'linear-gradient(135deg, rgba(245,166,35,0.2) 0%, rgba(31,14,5,0.95) 100%)',
        border: 'rgba(245,166,35,0.25)',
        glow: 'rgba(245,166,35,0.2)',
        accent: '#F5A623',
        size: 'tall',
        tags: ['ML Engineer', 'Data Analyst'],
    },
    {
        id: 'product',
        title: 'Product Management',
        description: 'Test your strategic thinking for product roles.',
        emoji: '🎯',
        gradient: 'linear-gradient(135deg, rgba(255,157,0,0.2) 0%, rgba(31,14,5,0.95) 100%)',
        border: 'rgba(255,157,0,0.25)',
        glow: 'rgba(255,157,0,0.2)',
        accent: '#FF9D00',
        size: 'small',
        tags: ['PM', 'Product Strategy'],
    },
    {
        id: 'security',
        title: 'Cybersecurity',
        description: 'Explore if structured thinking fits security careers.',
        emoji: '🛡️',
        gradient: 'linear-gradient(135deg, rgba(52,211,153,0.2) 0%, rgba(31,14,5,0.95) 100%)',
        border: 'rgba(52,211,153,0.25)',
        glow: 'rgba(52,211,153,0.2)',
        accent: '#34D399',
        size: 'small',
        tags: ['Ethical Hacking', 'InfoSec'],
    },
];

const BentoCard = ({ career, className, delay = 0 }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            onClick={() => navigate('/assessment', { state: { layoutId: `career-${career.id}`, title: career.title, description: career.description } })}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            whileHover={{ scale: 0.985, transition: { type: 'spring', stiffness: 250, damping: 25 } }}
            whileTap={{ scale: 0.97 }}
            className={`relative overflow-hidden rounded-3xl cursor-pointer group ${className}`}
            style={{
                background: career.gradient,
                border: `1px solid ${career.border}`,
                boxShadow: `0 4px 30px ${career.glow}`,
            }}
        >
            {/* Glow orb */}
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${career.glow} 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                }} />

            {/* Badge */}
            {career.badge && (
                <div className="absolute top-4 right-4 flex items-center gap-1 chip chip-gold text-[10px] font-bold">
                    <Flame size={9} fill="#F5A623" /> {career.badge}
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-7 h-full flex flex-col justify-between">
                <div>
                    {/* Emoji icon */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                        style={{ background: `${career.glow}`, border: `1px solid ${career.border}` }}>
                        {career.emoji}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {career.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{career.description}</p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {career.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                                style={{
                                    background: `${career.glow}`,
                                    border: `1px solid ${career.border}`,
                                    color: career.accent,
                                }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* CTA Row */}
                <div className="flex items-center justify-between mt-5 pt-4"
                    style={{ borderTop: `1px solid ${career.border}` }}>
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: career.accent }}>
                        Start Assessment
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background: `${career.glow}`, border: `1px solid ${career.border}` }}>
                        <ArrowUpRight size={14} style={{ color: career.accent }} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const BentoGrid = () => {
    return (
        <section className="py-24 relative" style={{ background: 'linear-gradient(180deg, #120803, #1F0E05)' }}>
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                            className="chip chip-primary inline-flex mb-4">
                            Explore Careers
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-white"
                            style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Find Your
                            <span style={{
                                background: 'linear-gradient(135deg, #FF5A00, #FF9D00)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}> Career Area</span>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-gray-400 text-base max-w-sm md:text-right">
                        Select a career area to begin your personalized assessment.
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5" style={{ gridAutoRows: '220px' }}>
                    {/* Large card - Engineering */}
                    <BentoCard
                        career={careers[0]}
                        className="md:col-span-2 md:row-span-2"
                        delay={0.05}
                    />
                    {/* Design */}
                    <BentoCard
                        career={careers[1]}
                        className="md:col-span-2"
                        delay={0.1}
                    />
                    {/* Product */}
                    <BentoCard
                        career={careers[3]}
                        className="md:col-span-1"
                        delay={0.15}
                    />
                    {/* Security */}
                    <BentoCard
                        career={careers[4]}
                        className="md:col-span-1"
                        delay={0.2}
                    />
                    {/* Data - tall */}
                    <BentoCard
                        career={careers[2]}
                        className="md:col-span-2 md:row-span-2 -mt-[calc(220px+1.25rem)] hidden md:block"
                        delay={0.12}
                    />
                </div>

                {/* Mobile: show data card normally too */}
                <div className="mt-5 md:hidden">
                    <BentoCard career={careers[2]} className="" delay={0.1} />
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
