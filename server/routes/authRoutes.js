
const express = require('express');

const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require('../controllers/authController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/me', protect, getMe);

// Logout route
router.post('/logout', logoutUser);

module.exports = router;
