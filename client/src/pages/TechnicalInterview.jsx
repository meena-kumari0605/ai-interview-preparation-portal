import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Code2, 
  Play, 
  Send, 
  HelpCircle, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Clock, 
  Cpu, 
  Layers,
  Sparkles,
  Lightbulb,
  BookOpen,
  X
} from 'lucide-react';

export default function TechnicalInterview() {
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState('two-sum');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  const [executionResult, setExecutionResult] = useState(null);
  const [hintData, setHintData] = useState(null);
  const [solutionData, setSolutionData] = useState(null);

  const [showHintModal, setShowHintModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await API.get('/technical/problems');
        if (res.data.success) {
          setProblems(res.data.data);
          const firstProb = res.data.data[0];
          if (firstProb) {
            setSelectedProblemId(firstProb.id);
            setCode('');
          }
        }
      } catch (err) {
        console.error('Failed to load technical problems:', err);
      }
    };
    fetchProblems();
  }, []);

  const currentProblem = problems.find(p => p.id === selectedProblemId) || {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode('');
  };

  const handleProblemChange = (probId) => {
    setSelectedProblemId(probId);
    setCode('');
  };

  const handleRunOrSubmit = async (actionType) => {
    setLoading(true);
    setError('');
    setExecutionResult(null);

    try {
      const res = await API.post('/technical', {
        action: actionType,
        problemId: selectedProblemId,
        problemTitle: currentProblem.title,
        problemDescription: currentProblem.description,
        language,
        code
      });

      if (res.data.success) {
        setExecutionResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Code execution or AI analysis error.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchHint = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/technical', {
        action: 'hint',
        problemId: selectedProblemId,
        problemTitle: currentProblem.title,
        problemDescription: currentProblem.description,
        language,
        code
      });

      if (res.data.success) {
        setHintData(res.data.data);
        setShowHintModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate AI hint.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevealSolution = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/technical', {
        action: 'reveal_solution',
        problemId: selectedProblemId,
        problemTitle: currentProblem.title,
        problemDescription: currentProblem.description,
        language
      });

      if (res.data.success) {
        setSolutionData(res.data.data);
        setShowSolutionModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reveal optimal solution.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border-purple-500/20">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Technical Interview Sandbox</h1>
            <p className="text-xs text-slate-400">Multi-language code execution engine with AI Hint & Code Analysis</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedProblemId}
            onChange={(e) => handleProblemChange(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs font-semibold bg-slate-900"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>

          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs font-semibold bg-slate-900 text-purple-300"
          >
            <option value="javascript">JavaScript (ES6)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ 20</option>
            <option value="java">Java 17</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center space-x-2">
          <AlertOctagon className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Problem Description Panel */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl space-y-4 border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                currentProblem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                currentProblem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {currentProblem.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-mono">{currentProblem.category}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-100">{currentProblem.title}</h2>
            
            <div className="text-sm text-slate-300 leading-relaxed font-sans space-y-2">
              <p>{currentProblem.description}</p>
            </div>
          </div>
        </div>

        {/* Empty Code Editor & Action Controls Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4 border-purple-500/20">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400">Editor ({language}) - Write Code From Scratch</span>
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleFetchHint}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl border border-amber-500/30 hover:bg-amber-500/10 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  title="Get AI clue without solution code"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>AI Hint</span>
                </button>

                <button
                  onClick={handleRevealSolution}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  title="Reveal complete optimal code & explanation"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reveal Solution</span>
                </button>

                <button
                  onClick={() => handleRunOrSubmit('run')}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Code</span>
                </button>

                <button
                  onClick={() => handleRunOrSubmit('submit')}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 hover:opacity-95 flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Code</span>
                </button>
              </div>
            </div>

            {/* Code Input (Empty by default) */}
            <textarea
              rows="14"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Write your ${language} solution here...`}
              className="w-full p-4 rounded-2xl bg-slate-950 text-indigo-200 font-mono text-sm leading-relaxed border border-slate-800 focus:outline-none focus:border-purple-500/50"
              spellCheck="false"
            />
          </div>

          {/* TEST RESULTS & AI CODE ANALYSIS DISPLAY */}
          {executionResult && (
            <div className="glass-panel p-6 rounded-3xl space-y-6 border-slate-800 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    executionResult.success ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {executionResult.success ? 'All Tests Passed' : 'Submission Failed'}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    Passed: {executionResult.passedCount} / {executionResult.totalCount}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Runtime: {executionResult.executionTimeMs}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Time: {executionResult.timeComplexity}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Space: {executionResult.spaceComplexity}</span>
                  </div>
                </div>
              </div>

              {/* Test Case Suite Results */}
              {executionResult.testResults && executionResult.testResults.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Test Suite Matrix</div>
                  <div className="grid grid-cols-1 gap-2 font-mono text-xs">
                    {executionResult.testResults.map((tc, idx) => (
                      <div key={idx} className={`p-3 rounded-xl glass-card flex items-center justify-between border ${
                        tc.passed ? 'border-emerald-500/20' : 'border-red-500/30'
                      }`}>
                        <div className="flex items-center space-x-3">
                          {tc.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                          <span className="text-slate-200">Test Case #{tc.testCaseNumber}</span>
                        </div>
                        <div className="text-slate-400 text-right">
                          Expected: <span className="text-slate-200">{tc.expectedOutput}</span> | Actual: <span className={tc.passed ? 'text-emerald-300' : 'text-red-300'}>{tc.actualOutput}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Code Analysis Breakdown */}
              {executionResult.aiAnalysis && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <h3 className="text-base font-bold text-purple-300 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Code Deep Analysis</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="glass-card p-4 rounded-xl space-y-1">
                      <div className="font-bold text-slate-300">Correctness & Quality</div>
                      <p className="text-slate-400">{executionResult.aiAnalysis.correctness}</p>
                    </div>
                    <div className="glass-card p-4 rounded-xl space-y-1">
                      <div className="font-bold text-slate-300">Logic & Optimization</div>
                      <p className="text-slate-400">{executionResult.aiAnalysis.logicAnalysis}</p>
                    </div>
                  </div>

                  {executionResult.aiAnalysis.suggestions && (
                    <div className="glass-card p-4 rounded-xl space-y-1 text-xs border-purple-500/20">
                      <div className="font-bold text-purple-300">Suggestions & Best Practices</div>
                      <ul className="space-y-1 text-slate-300">
                        {executionResult.aiAnalysis.suggestions.map((sug, i) => <li key={i}>• {sug}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI HINT MODAL */}
      {showHintModal && hintData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full space-y-4 border-amber-500/30 animate-fadeIn relative">
            <button
              onClick={() => setShowHintModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Lightbulb className="w-5 h-5" />
              <h3>{hintData.hintTitle || 'AI Algorithmic Clue'}</h3>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-300">Clue: </span>
                <span>{hintData.clue}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-300">Approach Direction: </span>
                <span>{hintData.approach}</span>
              </div>
              {hintData.thinkingDirection && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-amber-300">Thinking Direction: </span>
                  <span>{hintData.thinkingDirection}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowHintModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30 hover:bg-amber-500/30"
            >
              Got it, let me code it!
            </button>
          </div>
        </div>
      )}

      {/* REVEAL SOLUTION MODAL */}
      {showSolutionModal && solutionData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel p-6 rounded-3xl max-w-2xl w-full space-y-4 border-cyan-500/30 animate-fadeIn relative my-8">
            <button
              onClick={() => setShowSolutionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <BookOpen className="w-5 h-5" />
              <h3>Optimal Reference Solution ({solutionData.language})</h3>
            </div>

            <div className="space-y-3 text-xs">
              <textarea
                rows="8"
                readOnly
                value={solutionData.solutionCode}
                className="w-full p-4 rounded-xl bg-slate-950 text-cyan-300 font-mono border border-slate-800"
              />
              
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-slate-300">
                <div className="font-bold text-cyan-300">Algorithm Explanation</div>
                <p>{solutionData.explanation}</p>
                <div className="flex items-center space-x-4 pt-1 font-mono text-[11px] text-slate-400">
                  <span>Time: <strong className="text-cyan-300">{solutionData.timeComplexity}</strong></span>
                  <span>Space: <strong className="text-purple-300">{solutionData.spaceComplexity}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSolutionModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 text-white font-semibold text-xs shadow-md shadow-cyan-500/20"
            >
              Close Solution
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
