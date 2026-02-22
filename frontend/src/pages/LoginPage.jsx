import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    // view modes: LOGIN, ADMIN_OTP, FORGOT_PWD, RESET_PWD
    const [view, setView] = useState('LOGIN');

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const clearMsgs = () => { setError(''); setMessage(''); };

    const handleStandardLogin = async (e) => {
        e.preventDefault();
        clearMsgs();
        try {
            const res = await authAPI.login({ identifier: email, password });
            if (res.data.message === 'OTP_SENT') {
                setView('ADMIN_OTP');
                setMessage('A verification code has been sent to your email for admin access.');
            } else {
                completeLogin(res.data);
            }
        } catch (err) {
            setError("Invalid email/phone or password. Please try again.");
        }
    };

    const handleVerifyAdminOtp = async (e) => {
        e.preventDefault();
        clearMsgs();
        try {
            const res = await authAPI.verifyAdminLogin({ email, otp });
            completeLogin(res.data);
        } catch (err) {
            setError("Invalid or expired verification code. Please try again.");
        }
    };

    const completeLogin = (data) => {
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/student');
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        clearMsgs();
        try {
            await authAPI.forgotPassword({ email });
            setView('RESET_PWD');
            setMessage('Password reset code has been sent to your email.');
        } catch (err) {
            setError("Could not send reset code. Please verify your email address.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        clearMsgs();
        try {
            await authAPI.resetPassword({ email, otp, newPassword });
            setView('LOGIN');
            setOtp('');
            setNewPassword('');
            setPassword('');
            setMessage('Password reset successfully. You can now log in.');
        } catch (err) {
            setError("Invalid or expired reset code. Please try again.");
        }
    };

    const viewTitles = {
        LOGIN: 'Welcome Back',
        ADMIN_OTP: 'Admin Verification',
        FORGOT_PWD: 'Reset Password',
        RESET_PWD: 'Create New Password',
    };

    const viewSubtitles = {
        LOGIN: 'Sign in to access your career assessment dashboard',
        ADMIN_OTP: 'Enter the 6-digit code sent to your email',
        FORGOT_PWD: 'Enter your email to receive a password reset code',
        RESET_PWD: 'Enter your reset code and choose a new password',
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    const inputClass = "w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-accentLight transition-all placeholder-gray-600";

    return (
        <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-accentLight)_0%,_transparent_50%)] opacity-20 blur-3xl pointer-events-none"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl z-10 relative shadow-[0_0_50px_rgba(34,211,238,0.1)]"
            >
                <motion.div variants={itemVariants}>
                    <h2 className="text-3xl font-bold mb-2 text-white text-center tracking-wide">
                        {viewTitles[view]}
                    </h2>
                    <p className="text-gray-400 text-center mb-8">
                        {viewSubtitles[view]}
                    </p>
                </motion.div>

                {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-red-400 text-sm text-center font-semibold bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</motion.div>}
                {message && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-green-400 text-sm text-center font-semibold bg-green-500/10 p-3 rounded-xl border border-green-500/20">{message}</motion.div>}

                <AnimatePresence mode="wait">
                    {view === 'LOGIN' && (
                        <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleStandardLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Email or Phone Number</label>
                                <input type="text" required className={inputClass} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Password</label>
                                <input type="password" required className={inputClass} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={() => { setView('FORGOT_PWD'); clearMsgs(); }} className="text-xs text-accentLight hover:underline font-semibold">
                                    Forgot password?
                                </button>
                            </div>
                            <button type="submit" className="w-full py-4 bg-accentLight text-background font-bold rounded-xl hover:bg-cyan-300 transition-all mt-4">
                                Sign In
                            </button>
                        </motion.form>
                    )}

                    {view === 'ADMIN_OTP' && (
                        <motion.form key="admin_otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleVerifyAdminOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Verification Code</label>
                                <input type="text" required className="w-full bg-black/40 border border-accentLight/40 rounded-xl p-4 text-white focus:outline-none text-center tracking-widest text-xl font-bold focus:border-accentLight transition-all" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} placeholder="000000" />
                            </div>
                            <button type="submit" className="w-full py-4 bg-accentLight text-background font-bold rounded-xl hover:bg-cyan-300 transition-all mt-4">
                                Verify & Access Admin Panel
                            </button>
                            <button type="button" onClick={() => { setView('LOGIN'); clearMsgs(); }} className="w-full text-sm text-gray-500 hover:text-white transition-colors">
                                Back to Login
                            </button>
                        </motion.form>
                    )}

                    {view === 'FORGOT_PWD' && (
                        <motion.form key="forgot_pwd" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleForgotPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Email Address</label>
                                <input type="email" required className={inputClass} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <button type="submit" className="w-full py-4 bg-accentLight text-background font-bold rounded-xl hover:bg-cyan-300 transition-all mt-4">
                                Send Reset Code
                            </button>
                            <button type="button" onClick={() => { setView('LOGIN'); clearMsgs(); }} className="w-full text-sm text-gray-500 hover:text-white transition-colors">
                                Back to Login
                            </button>
                        </motion.form>
                    )}

                    {view === 'RESET_PWD' && (
                        <motion.form key="reset_pwd" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">6-Digit Reset Code</label>
                                <input type="text" required className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:outline-none tracking-widest text-center text-xl font-bold focus:border-accentLight transition-all" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} placeholder="000000" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">New Password</label>
                                <input type="password" required className={inputClass} placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="w-full py-4 bg-accentLight text-background font-bold rounded-xl hover:bg-cyan-300 transition-all mt-4">
                                Reset Password
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account? <Link to="/register" className="text-accentLight hover:text-cyan-300 hover:underline transition-colors">Create one here.</Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
