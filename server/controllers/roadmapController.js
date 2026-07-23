const aiService = require('../services/aiService');
const CareerRoadmap = require('../models/CareerRoadmap');

/**
 * Handles POST /api/roadmap
 */
exports.handleCareerRoadmap = async (req, res, next) => {
  try {
    const { targetRole, currentSkills, experience } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Target Role is required to generate a personalized career roadmap.'
      });
    }

    const roadmapData = await aiService.generateCareerRoadmap({
      targetRole,
      currentSkills: currentSkills || 'General Programming',
      experience: experience || '1'
    });

    if (req.user) {
      try {
        await CareerRoadmap.create({
          user: req.user.id,
          targetRole,
          currentSkills: currentSkills || 'General Programming',
          experience: experience || '1',
          estimatedTimeframe: roadmapData.estimatedTimeframe,
          learningPath: roadmapData.learningPath,
          projects: roadmapData.projects,
          technologies: roadmapData.technologies,
          certifications: roadmapData.certifications,
          timeline: roadmapData.timeline,
          freeResources: roadmapData.freeResources
        });
      } catch (dbErr) {
        // Fallback for volatile DB
      }
    }

    res.status(200).json({
      success: true,
      data: roadmapData
    });
  } catch (error) {
    next(error);
  }
};
