const aiService = require('../services/aiService');
const InterviewSession = require('../models/InterviewSession');
const memoryStore = require('../utils/memoryStore');

/**
 * Handles POST /api/mock-interview
 * Handles two actions based on request payload:
 * 1. action: "generate_question"
 * 2. action: "evaluate_answer"
 */
exports.handleMockInterview = async (req, res, next) => {
  try {
    const { action, role, company, experience, difficulty, previousQuestions, question, answer } = req.body;

    // Action 1: Generate AI Question
    if (action === 'generate_question') {
      if (!role) {
        return res.status(400).json({ success: false, message: 'Role is required to generate interview question.' });
      }

      const generatedData = await aiService.generateMockQuestion({
        role: role || 'Software Engineer',
        company: company || 'Tech Corp',
        experience: experience || '2',
        difficulty: difficulty || 'Medium',
        previousQuestions: previousQuestions || []
      });

      return res.status(200).json({
        success: true,
        data: {
          question: generatedData.question,
          category: generatedData.category,
          expectedKeyPoints: generatedData.expectedKeyPoints
        }
      });
    }

    // Action 2: Evaluate Candidate Answer
    if (action === 'evaluate_answer') {
      if (!question) {
        return res.status(400).json({ success: false, message: 'Question parameter is required for evaluation.' });
      }

      const evaluation = await aiService.evaluateMockAnswer({
        question,
        answer,
        role: role || 'Software Engineer',
        experience: experience || '2',
        difficulty: difficulty || 'Medium'
      });

      // Save evaluation session if user is logged in
      const userId = req.user ? (req.user.id || req.user._id) : null;
      if (userId) {
        const sessionData = {
          user: userId,
          type: 'MOCK',
          role: role || 'Software Engineer',
          company: company || 'Tech Corp',
          experience: experience || '2',
          difficulty: difficulty || 'Medium',
          questions: [{
            question,
            answer: answer || 'SKIP',
            skipped: evaluation.overallScore === 0,
            score: evaluation.overallScore,
            metrics: evaluation.metrics,
            strengths: evaluation.strengths,
            weaknesses: evaluation.weaknesses,
            betterAnswer: evaluation.betterAnswer,
            followUpQuestion: evaluation.followUpQuestion
          }],
          overallScore: evaluation.overallScore,
          createdAt: new Date()
        };

        memoryStore.addSession(sessionData);

        try {
          await InterviewSession.create(sessionData);
          console.log(`[Dashboard Sync] Mock Interview session saved successfully to MongoDB for user: ${userId}`);
        } catch (dbErr) {
          console.error(`[Dashboard Sync Warning] MongoDB Atlas save failed for Mock Interview: ${dbErr.message}`);
        }
      }

      return res.status(200).json({
        success: true,
        data: evaluation
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid action. Must be "generate_question" or "evaluate_answer"'
    });
  } catch (error) {
    next(error);
  }
};
