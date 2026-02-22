import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import EclipseToggle from './EclipseToggle';
import { LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    let user = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) { }

    const isAuthenticated = !!localStorage.getItem('token');
    const isAdmin = user?.role === 'ADMIN';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-40 glass-panel rounded-full px-6 py-4 flex justify-between items-center"
        >
            <div className="flex gap-6 items-center">
                <Link to="/" className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accentLight to-accentWarm">
                    THE CHAKRA
                </Link>
            </div>

            <div className="flex gap-6 items-center">
                <Link to="/about" className="text-sm font-medium text-gray-400 hover:text-accentLight transition-colors hidden md:block">
                    About
                </Link>
                <EclipseToggle />

                {isAuthenticated ? (
                    <>
                        {isAdmin ? (
                            <Link to="/admin" className="flex items-center gap-2 text-sm font-medium hover:text-accentWarm transition-colors">
                                <ShieldCheck size={16} />
                                Admin Panel
                            </Link>
                        ) : (
                            <Link to="/student" className="flex items-center gap-2 text-sm font-medium hover:text-accentLight transition-colors">
                                <LayoutDashboard size={16} />
                                My Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm font-bold border border-red-500/20"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/assessment" className="text-sm font-medium hover:text-accentLight transition-colors">
                            Take Assessment
                        </Link>
                        <Link to="/login" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-medium">
                            Sign In
                        </Link>
                    </>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
