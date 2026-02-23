import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff, Zap, ShieldAlert, CheckCircle } from 'lucide-react';

/* Left branding panel (different from login) */
const BrandPanel = () => (
    <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
            background: 'linear-gradient(135deg, #2C1408 0%, #1F0E05 50%, #120803 100%)',
            borderRight: '1px solid rgba(255,157,0,0.12)',
        }}>
        {/* Orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,157,0,0.2) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,90,0,0.2) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `linear-gradient(rgba(255,157,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,157,0,0.03) 1px, transparent 1px)`,
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
            <h2 className="text-4xl font-black text-white leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Join other<br />
                <span style={{
                    background: 'linear-gradient(135deg, #FF9D00, #FF5A00)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                    students thriving.
                </span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-xs">
                Create your free account and start discovering the career you were born for — in minutes.
            </p>

            {/* Perks */}
            <div className="space-y-3 pt-2">
                {[
                    { label: 'Free for all students', color: '#FF9D00' },
                    { label: 'Personality + skills assessments', color: '#FF5A00' },
                    { label: 'Personalized career roadmap', color: '#F5A623' },
                    { label: 'Save & track your results', color: '#FF8A8A' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <CheckCircle size={16} style={{ color: item.color, flexShrink: 0 }} />
                        <span className="text-sm text-gray-400">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Career path visual */}
        <div className="relative z-10 glass-card rounded-2xl p-5" style={{ borderColor: 'rgba(255,157,0,0.2)' }}>
            <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-semibold">Popular career matches</p>
            <div className="space-y-2.5">
                {[
                    { label: 'Software Engineering', pct: 94, color: '#FF5A00' },
                    { label: 'Data Science', pct: 87, color: '#FF9D00' },
                    { label: 'Product Management', pct: 78, color: '#F5A623' },
                ].map(item => (
                    <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">{item.label}</span>
                            <span className="font-semibold" style={{ color: item.color }}>{item.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [showAdminField, setShowAdminField] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await authAPI.register({ name, email, phoneNumber, password, adminCode });
            localStorage.setItem('token', res.data.token);
            if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/student');
        } catch {
            setError('Registration failed. Email or phone may already be in use, or the Admin Code is invalid.');
            setMessage('');
        }
    };

    const requestAdminAccess = async () => {
        if (!name || !email) { setError('Please provide Name and Email before requesting Admin access.'); return; }
        try {
            await authAPI.requestAdminAccess({ name, email });
            setMessage('Admin access request sent. Check your email for the code.');
            setError(''); setShowAdminField(true);
        } catch (err) {
            setError('Error: ' + (err.response?.data?.message || 'Failed to request admin access.'));
            setMessage('');
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: '#120803' }}>

            {/* Left brand panel */}
            <div className="lg:w-[45%] lg:min-h-screen">
                <BrandPanel />
            </div>

            {/* Right form */}
            <div className="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,157,0,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
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

                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Create your account
                        </h1>
                        <p className="text-gray-400 text-sm">Free forever. Start your career journey today.</p>
                    </div>

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

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="text" required className="input-field pl-11" placeholder="John Doe"
                                    value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="email" required className="input-field pl-11" placeholder="you@example.com"
                                    value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number <span className="text-gray-600">(optional)</span></label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="tel" className="input-field pl-11" placeholder="+91 98765 43210"
                                    value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type={showPwd ? 'text' : 'password'} required
                                    className="input-field pl-11 pr-12" placeholder="Min. 8 characters"
                                    value={password} onChange={e => setPassword(e.target.value)} />
                                <button type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    onClick={() => setShowPwd(!showPwd)}>
                                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Admin access toggle */}
                        <div className="pt-1">
                            <button type="button" onClick={requestAdminAccess}
                                className="flex items-center gap-2 text-xs font-semibold transition-colors"
                                style={{ color: '#FF9D00' }}>
                                <ShieldAlert size={13} />
                                Request Admin Access Code
                            </button>
                            <AnimatePresence>
                                {showAdminField && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Admin Code (OTP)</label>
                                        <input type="text" className="input-field tracking-widest text-center"
                                            placeholder="Enter 6-digit code"
                                            value={adminCode} onChange={e => setAdminCode(e.target.value)} />
                                        <p className="text-xs text-gray-600 mt-1.5">Leave blank to register as a Student.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button type="submit" className="btn-accent w-full justify-center text-base py-3.5 mt-2">
                            Create Free Account <ArrowRight size={16} />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold transition-colors hover:opacity-80"
                            style={{ color: '#FF9D00' }}>
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
