const express = require('express');
const router = express.Router();
const userLoginController = require('../controllers/userLoginController');
const { authenticateUser } = require('../middleware/auth');

router.post('/', authenticateUser, userLoginController.loginUser);

module.exports = router;