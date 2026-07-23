import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  Users, 
  Code2, 
  FileText, 
  Map, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  ArrowRight,
  Sparkles,
  User as UserIcon,
  Activity,
  Calendar,
  FileCheck,
  Zap,
  CheckSquare,
  HelpCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/stats');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load personal dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-sm text-slate-400 font-mono">Loading user dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm max-w-md mx-auto">
          {error}
        </div>
        <Link to="/login" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold inline-block">
          Sign In to Access Dashboard
        </Link>
      </div>
    );
  }

  const profile = data?.userProfile || { name: user?.name || 'Candidate', email: user?.email || '', joinDate: 'Today', lastLogin: 'Today' };
  const stats = data?.interviewStats || { totalMockInterviews: 0, totalHRInterviews: 0, totalTechnicalInterviews: 0, totalQuestionsAnswered: 0, totalQuestionsSkipped: 0 };
  const perf = data?.performance || { averageMockScore: 0, averageHRScore: 0, averageTechnicalScore: 0, bestScore: 0, latestScore: 0 };
  const coding = data?.codingStats || { problemsAttempted: 0, problemsSolved: 0, totalTestCasesPassed: 0, languagesUsed: [] };
  const resume = data?.resume || { resumeUploaded: false, resumeAnalysisHistory: [] };
  const roadmap = data?.careerRoadmap || { generatedRoadmapsCount: 0, latestCareerGoal: 'Software Engineer' };
  const activities = data?.recentActivity || [];
  const isNewUser = data?.isNewUser || activities.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Header Profile Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-indigo-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-300">
              <UserIcon className="w-8 h-8" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Candidate Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Welcome, {profile.name}!</h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {profile.email} • Joined: {profile.joinDate} • Last Login: {profile.lastLogin}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/mock-interview"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-xs shadow-md flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Practice</span>
          </Link>
        </div>
      </div>

      {/* NEW USER WELCOME STATE */}
      {isNewUser ? (
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border-indigo-500/20">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Bot className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">No interviews completed yet</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            As you complete Mock Interviews, HR rounds, technical challenges, and resume audits, your personal progress stats will automatically populate here.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link to="/mock-interview" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
              Take First Mock Interview
            </Link>
            <Link to="/technical-interview" className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700">
              Solve Technical Problem
            </Link>
          </div>
        </div>
      ) : null}

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl space-y-2 border-indigo-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Interview Sessions</span>
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100">
            {stats.totalMockInterviews + stats.totalHRInterviews + stats.totalTechnicalInterviews}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Mock: {stats.totalMockInterviews} | HR: {stats.totalHRInterviews} | Tech: {stats.totalTechnicalInterviews}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-2 border-emerald-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Performance Ratings</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-300">
            {perf.bestScore}% <span className="text-xs text-slate-400 font-normal">Best</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Avg Mock: {perf.averageMockScore}% | Avg HR: {perf.averageHRScore}%
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-2 border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Coding Metrics</span>
            <Code2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-300">
            {coding.problemsSolved} / {coding.problemsAttempted}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Solved | Total Passed Cases: {coding.totalTestCasesPassed}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-2 border-purple-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Questions Handled</span>
            <CheckSquare className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-300">
            {stats.totalQuestionsAnswered}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Answered | Skipped: {stats.totalQuestionsSkipped}
          </div>
        </div>
      </div>

      {/* DETAILED STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Activity Feed */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>Personal Recent Activity</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{activities.length} Recorded</span>
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">No activity recorded for this user yet.</div>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="glass-card p-4 rounded-2xl flex items-center justify-between border border-slate-800">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-300">{act.type}</div>
                    <div className="text-sm font-semibold text-slate-100">{act.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{act.date}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                      Score: {act.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Resume & Career Roadmap Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Resume ATS Status Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border-amber-500/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center space-x-2 text-amber-300">
                <FileText className="w-4 h-4" />
                <span>Resume ATS Status</span>
              </h3>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                resume.resumeUploaded ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {resume.resumeUploaded ? 'Uploaded' : 'Not Uploaded'}
              </span>
            </div>

            {resume.resumeAnalysisHistory && resume.resumeAnalysisHistory.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {resume.resumeAnalysisHistory.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl glass-card flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-semibold">{h.targetRole}</div>
                      <div className="text-[10px] text-slate-400">{h.date}</div>
                    </div>
                    <div className="text-amber-300 font-bold">{h.atsScore}/100</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No resume analysis history generated yet.</p>
            )}

            <Link to="/resume-analyzer" className="block text-center py-2.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20">
              Upload Resume for ATS Audit
            </Link>
          </div>

          {/* Career Roadmap Status Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border-cyan-500/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center space-x-2 text-cyan-300">
                <Map className="w-4 h-4" />
                <span>Career Goal Roadmap</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">{roadmap.generatedRoadmapsCount} Created</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Target Goal</div>
              <div className="text-base font-bold text-slate-100">{roadmap.latestCareerGoal}</div>
            </div>

            <Link to="/career-roadmap" className="block text-center py-2.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold hover:bg-cyan-500/20">
              Generate AI Career Roadmap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
