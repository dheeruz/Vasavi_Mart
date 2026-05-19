import express from 'express';
import { login, signup, registerNotification, requestPasswordReset, getProfile, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests, please try again later." }
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/register-notify', registerNotification);
router.post('/forgot-password', authLimiter, requestPasswordReset);

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;
