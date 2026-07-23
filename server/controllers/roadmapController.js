const aiService = require('../services/aiService');
const CareerRoadmap = require('../models/CareerRoadmap');
const memoryStore = require('../utils/memoryStore');

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

    const userId = req.user ? (req.user.id || req.user._id) : null;
    if (userId) {
      const roadmapRecord = {
        user: userId,
        targetRole,
        currentSkills: currentSkills || 'General Programming',
        experience: experience || '1',
        estimatedTimeframe: roadmapData.estimatedTimeframe,
        learningPath: roadmapData.learningPath,
        projects: roadmapData.projects,
        technologies: roadmapData.technologies,
        certifications: roadmapData.certifications,
        timeline: roadmapData.timeline,
        freeResources: roadmapData.freeResources,
        createdAt: new Date()
      };

      memoryStore.addCareerRoadmap(roadmapRecord);

      try {
        await CareerRoadmap.create(roadmapRecord);
        console.log(`[Dashboard Sync] Career Roadmap saved successfully to MongoDB for user: ${userId}`);
      } catch (dbErr) {
        console.error(`[Dashboard Sync Warning] MongoDB Atlas save failed for Career Roadmap: ${dbErr.message}`);
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
