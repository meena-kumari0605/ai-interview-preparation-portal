const mongoose = require('mongoose');

const careerRoadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  currentSkills: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  estimatedTimeframe: String,
  learningPath: [Object],
  projects: [Object],
  technologies: [String],
  certifications: [String],
  timeline: String,
  freeResources: [Object],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CareerRoadmap', careerRoadmapSchema);
