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

// ── ChakraAI Question Bank: unique questions per category ──
const AI_QUESTION_BANK = {
    Logic: [
        { text: 'Which approach best solves a complex algorithmic problem?', options: [{ text: 'Break it into smaller sub-problems', score: '5' }, { text: 'Trial and error without planning', score: '1' }, { text: 'Copy a similar solution without understanding', score: '0' }, { text: 'Analyze constraints, then design step-by-step', score: '4' }] },
        { text: 'When debugging a critical system failure, what is your first step?', options: [{ text: 'Reproduce the issue in isolation', score: '5' }, { text: 'Restart everything and hope it fixes', score: '1' }, { text: 'Check recent changes for root cause', score: '4' }, { text: 'Ignore it and move forward', score: '0' }] },
        { text: 'How do you evaluate the efficiency of an algorithm?', options: [{ text: 'Time and space complexity analysis', score: '5' }, { text: 'Run it once and guess', score: '1' }, { text: 'Compare with known benchmarks', score: '4' }, { text: 'Ask a colleague', score: '2' }] },
        { text: 'What is the best way to design a scalable backend system?', options: [{ text: 'Plan for modularity and horizontal scaling', score: '5' }, { text: 'Build everything in one monolith quickly', score: '2' }, { text: 'Use microservices where appropriate', score: '4' }, { text: 'Ignore scalability until it becomes a problem', score: '0' }] },
    ],
    Creativity: [
        { text: 'When designing a new user interface, what is most important?', options: [{ text: 'Aesthetics that delight the user', score: '4' }, { text: 'Functionality over appearance always', score: '2' }, { text: 'Balance of beauty and usability', score: '5' }, { text: 'Copy what competitors have done', score: '1' }] },
        { text: 'How do you come up with innovative product ideas?', options: [{ text: 'Observe real user pain points deeply', score: '5' }, { text: 'Brainstorm without constraints first', score: '4' }, { text: 'Stick to what has worked before', score: '1' }, { text: 'Wait for inspiration to strike', score: '2' }] },
        { text: 'What role does prototyping play in the creative process?', options: [{ text: 'Essential for testing ideas quickly', score: '5' }, { text: 'Skip it and build final product directly', score: '0' }, { text: 'Useful only for big projects', score: '2' }, { text: 'Helps visualize before committing resources', score: '4' }] },
        { text: 'How do you handle creative blocks?', options: [{ text: 'Seek diverse inspiration outside your field', score: '5' }, { text: 'Force yourself to produce something anyway', score: '3' }, { text: 'Take a break and reset your mind', score: '4' }, { text: 'Give up on the creative task', score: '0' }] },
    ],
    Empathy: [
        { text: 'A team member is struggling with their workload. What do you do?', options: [{ text: 'Offer to help and redistribute tasks fairly', score: '5' }, { text: 'Ignore it, everyone has their own job', score: '0' }, { text: 'Report it to the manager immediately', score: '2' }, { text: 'Check in privately and support them', score: '4' }] },
        { text: 'How do you gather feedback from users most effectively?', options: [{ text: 'Conduct interviews and observe real usage', score: '5' }, { text: 'Send a quick survey and move on', score: '2' }, { text: 'Assume you know what users want', score: '0' }, { text: 'Combine surveys, interviews, and analytics', score: '4' }] },
        { text: 'What is the best way to handle a conflict within a team?', options: [{ text: 'Address it openly with all parties', score: '5' }, { text: 'Let it resolve itself over time', score: '1' }, { text: 'Side with the senior person always', score: '0' }, { text: 'Facilitate a structured discussion', score: '4' }] },
        { text: 'How do you build trust with stakeholders?', options: [{ text: 'Deliver consistently and communicate proactively', score: '5' }, { text: 'Only report successes, hide failures', score: '0' }, { text: 'Promise everything, figure it out later', score: '1' }, { text: 'Set realistic expectations and meet them', score: '4' }] },
    ],
    Structure: [
        { text: 'How do you approach setting up a CI/CD pipeline?', options: [{ text: 'Automate builds, tests, and deployments end-to-end', score: '5' }, { text: 'Deploy manually, pipelines are overkill', score: '0' }, { text: 'Set up basic automation and iterate', score: '4' }, { text: 'Use whatever tool the team already knows', score: '2' }] },
        { text: 'What is the most important aspect of infrastructure reliability?', options: [{ text: 'Redundancy and failover planning', score: '5' }, { text: 'Keeping costs as low as possible', score: '2' }, { text: 'Using the latest technologies', score: '1' }, { text: 'Monitoring and alerting on key metrics', score: '4' }] },
        { text: 'How do you ensure software quality throughout a project?', options: [{ text: 'Write tests at every stage of development', score: '5' }, { text: 'Test only at the end before release', score: '1' }, { text: 'Rely on user feedback after launch', score: '0' }, { text: 'Code reviews and automated testing', score: '4' }] },
        { text: 'When onboarding a new system, what is your first priority?', options: [{ text: 'Understand the architecture and data flow', score: '5' }, { text: 'Start making changes immediately', score: '0' }, { text: 'Read existing documentation thoroughly', score: '4' }, { text: 'Ask teammates for a quick overview', score: '2' }] },
    ],
    Vision: [
        { text: 'How do you define a compelling product vision?', options: [{ text: 'Align user needs with long-term business goals', score: '5' }, { text: 'Follow what the market leader is doing', score: '1' }, { text: 'Focus only on the next quarter', score: '2' }, { text: 'Build a 3-year roadmap with flexibility', score: '4' }] },
        { text: 'What is the best strategy for entering a competitive market?', options: [{ text: 'Find an underserved niche and own it', score: '5' }, { text: 'Copy the leading product at a lower price', score: '1' }, { text: 'Differentiate on a unique value proposition', score: '4' }, { text: 'Wait for the market to mature', score: '0' }] },
        { text: 'How do you prioritize features on a product roadmap?', options: [{ text: 'Impact vs. effort matrix with user value', score: '5' }, { text: 'Add whatever stakeholders request', score: '1' }, { text: 'Focus on highest user demand first', score: '4' }, { text: 'Prioritize features that are easiest to build', score: '2' }] },
        { text: 'How do you measure the success of a product strategy?', options: [{ text: 'KPIs aligned to user outcomes and revenue', score: '5' }, { text: 'Number of features shipped', score: '1' }, { text: 'Customer retention and satisfaction scores', score: '4' }, { text: 'Number of press mentions', score: '0' }] },
    ],
    Detail: [
        { text: 'How do you ensure accuracy in a large dataset?', options: [{ text: 'Validate data at every transformation step', score: '5' }, { text: 'Spot-check a few rows and assume the rest is fine', score: '1' }, { text: 'Use automated data quality checks', score: '4' }, { text: 'Trust the source system completely', score: '0' }] },
        { text: 'What is the most critical step when building an ML model?', options: [{ text: 'Clean and understand your training data first', score: '5' }, { text: 'Pick the most complex model available', score: '1' }, { text: 'Define a clear evaluation metric upfront', score: '4' }, { text: 'Train on all available data without filtering', score: '0' }] },
        { text: 'How do you approach security vulnerability analysis?', options: [{ text: 'Threat modeling and penetration testing', score: '5' }, { text: 'Fix issues only when they are exploited', score: '0' }, { text: 'Regular audits and dependency scanning', score: '4' }, { text: 'Rely on the framework to handle security', score: '1' }] },
        { text: 'What is the best way to document technical systems?', options: [{ text: 'Keep docs close to code and update them with changes', score: '5' }, { text: 'Write documentation once and forget it', score: '1' }, { text: 'Use diagrams and written explanations together', score: '4' }, { text: 'Skip documentation, code is self-explanatory', score: '0' }] },
    ],
};

// Tracks which AI questions have been used per category in this session
const usedAIIndices = {};

const getUniqueAIQuestion = (category) => {
    const key = category.trim();
    const bank = AI_QUESTION_BANK[key];
    if (!bank || bank.length === 0) {
        // Fallback for unknown categories
        return {
            text: `Describe your approach to a challenging ${key.toLowerCase()} problem.`,
            options: [
                { text: 'Analyze thoroughly before acting', score: '5' },
                { text: 'Research similar cases first', score: '4' },
                { text: 'Trial and error', score: '2' },
                { text: 'Ask for help immediately', score: '1' },
            ],
        };
    }
    if (!usedAIIndices[key]) usedAIIndices[key] = [];
    let available = bank.map((_, i) => i).filter(i => !usedAIIndices[key].includes(i));
    if (available.length === 0) { usedAIIndices[key] = []; available = bank.map((_, i) => i); }
    const chosen = available[Math.floor(Math.random() * available.length)];
    usedAIIndices[key].push(chosen);
    return bank[chosen];
};

const TabButton = ({ id, label, icon: TabIcon, activeTab, setActiveTab }) => (
    <button
        onClick={() => {
            setActiveTab(id);
        }}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === id ? 'bg-accentLight text-[#120803]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
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

    // ── Assignment Builder State ──
    const [assignmentName, setAssignmentName] = useState('');
    const [questionLimit, setQuestionLimit] = useState('');
    const [draftQuestions, setDraftQuestions] = useState([]); // list of questions queued before saving
    const [savingAssignment, setSavingAssignment] = useState(false);

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
            setMessage('Please enter a Category first (e.g., Logic, Creativity) to generate a question.');
            return;
        }
        setGeneratingQuestion(true);
        setTimeout(() => {
            const generated = getUniqueAIQuestion(category);
            setQuestionText(generated.text);
            setWeightage('1.5');
            setOptions(generated.options);
            setGeneratingQuestion(false);
            setMessage(`✨ ChakraAI generated a unique ${category} question! You can edit it before adding.`);
        }, 1500);
    };

    // Add current form question to the draft queue
    const handleAddToDraft = (e) => {
        e.preventDefault();
        if (!questionText.trim() || !category.trim() || !weightage) {
            setMessage('Please fill in Question Text, Category, and Weightage.');
            return;
        }
        if (questionLimit && draftQuestions.length >= parseInt(questionLimit, 10)) {
            setMessage(`Assignment limit reached: max ${questionLimit} question(s) allowed.`);
            return;
        }
        const draft = { text: questionText, category, weightage, options: [...options] };
        setDraftQuestions(prev => [...prev, draft]);
        setQuestionText(''); setCategory(''); setWeightage('');
        setOptions([{ text: '', score: '' }, { text: '', score: '' }]);
        setMessage(`✅ Question added to assignment draft (${draftQuestions.length + 1}/${questionLimit || '∞'}).`);
    };

    // Save entire assignment (all draft questions) to backend
    const handleSaveAssignment = async () => {
        if (draftQuestions.length === 0) { setMessage('Add at least one question to the assignment first.'); return; }
        setSavingAssignment(true);
        setMessage('');
        try {
            for (const q of draftQuestions) {
                await createQuestionMutation.mutateAsync({ text: q.text, category: q.category, weightage: q.weightage, options: q.options });
            }
            setDraftQuestions([]);
            setAssignmentName('');
            setQuestionLimit('');
            setMessage(`🎉 Assignment "${assignmentName || 'Untitled'}" saved with ${draftQuestions.length} question(s)!`);
        } catch {
            setMessage('Error saving assignment. Please try again.');
        } finally {
            setSavingAssignment(false);
        }
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

                        {/* Assignment Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/3 border border-white/8 mb-2">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Assignment Name <span className="text-gray-600">(optional)</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. Week 1 Logic Assessment"
                                    className="w-full bg-[#1A0B05] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accentLight transition-colors"
                                    value={assignmentName}
                                    onChange={e => setAssignmentName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Question Limit <span className="text-gray-600">(max per assignment)</span></label>
                                <input
                                    type="number" min="1" max="50"
                                    placeholder="e.g. 10  (leave blank for unlimited)"
                                    className="w-full bg-[#1A0B05] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accentLight transition-colors"
                                    value={questionLimit}
                                    onChange={e => setQuestionLimit(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Draft Queue */}
                        {draftQuestions.length > 0 && (
                            <div className="p-4 rounded-2xl bg-accentLight/5 border border-accentLight/20">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-accentLight">📋 Assignment Draft — {draftQuestions.length}/{questionLimit || '∞'} question(s)</p>
                                    <button
                                        type="button"
                                        onClick={handleSaveAssignment}
                                        disabled={savingAssignment}
                                        className="px-4 py-1.5 bg-accentLight text-[#120803] text-xs font-bold rounded-xl hover:bg-[#FF8533] transition-all disabled:opacity-50"
                                    >
                                        {savingAssignment ? 'Saving...' : '💾 Save Assignment'}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {draftQuestions.map((dq, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-white/5">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white font-medium truncate">{i + 1}. {dq.text}</p>
                                                <p className="text-xs text-gray-500">{dq.category} · Weight: {dq.weightage}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setDraftQuestions(prev => prev.filter((_, idx) => idx !== i))}
                                                className="ml-3 p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleAddToDraft} className="space-y-6">
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

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-accentWarm text-white font-bold rounded-xl hover:bg-[#FF8533] transition-colors"
                                >
                                    ➕ Add to Assignment
                                </button>
                                <button
                                    type="button"
                                    onClick={async (e) => { e.preventDefault(); await handleCreateQuestion({ preventDefault: () => {} }); }}
                                    disabled={createQuestionMutation.isPending || !questionText.trim() || !category.trim() || !weightage}
                                    className="px-5 py-4 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors disabled:opacity-40 text-sm"
                                    title="Save this single question directly without adding to draft"
                                >
                                    {createQuestionMutation.isPending ? 'Saving...' : 'Save Single'}
                                </button>
                            </div>
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
