import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, LayoutDashboard, ShieldCheck } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import BentoGrid from '../components/BentoGrid';
import LandingFeatures from '../components/LandingFeatures';
import PageTransition from '../components/PageTransition';

/* CTA Section at the bottom of the landing page */
const CTASection = () => {
    const token = localStorage.getItem('token');
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
    const isLoggedIn = !!token && !!user;
    const isAdmin = isLoggedIn && user?.role === 'ADMIN';

    return (
        <section className="py-28 relative overflow-hidden" style={{ background: '#120803' }}>
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,90,0,0.15) 0%, transparent 70%)',
                }} />
            <div className="divider-gradient absolute top-0 left-0 right-0" />

            <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="chip chip-primary inline-flex mb-6">
                    <Sparkles size={11} /> {isLoggedIn ? 'Welcome Back!' : "Start Today — It's Free"}
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
                    style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {isLoggedIn ? 'Continue Your' : 'Ready to Discover'}<br />
                    <span style={{
                        background: 'linear-gradient(135deg, #FF5A00 0%, #FF9D00 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                        {isLoggedIn ? 'Career Journey' : 'Your True Calling?'}
                    </span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                    {isLoggedIn
                        ? 'Head to your dashboard to view results, track progress, and explore career resources.'
                        : 'Join thousands of students who have transformed uncertainty into direction with The Chakra.'}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-4">
                    {isLoggedIn ? (
                        <Link to={isAdmin ? '/admin' : '/student'} className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                            {isAdmin ? <><ShieldCheck size={16} /> Admin Panel</> : <><LayoutDashboard size={16} /> Go to Dashboard</>}
                            <ArrowRight size={16} />
                        </Link>
                    ) : (
                        <Link to="/register" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                            Get Started Free <ArrowRight size={16} />
                        </Link>
                    )}
                    <Link to="/assessment" className="btn-secondary text-base px-8 py-4">
                        Take Assessment Now
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

const LandingPage = () => (
    <PageTransition>
    <div style={{ background: '#120803', minHeight: '100vh' }}>
        <HeroSection />
        <LandingFeatures />
        <BentoGrid />
        <CTASection />
    </div>
    </PageTransition>
);

export default LandingPage;
