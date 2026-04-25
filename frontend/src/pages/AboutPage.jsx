import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, LineChart, Award, Users, BookOpen, Lightbulb, GraduationCap } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const teamMembers = [
    {
        photo: '/Rohit.jpg.jpeg',
        initials: 'MR',
        name: 'MS Rohit',
        role: 'Main Lead & Full-Stack Developer',
        desc: 'Visioned and led the entire platform — designed the system architecture, built the Spring Boot backend, REST APIs, assessment algorithm, and React frontend from the ground up.',
        gradient: 'from-cyan-500 to-blue-600'
    },
    {
        photo: '/Mallesh.jpg.jpeg',
        initials: 'PM',
        name: 'P Mallesh',
        role: 'Team Lead & UI/UX Design Lead',
        desc: 'Crafted the visual identity of the platform — from color systems and typography to component layouts and animations, ensuring an engaging experience for every student.',
        gradient: 'from-purple-500 to-pink-600'
    },
    {
        photo: '/umesh.jpg.jpeg',
        initials: 'DU',
        name: 'D Umesh Chandra',
        role: 'Database Lead',
        desc: 'Designed and optimized the MySQL schema, wrote efficient JPA queries, and ensured data integrity across user accounts, assessment results, and authentication flows.',
        gradient: 'from-emerald-500 to-teal-600'
    },
];

const techStack = [
    { name: 'React 19 + Vite', description: 'Dynamic, component-based frontend with lightning-fast hot reload for a smooth user experience.', icon: '⚛️', color: 'from-[#61DAFB] to-[#00E5FF]' },
    { name: 'Spring Boot 3', description: 'Robust Java backend handling assessment algorithms, REST APIs, and secure user data management.', icon: '🍃', color: 'from-[#6DB33F] to-[#0f766e]' },
    { name: 'MySQL Database', description: 'Reliable relational database storing questions, assessment results, and user accounts securely.', icon: '🐬', color: 'from-[#4479A1] to-[#0d9488]' },
    { name: 'JWT + Spring Security', description: 'Industry-standard JWT authentication with role-based access for students and admins.', icon: '🔐', color: 'from-[#EA4335] to-[#9D4EDD]' },
];

const features = [
    { icon: <Brain size={24} />, title: 'Personality Tests', desc: 'Identify core traits, cognitive styles, and personality dimensions that align with career domains.' },
    { icon: <Target size={24} />, title: 'Career Assessments', desc: 'Multi-dimensional assessments measuring Logic, Creativity, Empathy, Structure, Vision, and Detail.' },
    { icon: <LineChart size={24} />, title: 'Skills Evaluations', desc: 'Quantitative skills scoring with radar charts showing your strengths across all career categories.' },
    { icon: <Award size={24} />, title: 'Career Recommendations', desc: 'Data-driven career path suggestions matched to your dominant personality and skills profile.' },
    { icon: <GraduationCap size={24} />, title: 'Student Focused', desc: 'Designed specifically for students navigating career choices — simple, clear, and actionable.' },
    { icon: <Lightbulb size={24} />, title: 'Actionable Insights', desc: 'Download your personalized PDF report with career paths and next steps to pursue your ideal career.' },
];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
});

const AboutPage = () => {
    return (
        <PageTransition>
        <div className="min-h-screen bg-background text-white overflow-x-hidden">

            {/* ─── HERO ─── */}
            <div className="relative py-40 px-6 flex flex-col items-center text-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.08)_0%,_transparent_60%)] pointer-events-none" />
                <motion.span {...fadeUp(0)} className="mb-6 px-4 py-1.5 rounded-full border border-accentLight/30 bg-accentLight/10 text-accentLight text-xs font-semibold tracking-widest uppercase">
                    About The Chakra
                </motion.span>
                <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-gray-500 tracking-tighter max-w-4xl">
                    Helping Students <br />Find Their True Career
                </motion.h1>
                <motion.p {...fadeUp(0.2)} className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                    The Chakra is a comprehensive career assessment platform built to bridge the gap between a student's personal strengths and the career path that's right for them.
                </motion.p>
            </div>

            {/* ─── WHO WE ARE ─── */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <motion.div {...fadeUp(0)} className="mb-16 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Users size={28} className="text-accentLight" />
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Who We Are</h2>
                    </div>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        We are a passionate team of students, developers, and career advisors united by one goal: helping students make confident, informed career decisions.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            key={i}
                            {...fadeUp(0.1 + i * 0.1)}
                            whileHover={{ y: -6 }}
                            className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center group"
                        >
                            <div className={`w-24 h-2 p-1 bg-gradient-to-br ${member.gradient} mb-5 rounded-full`} />
                            <h3 className="text-xl font-bold text-white mb-3">{member.name}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{member.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── OUR STORY ─── */}
            <section className="py-24 px-6 md:px-12 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeUp(0)}>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Our Story
                        </h2>
                        <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                            <p>
                                The Chakra began as an academic project — <span className="text-white font-medium">FSAD-PS30</span> — aimed at solving a real problem: students graduating without a clear sense of direction in their career.
                            </p>
                            <p>
                                We noticed that most career guidance tools were either too generic or buried in outdated frameworks. So we built something better: a platform that uses <span className="text-accentLight font-medium">personality science and skills evaluation</span> to provide genuinely personalized career recommendations.
                            </p>
                            <p>
                                Today, The Chakra offers assessments across six core dimensions — Logic, Creativity, Empathy, Structure, Vision, and Detail — mapping each student to the career paths where they're most likely to thrive.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-5">
                        {[
                            { icon: '🎯', title: 'Our Mission', desc: 'Help every student discover the career that matches their unique strengths and personality.' },
                            { icon: '📊', title: 'Science-Backed', desc: 'Assessments grounded in established personality psychology and skills analysis frameworks.' },
                            { icon: '🚀', title: 'Future-Ready', desc: 'Career recommendations mapped to current industry demands and emerging job opportunities.' },
                            { icon: '🤝', title: 'Student-First', desc: 'Designed for students, not HR teams. Simple, relevant, and actionable guidance.' },
                        ].map((item, i) => (
                            <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5">
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── WHAT WE OFFER ─── */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <motion.div {...fadeUp(0)} className="mb-16 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <BookOpen size={28} className="text-accentWarm" />
                        <h2 className="text-4xl md:text-5xl font-bold text-white">What We Offer</h2>
                    </div>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A complete suite of career assessment tools, all in one place.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            {...fadeUp(0.05 * i)}
                            whileHover={{ scale: 1.02, borderColor: 'rgba(34,211,238,0.4)' }}
                            className="glass-panel p-8 rounded-3xl border border-white/5 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-xl bg-accentLight/10 flex items-center justify-center text-accentLight mb-5">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── TECHNOLOGY STACK ─── */}
            <section className="py-24 px-6 md:px-12 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp(0)} className="mb-16 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Technology Stack</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Built with modern, production-grade technologies for reliability and performance.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {techStack.map((tech, idx) => (
                            <motion.div
                                key={idx}
                                {...fadeUp(0.1 * idx)}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="glass-panel group relative overflow-hidden rounded-3xl p-7 h-full flex flex-col"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                <div className="text-4xl mb-6 relative z-10">{tech.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{tech.name}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed relative z-10 flex-grow">{tech.description}</p>
                                <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${tech.color} blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── PLATFORM STATUS ─── */}
            <section className="py-16 px-6">
                <motion.div {...fadeUp(0)} className="max-w-xl mx-auto glass-panel p-8 rounded-3xl text-center border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 tracking-widest uppercase">Platform Status</h3>
                    <div className="flex items-center justify-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <p className="text-sm text-gray-400">All systems operational. Backend services active.</p>
                    </div>
                </motion.div>
            </section>

        </div>
        </PageTransition>
    );
};

export default AboutPage;
