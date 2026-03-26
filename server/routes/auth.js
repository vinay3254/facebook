const express = require('express');
const router = express.Router();
const { register, login, refreshToken, forgotPassword, resetPassword } = require('../controllers/authController');
const { body } = require('express-validator');

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', body('email').isEmail(), forgotPassword);
router.post('/reset-password/:token', body('password').isLength({ min: 6 }), resetPassword);

module.exports = router;
