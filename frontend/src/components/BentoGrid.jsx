import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BentoCard = ({ title, description, size, icon, color, layoutId }) => {
    const navigate = useNavigate();

    // Map size to CSS grid spans
    const sizeClasses = {
        '1x1': 'col-span-1 row-span-1',
        '2x1': 'col-span-1 md:col-span-2 row-span-1',
        '1x2': 'col-span-1 md:col-span-1 row-span-1 md:row-span-2',
        '2x2': 'col-span-1 md:col-span-2 row-span-1 md:row-span-2',
    };

    return (
        <motion.div
            layoutId={layoutId}
            onClick={() => navigate('/assessment', { state: { layoutId, title, description, color } })}
            whileHover={{ scale: 0.98, transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 } }}
            whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 } }}
            className={`relative overflow-hidden rounded-3xl cursor-pointer shadow-lg group ${sizeClasses[size] || 'col-span-1 row-span-1'}`}
        >
            {/* High-Gloss finish background */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[20px] transition-colors duration-500 group-hover:bg-white/10 z-0" />

            {/* 1px white border at 10% opacity */}
            <div className="absolute inset-0 border border-white/10 rounded-3xl z-10 pointer-events-none" />

            {/* Noise texture */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

            {/* Glowing orb in corner */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-60 bg-${color}-500`} />

            {/* Content */}
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                {icon && <div className="mb-4 text-4xl">{icon}</div>}
                <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed mb-3">{description}</p>
                <span className="text-xs text-accentLight font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Assessment →
                </span>
            </div>
        </motion.div>
    );
};

const BentoGrid = () => {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Explore Career Areas</h2>
                <p className="text-xl text-gray-400">Select a career area to begin your personalized assessment and discover your ideal path.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
                <BentoCard
                    title="Engineering & Tech"
                    description="Assess your aptitude for coding, systems thinking, and technical problem-solving."
                    size="2x2"
                    icon="💻"
                    color="cyan"
                    layoutId="career-engineering"
                />
                <BentoCard
                    title="Design & UX"
                    description="Discover if your creativity and empathy align with design and user experience careers."
                    size="2x1"
                    icon="✨"
                    color="purple"
                    layoutId="career-design"
                />
                <BentoCard
                    title="Data Science"
                    description="Evaluate your analytical skills and interest in data-driven decision making."
                    size="1x2"
                    icon="📊"
                    color="blue"
                    layoutId="career-data"
                />
                <BentoCard
                    title="Product Management"
                    description="Test your strategic thinking and leadership potential for product roles."
                    size="1x1"
                    icon="🎯"
                    color="orange"
                    layoutId="career-product"
                />
                <BentoCard
                    title="Cybersecurity"
                    description="Explore if your detail-oriented and structured thinking suits security careers."
                    size="1x1"
                    icon="🛡️"
                    color="green"
                    layoutId="career-security"
                />
            </div>
        </section>
    );
};

export default BentoGrid;
