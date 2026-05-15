import mailService from '../services/mailService.js';
import logger from '../utils/logger.js';

/**
 * Handle new order placement notification
 */
export const orderNotification = async (req, res) => {
  try {
    const { orderDetails } = req.body;
    
    if (!orderDetails || !orderDetails.id) {
      return res.status(400).json({ success: false, message: "Order details are required" });
    }

    logger.info(`Processing order notification for #${orderDetails.id}`);

    // 1. Send Confirmation to Customer
    await mailService.sendOrderConfirmation(orderDetails.customer.email, orderDetails);

    // 2. Send Alert to Admin
    await mailService.sendAdminNewOrderAlert(orderDetails);

    res.status(200).json({ success: true, message: "Order notifications queued" });
  } catch (error) {
    logger.error('Order notification failed', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Handle order status update notification
 */
export const updateStatusNotification = async (req, res) => {
  try {
    const { email, orderId, customerName, status } = req.body;

    if (!email || !orderId || !status) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    logger.info(`Processing status update notification for #${orderId} -> ${status}`);

    await mailService.sendStatusUpdate(email, orderId, customerName, status);

    res.status(200).json({ success: true, message: `Status update notification for ${status} queued` });
  } catch (error) {
    logger.error('Status update notification failed', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
