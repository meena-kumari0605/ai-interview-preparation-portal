const express = require('express');
const router = express.Router();
const mockController = require('../controllers/mockController');
const authMiddleware = require('../middleware/auth');

// Endpoint: POST /api/mock-interview (optional auth token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authMiddleware(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, mockController.handleMockInterview);

module.exports = router;
