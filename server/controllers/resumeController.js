const resumeParserService = require('../services/resumeParserService');
const aiService = require('../services/aiService');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const memoryStore = require('../utils/memoryStore');

/**
 * Handles POST /api/resume
 * Accepts file upload or JSON body with resumeText
 */
exports.handleResumeAnalysis = async (req, res, next) => {
  try {
    let resumeText = req.body.resumeText || '';
    const targetRole = req.body.targetRole || 'Software Engineer';
    let fileName = 'Direct Input Resume';

    // File upload parsing
    if (req.file) {
      fileName = req.file.originalname;
      resumeText = await resumeParserService.parseResumeFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid PDF/DOC/DOCX resume file or provide resume text.'
      });
    }

    // Call AI resume analysis service
    const analysisResult = await aiService.analyzeResume(resumeText, targetRole);

    // Save result if user logged in
    const userId = req.user ? (req.user.id || req.user._id) : null;
    if (userId) {
      const analysisData = {
        user: userId,
        fileName,
        targetRole,
        atsScore: analysisResult.atsScore,
        skills: analysisResult.skills,
        missingKeywords: analysisResult.missingKeywords,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        suggestedProjects: analysisResult.suggestedProjects,
        recommendedCertifications: analysisResult.recommendedCertifications,
        careerSuggestions: analysisResult.careerSuggestions,
        createdAt: new Date()
      };

      memoryStore.addResumeAnalysis(analysisData);

      try {
        await ResumeAnalysis.create(analysisData);
        console.log(`[Dashboard Sync] Resume Analysis saved successfully to MongoDB for user: ${userId}`);
      } catch (dbErr) {
        console.error(`[Dashboard Sync Warning] MongoDB Atlas save failed for Resume Analysis: ${dbErr.message}`);
      }
    }

    res.status(200).json({
      success: true,
      fileName,
      targetRole,
      data: analysisResult
    });
  } catch (error) {
    next(error);
  }
};
