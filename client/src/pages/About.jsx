import React from 'react';
import { Cpu, ShieldCheck, Database, Code, Server, Layers, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">
          About <span className="gradient-text-indigo">InterviewAI</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          An enterprise-grade AI-powered preparation ecosystem built for software engineers, developers, and tech professionals.
        </p>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold">Frontend Architecture</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Built with React 18, Vite, React Router 6, Tailwind CSS, Lucide icons, and modern Dark Glassmorphism aesthetics for responsive 60fps performance.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold">Backend & Express MVC</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Node.js & Express REST API using traditional MVC architecture. Features JWT authentication, bcrypt password hashing, and Multer file upload stream.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold">Independent AI Services</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Dedicated AI endpoint handlers for Mock Interview, HR Interview, Resume Parsing, Code Evaluation, and Career Roadmaps with zero prompt leakage.
          </p>
        </div>
      </div>

      {/* System Architecture Diagram */}
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <Layers className="w-6 h-6 text-indigo-400" />
          <span>System Architecture & Data Flow</span>
        </h2>
        <div className="bg-slate-950/80 p-6 rounded-2xl font-mono text-xs text-indigo-300 overflow-x-auto border border-slate-800 leading-relaxed">
          <pre>{`[ Client Browser (React + Vite) ]
          │
          ├── (JWT Auth Header) ──► [ Express REST API Gateway ]
                                              │
         ┌────────────────────────────────────┼──────────────────────────────────┐
         │                                    │                                  │
[ POST /api/mock-interview ]     [ POST /api/hr-interview ]      [ POST /api/technical ]
         │                                    │                                  │
[ Google Gemini / AI Engine ]     [ HR Assessment Evaluator ]     [ Code Runner & Test Cases ]
         │                                    │                                  │
         └────────────────────────────────────┼──────────────────────────────────┘
                                              │
                                   [ MongoDB Database Layer ]
                                   (Users, Interviews, Submissions)`}</pre>
        </div>
      </div>

      {/* Deployment Credentials */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-indigo-400" />
          <h3 className="text-lg font-bold">Cloud & Containerization Ready</h3>
        </div>
        <p className="text-slate-300 text-sm">
          InterviewAI ships with multi-stage Docker containerization support (`Dockerfile`, `docker-compose.yml`), making it immediately compatible with AWS App Runner, ECS, Google Cloud Run, or any Kubernetes cluster.
        </p>
      </div>
    </div>
  );
}
