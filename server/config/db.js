const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interviewai';
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 50, // Connection pooling for 50+ concurrent requests
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (Pool Size: 50)`);
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection failed: ${error.message}. Running in volatile fallback memory mode.`);
  }
};

module.exports = connectDB;
