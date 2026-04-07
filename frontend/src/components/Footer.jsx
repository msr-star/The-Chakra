import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Linkedin, Mail, ArrowUpRight, Twitter, Github } from 'lucide-react';

const Footer = () => {
    const token = localStorage.getItem('token');
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
    const isLoggedIn = !!token && !!user;
    const isAdmin = isLoggedIn && user?.role === 'ADMIN';
    const isStudent = isLoggedIn && user?.role === 'STUDENT';

    const platformLinks = [
        { to: '/assessment', label: 'Career Assessment' },
        ...(isStudent ? [{ to: '/resources', label: 'Career Resources' }] : []),
        ...(isStudent ? [{ to: '/student', label: 'My Dashboard' }] : []),
        ...(isAdmin ? [{ to: '/admin', label: 'Admin Dashboard' }] : []),
        ...(!isLoggedIn ? [
            { to: '/login', label: 'Sign In' },
            { to: '/register', label: 'Register Free' },
        ] : []),
    ];

    const companyLinks = [
        { to: '/about', label: 'About Us' },
        { to: '/about#team', label: 'Our Team' },
        { to: '/about#story', label: 'Our Story' },
    ];

    return (
        <footer className="relative overflow-hidden z-20"
            style={{ background: 'linear-gradient(180deg, #05091A 0%, #030610 100%)' }}>

            {/* Top gradient border */}
            <div className="divider-gradient" />

            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse, rgba(124,58,255,0.08) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }} />

            <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">

                    {/* Brand */}
                    <div className="md:col-span-4">
                        <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #7C3AFF, #00D4C8)' }}>
                                <Zap size={17} className="text-white" fill="white" />
                            </div>
                            <span className="text-xl font-bold"
                                style={{
                                    fontFamily: 'Outfit, sans-serif',
                                    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.65) 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>
                                The Chakra
                            </span>
                        </Link>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                            A career assessment platform helping students discover their strengths, personality traits, and ideal career paths through intelligent assessments.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3">
                            <a href="https://www.linkedin.com/in/m-sai-sri-rohit-aa698a367/"
                                target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white border border-white/8 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-200">
                                <Linkedin size={16} />
                            </a>
                            <a href="mailto:msrohit2007@gmail.com"
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white border border-white/8 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-200">
                                <Mail size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase"
                            style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Platform
                        </h4>
                        <ul className="space-y-3">
                            {platformLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to}
                                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                                        {label}
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-px" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase"
                            style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {companyLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to}
                                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                                        {label}
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-px" />
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <a href="mailto:msrohit2007@gmail.com"
                                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                                    Contact
                                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-px" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact / CTA */}
                    <div className="md:col-span-2">
                        <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase"
                            style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Connect
                        </h4>
                        <div className="space-y-3">
                            <a href="mailto:msrohit2007@gmail.com"
                                className="text-sm text-gray-400 hover:text-white transition-colors block break-all">
                                msrohit2007@gmail.com
                            </a>
                            <div className="mt-4">
                                <Link to="/register"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all"
                                    style={{ background: 'linear-gradient(135deg, rgba(124,58,255,0.25), rgba(0,212,200,0.15))', border: '1px solid rgba(124,58,255,0.3)' }}>
                                    Get Started Free
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="divider-gradient mb-8" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-xs">
                        &copy; {new Date().getFullYear()} The Chakra Career Assessment Platform. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-700">Built for FSAD-PS30</span>
                        <span className="text-gray-700">·</span>
                        <span className="text-xs text-gray-700">Spring Boot + React</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
