import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MockInterview from './pages/MockInterview';
import HRInterview from './pages/HRInterview';
import TechnicalInterview from './pages/TechnicalInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CareerRoadmap from './pages/CareerRoadmap';
import Profile from './pages/Profile';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/mock-interview" element={<MockInterview />} />
                <Route path="/hr-interview" element={<HRInterview />} />
                <Route path="/technical-interview" element={<TechnicalInterview />} />
                <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
                <Route path="/career-roadmap" element={<CareerRoadmap />} />
                <Route path="/profile" element={<Profile />} />

                {/* ONLY Dashboard requires authentication */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <footer className="border-t border-slate-800/80 glass-panel py-8 text-center text-xs text-slate-400">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>InterviewAI – AI Powered Interview Preparation Portal</div>
                <div>Designed with Dark & Light Glassmorphism aesthetics</div>
              </div>
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
