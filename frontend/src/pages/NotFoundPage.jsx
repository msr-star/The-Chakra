import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Zap } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const NotFoundPage = () => (
    <PageTransition>
        <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
            style={{ background: '#120803' }}>
            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,90,0,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

            <div className="text-center max-w-lg relative z-10">
                {/* 404 Number */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-6"
                >
                    <span className="text-[10rem] md:text-[14rem] font-black leading-none select-none"
                        style={{
                            fontFamily: 'Outfit, sans-serif',
                            background: 'linear-gradient(180deg, rgba(255,90,0,0.3) 0%, rgba(255,90,0,0.03) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                        404
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="text-3xl md:text-4xl font-black text-white mb-4"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                    Page Not Found
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 text-base mb-10 leading-relaxed"
                >
                    The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
                    Let&rsquo;s get you back on track.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <Link to="/" className="btn-primary text-sm px-7 py-3 flex items-center gap-2">
                        <Home size={15} /> Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn-secondary text-sm px-7 py-3 flex items-center gap-2"
                    >
                        <ArrowLeft size={15} /> Go Back
                    </button>
                </motion.div>
            </div>
        </div>
    </PageTransition>
);

export default NotFoundPage;
