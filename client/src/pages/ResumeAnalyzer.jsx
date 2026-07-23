import React, { useState } from 'react';
import API from '../services/api';
import SpeechToTextButton from '../components/SpeechToTextButton';
import { 
  FileText, 
  UploadCloud, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  Briefcase, 
  Lightbulb, 
  FileCheck
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [resumeText, setResumeText] = useState('');
  const [useTextInput, setUseTextInput] = useState(false);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file && !resumeText.trim()) {
      setError('Please upload a PDF/DOC/DOCX file or paste your resume text.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('targetRole', targetRole);

      if (file && !useTextInput) {
        formData.append('resume', file);
      } else {
        formData.append('resumeText', resumeText);
      }

      const res = await API.post('/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setAnalysis(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume. Please check file format.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechResumeText = (transcriptText) => {
    setResumeText(prev => (prev ? `${prev} ${transcriptText}` : transcriptText));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border-amber-500/30 text-amber-300 text-xs font-semibold">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>ATS Resume Audit Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Resume Analyzer</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Extract skills, evaluate ATS compatibility scores, identify missing keywords, and receive project recommendations.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Form Panel */}
      <div className="glass-panel p-8 rounded-3xl space-y-6 border-amber-500/20 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Upload or Paste Resume</span>
          </h2>
          <button
            onClick={() => setUseTextInput(!useTextInput)}
            className="text-xs text-amber-400 font-semibold hover:underline"
          >
            {useTextInput ? 'Switch to File Upload' : 'Paste Text / Dictate Instead'}
          </button>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Target Job Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>

          {!useTextInput ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Upload Resume (PDF, DOC, DOCX)</label>
              <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-8 text-center glass-card cursor-pointer transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center space-y-3">
                  <UploadCloud className="w-10 h-10 text-amber-400" />
                  {file ? (
                    <div className="text-sm font-semibold text-slate-100 flex items-center space-x-2">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Drag and drop file here or click to browse</p>
                      <p className="text-xs text-slate-400 mt-1">Supports PDF, DOC, DOCX files up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Paste Resume Content / Dictate</label>
                <SpeechToTextButton onTranscript={handleSpeechResumeText} />
              </div>
              <textarea
                rows="8"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste plain text content or click Voice to dictate..."
                className="w-full p-4 rounded-xl glass-input text-sm leading-relaxed"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white font-semibold text-base shadow-lg shadow-amber-500/25 hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze ATS Resume Compatibility</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* ANALYSIS RESULTS DISPLAY */}
      {analysis && (
        <div className="glass-panel p-8 rounded-3xl space-y-8 border-amber-500/30 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">ATS Match Analysis</span>
              <h2 className="text-2xl font-bold">Resume ATS Audit Report</h2>
            </div>
            <div className="flex items-center space-x-4 bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800">
              <Award className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-3xl font-extrabold text-amber-300">{analysis.atsScore}/100</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">ATS Score</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border-emerald-500/20">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Detected Technical Skills</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3 border-red-500/20">
              <h3 className="text-sm font-bold text-red-400 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Missing Industry Keywords</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords?.map((kw, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 text-xs font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-2 border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Resume Strengths</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                {analysis.strengths?.map((str, i) => <li key={i}>• {str}</li>)}
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-2 border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Areas for Improvement</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                {analysis.weaknesses?.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border-indigo-500/20">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Suggested Resume Projects</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {analysis.suggestedProjects?.map((proj, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium">
                    {proj}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3 border-cyan-500/20">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Recommended Certifications</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {analysis.recommendedCertifications?.map((cert, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium">
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3 border-amber-500/20">
            <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>Executive Career Action Points</span>
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-300">
              {analysis.careerSuggestions?.map((sug, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">→</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
