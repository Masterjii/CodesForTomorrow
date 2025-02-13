const express = require('express');
const { register, login, logout } = require('../controllers/auth.controller');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validRequest');
const { protect } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/authorizeRole');

const router = express.Router();

// Register Route
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  register
);

// Login Route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
);

// Logout Route (Protected)
router.post('/logout', protect, logout);

// Example route accessible by all authenticated users
router.get('/profile', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is your profile` });
});

// Admin-only route: only users with the role "admin" can access this route.
router.get('/admin-only', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have admin access!` });
});

// Example route accessible by both admin and user roles (if needed)
router.get('/common', protect, authorizeRoles('admin', 'user'), (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are allowed here` });
});


module.exports = router;
