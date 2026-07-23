const codeRunnerService = require('../services/codeRunnerService');
const aiService = require('../services/aiService');
const TechnicalSubmission = require('../models/TechnicalSubmission');

/**
 * Handles GET /api/technical/problems
 */
exports.getProblems = async (req, res, next) => {
  try {
    const problems = codeRunnerService.getProblems();
    res.status(200).json({
      success: true,
      data: problems
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles POST /api/technical
 * Supported actions: "run", "submit", "hint", "reveal_solution"
 */
exports.handleTechnicalSubmission = async (req, res, next) => {
  try {
    const { problemId, language, code, action, problemTitle, problemDescription } = req.body;

    // Action 1: Generate AI Hint (No solution code)
    if (action === 'hint') {
      const hintData = await aiService.generateTechnicalHint({
        problemTitle: problemTitle || problemId,
        problemDescription: problemDescription || 'Algorithmic Problem',
        language: language || 'javascript',
        currentCode: code || ''
      });
      return res.status(200).json({
        success: true,
        data: hintData
      });
    }

    // Action 2: Reveal AI Solution (Optimized code & algorithm explanation)
    if (action === 'reveal_solution') {
      const solutionData = await aiService.revealTechnicalSolution({
        problemTitle: problemTitle || problemId,
        problemDescription: problemDescription || 'Algorithmic Problem',
        language: language || 'javascript'
      });
      return res.status(200).json({
        success: true,
        data: solutionData
      });
    }

    if (!problemId || !language || code === undefined) {
      return res.status(400).json({
        success: false,
        message: 'problemId, language, and code are required fields.'
      });
    }

    // Execute code against test cases
    const executionResult = await codeRunnerService.executeCode({
      problemId,
      language,
      code
    });

    let aiCodeAnalysis = null;

    // Action 3: Submit Code -> Run AI Code Analysis
    if (action === 'submit') {
      try {
        aiCodeAnalysis = await aiService.analyzeSubmittedCode({
          problemTitle: problemTitle || problemId,
          problemDescription: problemDescription || 'Algorithmic Problem',
          language,
          code,
          testResults: executionResult.testResults
        });
      } catch (aiErr) {
        console.warn('[Technical AI Analysis Note]:', aiErr.message);
      }

      if (req.user) {
        try {
          await TechnicalSubmission.create({
            user: req.user.id,
            problemId,
            problemTitle: (problemTitle || problemId).toUpperCase(),
            language,
            code,
            passedCount: executionResult.passedCount,
            totalCount: executionResult.totalCount,
            compilationErrors: executionResult.compilationErrors,
            runtimeErrors: executionResult.runtimeErrors,
            timeComplexity: executionResult.timeComplexity,
            spaceComplexity: executionResult.spaceComplexity,
            executionTimeMs: executionResult.executionTimeMs
          });
        } catch (dbErr) {
          // Silent fallback
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        success: executionResult.success,
        passedCount: executionResult.passedCount,
        totalCount: executionResult.totalCount,
        compilationErrors: executionResult.compilationErrors,
        runtimeErrors: executionResult.runtimeErrors,
        testResults: executionResult.testResults,
        timeComplexity: executionResult.timeComplexity,
        spaceComplexity: executionResult.spaceComplexity,
        executionTimeMs: executionResult.executionTimeMs,
        aiAnalysis: aiCodeAnalysis
      }
    });
  } catch (error) {
    next(error);
  }
};
