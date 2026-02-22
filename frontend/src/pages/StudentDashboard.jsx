import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Activity, Clock, Zap, Target, BookOpen, CheckCircle, AlertCircle, GraduationCap, Compass, UserCheck, ExternalLink } from 'lucide-react';
import { assessmentAPI, studentAPI } from '../api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    let user = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        user = null;
    }

    const [results, setResults] = useState([]);
    const [loadingResults, setLoadingResults] = useState(true);
    const [mentor, setMentor] = useState(null);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await assessmentAPI.getMyResults();
                setResults(res.data || []);
            } catch (error) {
                console.error('Failed to load results', error);
            } finally {
                setLoadingResults(false);
            }
        };
        const fetchMentorData = async () => {
            try {
                const [mentorRes, tasksRes] = await Promise.all([
                    studentAPI.getMyMentor(),
                    studentAPI.getMyTasks(),
                ]);
                if (mentorRes.data?.mentorName) setMentor(mentorRes.data);
                setTasks(tasksRes.data || []);
            } catch (e) { /* silent fail */ }
        };
        fetchResults();
        fetchMentorData();
    }, []);

    const latestResult = results[0] || null;
    const totalAssessments = results.length;

    // Build career profile bars from latest result category scores
    const categoryScores = latestResult?.categoryScores || {};
    const sortedCategories = Object.entries(categoryScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);
    const maxScore = sortedCategories[0]?.[1] || 1;

    const barColors = ['bg-accentLight', 'bg-purple-400', 'bg-accentWarm', 'bg-emerald-400'];

    return (
        <div className="min-h-screen pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
            {/* Ambient Background */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-accentLight)_0%,_transparent_40%)] opacity-20 blur-3xl pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Left Column: Profile & Summary */}
                <div className="lg:col-span-1 space-y-6">
                    {/* User Profile Card */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-accentLight/20 to-accentWarm/20 group-hover:from-accentLight/30 group-hover:to-accentWarm/30 transition-colors" />
                        <div className="relative z-10 flex flex-col items-center mt-6">
                            <div className="w-24 h-24 rounded-full bg-[#020617] border-4 border-background flex items-center justify-center mb-4 shadow-xl">
                                <User size={40} className="text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user?.name || 'Student'}</h2>
                            <p className="text-accentLight text-sm font-medium tracking-wide mb-1">{user?.email || ''}</p>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mb-6">Student</span>

                            <div className="w-full grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                                <div className="text-center">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Assessments</p>
                                    <p className="text-xl font-bold text-white">{loadingResults ? '—' : totalAssessments}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Top Match</p>
                                    <p className="text-sm font-bold text-accentWarm truncate">{latestResult?.suggestedPath || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Career Profile Widget */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Target size={18} className="text-accentLight" /> Your Career Profile
                        </h3>
                        {loadingResults ? (
                            <p className="text-gray-500 text-sm">Loading your profile...</p>
                        ) : sortedCategories.length > 0 ? (
                            <div className="space-y-4">
                                {sortedCategories.map(([category, score], i) => (
                                    <div key={category}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">{category}</span>
                                            <span className="text-white font-bold">{Math.round((score / maxScore) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-2">
                                            <div
                                                className={`${barColors[i % barColors.length]} rounded-full h-2 transition-all duration-1000`}
                                                style={{ width: `${Math.round((score / maxScore) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm">Complete an assessment to see your career profile.</p>
                            </div>
                        )}
                    </div>

                    {/* Mentor Card */}
                    {mentor && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-6 rounded-3xl border border-accentLight/20 bg-accentLight/5"
                        >
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <UserCheck size={18} className="text-accentLight" /> Your Mentor
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accentLight/30 to-purple-500/30 flex items-center justify-center text-xl font-black text-white">
                                    {mentor.mentorName?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white font-bold">{mentor.mentorName}</p>
                                    <p className="text-accentLight text-xs">Your assigned career mentor</p>
                                </div>
                            </div>
                            {tasks.length > 0 && (
                                <p className="text-xs text-gray-500 mt-3">{tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you</p>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Career Dashboard</h1>
                        <p className="text-gray-400 mb-8">Track your assessments, explore career recommendations, and plan your future.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Assessment Action */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/assessment')}
                                className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-accentLight/20 cursor-pointer transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-full bg-accentLight/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Zap size={24} className="text-accentLight" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Take Assessment</h3>
                                <p className="text-sm text-gray-400">
                                    {totalAssessments > 0
                                        ? "Retake the assessment to get updated career recommendations."
                                        : "Start the career assessment to discover your strengths and ideal career paths."}
                                </p>
                            </motion.div>

                            {/* Results Action */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => latestResult ? navigate('/results', { state: { result: latestResult } }) : navigate('/assessment')}
                                className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-accentWarm/20 cursor-pointer transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-full bg-accentWarm/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Activity size={24} className="text-accentWarm" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">View My Results</h3>
                                <p className="text-sm text-gray-400">
                                    {latestResult
                                        ? `View your career recommendations based on your ${latestResult.suggestedPath} profile.`
                                        : "Complete an assessment first to view your recommended career paths."}
                                </p>
                            </motion.div>
                            {/* Career Resources Action */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/resources')}
                                className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-purple-400/20 cursor-pointer transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-full bg-purple-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} className="text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Career Resources</h3>
                                <p className="text-sm text-gray-400">
                                    Browse 30+ curated learning resources — courses, tutorials, and roadmaps for your path.
                                </p>
                            </motion.div>

                            {/* About Your Career Path */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/about')}
                                className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-emerald-400/20 cursor-pointer transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-full bg-emerald-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Compass size={24} className="text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">About The Chakra</h3>
                                <p className="text-sm text-gray-400">
                                    Learn about our platform, the team behind it, and how the assessment algorithm works.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Assessment History */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5">
                        <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                            <Clock size={20} className="text-gray-400" /> Assessment History
                        </h3>

                        {loadingResults ? (
                            <div className="text-center py-8 text-gray-500">Loading history...</div>
                        ) : results.length === 0 ? (
                            <div className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/5">
                                <div className="p-2 bg-accentLight/20 text-accentLight rounded-lg mt-0.5">
                                    <AlertCircle size={18} />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-1">No assessments completed yet</p>
                                    <p className="text-xs text-gray-500">Take your first career assessment to get personalized career recommendations.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {results.map((result, index) => (
                                    <motion.div
                                        key={result.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => navigate('/results', { state: { result } })}
                                        className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-accentLight/30 hover:bg-white/10 transition-colors cursor-pointer group"
                                    >
                                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium mb-1">
                                                Career Assessment #{results.length - index}
                                            </p>
                                            <p className="text-xs text-gray-500 mb-2">
                                                Recommended Path: <span className="text-accentLight font-semibold">{result.suggestedPath}</span>
                                                {result.timestamp && ` • ${new Date(result.timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}`}
                                            </p>
                                        </div>
                                        <span className="text-xs text-accentLight opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Daily Tasks from Mentor */}
                {tasks.length > 0 && (
                    <div className="glass-panel p-6 rounded-3xl border border-white/5">
                        <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                            <CheckCircle size={20} className="text-purple-400" /> Daily Tasks from Mentor
                        </h3>
                        <div className="space-y-4">
                            {tasks.map((task, i) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="p-4 bg-white/5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <p className="text-white font-semibold text-sm">{task.title}</p>
                                        <span className="text-xs text-gray-600 shrink-0">
                                            {task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-xs leading-relaxed mb-3">{task.content}</p>
                                    {task.resourceUrl && (
                                        <a href={task.resourceUrl} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-accentLight hover:underline">
                                            <ExternalLink size={12} /> View Resource
                                        </a>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

            </motion.div>
        </div>
    );
};

export default StudentDashboard;
