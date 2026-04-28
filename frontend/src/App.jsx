import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import NeuralLoader from './components/NeuralLoader';
import Footer from './components/Footer';

// Lazy-loaded pages — each page is loaded only when the user navigates to it
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const RootVerifyPage = lazy(() => import('./pages/RootVerifyPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CareerResourcesPage = lazy(() => import('./pages/CareerResourcesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// QueryClient with production-grade defaults
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 2,
            refetchOnWindowFocus: false,
        },
    },
});

// Full-screen loader shown while lazy pages are being fetched
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#120803' }}>
        <NeuralLoader />
    </div>
);

const AnimatedRoutes = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    // Safely parse user to avoid JSON parse errors on empty/invalid string
    let user = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (_e) {
        user = null;
    }

    const isAuthenticated = !!token;
    const isAdmin = user?.role === 'ADMIN';

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/resources" element={<CareerResourcesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/root-verify" element={<RootVerifyPage />} />

                {/* Protected Routes */}
                <Route path="/student" element={isAuthenticated && !isAdmin ? <StudentDashboard /> : <Navigate to="/login" />} />
                <Route path="/assessment" element={isAuthenticated && !isAdmin ? <AssessmentPage /> : <Navigate to="/login" />} />
                <Route path="/results" element={isAuthenticated && !isAdmin ? <ResultPage /> : <Navigate to="/login" />} />
                <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <ErrorBoundary>
                    <div className="min-h-screen text-white overflow-x-hidden flex flex-col"
                        style={{ background: '#120803', fontFamily: 'Inter, sans-serif' }}>
                        <Navbar />
                        <ScrollToTop />
                        <main className="flex-grow">
                            <Suspense fallback={<PageLoader />}>
                                <AnimatedRoutes />
                            </Suspense>
                        </main>
                        <Footer />
                    </div>
                </ErrorBoundary>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
