const Groq = require('groq-sdk');
const prompts = require('../utils/prompts');

/**
 * High-Concurrency AI Request Queue (Limits max concurrent Groq calls to 15)
 */
class RequestQueue {
  constructor(concurrency = 15) {
    this.concurrency = concurrency;
    this.activeCount = 0;
    this.queue = [];
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.next();
    });
  }

  next() {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) return;

    const { fn, resolve, reject } = this.queue.shift();
    this.activeCount++;

    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.activeCount--;
        this.next();
      });
  }
}

const aiRequestQueue = new RequestQueue(15);

/**
 * In-Memory API Response Cache (TTL 1 Hour)
 */
const responseCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

function getCached(key) {
  const cached = responseCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return cached.data;
}

function setCache(key, data) {
  if (responseCache.size > 200) {
    const oldestKey = responseCache.keys().next().value;
    responseCache.delete(oldestKey);
  }
  responseCache.set(key, { timestamp: Date.now(), data });
}

/**
 * Initialize Groq SDK Client with GROQ_API_KEY
 */
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
    throw new Error('Groq API Key is not configured. Please add GROQ_API_KEY to server/.env.');
  }
  return new Groq({ apiKey: apiKey.trim() });
}

/**
 * Utility to extract clean JSON from AI output text
 */
function parseCleanJSON(text) {
  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('[AI JSON Parse Error] Raw text:', text);
    throw new Error('Failed to parse JSON response from Groq model');
  }
}

/**
 * Call Groq API with Queueing, Caching, Timeouts, and Retries.
 */
async function callLLM(promptText, useCache = true) {
  const cacheKey = useCache ? promptText.trim() : null;
  if (useCache && cacheKey) {
    const cachedRes = getCached(cacheKey);
    if (cachedRes) return cachedRes;
  }

  return aiRequestQueue.add(() => callLLMWithRetryAndTimeout(promptText, cacheKey, 2, 15000));
}

async function callLLMWithRetryAndTimeout(promptText, cacheKey, maxRetries = 2, timeoutMs = 15000) {
  const groq = getGroqClient();
  const selectedModel = process.env.MODEL_NAME || 'llama-3.3-70b-versatile';

  let attempts = 0;

  while (attempts <= maxRetries) {
    attempts++;
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI Request Timeout after 15 seconds')), timeoutMs)
      );

      const apiPromise = groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI interviewer. Return ONLY valid JSON tailored specifically to the input question and candidate response.',
          },
          {
            role: 'user',
            content: promptText,
          },
        ],
        model: selectedModel,
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const chatCompletion = await Promise.race([apiPromise, timeoutPromise]);
      const responseText = chatCompletion.choices[0]?.message?.content || '';
      const resultData = parseCleanJSON(responseText);

      if (cacheKey) setCache(cacheKey, resultData);
      return resultData;
    } catch (err) {
      console.warn(`[Groq AI Attempt ${attempts}/${maxRetries + 1} Failed]: ${err.message}`);
      if (attempts > maxRetries) {
        throw new Error(`The AI service is temporarily busy. Please try again in a few seconds. (${err.message})`);
      }
      await new Promise((r) => setTimeout(r, attempts * 500)); // Exponential backoff
    }
  }
}

/**
 * Robust Gibberish & Meaningless Answer Detector
 */
function isInvalidOrMeaningless(text) {
  const clean = (text || '').trim();
  if (!clean || clean.length < 4 || clean.toUpperCase() === 'SKIP') return true;

  if (['OK', 'YES', 'NO', 'I', 'HI', 'TEST', 'NONE', 'HELLO', 'BYE'].includes(clean.toUpperCase())) return true;
  if (/^\d+$/.test(clean)) return true;

  const isRandomKeyboard = /^[a-z0-9]{1,16}$/i.test(clean) && !/\s/.test(clean);
  const isRepeatedChar = /^(.)\1{3,}$/i.test(clean);

  return isRandomKeyboard || isRepeatedChar;
}

/**
 * 1. Mock Interview Services
 */
async function generateMockQuestion({ role, company, experience, difficulty, previousQuestions }) {
  const promptText = prompts.MOCK_INTERVIEW_QUESTION_PROMPT({ role, company, experience, difficulty, previousQuestions });
  return await callLLM(promptText, false);
}

async function evaluateMockAnswer({ question, answer, role, experience, difficulty }) {
  const cleanAns = (answer || '').trim();

  if (isInvalidOrMeaningless(cleanAns)) {
    return {
      isMeaningful: false,
      overallScore: 0,
      metrics: {
        communication: 0,
        confidence: 0,
        relevance: 0,
        completeness: 0,
        professionalism: 0,
        contentQuality: 0,
        grammar: 0
      },
      feedbackMessage: "The answer is not meaningful enough to evaluate.",
      reason: "The answer is not meaningful enough to evaluate.",
      strengths: [],
      weaknesses: [],
      missingPoints: ["Complete sentence technical explanation"],
      suggestions: ["Provide a structured response addressing the question."],
      betterAnswer: "",
      followUpQuestion: "",
      interviewTips: "",
      finalRecommendation: "Provide complete sentences."
    };
  }

  const promptText = prompts.MOCK_INTERVIEW_EVALUATION_PROMPT({ question, answer: cleanAns, role, experience, difficulty });
  return await callLLM(promptText, false);
}

/**
 * 2. HR Interview Services
 */
async function generateHRQuestion({ role, experience, difficulty }) {
  const promptText = prompts.HR_INTERVIEW_QUESTION_PROMPT({ role, experience, difficulty });
  return await callLLM(promptText, false);
}

async function evaluateHRAnswer({ question, answer, role }) {
  const cleanAns = (answer || '').trim();

  if (isInvalidOrMeaningless(cleanAns)) {
    return {
      isMeaningful: false,
      overallScore: 0,
      metrics: {
        communication: 0,
        confidence: 0,
        professionalism: 0,
        clarity: 0,
        leadership: 0,
        teamwork: 0,
        problemSolving: 0,
        contentQuality: 0,
        grammar: 0
      },
      feedbackMessage: "The answer is not meaningful enough to evaluate.",
      reason: "The answer is not meaningful enough to evaluate.",
      strengths: [],
      weaknesses: [],
      missingPoints: ["Behavioral story context"],
      suggestions: ["Use STAR method."],
      betterAnswer: "",
      interviewTips: "",
      finalRecommendation: "Answer in full sentences."
    };
  }

  const promptText = prompts.HR_INTERVIEW_EVALUATION_PROMPT({ question, answer: cleanAns, role });
  return await callLLM(promptText, false);
}

async function revealHRAnswer({ question, role }) {
  const promptText = prompts.HR_REVEAL_ANSWER_PROMPT({ question, role });
  return await callLLM(promptText, true);
}

/**
 * 3. Technical Interview AI Services
 */
async function generateTechnicalHint({ problemTitle, problemDescription, language, currentCode }) {
  const promptText = prompts.TECHNICAL_HINT_PROMPT({ problemTitle, problemDescription, language, currentCode });
  return await callLLM(promptText, true);
}

async function revealTechnicalSolution({ problemTitle, problemDescription, language }) {
  const promptText = prompts.TECHNICAL_REVEAL_SOLUTION_PROMPT({ problemTitle, problemDescription, language });
  return await callLLM(promptText, true);
}

async function analyzeSubmittedCode({ problemTitle, problemDescription, language, code, testResults }) {
  const promptText = prompts.TECHNICAL_CODE_ANALYSIS_PROMPT({ problemTitle, problemDescription, language, code, testResults });
  return await callLLM(promptText, false);
}

/**
 * 4. Resume Analyzer Services
 */
async function analyzeResume(resumeText, targetRole) {
  const promptText = prompts.RESUME_ANALYSIS_PROMPT(resumeText, targetRole);
  return await callLLM(promptText, false);
}

/**
 * 5. Career Roadmap Services
 */
async function generateCareerRoadmap({ targetRole, currentSkills, experience }) {
  const promptText = prompts.CAREER_ROADMAP_PROMPT({ targetRole, currentSkills, experience });
  return await callLLM(promptText, true);
}

module.exports = {
  generateMockQuestion,
  evaluateMockAnswer,
  generateHRQuestion,
  evaluateHRAnswer,
  revealHRAnswer,
  generateTechnicalHint,
  revealTechnicalSolution,
  analyzeSubmittedCode,
  analyzeResume,
  generateCareerRoadmap
};
