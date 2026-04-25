import React, { useState } from 'react';
import { adminAPI, assessmentAPI } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, PlusCircle, Users, BookOpen, Activity, ShieldCheck, UserCheck, Mail, Send, X, Zap } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const careerMapping = {
    'Logic': ['Backend Software Engineer', 'Database Administrator', 'Systems Architect'],
    'Creativity': ['UI/UX Designer', 'Frontend Developer', 'Motion Graphics Artist'],
    'Structure': ['DevOps Engineer', 'Infrastructure Specialist', 'QA Lead'],
    'Empathy': ['Product Manager', 'Scrum Master', 'Developer Evangelist'],
    'Vision': ['Product Strategist', 'Enterprise Architect', 'CTO'],
    'Detail': ['Data Scientist', 'Machine Learning Engineer', 'Security Analyst'],
};

const TabButton = ({ id, label, icon: TabIcon, activeTab, setActiveTab }) => (
    <button
        onClick={() => {
            setActiveTab(id);
        }}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === id ? 'bg-accentLight text-background' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
        <TabIcon size={16} /> {label}
    </button>
);

const AdminDashboard = () => {
    const [questionText, setQuestionText] = useState('');
    const [category, setCategory] = useState('');
    const [weightage, setWeightage] = useState('');
    const [options, setOptions] = useState([{ text: '', score: '' }, { text: '', score: '' }]);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('questions');
    const [generatingQuestion, setGeneratingQuestion] = useState(false);
    const queryClient = useQueryClient();

    // ── Mentorship State ──
    const [taskModalStudent, setTaskModalStudent] = useState(null); // student to send task to
    const [taskTitle, setTaskTitle] = useState('');
    const [taskContent, setTaskContent] = useState('');
    const [taskUrl, setTaskUrl] = useState('');
    const [mentorMsg, setMentorMsg] = useState('');

    const { data: questionsList = [] } = useQuery({
        queryKey: ['questions'],
        queryFn: async () => {
            const res = await assessmentAPI.getQuestions();
            return res.data;
        }
    });

    const { data: stats } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const res = await adminAPI.getStats();
            return res.data;
        },
        refetchInterval: 15000
    });

    const { data: students = [], refetch: refetchStudents } = useQuery({
        queryKey: ['studentsList'],
        queryFn: async () => {
            const res = await adminAPI.getStudents();
            return res.data;
        }
    });

    // We will call refetchStudents when the 'students' tab is selected
    React.useEffect(() => {
        if (activeTab === 'students' || activeTab === 'mentorship') {
            refetchStudents();
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
        }
    }, [activeTab, refetchStudents, queryClient]);

    // ── Mentorship mutations ──
    const adminUser = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

    const assignMutation = useMutation({
        mutationFn: (studentId) => adminAPI.assignStudent(studentId),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['studentsList'] }); setMentorMsg('Student assigned! ✅'); },
        onError: () => setMentorMsg('Error assigning student.'),
    });

    const unassignMutation = useMutation({
        mutationFn: (studentId) => adminAPI.unassignStudent(studentId),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['studentsList'] }); setMentorMsg('Student unassigned.'); },
    });

    const sendEmailMutation = useMutation({
        mutationFn: (studentId) => adminAPI.sendMentorEmail(studentId),
        onSuccess: () => setMentorMsg('Mentor welcome email sent! 📧'),
        onError: () => setMentorMsg('Failed to send email.'),
    });

    const sendTaskMutation = useMutation({
        mutationFn: ({ studentId, data }) => adminAPI.sendTask(studentId, data),
        onSuccess: () => {
            setMentorMsg('Task sent successfully! 📋');
            setTaskModalStudent(null);
            setTaskTitle(''); setTaskContent(''); setTaskUrl('');
        },
        onError: () => setMentorMsg('Failed to send task.'),
    });

    const handleSendTask = (e) => {
        e.preventDefault();
        if (!taskTitle.trim() || !taskContent.trim()) return;
        sendTaskMutation.mutate({ studentId: taskModalStudent.id, data: { title: taskTitle, content: taskContent, resourceUrl: taskUrl || null } });
    };

    const deleteQuestionMutation = useMutation({
        mutationFn: (questionId) => adminAPI.deleteQuestion(questionId),
        onMutate: async (questionId) => {
            await queryClient.cancelQueries({ queryKey: ['questions'] });
            const previousQuestions = queryClient.getQueryData(['questions']) || [];
            queryClient.setQueryData(['questions'], (old = []) => old.filter(q => q.id !== questionId));
            return { previousQuestions };
        },
        onError: (_err, _questionId, context) => {
            queryClient.setQueryData(['questions'], context?.previousQuestions);
            setMessage('Error deleting question. Please try again.');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
        onSuccess: () => {
            setMessage('Question deleted successfully.');
        },
    });

    const handleDeleteQuestion = (questionId) => {
        if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
            deleteQuestionMutation.mutate(questionId);
        }
    };

    const createQuestionMutation = useMutation({
        mutationFn: async (newQuestionData) => {
            const qRes = await adminAPI.createQuestion({
                text: newQuestionData.text,
                category: newQuestionData.category,
                weightage: parseFloat(newQuestionData.weightage)
            });
            const qId = qRes.data.id;
            for (const opt of newQuestionData.options) {
                if (opt.text && opt.score) {
                    await adminAPI.addOption(qId, {
                        optionText: opt.text,
                        scoreValue: parseFloat(opt.score)
                    });
                }
            }
            return { ...qRes.data, options: newQuestionData.options };
        },
        onMutate: async (newQuestionData) => {
            await queryClient.cancelQueries({ queryKey: ['questions'] });
            const previousQuestions = queryClient.getQueryData(['questions']) || [];
            const optimisticQuestion = {
                id: 'temp-' + Date.now(),
                text: newQuestionData.text,
                category: newQuestionData.category,
                weightage: newQuestionData.weightage,
                options: newQuestionData.options.map(opt => ({ optionText: opt.text, scoreValue: parseFloat(opt.score) })),
                status: 'saving'
            };
            queryClient.setQueryData(['questions'], (old = []) => [optimisticQuestion, ...old]);
            return { previousQuestions };
        },
        onError: (err, newQuestionData, context) => {
            queryClient.setQueryData(['questions'], context?.previousQuestions);
            setMessage("Error saving question. Please try again.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
        onSuccess: () => {
            setMessage("Question saved successfully!");
            setQuestionText('');
            setCategory('');
            setWeightage('');
            setOptions([{ text: '', score: '' }, { text: '', score: '' }]);
        }
    });

    const handleCreateQuestion = (e) => {
        e.preventDefault();
        setMessage('');
        createQuestionMutation.mutate({ text: questionText, category, weightage, options });
    };

    const updateOption = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index][field] = value;
        setOptions(newOptions);
    };

    const handleAIGenerateQuestion = () => {
        if (!category) {
            setMessage('Please enter a Category first (e.g., Logic) to generate a question.');
            return;
        }
        setGeneratingQuestion(true);
        // Simulate API call to ChakraAI Model
        setTimeout(() => {
            setQuestionText(`Which of the following approaches is most optimal for solving a complex ${category.toLowerCase()} problem?`);
            setWeightage('1.5');
            setOptions([
                { text: 'Iterative refinement and testing', score: '5' },
                { text: 'Ignoring constraints and building quickly', score: '1' },
                { text: 'Delegating without understanding', score: '0' },
                { text: 'Analyzing requirements thoroughly first', score: '4' }
            ]);
            setGeneratingQuestion(false);
            setMessage('✨ ChakraAI generated a new question based on your category!');
        }, 2000);
    };

    const addOptionField = () => {
        setOptions([...options, { text: '', score: '' }]);
    };

    return (
        <PageTransition>
        <div className="min-h-screen text-white pt-32 pb-16 px-4 md:px-8 max-w-5xl mx-auto space-y-8 flex flex-col items-center" style={{ background: '#120803' }}>

            {/* Header */}
            <div className="w-full text-center space-y-2 mb-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <ShieldCheck size={28} className="text-accentWarm" />
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentWarm to-yellow-300 uppercase tracking-tight">Admin Dashboard</h1>
                </div>
                <p className="text-gray-400 text-sm tracking-widest uppercase">Manage Assessments & Students</p>
            </div>

            {/* Stats Row */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-6 rounded-3xl">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Users size={16} className="text-gray-400" />
                            <div className="text-xs text-gray-400 uppercase tracking-widest">Total Students</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-3xl">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <BookOpen size={16} className="text-gray-400" />
                            <div className="text-xs text-gray-400 uppercase tracking-widest">Questions</div>
                        </div>
                        <div className="text-3xl font-bold text-accentWarm">{questionsList.length}</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="glass-panel p-6 rounded-3xl">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Activity size={16} className="text-gray-400" />
                            <div className="text-xs text-gray-400 uppercase tracking-widest">Engagement</div>
                        </div>
                        <div className="text-3xl font-bold text-[#FF9D00]">
                            {stats.totalUsers > 0 ? Math.min(100, Math.round((questionsList.length / stats.totalUsers) * 25)) : 0}%
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <ShieldCheck size={16} className="text-gray-400" />
                            <div className="text-xs text-gray-400 uppercase tracking-widest">System Health</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xl font-bold text-emerald-400 tracking-wider">ONLINE</span>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 w-full p-1 glass-panel rounded-2xl flex-wrap">
                <TabButton id="questions" label="Assessment Questions" icon={BookOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton id="students" label="Registered Students" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton id="recommendations" label="Career Recommendations" icon={Activity} activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton id="mentorship" label="Mentorship" icon={UserCheck} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Tab: Create & Manage Questions */}
            {activeTab === 'questions' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-8">
                    {/* Create Question Form */}
                    <div className="glass-panel w-full p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 w-full max-w-sm">
                            <button
                                type="button"
                                onClick={handleAIGenerateQuestion}
                                disabled={generatingQuestion}
                                className="w-full py-3 bg-[#FF5A00]/10 border border-[#FF5A00]/30 text-[#FF5A00] hover:bg-[#FF5A00]/20 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2 group"
                            >
                                {generatingQuestion ? (
                                    <>
                                        <span className="animate-spin"><Zap size={16} /></span> Generating with ChakraAI...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={16} className="group-hover:scale-110 transition-transform" /> ChakraAI Auto-Draft
                                    </>
                                )}
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
                            <PlusCircle size={22} className="text-accentWarm" /> Create New Question
                        </h2>
                        <p className="text-sm text-gray-500 mb-6 max-w-lg">Add a new assessment question manually or use ChakraAI to auto-draft options based on a category.</p>

                        {message && (
                            <div className={`mb-6 p-4 rounded-xl border text-sm font-medium ${message.includes('Error') ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-accentLight/10 text-accentLight border-accentLight/30'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleCreateQuestion} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Question Text *</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Enter the assessment question here..."
                                    className="w-full bg-[#1A0B05] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-accentLight transition-colors resize-none"
                                    value={questionText}
                                    onChange={e => setQuestionText(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Category *
                                        <span className="ml-2 text-xs text-gray-600">(e.g. Logic, Creativity, Empathy)</span>
                                    </label>
                                    <input
                                        type="text" required
                                        placeholder="e.g. Logic"
                                        className="w-full bg-[#1A0B05] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accentLight transition-colors"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Weightage (Score Multiplier) *</label>
                                    <input
                                        type="number" step="0.1" required
                                        placeholder="e.g. 1.0"
                                        className="w-full bg-[#1A0B05] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accentLight transition-colors"
                                        value={weightage}
                                        onChange={e => setWeightage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Answer Options</h3>

                                {options.map((opt, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <span className="text-gray-600 text-sm w-6 text-center">{String.fromCharCode(65 + index)}.</span>
                                        <div className="flex-1">
                                            <input
                                                type="text" placeholder="Option text" required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accentWarm transition-colors"
                                                value={opt.text}
                                                onChange={e => updateOption(index, 'text', e.target.value)}
                                            />
                                        </div>
                                        <div className="w-28">
                                            <input
                                                type="number" placeholder="Score" required step="0.1"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accentWarm transition-colors"
                                                value={opt.score}
                                                onChange={e => updateOption(index, 'score', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addOptionField}
                                    className="text-sm text-accentLight hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <PlusCircle size={14} /> Add another option
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={createQuestionMutation.isPending}
                                className="w-full py-4 bg-accentWarm text-white font-bold rounded-xl hover:bg-[#FF8533] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {createQuestionMutation.isPending ? 'Saving...' : 'Save Question'}
                            </button>
                        </form>
                    </div>

                    {/* Questions List */}
                    <div className="glass-panel w-full p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-2 text-white">Assessment Questions ({questionsList.length})</h2>
                        <p className="text-sm text-gray-500 mb-6">All active questions shown to students during assessments.</p>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {!Array.isArray(questionsList) || questionsList.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">No questions created yet. Add your first question above.</div>
                                ) : (
                                    questionsList.map((q) => (
                                        <motion.div
                                            key={q.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className={`p-5 rounded-2xl border ${q.status === 'saving' ? 'bg-white/5 border-dashed border-accentLight/50 opacity-70' : 'bg-black/40 border-white/10 shadow-lg'}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-base font-semibold text-white pr-4 leading-relaxed">{q.text}</h4>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {q.status === 'saving' && (
                                                        <span className="text-xs font-semibold bg-accentLight/20 text-accentLight px-2 py-1 rounded-full animate-pulse whitespace-nowrap">Saving...</span>
                                                    )}
                                                    {q.status !== 'saving' && (
                                                        <button
                                                            onClick={() => handleDeleteQuestion(q.id)}
                                                            disabled={deleteQuestionMutation.isPending}
                                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Delete question"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-3 text-xs text-gray-400">
                                                <span className="bg-white/5 px-2 py-1 rounded-md">Category: <strong className="text-white">{q.category}</strong></span>
                                                <span className="bg-white/5 px-2 py-1 rounded-md">Weight: <strong className="text-white">{q.weightage}</strong></span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Tab: Students */}
            {activeTab === 'students' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel w-full p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold mb-2 text-white">Registered Students ({students.length})</h2>
                    <p className="text-sm text-gray-500 mb-6">All students registered on the platform.</p>

                    {students.length === 0 ? (
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-8 text-center">
                            <p className="text-gray-400 text-sm mb-2">No students registered yet.</p>
                            <p className="text-gray-600 text-xs">Students will appear here after they register on the platform.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-gray-500">
                                    <th className="py-4 px-4 font-normal">Student Name</th>
                                    <th className="py-4 px-4 font-normal">Email / Phone</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-300">
                                <AnimatePresence>
                                    {students.map((student) => (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white">{student.name}</span>
                                                    <span className="text-xs text-gray-600 font-mono">{student.id?.substring(0, 8)}...</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col">
                                                    <span className="text-accentLight">{student.email}</span>
                                                    <span className="text-xs text-gray-500">{student.phoneNumber}</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </motion.div>
            )}

            {/* Tab: Career Recommendations */}
            {activeTab === 'recommendations' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel w-full p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold mb-2 text-white">Career Recommendation Matrix</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        This matrix shows which career paths are recommended based on each assessment category. Students see these recommendations after completing an assessment.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(careerMapping).map(([category, careers], i) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-black/30 border border-white/10 rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-accentLight"></div>
                                    <h3 className="text-lg font-bold text-accentLight">{category}</h3>
                                    <span className="text-xs text-gray-600 ml-auto">Category Score</span>
                                </div>
                                <ul className="space-y-2">
                                    {careers.map((career, idx) => (
                                        <li key={career} className="flex items-center gap-3 text-sm text-gray-300">
                                            <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] flex items-center justify-center text-gray-500 shrink-0">{idx + 1}</span>
                                            {career}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 p-5 rounded-2xl bg-accentWarm/10 border border-accentWarm/20">
                        <p className="text-sm text-accentWarm font-medium mb-1">💡 How this works</p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            When a student completes an assessment, the system calculates weighted scores per category. The category with the highest score determines the student's dominant profile, and the matching career paths above are shown as recommendations on their results page.
                            To customize which careers are shown, modify the assessment question categories to match your desired recommendation categories.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* ── Tab: Mentorship ── */}
            {activeTab === 'mentorship' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">

                    {/* Header */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-3 mb-1">
                            <UserCheck size={22} className="text-accentLight" />
                            <h2 className="text-2xl font-bold text-white">Student Mentorship</h2>
                        </div>
                        <p className="text-gray-400 text-sm">Assign yourself as a mentor, send welcome emails, and deliver daily assignments to your students.</p>

                        {mentorMsg && (
                            <div className={`mt-4 p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${mentorMsg.includes('✅') || mentorMsg.includes('📧') || mentorMsg.includes('📋') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                                {mentorMsg}
                                <button onClick={() => setMentorMsg('')} className="ml-auto"><X size={14} /></button>
                            </div>
                        )}
                    </div>

                    {/* All Students Table */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Users size={18} className="text-gray-400" /> All Students
                        </h3>
                        {students.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-8">No students registered yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {students.map(student => {
                                    const isMyStudent = student.assignedAdminId === adminUser?.id;
                                    const isOthersStudent = student.assignedAdminId && !isMyStudent;
                                    return (
                                        <motion.div
                                            key={student.id}
                                            whileHover={{ scale: 1.005 }}
                                            className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${isMyStudent ? 'bg-accentLight/5 border-accentLight/20' : isOthersStudent ? 'bg-white/3 border-white/5 opacity-60' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accentLight/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-white shrink-0">
                                                    {student.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold text-sm">{student.name}</p>
                                                    <p className="text-gray-500 text-xs">{student.email}</p>
                                                    {student.assignedAdminName && (
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${isMyStudent ? 'bg-accentLight/20 text-accentLight' : 'bg-purple-500/20 text-purple-400'}`}>
                                                            {isMyStudent ? '⭐ Your Student' : `👤 Mentor: ${student.assignedAdminName}`}
                                                        </span>
                                                    )}
                                                    {!student.assignedAdminId && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-500">Unassigned</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-wrap justify-end">
                                                {!student.assignedAdminId && (
                                                    <button
                                                        onClick={() => assignMutation.mutate(student.id)}
                                                        disabled={assignMutation.isPending}
                                                        className="text-xs px-4 py-2 bg-accentLight/10 hover:bg-accentLight text-accentLight hover:text-background rounded-xl border border-accentLight/30 font-semibold transition-all"
                                                    >
                                                        + Assign to Me
                                                    </button>
                                                )}
                                                {isMyStudent && (
                                                    <>
                                                        <button
                                                            onClick={() => sendEmailMutation.mutate(student.id)}
                                                            disabled={sendEmailMutation.isPending}
                                                            className="text-xs px-3 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl border border-blue-500/30 flex items-center gap-1.5 font-semibold transition-all"
                                                        >
                                                            <Mail size={12} /> Send Email
                                                        </button>
                                                        <button
                                                            onClick={() => { setTaskModalStudent(student); setMentorMsg(''); }}
                                                            className="text-xs px-3 py-2 bg-[#F5A623]/10 hover:bg-[#F5A623] text-[#F5A623] hover:text-white rounded-xl border border-[#F5A623]/30 flex items-center gap-1.5 font-semibold transition-all"
                                                        >
                                                            <Send size={12} /> Send Task
                                                        </button>
                                                        <button
                                                            onClick={() => unassignMutation.mutate(student.id)}
                                                            className="text-xs px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 font-semibold transition-all"
                                                        >
                                                            Unassign
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* ── Task Modal ── */}
            <AnimatePresence>
                {taskModalStudent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setTaskModalStudent(null); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#120803] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Send size={18} className="text-[#FF5A00]" /> Send Daily Task</h3>
                                    <p className="text-gray-500 text-sm mt-1">To: <span className="text-white font-medium">{taskModalStudent.name}</span> ({taskModalStudent.email})</p>
                                </div>
                                <button onClick={() => setTaskModalStudent(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    <X size={18} className="text-gray-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSendTask} className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Task Title *</label>
                                    <input
                                        type="text" required
                                        placeholder="e.g. Day 1: Set up your development environment"
                                        value={taskTitle}
                                        onChange={e => setTaskTitle(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-400 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Task Instructions *</label>
                                    <textarea
                                        required rows={4}
                                        placeholder="Describe what the student should do today in detail..."
                                        value={taskContent}
                                        onChange={e => setTaskContent(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Resource Link <span className="text-gray-600">(optional)</span></label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/resource"
                                        value={taskUrl}
                                        onChange={e => setTaskUrl(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-400 transition-colors"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sendTaskMutation.isPending}
                                    className="w-full py-3 bg-gradient-to-r from-[#FF5A00] to-accentLight text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                >
                                    {sendTaskMutation.isPending ? 'Sending...' : <><Send size={16} /> Send Task to Student</>}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
        </PageTransition>
    );
};

export default AdminDashboard;
