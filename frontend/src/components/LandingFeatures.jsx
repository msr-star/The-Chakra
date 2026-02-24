import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Target, LineChart, Award, Quote, CheckCircle, Zap, Star, Sparkles } from 'lucide-react';


const FeatureCard = ({ icon: Icon, title, description, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        className="glass-card hover-card rounded-3xl p-7 flex flex-col gap-4"
    >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
            <Icon size={22} style={{ color }} />
        </div>
        <div>
            <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

const StepCard = ({ number, title, description, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        className="relative flex flex-col items-center text-center"
    >
        {/* Step number circle */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-xl relative z-10"
            style={{
                fontFamily: 'Outfit, sans-serif',
                background: 'linear-gradient(135deg, #2C1408, #1F0E05)',
                color: number === '1' ? '#FF5A00' : number === '2' ? '#FFB347' : '#FF9D00',
                border: '1px solid rgba(255,90,0,0.2)'
            }}>
            {number}
        </div>
        <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{description}</p>
    </motion.div>
);

const TestimonialCard = ({ quote, name, outcome, avatar, accentColor, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        className="glass-card hover-card rounded-3xl p-8 flex flex-col gap-5 relative overflow-hidden"
    >
        {/* Quote icon */}
        <Quote className="absolute top-6 right-6 opacity-5" size={72} style={{ color: accentColor }} />

        {/* Stars */}
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={accentColor} style={{ color: accentColor }} />
            ))}
        </div>

        <p className="text-gray-300 text-base leading-relaxed relative z-10">&ldquo;{quote}&rdquo;</p>

        <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-lg font-bold"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)` }}>
                {avatar}
            </div>
            <div>
                <p className="font-semibold text-white text-sm">{name}</p>
                <p className="text-xs font-medium" style={{ color: accentColor }}>→ {outcome}</p>
            </div>
        </div>
    </motion.div>
);

const LandingFeatures = () => {
    const statsRef = useRef(null);

    const features = [
        {
            icon: Brain,
            title: 'Personality Assessment',
            description: 'Uncover your unique personality traits, cognitive styles, and behavioral preferences with science-backed tests.',
            color: '#FF5A00',
        },
        {
            icon: Target,
            title: 'Precision Matching',
            description: 'Our advanced algorithm cross-references your profile with over 500+ modern career paths to find your perfect fit.',
            color: '#FF5A00',
        },
        {
            icon: LineChart,
            title: 'Skills Evaluation',
            description: 'Identify your technical and soft skill strengths, and see exactly which roles you are primed for.',
            color: '#F5A623',
        },
        {
            icon: Award,
            title: 'Actionable Results',
            description: 'Receive a detailed report with next steps, recommended courses, and career roadmaps tailored to you.',
            color: '#FF6B6B',
        },
        {
            icon: CheckCircle,
            title: 'Track Progress',
            description: 'Monitor your assessment history on your personal dashboard and see how you grow over time.',
            color: '#FF9D00',
        },
        {
            icon: Zap,
            title: 'Instant Insights',
            description: 'Get real-time feedback and career path visualization the moment you complete your assessment.',
            color: '#F5A623',
        },
    ];

    const steps = [
        {
            number: '01',
            title: 'Create Your Account',
            description: 'Register as a student to access all assessments, track your results, and save your career profile.',
        },
        {
            number: '02',
            title: 'Take Assessments',
            description: 'Complete career, personality, and skills evaluations — each one tailored to build your profile.',
        },
        {
            number: '03',
            title: 'Get Recommendations',
            description: 'Receive personalized career paths, resources, and roadmaps based on your unique results.',
        },
    ];

    const testimonials = [
        {
            quote: "The career assessment helped me realize that my analytical mindset was perfect for software engineering. The personality test results were spot on and gave me the confidence to pursue a CS degree.",
            name: 'Sarah Jenkins',
            role: 'Computer Science Student',
            outcome: 'Backend Engineering',
            avatar: 'S',
            accentColor: '#FF5A00',
        },
        {
            quote: "I was unsure which career to pursue after graduation. The skills evaluation showed me I excel in leadership and communication — and led me straight to product management.",
            name: 'Marcus Vance',
            role: 'Business Graduate',
            outcome: 'Product Management',
            avatar: 'M',
            accentColor: '#FFB347',
        },
        {
            quote: "What impressed me most was the accuracy. Within minutes I had a complete picture of my strengths and a clear career roadmap. This platform is genuinely life-changing.",
            name: 'Priya Sharma',
            role: 'Engineering Student',
            outcome: 'Data Science',
            avatar: 'P',
            accentColor: '#F5A623',
        },
        {
            quote: "The detailed breakdown of my personality traits alongside career matches made me realise UX design was my calling. I'm now working at a top agency and loving every day.",
            name: 'Alex Reid',
            role: 'Design Graduate',
            outcome: 'UX / Product Design',
            avatar: 'A',
            accentColor: '#FF6B6B',
        },
    ];

    return (
        <div className="relative z-10 overflow-hidden">
            {/* Subtle divider from hero */}
            <div className="divider-gradient" />

            {/* ── Assessment Type Chips ── */}
            <section className="py-16 relative"
                style={{ background: 'linear-gradient(180deg, #05091A, #080D22)' }}>
                <div className="max-w-6xl mx-auto px-6">
                    <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase text-center mb-8">
                        Comprehensive Assessment Suite
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                        {[
                            { icon: <Brain size={15} />, label: 'Personality Tests' },
                            { icon: <Target size={15} />, label: 'Career Assessments' },
                            { icon: <LineChart size={15} />, label: 'Skills Evaluations' },
                            { icon: <Award size={15} />, label: 'Career Matching' },
                            { icon: <Zap size={15} />, label: 'Instant Results' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card border text-sm font-medium text-gray-300"
                                style={{ borderColor: 'rgba(255,90,0,0.2)' }}
                            >
                                <span style={{ color: '#FF5A00' }}>{item.icon}</span>
                                {item.label}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ── Features Grid ── */}
            <section className="py-24 relative" style={{ background: '#080D22' }}>
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                            className="chip chip-primary inline-flex mb-4">
                            <Sparkles size={11} /> What We Offer
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-white mb-4"
                            style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Everything You Need to
                            <br />
                            <span style={{
                                background: 'linear-gradient(135deg, #FF5A00, #FF9D00)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>Find Your Direction</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-lg max-w-xl mx-auto">
                            A complete toolkit to understand yourself and chart the perfect career path.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <FeatureCard key={i} {...f} delay={i * 0.07} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="py-24 relative overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #080D22, #05091A)' }}>
                {/* Ambient orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse, rgba(255,90,0,0.07) 0%, transparent 70%)',
                        filter: 'blur(50px)',
                    }} />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                            className="chip chip-accent inline-flex mb-4">
                            Simple Process
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-white mb-4"
                            style={{ fontFamily: 'Outfit, sans-serif' }}>
                            How It Works
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                            className="text-gray-400 text-lg">
                            Three steps to discover your ideal career.
                        </motion.p>
                    </div>

                    {/* Steps with connector line */}
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
                        {/* Connector */}
                        <div className="hidden md:block absolute top-[30px] left-[20%] right-[20%] h-px"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,90,0,0.3), rgba(255,157,0,0.3), transparent)' }} />
                        {steps.map((s, i) => <StepCard key={i} {...s} i={i} delay={i * 0.15} />)}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="py-24 relative" style={{ background: '#05091A' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                            className="chip chip-gold inline-flex mb-4">
                            <Star size={11} fill="#F5A623" /> Success Stories
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-white mb-4"
                            style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Students Who Found
                            <br />
                            <span style={{
                                background: 'linear-gradient(135deg, #F5A623, #FF6B6B)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>Their True Path</span>
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {testimonials.map((t, i) => <TestimonialCard key={i} {...t} delay={i * 0.1} />)}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingFeatures;
