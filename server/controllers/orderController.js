import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '../services/mailService.js';

export const orderNotification = async (req, res) => {
  try {
    const { orderDetails, adminEmail } = req.body;
    
    if (!orderDetails || !orderDetails.customer) {
      return res.status(400).json({ success: false, message: "Order data missing" });
    }

    const finalAdminEmail = (!adminEmail || adminEmail === 'admin@vasavimart.com') 
      ? process.env.MAIL_USER 
      : adminEmail;

    console.log(`[Order Controller] Notifications: User: ${orderDetails.customer.email}, Admin: ${finalAdminEmail}`);

    // Send Confirmation Email to User
    const confirmationResult = await sendOrderConfirmationEmail(orderDetails);
    
    // Send Alert to Admin
    const adminAlertResult = await sendAdminOrderNotification(orderDetails, finalAdminEmail);

    res.status(200).json({ 
      success: true, 
      message: 'Order notifications processed',
      userEmailSent: confirmationResult.success,
      adminEmailSent: adminAlertResult.success
    });
  } catch (error) {
    console.error(`[Order Controller] Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
