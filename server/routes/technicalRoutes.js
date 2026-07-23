const express = require('express');
const router = express.Router();
const technicalController = require('../controllers/technicalController');
const authMiddleware = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authMiddleware(req, res, next);
  }
  next();
};

// Endpoint: GET /api/technical/problems
router.get('/problems', technicalController.getProblems);

// Endpoint: POST /api/technical
router.post('/', optionalAuth, technicalController.handleTechnicalSubmission);

module.exports = router;
