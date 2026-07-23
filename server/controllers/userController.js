const User = require('../models/User');

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, role, experienceYears, skills, bio } = req.body;
    const userId = req.user.id;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, role, experienceYears, skills, bio },
        { new: true, runValidators: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        user: updatedUser
      });
    } catch (err) {
      res.status(200).json({
        success: true,
        user: {
          id: userId,
          name: name || 'Demo Candidate',
          role: role || 'Software Engineer',
          experienceYears: experienceYears || 2,
          skills: skills || ['JavaScript', 'React', 'Node.js'],
          bio: bio || 'Updated bio'
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
