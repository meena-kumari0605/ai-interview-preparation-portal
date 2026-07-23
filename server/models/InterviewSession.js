const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['MOCK', 'HR'],
    required: true,
    index: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: 'General'
  },
  experience: {
    type: String,
    default: '2'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  questions: [{
    question: String,
    category: String,
    answer: String,
    skipped: { type: Boolean, default: false },
    score: Number,
    metrics: Object,
    strengths: [String],
    weaknesses: [String],
    betterAnswer: String,
    followUpQuestion: String
  }],
  overallScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED'],
    default: 'COMPLETED'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

interviewSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
