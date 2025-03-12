const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const { authenticateUser } = require('../middleware/auth');

// Route to save (create or update) user profile
router.post('/', authenticateUser, userProfileController.saveUserProfile);

// Route to get user profile
router.get('/:email?', authenticateUser, userProfileController.getUserProfile);

module.exports = router;