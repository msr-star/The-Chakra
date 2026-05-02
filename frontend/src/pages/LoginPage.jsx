import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, Zap, ArrowLeft, Loader2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';

/* Left branding panel */
const BrandPanel = () => (
    <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
            background: 'linear-gradient(135deg, #2C1408 0%, #1F0E05 50%, #120803 100%)',
            borderRight: '1px solid rgba(255,90,0,0.15)',
        }}>
        {/* Background orbs */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,90,0,0.25) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,157,0,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `linear-gradient(rgba(255,90,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,90,0,0.04) 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
            }} />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF5A00, #FF9D00)' }}>
                <Zap size={17} fill="white" className="text-white" />
            </div>
            <span className="text-xl font-bold"
                style={{
                    fontFamily: 'Outfit, sans-serif',
                    background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.65))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                The Chakra
            </span>
        </Link>

        {/* Main copy */}
        <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-black text-white leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}>
                Welcome back.<br />
                <span style={{
                    background: 'linear-gradient(135deg, #FF5A00, #FF9D00)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Your path awaits.</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-xs">
                Log in to access your career assessments, results, and personalized guidance.
            </p>

            {/* Feature bullets */}
            <div className="space-y-3 pt-2">
                {[
                    'View your assessment results',
                    'Track career progress',
                    'Access personalized resources',
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(255,90,0,0.2)', border: '1px solid rgba(255,90,0,0.3)' }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF5A00' }} />
                        </div>
                        <span className="text-sm text-gray-400">{item}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Bottom social proof */}
        <div className="relative z-10">
            <div className="glass-card rounded-2xl p-4 max-w-xs" style={{ borderColor: 'rgba(255,90,0,0.2)' }}>
                <div className="flex -space-x-2 mb-3">
                    {['#FF5A00', '#FF9D00', '#F5A623', '#FF8A8A'].map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: c, borderColor: '#2C1408', zIndex: 10 - i }}>
                            {['A', 'J', 'M', 'S'][i]}
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-400">
                    Join other students who discovered their career path.
                </p>
            </div>
        </div>
    </div>
);

const LoginPage = () => {
    const [view, setView] = useState('LOGIN');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const clearMsgs = () => { setError(''); setMessage(''); };

    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const u = JSON.parse(userStr);
                navigate(u?.role === 'ADMIN' ? '/admin' : '/student', { replace: true });
            } catch { /* ignore */ }
        }
    }, [navigate]);

    const handleStandardLogin = async (e) => {
        e.preventDefault(); clearMsgs(); setLoading(true);
        try {
            const res = await authAPI.login({ identifier: email, password });
            completeLogin(res.data);
        } catch { setError('Invalid email/phone or password. Please try again.'); }
        finally { setLoading(false); }
    };

    const completeLogin = (data) => {
        localStorage.setItem('token', data.token);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(data.user.role === 'ADMIN' ? '/admin' : '/student');
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault(); clearMsgs(); setLoading(true);
        try {
            await authAPI.forgotPassword({ email });
            setView('RESET_PWD');
            setMessage('Password reset code sent to your email.');
        } catch { setError('Could not send reset code. Please verify your email.'); }
        finally { setLoading(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault(); clearMsgs(); setLoading(true);
        try {
            await authAPI.resetPassword({ email, otp, newPassword });
            setView('LOGIN'); setOtp(''); setNewPassword(''); setPassword('');
            setMessage('Password reset successfully. You can now log in.');
        } catch { setError('Invalid or expired reset code.'); }
        finally { setLoading(false); }
    };

    const viewMeta = {
        LOGIN: { title: 'Sign in', subtitle: 'Access your career assessment dashboard' },
        FORGOT_PWD: { title: 'Reset Password', subtitle: 'Enter your email to receive a reset code' },
        RESET_PWD: { title: 'New Password', subtitle: 'Enter your reset code and new password' },
    };

    return (
        <PageTransition>
            <div className="min-h-screen flex pt-28"
                style={{ background: '#120803' }}>

                {/* Left brand panel (takes 45% on desktop) */}
                <div className="lg:w-[45%] lg:min-h-screen">
                    <BrandPanel />
                </div>

                {/* Right form panel */}
                <div className="flex-1 flex items-center justify-center px-6 py-20 relative overflow-hidden">
                    {/* Ambient glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(255,90,0,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-md relative z-10"
                    >
                        {/* Mobile logo */}
                        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #FF5A00, #FF9D00)' }}>
                                <Zap size={15} fill="white" className="text-white" />
                            </div>
                            <span className="font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>The Chakra</span>
                        </Link>

                        {/* Heading */}
                        <AnimatePresence mode="wait">
                            <motion.div key={view}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }} className="mb-8">
                                <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    {viewMeta[view].title}
                                </h1>
                                <p className="text-gray-400 text-sm">{viewMeta[view].subtitle}</p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="mb-5 px-4 py-3 rounded-xl text-sm text-red-300 font-medium"
                                    style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)' }}>
                                    {error}
                                </motion.div>
                            )}
                            {message && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="mb-5 px-4 py-3 rounded-xl text-sm text-emerald-300 font-medium"
                                    style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Forms */}
                        <AnimatePresence mode="wait">
                            {view === 'LOGIN' && (
                                <motion.form key="login"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }} onSubmit={handleStandardLogin} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email or Phone</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input type="text" required className="input-field pl-11"
                                                value={email} onChange={e => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input type={showPwd ? 'text' : 'password'} required
                                                className="input-field pl-11 pr-12"
                                                value={password} onChange={e => setPassword(e.target.value)} />
                                            <button type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                                onClick={() => setShowPwd(!showPwd)}>
                                                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="button" onClick={() => { setView('FORGOT_PWD'); clearMsgs(); }}
                                            className="text-xs font-semibold transition-colors"
                                            style={{ color: '#FF5A00' }}>
                                            Forgot password?
                                        </button>
                                    </div>
                                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                                        {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
                                    </button>
                                </motion.form>
                            )}



                            {view === 'FORGOT_PWD' && (
                                <motion.form key="forgot_pwd"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }} onSubmit={handleForgotPassword} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input type="email" required className="input-field pl-11"
                                                placeholder="you@example.com"
                                                value={email} onChange={e => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                                        {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <>Send Reset Code <ArrowRight size={16} /></>}
                                    </button>
                                    <button type="button" onClick={() => { setView('LOGIN'); clearMsgs(); }}
                                        className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                                        <ArrowLeft size={14} /> Back to Login
                                    </button>
                                </motion.form>
                            )}

                            {view === 'RESET_PWD' && (
                                <motion.form key="reset_pwd"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }} onSubmit={handleResetPassword} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">6-Digit Reset Code</label>
                                        <input type="text" required maxLength={6}
                                            className="input-field text-center tracking-[0.5em] text-xl font-bold"
                                            placeholder="000000" value={otp} onChange={e => setOtp(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input type="password" required className="input-field pl-11"
                                                placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                                        {loading ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : <>Reset Password <ArrowRight size={16} /></>}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Footer link */}
                        <p className="mt-8 text-center text-sm text-gray-500">
                            Don&rsquo;t have an account?{' '}
                            <Link to="/register" className="font-semibold transition-colors hover:opacity-80"
                                style={{ color: '#FF5A00' }}>
                                Create one free
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default LoginPage;
