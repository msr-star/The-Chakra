import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import ResultDashboard from '../components/ResultDashboard';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const ResultPage = () => {
    const location = useLocation();
    const { result } = location.state || {};

    if (!result) {
        return <Navigate to="/student" />;
    }

    return (
        <PageTransition>
        <div className="min-h-screen pt-32 pb-16 px-4 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accentWarm/5 via-background to-background pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4 z-10"
            >
                <span className="px-4 py-1.5 rounded-full bg-accentLight/10 border border-accentLight/30 text-accentLight text-xs font-semibold uppercase tracking-widest">
                    Assessment Complete
                </span>
            </motion.div>

            <ResultDashboard result={result} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-12 z-10 flex gap-4 flex-wrap justify-center"
            >
                <Link
                    to="/assessment"
                    className="px-8 py-3 rounded-full bg-accentLight/10 border border-accentLight/30 hover:bg-accentLight/20 text-accentLight transition-colors text-sm font-medium tracking-wide"
                >
                    Take Another Assessment
                </Link>
                <Link
                    to="/student"
                    className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium tracking-wide"
                >
                    Return to Dashboard
                </Link>
            </motion.div>
        </div>
        </PageTransition>
    );
};

export default ResultPage;
