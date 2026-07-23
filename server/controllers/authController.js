const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const memoryUsers = [];

const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'super_secret_interviewai_jwt_key_2026_production',
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, experienceYears } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'Software Engineer',
        experienceYears: experienceYears || 2
      });
    } catch (dbErr) {
      const existing = memoryUsers.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }
      user = {
        _id: 'mem_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'Software Engineer',
        experienceYears: experienceYears || 2,
        createdAt: new Date()
      };
      memoryUsers.push(user);
    }

    const token = generateToken(user._id, user.email);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        experienceYears: user.experienceYears
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user;
    try {
      user = await User.findOne({ email: email.toLowerCase() });
    } catch (dbErr) {
      user = memoryUsers.find(u => u.email === email.toLowerCase());
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const token = generateToken(user._id || user.id, user.email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'Software Engineer',
        experienceYears: user.experienceYears || 2
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    let user;
    try {
      user = await User.findById(req.user.id).select('-password');
    } catch (dbErr) {
      user = memoryUsers.find(u => u._id === req.user.id);
    }

    if (!user) {
      user = {
        _id: req.user.id,
        name: 'Candidate',
        email: req.user.email,
        role: 'Software Engineer',
        experienceYears: 2
      };
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};
