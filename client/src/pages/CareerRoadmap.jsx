import React, { useState } from 'react';
import API from '../services/api';
import { 
  Map, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Briefcase, 
  Award, 
  BookOpen, 
  Layers,
  ArrowRight
} from 'lucide-react';

export default function CareerRoadmap() {
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [currentSkills, setCurrentSkills] = useState('React, JavaScript, HTML/CSS');
  const [experience, setExperience] = useState('2');

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRoadmap(null);

    try {
      const res = await API.post('/roadmap', {
        targetRole,
        currentSkills,
        experience
      });

      if (res.data.success) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate career roadmap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold">
          <Map className="w-4 h-4 text-fuchsia-400" />
          <span>AI Career Growth Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Personalized Career Roadmap</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Tailored learning path timelines, project ideas, required technology stacks, certifications, and free resources.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Input Configuration Panel */}
      <div className="glass-panel p-8 rounded-3xl space-y-6 border-fuchsia-500/20 shadow-2xl">
        <h2 className="text-xl font-bold border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-fuchsia-400" />
          <span>Define Your Career Goals</span>
        </h2>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Target Role</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                placeholder="e.g. Lead DevOps Engineer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Current Technical Skills</label>
              <input
                type="text"
                required
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                placeholder="e.g. JS, React, SQL"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Years of Experience</label>
              <input
                type="number"
                min="0"
                max="25"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-500 text-white font-semibold text-base shadow-lg shadow-fuchsia-500/25 hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Map className="w-5 h-5" />
                <span>Generate Customized Roadmap</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* ROADMAP RESULTS DISPLAY */}
      {roadmap && (
        <div className="glass-panel p-8 rounded-3xl space-y-10 border-fuchsia-500/30 shadow-2xl animate-fadeIn">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">Career Strategy</span>
              <h2 className="text-2xl font-bold">{roadmap.targetRole} Blueprint</h2>
            </div>
            <div className="flex items-center space-x-3 bg-slate-900 px-5 py-3 rounded-2xl border border-slate-800">
              <Clock className="w-6 h-6 text-fuchsia-400" />
              <div>
                <div className="text-sm font-bold text-slate-100">{roadmap.estimatedTimeframe || '6 Months'}</div>
                <div className="text-[10px] text-slate-400">Estimated Timeline</div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Learning Path */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Step-by-Step Learning Path</span>
            </h3>

            <div className="space-y-4">
              {roadmap.learningPath?.map((phase, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl space-y-3 border-slate-800 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">{phase.phase}</span>
                    <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 font-mono">{phase.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {phase.topics?.map((topic, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold pt-1 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Milestone Goal: {phase.milestone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Projects & Technologies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border-indigo-500/20">
              <h3 className="text-base font-bold text-indigo-300 flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Hands-On Portfolio Projects</span>
              </h3>
              <div className="space-y-3">
                {roadmap.projects?.map((proj, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="text-sm font-bold text-slate-100">{proj.name}</div>
                    <p className="text-xs text-slate-400">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3 border-cyan-500/20">
              <h3 className="text-base font-bold text-cyan-300 flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Key Tech & Certifications</span>
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400">Target Tech Stack:</div>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.technologies?.map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400">Certifications:</div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {roadmap.certifications?.map((cert, i) => (
                      <li key={i}>• {cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Free Learning Resources */}
          <div className="glass-card p-6 rounded-2xl space-y-3 border-fuchsia-500/20">
            <h3 className="text-base font-bold text-fuchsia-300 flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Recommended Free Learning Resources</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roadmap.freeResources?.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-fuchsia-500/40 text-xs font-semibold text-slate-200 flex items-center justify-between group"
                >
                  <span>{res.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-fuchsia-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
