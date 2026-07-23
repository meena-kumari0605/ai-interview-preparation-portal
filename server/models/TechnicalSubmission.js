const mongoose = require('mongoose');

const technicalSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: String,
    required: true,
    index: true
  },
  problemTitle: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  passedCount: {
    type: Number,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  },
  compilationErrors: String,
  runtimeErrors: String,
  timeComplexity: String,
  spaceComplexity: String,
  executionTimeMs: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

technicalSubmissionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('TechnicalSubmission', technicalSubmissionSchema);
