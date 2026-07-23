const aiService = require('../services/aiService');
const InterviewSession = require('../models/InterviewSession');

/**
 * Handles POST /api/hr-interview
 * Actions: "generate_question", "evaluate_answer", or "reveal_answer"
 */
exports.handleHRInterview = async (req, res, next) => {
  try {
    const { action, role, experience, difficulty, question, answer } = req.body;

    if (action === 'generate_question') {
      const hrQuestionData = await aiService.generateHRQuestion({
        role: role || 'Software Engineer',
        experience: experience || '2',
        difficulty: difficulty || 'Medium'
      });

      return res.status(200).json({
        success: true,
        data: hrQuestionData
      });
    }

    if (action === 'reveal_answer') {
      if (!question) {
        return res.status(400).json({ success: false, message: 'Question text is required to reveal answer.' });
      }

      const revealedAnswerData = await aiService.revealHRAnswer({
        question,
        role: role || 'Software Engineer'
      });

      return res.status(200).json({
        success: true,
        data: revealedAnswerData
      });
    }

    if (action === 'evaluate_answer') {
      if (!question) {
        return res.status(400).json({ success: false, message: 'Question text is required.' });
      }

      const hrEvaluation = await aiService.evaluateHRAnswer({
        question,
        answer,
        role: role || 'Software Engineer'
      });

      const userId = req.user ? req.user.id : null;
      if (userId) {
        try {
          await InterviewSession.create({
            user: userId,
            type: 'HR',
            role: role || 'Software Engineer',
            experience: experience || '2',
            difficulty: difficulty || 'Medium',
            questions: [{
              question,
              answer: answer || 'SKIP',
              score: hrEvaluation.overallScore,
              metrics: hrEvaluation.metrics
            }],
            overallScore: hrEvaluation.overallScore
          });
        } catch (dbErr) {
          // Silent fallback
        }
      }

      return res.status(200).json({
        success: true,
        data: hrEvaluation
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid action. Must be "generate_question", "evaluate_answer", or "reveal_answer"'
    });
  } catch (error) {
    next(error);
  }
};
