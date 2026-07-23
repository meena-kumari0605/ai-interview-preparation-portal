const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authMiddleware(req, res, next);
  }
  next();
};

// Endpoint: POST /api/resume
router.post('/', optionalAuth, upload.single('resume'), resumeController.handleResumeAnalysis);

module.exports = router;
