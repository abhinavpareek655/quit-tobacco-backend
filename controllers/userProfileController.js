const UserProfile = require('../models/UserProfile');
const bcrypt = require('bcryptjs');


// ✅ Create or update user profile
exports.saveUserProfile = async (req, res) => {
  try {
    const email = req.user?.email || req.body.email;

    if (!Object.keys(req.body).length) {
      return res.status(400).json({ success: false, error: 'Request body cannot be empty' });
    }

    const password = req.body.password;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt); 
        req.body.password = hash;
    }

    const existingProfile = await UserProfile.findOne({ email });

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { email },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: existingProfile ? 'User profile updated successfully' : 'User profile created successfully',
      data: updatedProfile
    });

  } catch (error) {
    console.error('Error saving user profile:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ✅ Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const userProfile = await UserProfile.findOne({ userId }).lean();
    
    if (!userProfile) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }
    
    return res.status(200).json({ success: true, data: userProfile });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
