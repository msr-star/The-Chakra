import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AssessmentPage from './pages/AssessmentPage';
import ResultPage from './pages/ResultPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import RootVerifyPage from './pages/RootVerifyPage';
import AboutPage from './pages/AboutPage';
import CareerResourcesPage from './pages/CareerResourcesPage';

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // Safely parse user to avoid JSON parse errors on empty/invalid string
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

import Footer from './components/Footer';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-shell min-h-screen text-white overflow-x-hidden flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
          <div className="app-shell__grid" />
          <div className="app-shell__orb app-shell__orb--one" />
          <div className="app-shell__orb app-shell__orb--two" />
          <CustomCursor />
          <Navbar />
          <main className="flex-grow relative z-10">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
