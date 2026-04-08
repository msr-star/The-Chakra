import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LayoutDashboard, ShieldCheck, Menu, X, Zap, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const userStr = localStorage.getItem('user');
    let user = null;
    try { user = userStr ? JSON.parse(userStr) : null; } catch (_err) { /* ignore parse error */ }

    const [isLightMode, setIsLightMode] = useState(() => {
        return document.documentElement.classList.contains('light-mode');
    });

    const isAuthenticated = !!localStorage.getItem('token');
    const isAdmin = user?.role === 'ADMIN';
    const isStudent = user?.role === 'STUDENT';

    const toggleTheme = () => {
        const root = document.documentElement;
        if (isLightMode) {
            root.classList.remove('light-mode');
            setIsLightMode(false);
        } else {
            root.classList.add('light-mode');
            setIsLightMode(true);
        }
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu when the route changes (intentional side-effect)
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const navLinks = [
        { to: '/about', label: 'About' },
        ...(isStudent ? [{ to: '/resources', label: 'Resources' }] : []),
        { to: '/assessment', label: 'Take Assessment' },
    ];

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className={`flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300 ${scrolled
                    ? 'glass-strong shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                    : 'glass'
                    }`}>

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="relative w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #7C3AFF, #00D4C8)' }}>
                            <Zap size={16} className="text-white" fill="white" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: 'linear-gradient(135deg, #00D4C8, #7C3AFF)' }} />
                        </div>
                        <span
                            className="text-lg font-bold tracking-tight"
                            style={{
                                fontFamily: 'Outfit, sans-serif',
                                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            The Chakra
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${location.pathname === to
                                    ? 'text-white bg-white/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {label}
                                {location.pathname === to && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                                        style={{ background: 'linear-gradient(90deg, #7C3AFF, #00D4C8)' }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth Controls */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                {isAdmin ? (
                                    <Link to="/admin"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-300 hover:text-violet-200 rounded-xl hover:bg-violet-500/10 transition-all">
                                        <ShieldCheck size={15} /> Admin Panel
                                    </Link>
                                ) : (
                                    <Link to="/student"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-300 hover:text-cyan-200 rounded-xl hover:bg-cyan-500/10 transition-all">
                                        <LayoutDashboard size={15} /> Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 hover:text-red-300 rounded-xl bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 transition-all"
                                >
                                    <LogOut size={14} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all mr-2"
                                    title="Toggle Light/Dark Mode"
                                >
                                    {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
                                </button>
                                <Link to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary text-sm px-5 py-2.5">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center gap-2">
                        {!isAuthenticated && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
                            </button>
                        )}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={menuOpen ? 'x' : 'menu'}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {menuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-1"
                        >
                            {navLinks.map(({ to, label }) => (
                                <Link key={to} to={to}
                                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all ${location.pathname === to
                                        ? 'text-white bg-white/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}>
                                    {label}
                                </Link>
                            ))}
                            <div className="h-px bg-white/10 my-2" />
                            {isAuthenticated ? (
                                <>
                                    {isAdmin ? (
                                        <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-violet-300 rounded-xl hover:bg-white/5 transition-all">
                                            <ShieldCheck size={15} /> Admin Panel
                                        </Link>
                                    ) : (
                                        <Link to="/student" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-cyan-300 rounded-xl hover:bg-white/5 transition-all">
                                            <LayoutDashboard size={15} /> Dashboard
                                        </Link>
                                    )}
                                    <button onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-400 rounded-xl hover:bg-red-500/10 transition-all text-left w-full">
                                        <LogOut size={14} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-white/5 transition-all">
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="btn-primary text-sm text-center mt-1">
                                        Get Started Free
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

export default Navbar;
