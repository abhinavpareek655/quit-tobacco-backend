const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verifyController');
const { authenticateUser } = require('../middleware/auth');

router.post('/', authenticateUser, verifyController.verifyUser);
router.post('/send-otp', verifyController.sendOTP);

module.exports = router;