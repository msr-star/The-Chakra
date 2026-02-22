import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Linkedin, Mail, Shield, Zap, Sparkles } from 'lucide-react';

const Footer = () => {
    const location = useLocation(); // re-reads localStorage fresh on every route change

    // Determine auth state from localStorage
    const token = localStorage.getItem('token');
    const user = (() => {
        try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
    })();

    const isLoggedIn = !!token && !!user;
    const isAdmin = isLoggedIn && user?.role === 'ADMIN';
    const isStudent = isLoggedIn && user?.role === 'STUDENT';

    return (
        <footer className="bg-[#020617] border-t border-white/10 pt-16 pb-8 relative overflow-hidden z-20">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--color-accentLight)_0%,_transparent_40%)] opacity-5 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accentLight to-accentWarm mb-4 inline-block">
                            THE CHAKRA
                        </Link>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            A web-based career assessment platform helping students discover their strengths, personality traits, and ideal career paths.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.linkedin.com/in/m-sai-sri-rohit-aa698a367/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-white/5 hover:bg-[#0A66C2]/20 text-gray-400 hover:text-[#0A66C2] transition-colors border border-white/5 hover:border-[#0A66C2]/30"
                            >
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation - Platform */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                            <Zap size={16} className="text-accentWarm" /> Platform
                        </h4>
                        <ul className="space-y-4">
                            <li><Link to="/assessment" className="text-sm text-gray-400 hover:text-white transition-colors">Career Assessment</Link></li>
                            <li><Link to="/resources" className="text-sm text-gray-400 hover:text-white transition-colors">Career Resources</Link></li>

                            {/* When logged in as Student */}
                            {isStudent && (
                                <li><Link to="/student" className="text-sm text-gray-400 hover:text-white transition-colors">My Dashboard</Link></li>
                            )}

                            {/* When logged in as Admin */}
                            {isAdmin && (
                                <li><Link to="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">Admin Dashboard</Link></li>
                            )}

                            {/* When NOT logged in */}
                            {!isLoggedIn && (
                                <>
                                    <li><Link to="/student" className="text-sm text-gray-400 hover:text-white transition-colors">Student Dashboard</Link></li>
                                    <li><Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                                    <li><Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors">Register</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Navigation - Company */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                            <Sparkles size={16} className="text-accentLight" /> Company
                        </h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/about#team" className="text-sm text-gray-400 hover:text-white transition-colors">Our Team</Link></li>
                            <li><Link to="/about#story" className="text-sm text-gray-400 hover:text-white transition-colors">Our Story</Link></li>
                            <li>
                                <a href="mailto:msrohit2007@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                            <Shield size={16} className="text-gray-300" /> Support
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="mailto:msrohit2007@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    <Mail size={14} /> msrohit2007@gmail.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com/in/m-sai-sri-rohit-aa698a367/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <Linkedin size={14} /> LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        &copy; {new Date().getFullYear()} The Chakra Career Assessment Platform. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <span className="text-xs text-gray-600">Built for FSAD-PS30</span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-600">Powered by Spring Boot + React</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
