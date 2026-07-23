const resumeParserService = require('../services/resumeParserService');
const aiService = require('../services/aiService');
const ResumeAnalysis = require('../models/ResumeAnalysis');

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
    if (req.user) {
      try {
        await ResumeAnalysis.create({
          user: req.user.id,
          fileName,
          targetRole,
          atsScore: analysisResult.atsScore,
          skills: analysisResult.skills,
          missingKeywords: analysisResult.missingKeywords,
          strengths: analysisResult.strengths,
          weaknesses: analysisResult.weaknesses,
          suggestedProjects: analysisResult.suggestedProjects,
          recommendedCertifications: analysisResult.recommendedCertifications,
          careerSuggestions: analysisResult.careerSuggestions
        });
      } catch (dbErr) {
        // Fallback for volatile DB
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
