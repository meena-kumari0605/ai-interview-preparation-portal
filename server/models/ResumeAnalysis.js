const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: {
    type: String,
    default: 'Resume.pdf'
  },
  targetRole: {
    type: String,
    default: 'Software Engineer'
  },
  atsScore: {
    type: Number,
    required: true
  },
  skills: [String],
  missingKeywords: [String],
  strengths: [String],
  weaknesses: [String],
  suggestedProjects: [String],
  recommendedCertifications: [String],
  careerSuggestions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

resumeAnalysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
