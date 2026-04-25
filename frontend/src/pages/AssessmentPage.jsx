import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChakraCard from '../components/ChakraCard';
import NeuralLoader from '../components/NeuralLoader';
import PageTransition from '../components/PageTransition';
import { assessmentAPI } from '../api';

const AssessmentPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Extract shared element state from BentoGrid card click
    const { layoutId, title, description, color } = location.state || {};

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await assessmentAPI.getQuestions();
                setQuestions(res.data);
            } catch (error) {
                console.error("Failed to load questions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleAnswer = async (optionId) => {
        const currentQ = questions[currentIndex];
        const newAnswers = [...answers, { questionId: currentQ.id, optionId }];
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, 300);
        } else {
            try {
                setLoading(true);
                setSubmitError('');
                const res = await assessmentAPI.submitAssessment(newAnswers);
                navigate('/results', { state: { result: res.data }, replace: true });
            } catch (error) {
                console.error("Failed to submit assessment", error);
                setLoading(false);
                setSubmitError('Failed to submit assessment. Please check your connection and try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24 relative overflow-hidden">
                {layoutId && (
                    <motion.div
                        layoutId={layoutId}
                        className={`absolute inset-0 bg-${color || 'accentLight'}-900/40 z-[-1] pointer-events-none`}
                    />
                )}
                <div className="relative z-10 text-center">
                    <div className="glass-panel p-16 rounded-full border border-white/10 shadow-[0_0_100px_rgba(34,211,238,0.2)] mb-6">
                        <NeuralLoader />
                    </div>
                    <p className="text-gray-400 text-sm">Loading assessment questions...</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24 text-center px-4">
                <div className="glass-panel p-12 rounded-3xl border border-white/10 max-w-md">
                    <div className="text-4xl mb-4">📋</div>
                    <h2 className="text-2xl font-bold text-white mb-3">No Questions Available</h2>
                    <p className="text-gray-400 mb-6">Assessment questions haven't been added yet. Please contact the administrator to set up the assessment.</p>
                    <button onClick={() => navigate('/student')} className="px-6 py-3 rounded-xl bg-accentLight/10 border border-accentLight/30 text-accentLight text-sm hover:bg-accentLight/20 transition-colors">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
        <div className="min-h-screen pt-32 pb-16 px-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accentLight/5 via-background to-background pointer-events-none" />

            {/* Shared Element Header matching the card */}
            {layoutId && (
                <motion.div
                    layoutId={layoutId}
                    className={`absolute inset-0 bg-${color || 'accentLight'}-900/30 backdrop-blur-3xl z-0 pointer-events-none rounded-b-[4rem] h-[40vh] border-b border-white/5 shadow-2xl`}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </motion.div>
            )}

            {/* Title from the card */}
            {title ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 text-center mb-12 max-w-3xl"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">{title} <span className="text-accentLight">Assessment</span></h1>
                    <p className="text-xl text-gray-400 font-light">{description}</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 text-center mb-12 max-w-3xl"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Career <span className="text-accentLight">Assessment</span></h1>
                    <p className="text-xl text-gray-400 font-light">Answer each question honestly to get the most accurate career recommendations.</p>
                </motion.div>
            )}

            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-8 flex items-center gap-4 z-10 relative">
                <div className="text-sm text-accentLight font-medium whitespace-nowrap">
                    Question {currentIndex + 1} of {questions.length}
                </div>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-accentLight to-accentWarm transition-all duration-500 ease-out shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap">
                    {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </div>
            </div>

            <div className="w-full relative min-h-[500px] z-10">
                {/* Inline error message replacing alert() */}
                <AnimatePresence>
                    {submitError && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-6 max-w-2xl mx-auto px-5 py-4 rounded-xl text-sm text-red-300 font-medium text-center"
                            style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)' }}
                        >
                            {submitError}
                            <button onClick={() => setSubmitError('')} className="ml-3 text-red-400 hover:text-red-300 font-bold">✕</button>
                        </motion.div>
                    )}
                </AnimatePresence>
                {questions.map((q, index) => (
                    <div key={q.id} className={index === currentIndex ? 'block' : 'hidden'}>
                        <ChakraCard
                            question={q}
                            isActive={index === currentIndex}
                            onAnswer={handleAnswer}
                        />
                    </div>
                ))}
            </div>
        </div>
        </PageTransition>
    );
};

export default AssessmentPage;
