const bcrypt = require('bcryptjs');
const UserProfile = require('../models/UserProfile');

exports.loginUser = async (req, res) => {
    try { 
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const user = await UserProfile.findOne({ email});
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        else {
            const isMatch = await bcrypt.compare(hash, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, error: 'Invalid credentials' });
            }
            else {
                return res.status(200).json({ success: true, message: 'User logged in successfully' });
            }
        }
    }
    catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};