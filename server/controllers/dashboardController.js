const mongoose = require('mongoose');
const User = require('../models/User');
const InterviewSession = require('../models/InterviewSession');
const TechnicalSubmission = require('../models/TechnicalSubmission');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const CareerRoadmap = require('../models/CareerRoadmap');
const memoryStore = require('../utils/memoryStore');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id) : null;
    const userEmail = req.user ? req.user.email : null;

    if (!userId && !userEmail) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please sign in to view dashboard.' });
    }

    let userObj = null;
    try {
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        userObj = await User.findById(userId).select('-password');
      }
      if (!userObj && userEmail) {
        userObj = await User.findOne({ email: userEmail.toLowerCase() }).select('-password');
      }
    } catch (e) {
      console.error('[Dashboard User Query Warning]:', e.message);
      userObj = null;
    }

    const name = userObj?.name || req.user?.name || 'Candidate';
    const email = userObj?.email || userEmail || 'candidate@example.com';
    const joinDate = userObj?.createdAt ? new Date(userObj.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
    const lastLogin = new Date().toLocaleDateString();

    let dbSessions = [];
    let dbTechSubs = [];
    let dbResumes = [];
    let dbRoadmaps = [];

    // Query MongoDB Atlas filtering strictly by logged in user ID / ObjectId / Email
    const userQueryConditions = [];
    if (userId) {
      userQueryConditions.push({ user: userId });
      if (mongoose.Types.ObjectId.isValid(userId)) {
        userQueryConditions.push({ user: new mongoose.Types.ObjectId(userId) });
      }
    }
    if (userEmail) {
      userQueryConditions.push({ user: userEmail });
    }

    const userQuery = userQueryConditions.length > 0 ? { $or: userQueryConditions } : { user: userId };

    try {
      dbSessions = await InterviewSession.find(userQuery).sort({ createdAt: -1 });
      dbTechSubs = await TechnicalSubmission.find(userQuery).sort({ createdAt: -1 });
      dbResumes = await ResumeAnalysis.find(userQuery).sort({ createdAt: -1 });
      dbRoadmaps = await CareerRoadmap.find(userQuery).sort({ createdAt: -1 });
      console.log(`[Dashboard Fetch] Fetched MongoDB Atlas records for user ${userId}: ${dbSessions.length} sessions, ${dbTechSubs.length} tech subs, ${dbResumes.length} resumes, ${dbRoadmaps.length} roadmaps.`);
    } catch (dbErr) {
      console.error('[Dashboard DB Fetch Error]:', dbErr.message);
    }

    // Combine with memory store records to ensure immediate state update after completed interviews
    const memData = memoryStore.getUserStats(userId, userEmail);

    const allSessionsMap = new Map();
    [...dbSessions, ...memData.sessions].forEach(s => {
      const key = s._id ? s._id.toString() : `${s.role}_${s.type}_${new Date(s.createdAt).getTime()}`;
      if (!allSessionsMap.has(key)) allSessionsMap.set(key, s);
    });
    dbSessions = Array.from(allSessionsMap.values());

    const allTechSubsMap = new Map();
    [...dbTechSubs, ...memData.technicalSubmissions].forEach(t => {
      const key = t._id ? t._id.toString() : `${t.problemId}_${new Date(t.createdAt).getTime()}`;
      if (!allTechSubsMap.has(key)) allTechSubsMap.set(key, t);
    });
    dbTechSubs = Array.from(allTechSubsMap.values());

    const allResumesMap = new Map();
    [...dbResumes, ...memData.resumeAnalyses].forEach(r => {
      const key = r._id ? r._id.toString() : `${r.targetRole}_${new Date(r.createdAt).getTime()}`;
      if (!allResumesMap.has(key)) allResumesMap.set(key, r);
    });
    dbResumes = Array.from(allResumesMap.values());

    const allRoadmapsMap = new Map();
    [...dbRoadmaps, ...memData.careerRoadmaps].forEach(m => {
      const key = m._id ? m._id.toString() : `${m.targetRole}_${new Date(m.createdAt).getTime()}`;
      if (!allRoadmapsMap.has(key)) allRoadmapsMap.set(key, m);
    });
    dbRoadmaps = Array.from(allRoadmapsMap.values());

    // Aggregations
    const mockSessions = dbSessions.filter(s => s.type === 'MOCK');
    const hrSessions = dbSessions.filter(s => s.type === 'HR');

    const totalMockInterviews = mockSessions.length;
    const totalHRInterviews = hrSessions.length;
    const totalTechnicalInterviews = dbTechSubs.length;

    let totalQuestionsAnswered = 0;
    let totalQuestionsSkipped = 0;

    dbSessions.forEach(s => {
      if (s.questions && Array.isArray(s.questions)) {
        s.questions.forEach(q => {
          if (q.skipped || q.answer === 'SKIP') {
            totalQuestionsSkipped++;
          } else {
            totalQuestionsAnswered++;
          }
        });
      }
    });

    const calcAvg = (arr) => {
      if (!arr || arr.length === 0) return 0;
      const sum = arr.reduce((acc, curr) => acc + (curr.overallScore || curr.score || 0), 0);
      return Math.round(sum / arr.length);
    };

    const averageMockScore = calcAvg(mockSessions);
    const averageHRScore = calcAvg(hrSessions);

    const techScores = dbTechSubs.map(t => t.totalCount > 0 ? Math.round((t.passedCount / t.totalCount) * 100) : 0);
    const averageTechnicalScore = techScores.length > 0 ? Math.round(techScores.reduce((a, b) => a + b, 0) / techScores.length) : 0;

    const allScores = [
      ...mockSessions.map(s => s.overallScore || 0),
      ...hrSessions.map(s => s.overallScore || 0),
      ...techScores
    ];

    const bestScore = allScores.length > 0 ? Math.max(...allScores) : 0;
    const latestScore = allScores.length > 0 ? allScores[0] : 0;

    const problemsAttempted = new Set(dbTechSubs.map(t => t.problemId)).size;
    const problemsSolved = new Set(dbTechSubs.filter(t => t.passedCount === t.totalCount).map(t => t.problemId)).size;
    const totalTestCasesPassed = dbTechSubs.reduce((acc, t) => acc + (t.passedCount || 0), 0);
    const languagesUsed = Array.from(new Set(dbTechSubs.map(t => t.language).filter(Boolean)));

    const resumeUploaded = dbResumes.length > 0;
    const resumeAnalysisHistory = dbResumes.map(r => ({
      id: r._id,
      targetRole: r.targetRole,
      atsScore: r.atsScore,
      date: new Date(r.createdAt || Date.now()).toLocaleDateString()
    }));

    const generatedRoadmapsCount = dbRoadmaps.length;
    const latestCareerGoal = dbRoadmaps.length > 0 ? dbRoadmaps[0].targetRole : (userObj?.role || 'Software Engineer');

    const recentActivity = [];

    dbSessions.forEach(s => {
      recentActivity.push({
        id: s._id?.toString() || Math.random().toString(),
        type: s.type === 'MOCK' ? 'Completed Mock Interview' : 'Completed HR Interview',
        title: `${s.role} ${s.type} Interview`,
        score: s.overallScore,
        date: new Date(s.createdAt || Date.now()).toLocaleDateString(),
        timestamp: new Date(s.createdAt || Date.now()).getTime()
      });
    });

    dbTechSubs.forEach(t => {
      recentActivity.push({
        id: t._id?.toString() || Math.random().toString(),
        type: 'Submitted Technical Interview',
        title: `${t.problemTitle} (${t.language})`,
        score: t.totalCount > 0 ? Math.round((t.passedCount / t.totalCount) * 100) : 0,
        date: new Date(t.createdAt || Date.now()).toLocaleDateString(),
        timestamp: new Date(t.createdAt || Date.now()).getTime()
      });
    });

    dbResumes.forEach(r => {
      recentActivity.push({
        id: r._id?.toString() || Math.random().toString(),
        type: 'Resume Analysis',
        title: `ATS Audit (${r.targetRole})`,
        score: r.atsScore,
        date: new Date(r.createdAt || Date.now()).toLocaleDateString(),
        timestamp: new Date(r.createdAt || Date.now()).getTime()
      });
    });

    dbRoadmaps.forEach(m => {
      recentActivity.push({
        id: m._id?.toString() || Math.random().toString(),
        type: 'Career Roadmap Generated',
        title: `Roadmap for ${m.targetRole}`,
        score: 100,
        date: new Date(m.createdAt || Date.now()).toLocaleDateString(),
        timestamp: new Date(m.createdAt || Date.now()).getTime()
      });
    });

    recentActivity.sort((a, b) => b.timestamp - a.timestamp);

    const isNewUser = recentActivity.length === 0;

    res.status(200).json({
      success: true,
      data: {
        isNewUser,
        userProfile: {
          name,
          email,
          joinDate,
          lastLogin,
          role: userObj?.role || 'Software Engineer'
        },
        interviewStats: {
          totalMockInterviews,
          totalHRInterviews,
          totalTechnicalInterviews,
          totalQuestionsAnswered,
          totalQuestionsSkipped
        },
        performance: {
          averageMockScore,
          averageHRScore,
          averageTechnicalScore,
          bestScore,
          latestScore
        },
        codingStats: {
          problemsAttempted,
          problemsSolved,
          totalTestCasesPassed,
          languagesUsed
        },
        resume: {
          resumeUploaded,
          resumeAnalysisHistory
        },
        careerRoadmap: {
          generatedRoadmapsCount,
          latestCareerGoal
        },
        recentActivity: recentActivity.slice(0, 10),
        progressChartData: {
          scoresOverTime: allScores.reverse(),
          weeklyActivityCount: [totalMockInterviews, totalHRInterviews, totalTechnicalInterviews]
        }
      }
    });
  } catch (error) {
    console.error('[Dashboard Controller Fatal Error]:', error);
    next(error);
  }
};
