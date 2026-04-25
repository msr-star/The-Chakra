import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const RootVerifyPage = () => {
    const [searchParams] = useSearchParams();
    const candidateEmail = searchParams.get('email');
    const navigate = useNavigate();

    const [rootSecret, setRootSecret] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        if (!candidateEmail) {
            // Set both states in a single microtask to avoid cascading renders
            Promise.resolve().then(() => {
                setErrorMessage("Invalid link parameters. Missing candidate email.");
                setStatus('error');
            });
        }
    }, [candidateEmail]);

    const handleAuthorize = async (e) => {
        e.preventDefault();
        if (!rootSecret) return;

        setStatus('loading');
        try {
            await authAPI.generateAdminOtp({ rootSecret, candidateEmail });
            setStatus('success');
        } catch (err) {
            setStatus('error');
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to authorize. Invalid Root Secret Token.";
            setErrorMessage("Authorization Denied: " + msg);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <PageTransition>
        <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center relative overflow-hidden bg-black">
            {/* High Security Aesthetic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-red-900)_0%,_black_70%)] opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-lg glass-panel border border-red-500/30 p-8 md:p-10 rounded-2xl z-10 relative shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden"
            >
                {/* Decorative scanning line */}
                <motion.div
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent z-0 pointer-events-none"
                />

                <div className="relative z-10 text-center mb-8">
                    <motion.div variants={itemVariants} className="flex justify-center mb-4">
                        {status === 'success' ? (
                            <ShieldCheck className="w-16 h-16 text-green-500" />
                        ) : (
                            <ShieldAlert className="w-16 h-16 text-red-500" />
                        )}
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-3xl font-black mb-2 text-white uppercase tracking-widest">
                        Root Command
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-red-400 font-mono text-sm tracking-wide">
                        RESTRICTED AUTHORIZATION OVERRIDE
                    </motion.p>
                </div>

                {status === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="p-6 bg-green-900/20 border border-green-500/30 rounded-xl">
                            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-green-400 mb-2">Authorization Granted</h3>
                            <p className="text-gray-300 text-sm">
                                A highly encrypted 6-digit OTP has been generated, saved to the grid, and dispatched to <span className="font-mono text-white">{candidateEmail}</span>.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-4 bg-transparent border border-gray-600 text-gray-300 font-bold rounded-xl hover:bg-gray-800 transition-all duration-300"
                        >
                            Return to Safe Zone
                        </button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleAuthorize} className="space-y-6 relative z-10">
                        {errorMessage && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm text-center font-mono">
                                {errorMessage}
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="p-4 bg-black/60 border border-gray-800 rounded-xl">
                            <label className="block text-xs text-gray-500 mb-1 font-mono uppercase">Target Candidate</label>
                            <div className="text-gray-200 font-mono truncate">{candidateEmail || 'UNKNOWN_ENTITY'}</div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm text-red-400 mb-2 font-mono uppercase">Master Security Token</label>
                            <input
                                type="password"
                                required
                                disabled={status === 'loading'}
                                className="w-full bg-black/80 border border-red-500/50 rounded-xl p-4 text-white font-mono tracking-widest text-center focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 placeholder:text-gray-700 disabled:opacity-50"
                                value={rootSecret}
                                onChange={e => setRootSecret(e.target.value)}
                                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            />
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={status !== 'loading' ? { scale: 1.02, boxShadow: "0 0 20px rgba(239,68,68,0.6)" } : {}}
                            whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-500 transition-all duration-300 mt-4 disabled:opacity-50 flex justify-center items-center"
                        >
                            {status === 'loading' ? (
                                <span className="animate-pulse">Authorizing...</span>
                            ) : (
                                "Authorize & Send"
                            )}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </div>
        </PageTransition>
    );
};

export default RootVerifyPage;
