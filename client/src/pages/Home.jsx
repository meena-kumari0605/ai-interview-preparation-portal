import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Users, 
  Code2, 
  FileText, 
  Map, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  BarChart3 
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Bot,
      title: "AI Mock Interviews",
      description: "Role-specific AI interviewer asks realistic questions one-by-one and evaluates communication, confidence, completeness, professionalism, and relevance.",
      link: "/mock-interview",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Users,
      title: "HR Behavioral Interviews",
      description: "Master leadership, teamwork, clarity, and situational conflict resolution questions evaluated across 7 key HR dimensions.",
      link: "/hr-interview",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Code2,
      title: "Technical Code Sandbox",
      description: "Solve algorithmic coding problems in JS, Python, C++, and Java. Run code against test cases with time & space complexity execution metrics.",
      link: "/technical-interview",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: FileText,
      title: "ATS Resume Analyzer",
      description: "Upload PDF or DOCX resumes for instant ATS score audits, missing keywords identification, skill analysis, and project suggestions.",
      link: "/resume-analyzer",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Map,
      title: "Personalized Career Roadmap",
      description: "Generate tailored step-by-step career growth paths, required technologies, project ideas, certifications, and free learning resources.",
      link: "/career-roadmap",
      color: "from-fuchsia-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Track progress, average scores, recent interview history, and strengths & weaknesses in your personalized candidate dashboard.",
      link: "/dashboard",
      color: "from-violet-500 to-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border-indigo-500/30 text-indigo-300 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Next-Generation AI Interview Coaching Portal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Ace Your Next Tech Interview with <span className="gradient-text-indigo">AI Intelligence</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Practice realistic AI mock interviews, execute code against test cases, optimize your resume for ATS parsers, and accelerate your career path.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/mock-interview"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Free AI Mock Interview</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-slate-200 font-semibold text-base hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
            >
              <span>View Dashboard</span>
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
            {[
              { label: 'AI Evaluation Speed', value: '< 2 Seconds' },
              { label: 'ATS Score Accuracy', value: '98.5%' },
              { label: 'Code Execution Engine', value: '4 Languages' },
              { label: 'Evaluation Metrics', value: '12 Dimensions' }
            ].map((stat, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl text-center border-slate-800">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Complete <span className="gradient-text-emerald">End-to-End</span> Interview Suite
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything you need to prepare, practice, and succeed in modern technical and HR interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl space-y-4 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 shadow-lg shadow-indigo-500/10`}>
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <Link
                  to={feature.link}
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 pt-2"
                >
                  <span>Explore Feature</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl space-y-8 border-indigo-500/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Enterprise Ready</span>
              <h3 className="text-3xl font-bold">Built for Scale with Express, React & Docker</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                InterviewAI is built following clean MVC software engineering standards. Equipped with independent AI prompts per endpoint, JWT secure authentication, Docker containerization, and AWS App Runner compatibility.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {['MVC Architecture', 'Docker Containerized', 'JWT Auth Security', 'Multi-Language Runner'].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-96 glass-card p-6 rounded-2xl space-y-4 border-slate-700/60">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-semibold text-slate-400">LIVE SYSTEM STATUS</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  HEALTHY
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div>[GET] /api/health → 200 OK</div>
                <div>[POST] /api/mock-interview → Evaluated</div>
                <div>[POST] /api/technical → Passed Test Suite</div>
                <div>[POST] /api/resume → ATS Analyzed</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
