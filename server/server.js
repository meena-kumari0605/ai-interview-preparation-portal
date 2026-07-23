const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, aiLimiter } = require('./middleware/rateLimiter');

// Auto-create server/.env if it does not exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log(`[Configuration] Created server/.env automatically from .env.example.`);
  } else {
    fs.writeFileSync(envPath, 'PORT=5000\nNODE_ENV=development\nGROQ_API_KEY=\nMODEL_NAME=llama-3.3-70b-versatile\n');
    console.log(`[Configuration] Created server/.env automatically.`);
  }
}

// Load Environment Variables from server/.env
dotenv.config({ path: envPath });

// Connect MongoDB
connectDB();

const selectedModel = process.env.MODEL_NAME || 'llama-3.3-70b-versatile';

// Validate GROQ_API_KEY during startup
const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey || groqApiKey.trim() === '' || groqApiKey === 'your_groq_api_key_here') {
  console.error(`\n======================================================================`);
  console.error(`[CONFIGURATION ERROR] Groq API Key is not configured. Please add GROQ_API_KEY to server/.env.`);
  console.error(`All AI evaluation endpoints require a valid Groq API Key.`);
  console.error(`Active Model Target: ${selectedModel}`);
  console.error(`----------------------------------------------------------------------`);
  console.error(`How to add your GROQ_API_KEY:`);
  console.error(`1. Get a free API key at Groq Console: https://console.groq.com/keys`);
  console.error(`2. Open 'server/.env' and set: GROQ_API_KEY=your_actual_key_here`);
  console.error(`======================================================================\n`);
} else {
  console.log(`[Configuration] Official Groq SDK loaded with Model: ${selectedModel}.`);
}

const app = express();

// Enable Trust Proxy for AWS App Runner & HTTPS load balancers
app.set('trust proxy', 1);

// Enable Production CORS & Body Parsers
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Apply General Rate Limiter to all /api routes
app.use('/api', apiLimiter);

// Health Check Endpoint for AWS App Runner & Docker
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '';
  res.status(200).json({
    status: 'HEALTHY',
    service: 'InterviewAI Backend API',
    sdk: 'groq-sdk (Official Groq SDK)',
    model: selectedModel,
    groqConfigured: hasKey,
    timestamp: new Date().toISOString()
  });
});

// Apply Strict Rate Limiter to AI Evaluation Modules
app.use('/api/mock-interview', aiLimiter);
app.use('/api/hr-interview', aiLimiter);
app.use('/api/technical', aiLimiter);
app.use('/api/resume', aiLimiter);
app.use('/api/roadmap', aiLimiter);

// Register Independent API Module Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/mock-interview', require('./routes/mockRoutes'));
app.use('/api/hr-interview', require('./routes/hrRoutes'));
app.use('/api/technical', require('./routes/technicalRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Serve React production build from client/dist if available
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // 404 Route Handler for standalone API
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API Route ${req.originalUrl} not found`
    });
  });
}

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`InterviewAI Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Selected AI Model: ${selectedModel}`);
  console.log(`==================================================`);
});

module.exports = app;
