import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EclipseToggle from './EclipseToggle';
import { LogOut, LayoutDashboard, ShieldCheck, Menu, X } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

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
        setMenuOpen(false);
        navigate('/login');
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-40 glass-panel rounded-2xl md:rounded-full px-4 md:px-6 py-3 md:py-4"
        >
            {/* Main bar */}
            <div className="flex justify-between items-center">
                {/* Logo */}
                <Link to="/" onClick={closeMenu} className="text-lg md:text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accentLight to-accentWarm whitespace-nowrap">
                    THE CHAKRA
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/about" className="text-sm font-medium text-gray-400 hover:text-accentLight transition-colors">About</Link>
                    <EclipseToggle />
                    {isAuthenticated ? (
                        <>
                            {isAdmin ? (
                                <Link to="/admin" className="flex items-center gap-2 text-sm font-medium hover:text-accentWarm transition-colors">
                                    <ShieldCheck size={16} />Admin Panel
                                </Link>
                            ) : (
                                <Link to="/student" className="flex items-center gap-2 text-sm font-medium hover:text-accentLight transition-colors">
                                    <LayoutDashboard size={16} />My Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm font-bold border border-red-500/20">
                                <LogOut size={14} />Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/assessment" className="text-sm font-medium hover:text-accentLight transition-colors">Take Assessment</Link>
                            <Link to="/login" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-medium">Sign In</Link>
                        </>
                    )}
                </div>

                {/* Mobile right side */}
                <div className="flex md:hidden items-center gap-3">
                    <EclipseToggle />
                    <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-gray-300 hover:text-white transition-colors">
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden overflow-hidden"
                    >
                        <div className="pt-3 pb-1 flex flex-col gap-3 border-t border-white/10 mt-3">
                            <Link to="/about" onClick={closeMenu} className="text-sm font-medium text-gray-400 hover:text-accentLight transition-colors py-1">About</Link>
                            {isAuthenticated ? (
                                <>
                                    {isAdmin ? (
                                        <Link to="/admin" onClick={closeMenu} className="flex items-center gap-2 text-sm font-medium hover:text-accentWarm transition-colors py-1">
                                            <ShieldCheck size={16} />Admin Panel
                                        </Link>
                                    ) : (
                                        <Link to="/student" onClick={closeMenu} className="flex items-center gap-2 text-sm font-medium hover:text-accentLight transition-colors py-1">
                                            <LayoutDashboard size={16} />My Dashboard
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm font-bold border border-red-500/20 w-fit">
                                        <LogOut size={14} />Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/assessment" onClick={closeMenu} className="text-sm font-medium hover:text-accentLight transition-colors py-1">Take Assessment</Link>
                                    <Link to="/login" onClick={closeMenu} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-medium w-fit">Sign In</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
