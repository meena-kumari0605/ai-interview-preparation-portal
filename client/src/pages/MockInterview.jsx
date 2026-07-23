import React, { useState } from 'react';
import API from '../services/api';
import SpeechToTextButton from '../components/SpeechToTextButton';
import { 
  Bot, 
  Play, 
  SkipForward, 
  Send, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  Sparkles,
  ShieldAlert,
  RotateCcw,
  Eye,
  BookOpen
} from 'lucide-react';

export default function MockInterview() {
  const [step, setStep] = useState('SETUP'); // 'SETUP' | 'INTERVIEW' | 'EVALUATION' | 'SKIPPED' | 'REVEAL'
  const [role, setRole] = useState('Full Stack Developer');
  const [company, setCompany] = useState('Google');
  const [experience, setExperience] = useState('2');
  const [difficulty, setDifficulty] = useState('Medium');

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [revealedAnswerData, setRevealedAnswerData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNextQuestion = async (isNewSession = false) => {
    setLoading(true);
    setError('');
    setAnswer('');
    setEvaluation(null);
    setRevealedAnswerData(null);

    try {
      const res = await API.post('/mock-interview', {
        action: 'generate_question',
        role,
        company,
        experience,
        difficulty,
        previousQuestions: isNewSession ? [] : previousQuestions
      });

      if (res.data.success) {
        setCurrentQuestion(res.data.data.question);
        if (isNewSession) setPreviousQuestions([res.data.data.question]);
        else setPreviousQuestions(prev => [...prev, res.data.data.question]);
        setStep('INTERVIEW');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate interview question.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (ansText) => {
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/mock-interview', {
        action: 'evaluate_answer',
        question: currentQuestion,
        answer: ansText,
        role,
        experience,
        difficulty
      });

      if (res.data.success) {
        setEvaluation(res.data.data);
        setStep('EVALUATION');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to evaluate answer. Please check API credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipQuestion = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/mock-interview', {
        action: 'evaluate_answer',
        question: currentQuestion,
        answer: `Generate specific ideal answer for question: ${currentQuestion}`,
        role,
        experience,
        difficulty
      });

      if (res.data.success) {
        setRevealedAnswerData(res.data.data);
      }
    } catch (err) {
      // Fallback
    } finally {
      setStep('SKIPPED');
      setLoading(false);
    }
  };

  const handleRevealAnswerClick = async () => {
    if (!revealedAnswerData) {
      setLoading(true);
      try {
        const res = await API.post('/mock-interview', {
          action: 'evaluate_answer',
          question: currentQuestion,
          answer: `Generate specific ideal answer for question: ${currentQuestion}`,
          role,
          experience,
          difficulty
        });
        if (res.data.success) {
          setRevealedAnswerData(res.data.data);
        }
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    setStep('REVEAL');
  };

  const handleReattemptQuestion = () => {
    setStep('INTERVIEW');
  };

  const handleSpeechTranscript = (transcriptText) => {
    setAnswer(transcriptText);
  };

  const isZeroScore = evaluation && (evaluation.overallScore === 0 || !evaluation.isMeaningful);
  const isPartialScore = evaluation && evaluation.overallScore > 0 && evaluation.overallScore < 70;
  const isGoodScore = evaluation && evaluation.overallScore >= 70;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>AI Technical Mock Evaluator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">AI Mock Interview</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Dynamic AI question generation & comprehensive LLM answer scoring.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SETUP FORM */}
      {step === 'SETUP' && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 border-indigo-500/20 shadow-2xl">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Configure Interview Setup</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Target Job Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Target Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Experience (Years)</label>
              <input
                type="number"
                min="0"
                max="25"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Interview Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm bg-slate-900"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => fetchNextQuestion(true)}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Begin AI Mock Interview</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* INTERVIEW QUESTION CARD */}
      {step === 'INTERVIEW' && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 border-indigo-500/30 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              Question #{previousQuestions.length}
            </span>
            <span className="text-xs text-slate-400">{role} at {company}</span>
          </div>

          <div className="p-6 rounded-2xl glass-card border-slate-700 space-y-3">
            <div className="flex items-start space-x-3">
              <Bot className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
              <h3 className="text-xl font-semibold text-slate-100 leading-snug">
                {currentQuestion}
              </h3>
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Your Answer</label>
              <SpeechToTextButton onTranscript={handleSpeechTranscript} />
            </div>
            <textarea
              rows="6"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type or click Voice to record your structured response..."
              className="w-full p-4 rounded-xl glass-input text-sm leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 gap-4">
            <button
              onClick={handleSkipQuestion}
              disabled={loading}
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-sm flex items-center space-x-2"
            >
              <SkipForward className="w-4 h-4 text-amber-400" />
              <span>Skip Question</span>
            </button>

            <button
              onClick={() => handleEvaluate(answer)}
              disabled={loading || !answer.trim()}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* SKIPPED QUESTION DISPLAY */}
      {step === 'SKIPPED' && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 border-amber-500/30 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
              Question Skipped (Not Scored)
            </span>
            <span className="text-xs text-slate-400">{role}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-200">
            "{currentQuestion}"
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3 border-amber-500/20">
            <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <span>Ideal Answer Specific to Question</span>
            </h3>
            <p className="text-sm text-slate-200 italic leading-relaxed">
              "{revealedAnswerData?.betterAnswer || `An exemplary answer for "${currentQuestion}" provides a clear explanation, architectural trade-offs, and practical examples.`}"
            </p>
          </div>

          <button
            onClick={() => fetchNextQuestion(false)}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm shadow-lg flex items-center justify-center space-x-2"
          >
            <span>Next Interview Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* EVALUATION RESULTS */}
      {step === 'EVALUATION' && evaluation && (
        <div className="glass-panel p-8 rounded-3xl space-y-8 border-indigo-500/30 shadow-2xl">
          {/* BRANCH 1: 0% MEANINGLESS ANSWER */}
          {isZeroScore ? (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 space-y-2">
                <div className="text-2xl font-extrabold text-red-400">Score: 0%</div>
                <div className="text-sm text-slate-200 font-semibold">
                  Reason: The answer is not meaningful enough to evaluate.
                </div>
              </div>

              {/* ONLY SHOW: Reattempt Question | Reveal Answer | Skip Question */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <button
                  onClick={handleReattemptQuestion}
                  className="px-4 py-3.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-sm font-semibold hover:bg-indigo-500/20 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reattempt Question</span>
                </button>

                <button
                  onClick={handleRevealAnswerClick}
                  className="px-4 py-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-sm font-semibold hover:bg-amber-500/20 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Answer</span>
                </button>

                <button
                  onClick={handleSkipQuestion}
                  className="px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 flex items-center justify-center space-x-2"
                >
                  <SkipForward className="w-4 h-4 text-amber-400" />
                  <span>Skip Question</span>
                </button>
              </div>
            </div>
          ) : isPartialScore ? (
            /* BRANCH 2: PARTIALLY CORRECT ANSWER */
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
                <div className="text-2xl font-extrabold text-amber-400">Score: {evaluation.overallScore}% (Partially Correct)</div>
                <p className="text-sm text-slate-200">
                  {evaluation.feedbackMessage}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="glass-card p-4 rounded-xl space-y-1 border-emerald-500/20">
                  <div className="font-bold text-emerald-400 uppercase">Correct Concepts</div>
                  <ul className="space-y-1 text-slate-300">
                    {evaluation.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>

                <div className="glass-card p-4 rounded-xl space-y-1 border-red-500/20">
                  <div className="font-bold text-red-400 uppercase">Missing Concepts</div>
                  <ul className="space-y-1 text-slate-300">
                    {evaluation.missingPoints?.map((mp, i) => <li key={i}>• {mp}</li>)}
                  </ul>
                </div>

                <div className="glass-card p-4 rounded-xl space-y-1 border-amber-500/20">
                  <div className="font-bold text-amber-400 uppercase">Why Incomplete</div>
                  <p className="text-slate-300">{evaluation.weaknesses?.[0] || "Answer lacks full depth and architectural edge cases."}</p>
                </div>
              </div>

              {/* THREE BUTTONS: Reattempt | Reveal Answer | Next Question */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <button
                  onClick={handleReattemptQuestion}
                  className="px-4 py-3.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-sm font-semibold flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reattempt</span>
                </button>

                <button
                  onClick={handleRevealAnswerClick}
                  className="px-4 py-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-sm font-semibold flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Answer</span>
                </button>

                <button
                  onClick={() => fetchNextQuestion(false)}
                  disabled={loading}
                  className="px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* BRANCH 3: GOOD ANSWER */
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Good Answer Evaluation</span>
                  <h2 className="text-2xl font-bold">Strong Response Assessment</h2>
                </div>
                <div className="flex items-center space-x-4 bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800">
                  <Award className="w-8 h-8 text-emerald-400" />
                  <div>
                    <div className="text-2xl font-extrabold text-emerald-300">{evaluation.overallScore}%</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Overall Score</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-2xl space-y-2 border-emerald-500/20">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Strengths</span>
                  </h3>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {evaluation.strengths?.map((str, idx) => <li key={idx}>• {str}</li>)}
                  </ul>
                </div>

                <div className="glass-card p-6 rounded-2xl space-y-2 border-amber-500/20">
                  <h3 className="text-sm font-bold text-amber-300">Missing Improvements</h3>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {evaluation.missingPoints?.map((mp, idx) => <li key={idx}>• {mp}</li>)}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-xl space-y-1">
                  <div className="font-bold text-xs uppercase text-indigo-400">Communication Tips</div>
                  <p className="text-xs text-slate-300">Maintain clear pacing and articulate key achievements.</p>
                </div>
                <div className="glass-card p-4 rounded-xl space-y-1">
                  <div className="font-bold text-xs uppercase text-cyan-400">Better Wording</div>
                  <p className="text-xs text-slate-300">"{evaluation.betterAnswer || "Reference domain terminology clearly."}"</p>
                </div>
                <div className="glass-card p-4 rounded-xl space-y-1">
                  <div className="font-bold text-xs uppercase text-purple-400">Professional Advice</div>
                  <p className="text-xs text-slate-300">{evaluation.interviewTips || "Provide clear architectural trade-offs."}</p>
                </div>
              </div>

              <button
                onClick={() => fetchNextQuestion(false)}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Continue to Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* REVEAL ANSWER VIEW */}
      {step === 'REVEAL' && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 border-amber-500/30 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Revealed Ideal Answer</span>
            </span>
            <span className="text-xs text-slate-400">{role}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-200">
            "{currentQuestion}"
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3 border-amber-500/20">
            <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Ideal Answer for Current Question</span>
            </h3>
            <p className="text-sm text-slate-200 italic leading-relaxed">
              "{revealedAnswerData?.betterAnswer || evaluation?.betterAnswer || `An exemplary answer for "${currentQuestion}" provides a clear explanation, architectural trade-offs, and practical examples.`}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handleReattemptQuestion}
              className="px-6 py-3 rounded-xl border border-indigo-500/40 text-indigo-300 text-sm font-semibold flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reattempt Question</span>
            </button>

            <button
              onClick={() => fetchNextQuestion(false)}
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
