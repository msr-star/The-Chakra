import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Search, Star, BookOpen, Filter } from 'lucide-react';

const CAREER_PATHS = [
    { id: 'all', label: 'All Resources', emoji: '🌐', color: 'from-gray-500 to-gray-600' },
    { id: 'engineering', label: 'Engineering & Tech', emoji: '💻', color: 'from-cyan-500 to-blue-600' },
    { id: 'design', label: 'Design & UX', emoji: '🎨', color: 'from-purple-500 to-pink-600' },
    { id: 'data', label: 'Data Science', emoji: '📊', color: 'from-emerald-500 to-teal-600' },
    { id: 'cybersecurity', label: 'Cybersecurity', emoji: '🛡️', color: 'from-red-500 to-orange-600' },
    { id: 'product', label: 'Product Management', emoji: '📦', color: 'from-yellow-500 to-amber-600' },
    { id: 'business', label: 'Business & Leadership', emoji: '🤝', color: 'from-indigo-500 to-violet-600' },
];

const RESOURCES = [
    // ── Engineering & Tech ──
    {
        id: 1, career: 'engineering',
        title: 'CS50: Introduction to Computer Science',
        platform: 'Harvard / edX', emoji: '🎓',
        desc: "Harvard's legendary intro to programming — covers C, Python, SQL, JavaScript. Best free CS course ever made.",
        level: 'Beginner', free: true, rating: 5,
        url: 'https://cs50.harvard.edu/x/',
        tags: ['C', 'Python', 'SQL', 'JavaScript']
    },
    {
        id: 2, career: 'engineering',
        title: 'The Odin Project',
        platform: 'Self-Hosted', emoji: '⚔️',
        desc: 'A completely free, open-source full-stack curriculum. Covers HTML, CSS, JS, React, Node.js, and databases.',
        level: 'Beginner', free: true, rating: 5,
        url: 'https://www.theodinproject.com/',
        tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js']
    },
    {
        id: 3, career: 'engineering',
        title: 'freeCodeCamp Full Stack Curriculum',
        platform: 'freeCodeCamp', emoji: '🔥',
        desc: '3,000+ hours of free coding challenges and certifications. From HTML basics to backend APIs.',
        level: 'Beginner', free: true, rating: 5,
        url: 'https://www.freecodecamp.org/',
        tags: ['HTML', 'CSS', 'JavaScript', 'Python', 'APIs']
    },
    {
        id: 4, career: 'engineering',
        title: 'roadmap.sh — Developer Roadmaps',
        platform: 'roadmap.sh', emoji: '🗺️',
        desc: 'Visual step-by-step roadmaps for Frontend, Backend, DevOps, Android, and 20+ more career paths.',
        level: 'All Levels', free: true, rating: 5,
        url: 'https://roadmap.sh/',
        tags: ['Roadmap', 'Career Paths', 'Planning']
    },
    {
        id: 5, career: 'engineering',
        title: 'Spring Boot + Java Full Course',
        platform: 'YouTube / Amigoscode', emoji: '🍃',
        desc: 'Complete Spring Boot 3 tutorial — REST APIs, Spring Security, JPA, Docker. Perfect for Java devs.',
        level: 'Intermediate', free: true, rating: 4,
        url: 'https://www.youtube.com/@amigoscode',
        tags: ['Java', 'Spring Boot', 'REST API']
    },
    {
        id: 6, career: 'engineering',
        title: 'LeetCode — Data Structures & Algorithms',
        platform: 'LeetCode', emoji: '🧩',
        desc: 'Practice coding problems for interviews. Free tier covers 2000+ problems. Essential for placements.',
        level: 'Intermediate', free: true, rating: 4,
        url: 'https://leetcode.com/',
        tags: ['DSA', 'Interviews', 'Problem Solving']
    },

    // ── Design & UX ──
    {
        id: 7, career: 'design',
        title: 'Google UX Design Professional Certificate',
        platform: 'Coursera / Google', emoji: '🎯',
        desc: 'Beginner-friendly 7-course certificate from Google. Covers UX research, wireframing, prototyping, Figma.',
        level: 'Beginner', free: false, rating: 5,
        url: 'https://www.coursera.org/professional-certificates/google-ux-design',
        tags: ['UX Research', 'Figma', 'Prototyping']
    },
    {
        id: 8, career: 'design',
        title: 'Figma – Design Fundamentals',
        platform: 'Figma Learn', emoji: '✏️',
        desc: 'Official free tutorials from Figma covering auto layout, components, prototyping and design systems.',
        level: 'Beginner', free: true, rating: 5,
        url: 'https://www.figma.com/resources/learn-design/',
        tags: ['Figma', 'UI Design', 'Prototyping']
    },
    {
        id: 9, career: 'design',
        title: 'Refactoring UI – Design Tips',
        platform: 'refactoringui.com', emoji: '🖌️',
        desc: 'Practical tips for making UIs look professional. The book that taught developers how to design.',
        level: 'Intermediate', free: false, rating: 5,
        url: 'https://www.refactoringui.com/',
        tags: ['UI Tips', 'Visual Design', 'CSS']
    },
    {
        id: 10, career: 'design',
        title: 'Interaction Design Foundation',
        platform: 'IDF', emoji: '🧠',
        desc: 'World-class UX courses. Covers design thinking, user research, accessibility and more. Community-driven.',
        level: 'All Levels', free: false, rating: 4,
        url: 'https://www.interaction-design.org/',
        tags: ['UX', 'Design Thinking', 'Research']
    },
    {
        id: 11, career: 'design',
        title: 'DesignCourse – Full UI/UX Tutorial',
        platform: 'YouTube / DesignCourse', emoji: '🎥',
        desc: 'Free YouTube channel with modern UI tutorials covering Figma, CSS, and real project walkthroughs.',
        level: 'Beginner', free: true, rating: 4,
        url: 'https://www.youtube.com/@DesignCourse',
        tags: ['Figma', 'CSS', 'UI Tutorial']
    },

    // ── Data Science ──
    {
        id: 12, career: 'data',
        title: 'Kaggle Learn – Data Science Micro-Courses',
        platform: 'Kaggle', emoji: '📈',
        desc: 'Free hands-on micro-courses in Python, ML, SQL, Deep Learning. Earn certificates. Best starting point.',
        level: 'Beginner', free: true, rating: 5,
        url: 'https://www.kaggle.com/learn',
        tags: ['Python', 'ML', 'SQL', 'Deep Learning']
    },
    {
        id: 13, career: 'data',
        title: 'fast.ai – Practical Deep Learning',
        platform: 'fast.ai', emoji: '🤖',
        desc: 'Top-down practical ML course. Learn neural networks, computer vision, NLP using PyTorch. Completely free.',
        level: 'Intermediate', free: true, rating: 5,
        url: 'https://www.fast.ai/',
        tags: ['Deep Learning', 'PyTorch', 'Computer Vision', 'NLP']
    },
    {
        id: 14, career: 'data',
        title: 'StatQuest with Josh Starmer',
        platform: 'YouTube', emoji: '📊',
        desc: 'Best channel for statistics and ML concepts explained visually. Covers probability, regression, ML algorithms clearly.',
        level: 'Beginner', free: true, rating: 5,
        url: 'https://www.youtube.com/@statquest',
        tags: ['Statistics', 'Machine Learning', 'Probability']
    },
    {
        id: 15, career: 'data',
        title: 'IBM Data Science Professional Certificate',
        platform: 'Coursera / IBM', emoji: '💡',
        desc: '12-course certificate series covering data analysis, visualization, SQL, Python, ML, and real projects.',
        level: 'Beginner', free: false, rating: 4,
        url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
        tags: ['Python', 'SQL', 'Data Analysis', 'ML']
    },
    {
        id: 16, career: 'data',
        title: 'Pandas + NumPy Crash Course',
        platform: 'YouTube / Keith Galli', emoji: '🐼',
        desc: 'Extremely practical tutorials for Pandas and NumPy — the core data science Python libraries. All free.',
        level: 'Beginner', free: true, rating: 4,
        url: 'https://www.youtube.com/@KeithGalli',
        tags: ['Pandas', 'NumPy', 'Python', 'Data Analysis']
    },

    // ── Cybersecurity ──
    {
        id: 17, career: 'cybersecurity',
        title: 'TryHackMe – Hands-On Cyber Training',
        platform: 'TryHackMe', emoji: '🕵️',
        desc: 'Learn cybersecurity through interactive browser-based labs. Free tier with 400+ rooms. Best beginner platform.',
        level: 'Beginner', free: true, rating: 5,
        url: 'https://tryhackme.com/',
        tags: ['Ethical Hacking', 'CTF', 'Networking', 'Penetration Testing']
    },
    {
        id: 18, career: 'cybersecurity',
        title: 'Google Cybersecurity Certificate',
        platform: 'Coursera / Google', emoji: '🔐',
        desc: '8-course certificate covering security operations, network security, Python for security, and SIEM tools.',
        level: 'Beginner', free: false, rating: 5,
        url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
        tags: ['Security Operations', 'SIEM', 'Python']
    },
    {
        id: 19, career: 'cybersecurity',
        title: 'Hack The Box Academy',
        platform: 'Hack The Box', emoji: '🎯',
        desc: 'Professional-grade cybersecurity training with gamified challenges. Free starter path available.',
        level: 'Intermediate', free: true, rating: 5,
        url: 'https://academy.hackthebox.com/',
        tags: ['Pentesting', 'CTF', 'Linux', 'Web Exploitation']
    },
    {
        id: 20, career: 'cybersecurity',
        title: 'OWASP Top 10 – Web Security Risks',
        platform: 'OWASP', emoji: '🛡️',
        desc: 'The definitive guide to web application security vulnerabilities — SQL injection, XSS, CSRF and more. Free.',
        level: 'Intermediate', free: true, rating: 4,
        url: 'https://owasp.org/www-project-top-ten/',
        tags: ['Web Security', 'SQL Injection', 'XSS', 'CSRF']
    },
    {
        id: 21, career: 'cybersecurity',
        title: 'CompTIA Security+ Study Resources',
        platform: 'Professor Messer', emoji: '📖',
        desc: 'Free video course for the industry-standard CompTIA Security+ certification. Very thorough and updated.',
        level: 'Intermediate', free: true, rating: 4,
        url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/',
        tags: ['CompTIA', 'Certification', 'Network Security']
    },

    // ── Product Management ──
    {
        id: 22, career: 'product',
        title: 'Google Project Management Certificate',
        platform: 'Coursera / Google', emoji: '📋',
        desc: '6-course series covering planning, risk management, Agile, Scrum, stakeholder communication. Job-ready.',
        level: 'Beginner', free: false, rating: 5,
        url: 'https://www.coursera.org/professional-certificates/google-project-management',
        tags: ['Agile', 'Scrum', 'Project Planning', 'Risk Management']
    },
    {
        id: 23, career: 'product',
        title: 'Lenny\'s Newsletter – PM Deep Dives',
        platform: 'Substack', emoji: '📰',
        desc: 'The most-read product management newsletter. Real insights from top PMs at Google, Airbnb, Stripe.',
        level: 'All Levels', free: true, rating: 5,
        url: 'https://www.lennysnewsletter.com/',
        tags: ['Product Strategy', 'Metrics', 'Growth']
    },
    {
        id: 24, career: 'product',
        title: 'Product School – Free Resources',
        platform: 'Product School', emoji: '🏫',
        desc: 'Free templates, guides, and webinars for aspiring PMs. Covers PRDs, roadmaps, user stories, and metrics.',
        level: 'Beginner', free: true, rating: 4,
        url: 'https://productschool.com/resources',
        tags: ['PRD', 'Roadmaps', 'User Stories']
    },
    {
        id: 25, career: 'product',
        title: 'PM Exercises – Case Study Practice',
        platform: 'PMExercises.com', emoji: '🧪',
        desc: '100+ free PM interview questions with examples. Design a product, estimate metrics, improve features.',
        level: 'Intermediate', free: true, rating: 4,
        url: 'https://www.pmexercises.com/',
        tags: ['Interviews', 'Case Studies', 'Design Questions']
    },

    // ── Business & Leadership ──
    {
        id: 26, career: 'business',
        title: 'The Science of Well-Being – Yale',
        platform: 'Coursera / Yale', emoji: '🌟',
        desc: "Yale's most popular course ever — covers happiness, habits, leadership mindset and peak performance.",
        level: 'Beginner', free: true, rating: 5,
        url: 'https://www.coursera.org/learn/the-science-of-well-being',
        tags: ['Psychology', 'Habits', 'Leadership', 'Mindset']
    },
    {
        id: 27, career: 'business',
        title: 'Business Foundations – Wharton',
        platform: 'Coursera / Wharton', emoji: '🏛️',
        desc: 'Four courses from the world-famous Wharton School: Marketing, Finance, Operations, Leadership.',
        level: 'Beginner', free: false, rating: 5,
        url: 'https://www.coursera.org/specializations/wharton-business-foundations',
        tags: ['Finance', 'Marketing', 'Operations', 'Leadership']
    },
    {
        id: 28, career: 'business',
        title: 'HBR – Harvard Business Review Articles',
        platform: 'Harvard Business Review', emoji: '📚',
        desc: 'Free articles from Harvard on leadership, strategy, management, and organizational behavior.',
        level: 'All Levels', free: true, rating: 4,
        url: 'https://hbr.org/',
        tags: ['Strategy', 'Leadership', 'Management', 'Innovation']
    },
    {
        id: 29, career: 'business',
        title: 'Introduction to Financial Accounting – Wharton',
        platform: 'Coursera / Wharton', emoji: '💰',
        desc: 'Learn to read balance sheets, income statements and understand business financial health. Beginner-friendly.',
        level: 'Beginner', free: false, rating: 4,
        url: 'https://www.coursera.org/learn/wharton-accounting',
        tags: ['Accounting', 'Finance', 'Business']
    },
    {
        id: 30, career: 'business',
        title: 'TED Talks – Leadership Playlist',
        platform: 'TED.com', emoji: '🎤',
        desc: 'Curated collection of the best TED talks on leadership, communication, decision-making and business strategy.',
        level: 'All Levels', free: true, rating: 5,
        url: 'https://www.ted.com/topics/leadership',
        tags: ['Leadership', 'Communication', 'Inspiration']
    },
];

const LEVEL_COLORS = {
    'Beginner': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Advanced': 'bg-red-500/20 text-red-400 border-red-500/30',
    'All Levels': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const ResourceCard = ({ resource, idx }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: idx * 0.05 }}
        whileHover={{ y: -6, scale: 1.01 }}
        className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-accentLight/30 transition-all duration-300 flex flex-col h-full group"
    >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
            <div className="text-3xl">{resource.emoji}</div>
            <div className="flex gap-2 flex-wrap justify-end">
                <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${LEVEL_COLORS[resource.level]}`}>
                    {resource.level}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${resource.free ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                    {resource.free ? '✓ Free' : '$ Paid'}
                </span>
            </div>
        </div>

        {/* Title & Platform */}
        <h3 className="text-white font-bold text-lg mb-1 leading-snug group-hover:text-accentLight transition-colors">
            {resource.title}
        </h3>
        <p className="text-accentLight text-xs font-semibold mb-3 tracking-wide">{resource.platform}</p>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">{resource.desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
            {resource.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    {tag}
                </span>
            ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < resource.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'} />
            ))}
            <span className="text-xs text-gray-500 ml-1">Highly recommended</span>
        </div>

        {/* CTA Button */}
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accentLight/10 hover:bg-accentLight text-accentLight hover:text-background font-bold text-sm transition-all duration-300 border border-accentLight/30 hover:border-accentLight group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
        >
            Start Learning <ExternalLink size={14} />
        </a>
    </motion.div>
);

const CareerResourcesPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = useMemo(() => {
        let list = activeTab === 'all' ? RESOURCES : RESOURCES.filter(r => r.career === activeTab);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(r =>
                r.title.toLowerCase().includes(q) ||
                r.desc.toLowerCase().includes(q) ||
                r.platform.toLowerCase().includes(q) ||
                r.tags.some(t => t.toLowerCase().includes(q))
            );
        }
        return list;
    }, [activeTab, searchQuery]);

    const activeCareer = CAREER_PATHS.find(c => c.id === activeTab);

    return (
        <div className="min-h-screen bg-background text-white pb-24 overflow-x-hidden">

            {/* ── HERO ── */}
            <div className="relative pt-36 pb-20 px-6 text-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.07)_0%,_transparent_65%)] pointer-events-none" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <span className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-accentLight/30 bg-accentLight/10 text-accentLight text-xs font-semibold tracking-widest uppercase">
                        <BookOpen size={14} /> Career Resource Library
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-gray-500 mb-6">
                        Learn. Grow. Succeed.
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
                        30+ curated, expert-vetted learning resources for every major career path — from beginner to advanced.
                    </p>
                    {/* Stats */}
                    <div className="flex justify-center flex-wrap gap-8 mt-6">
                        {[
                            { val: '30+', label: 'Curated Resources' },
                            { val: '6', label: 'Career Paths' },
                            { val: '70%', label: 'Free Resources' },
                            { val: '∞', label: 'Learning Potential' },
                        ].map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="text-center">
                                <div className="text-3xl font-black text-accentLight">{s.val}</div>
                                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12">

                {/* ── SEARCH BAR ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative max-w-xl mx-auto mb-10">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search resources, platforms, or topics..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-accentLight/50 transition-all"
                    />
                </motion.div>

                {/* ── CAREER TAB FILTER ── */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {CAREER_PATHS.map(path => (
                        <motion.button
                            key={path.id}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setActiveTab(path.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border ${activeTab === path.id
                                    ? `bg-gradient-to-r ${path.color} text-white border-transparent shadow-lg`
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            <span>{path.emoji}</span> {path.label}
                        </motion.button>
                    ))}
                </div>

                {/* ── ACTIVE PATH BANNER ── */}
                {activeTab !== 'all' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-8 p-5 rounded-2xl bg-gradient-to-r ${activeCareer?.color} bg-opacity-10 border border-white/10 flex items-center gap-4`}
                    >
                        <span className="text-4xl">{activeCareer?.emoji}</span>
                        <div>
                            <h2 className="text-white font-bold text-xl">{activeCareer?.label}</h2>
                            <p className="text-gray-300 text-sm">Showing {filtered.length} hand-picked resources for this career path.</p>
                        </div>
                    </motion.div>
                )}

                {/* ── RESOURCE COUNT ── */}
                <div className="flex items-center gap-2 mb-6">
                    <Filter size={16} className="text-gray-500" />
                    <span className="text-gray-500 text-sm">{filtered.length} resource{filtered.length !== 1 ? 's' : ''} found</span>
                </div>

                {/* ── RESOURCE GRID ── */}
                <AnimatePresence mode="wait">
                    {filtered.length > 0 ? (
                        <motion.div
                            key={activeTab + searchQuery}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filtered.map((resource, idx) => (
                                <ResourceCard key={resource.id} resource={resource} idx={idx} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24"
                        >
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-white text-xl font-bold mb-2">No resources found</h3>
                            <p className="text-gray-500">Try a different search term or career path.</p>
                            <button onClick={() => { setSearchQuery(''); setActiveTab('all'); }} className="mt-6 px-6 py-3 bg-accentLight/10 text-accentLight rounded-xl border border-accentLight/30 hover:bg-accentLight hover:text-background transition-all font-semibold">
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── BOTTOM CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 glass-panel p-10 rounded-3xl text-center border border-white/5 bg-gradient-to-br from-accentLight/5 to-accentWarm/5"
                >
                    <div className="text-5xl mb-4">🎯</div>
                    <h2 className="text-3xl font-black text-white mb-3">Not sure which path is yours?</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">Take our career assessment to discover which career path matches your personality, strengths, and skills.</p>
                    <a href="/assessment" className="inline-flex items-center gap-2 px-8 py-4 bg-accentLight text-background font-black rounded-xl hover:bg-cyan-300 transition-all text-lg shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                        Take The Assessment →
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default CareerResourcesPage;
