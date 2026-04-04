import { sendWelcomeEmail, sendAdminNewUserEmail } from '../services/mailService.js';

export const registerNotification = async (req, res) => {
  try {
    const { userData, adminEmail } = req.body;
    
    if (!userData || !userData.email) {
      return res.status(400).json({ success: false, message: "User data missing" });
    }

    const finalAdminEmail = (!adminEmail || adminEmail === 'admin@vasavimart.com') 
      ? process.env.MAIL_USER 
      : adminEmail;

    console.log(`[Auth Controller] Notifications: User: ${userData.email}, Admin: ${finalAdminEmail}`);

    // Send Welcome Email to User
    const welcomeResult = await sendWelcomeEmail(userData);
    
    // Send Alert to Admin
    const adminAlertResult = await sendAdminNewUserEmail(userData, finalAdminEmail);

    res.status(200).json({ 
      success: true, 
      message: 'Registration notifications processed',
      userEmailSent: welcomeResult.success,
      adminEmailSent: adminAlertResult.success
    });
  } catch (error) {
    console.error(`[Auth Controller] Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
