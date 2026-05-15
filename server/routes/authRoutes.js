import express from 'express';
import { registerNotification, requestPasswordReset } from '../controllers/authController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour for password resets
  message: { success: false, message: "Too many password reset requests, please try again in an hour." }
});

router.post('/register-notify', registerNotification);
router.post('/forgot-password', authLimiter, requestPasswordReset);

export default router;
