// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define routes
router.post('/login', authController.loginController);
router.post('/signup', authController.signupController);
router.get('/refresh', authController.refreshAccessTokenController);
router.get('/temp', authController.tempController);

module.exports = router;