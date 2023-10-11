// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define routes
router.get('/login', authController.loginController);
router.post('/signup', authController.signupController);
router.post('/refresh', authController.refreshAccessTokenController);

module.exports = router;