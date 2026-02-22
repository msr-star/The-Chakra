import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [showAdminField, setShowAdminField] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const payload = { name, email, phoneNumber, password, adminCode };
            const res = await authAPI.register(payload);

            localStorage.setItem('token', res.data.token);
            if (res.data.refreshToken) {
                localStorage.setItem('refreshToken', res.data.refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
        } catch (err) {
            setError("Registration failed. Email or Phone might be in use, or Admin Code is invalid.");
            setMessage('');
        }
    };

    const requestAdminAccess = async () => {
        if (!name || !email) {
            setError("Please provide Name and Email before requesting Admin access.");
            return;
        }
        try {
            await authAPI.requestAdminAccess({ name, email });
            setMessage("Admin access request sent to Root Authority.");
            setError('');
            setShowAdminField(true);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to request admin access.";
            setError("Error: " + errorMsg);
            setMessage('');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-accentWarm)_0%,_transparent_60%)] opacity-20 blur-3xl pointer-events-none"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl z-10 relative shadow-[0_0_50px_rgba(245,158,11,0.1)]"
            >
                <motion.div variants={itemVariants}>
                    <h2 className="text-3xl font-bold mb-2 text-white text-center tracking-wide">Create Account</h2>
                    <p className="text-gray-400 text-center mb-8">Register to start your career assessment journey</p>
                </motion.div>

                {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-red-400 text-sm text-center font-semibold">{error}</motion.div>}
                {message && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-green-400 text-sm text-center font-semibold">{message}</motion.div>}

                <form onSubmit={handleRegister} className="space-y-6">
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">Full Name</label>
                        <input
                            type="text" required
                            className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white hover:border-accentWarm/50 focus:outline-none focus:border-accentWarm focus:ring-1 focus:ring-accentWarm transition-all duration-300"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">Email Address</label>
                        <input
                            type="email" required
                            className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white hover:border-accentWarm/50 focus:outline-none focus:border-accentWarm focus:ring-1 focus:ring-accentWarm transition-all duration-300"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">Phone Number</label>
                        <input
                            type="tel"
                            className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white hover:border-accentWarm/50 focus:outline-none focus:border-accentWarm focus:ring-1 focus:ring-accentWarm transition-all duration-300"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">Password</label>
                        <input
                            type="password" required
                            className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white hover:border-accentWarm/50 focus:outline-none focus:border-accentWarm focus:ring-1 focus:ring-accentWarm transition-all duration-300"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-2">
                        <button
                            type="button"
                            onClick={requestAdminAccess}
                            className="text-xs text-accentWarm hover:text-yellow-400 font-semibold mb-2"
                        >
                            + Request Admin Access Code
                        </button>

                        <AnimatePresence>
                            {showAdminField && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-2"
                                >
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">Admin Access Code (OTP)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/40 border border-accentWarm/40 rounded-xl p-4 text-white focus:outline-none focus:border-accentWarm transition-all"
                                        value={adminCode}
                                        onChange={e => setAdminCode(e.target.value)}
                                        placeholder="Enter 6-digit code from email"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave blank to register as Student.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 bg-accentWarm text-background font-bold rounded-xl hover:bg-yellow-400 transition-all duration-300 mt-4"
                    >
                        Create Account
                    </motion.button>
                </form>

                <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-accentWarm hover:text-yellow-400 hover:underline transition-colors">Sign in here.</Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
