import mailService from '../services/mailService.js';
import authService from '../services/authService.js';
import logger from '../utils/logger.js';

/**
 * Handle new user registration notification
 */
export const registerNotification = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    logger.info(`Processing registration notification for ${email}`);

    // Send Welcome Email to User
    await mailService.sendWelcome(email, name || 'Customer');

    // Send Admin Alert
    await mailService.sendAdminAlert(
      'New User Registration',
      `A new customer has joined ${process.env.COMPANY_NAME || 'Vasavi Mart'}.`,
      `Customer: ${name} (${email})`,
      '#2F8F4C'
    );

    res.status(200).json({ success: true, message: "Registration notifications queued" });
  } catch (error) {
    logger.error('Registration notification failed', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Handle password reset request
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    // Generate secure token (mock logic)
    const { rawToken } = await authService.createPasswordReset(email);

    // Send Reset Email
    await mailService.sendPasswordReset(email, name || 'Customer', rawToken);

    res.status(200).json({ 
      success: true, 
      message: "If an account exists with that email, a reset link has been sent." 
    });
  } catch (error) {
    logger.error('Password reset request failed', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
