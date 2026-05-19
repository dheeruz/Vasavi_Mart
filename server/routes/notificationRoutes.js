import express from 'express';
import mailService from '../services/mailService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * Vasavi Mart - Test & Internal Notification Routes
 */

// POST /api/notify/test
// Responds immediately with 202 and processes email in the background
// to prevent SMTP timeouts from killing the request on Render.
router.post('/test', (req, res) => {
  const { email } = req.body;

  // Respond immediately so the browser doesn't time out
  res.status(202).json({ 
    success: true, 
    message: 'Test email is being sent in the background. Check your inbox in ~30 seconds.' 
  });

  // Fire-and-forget background send (does NOT block the response)
  (async () => {
    try {
      logger.info(`Background SMTP test starting for: ${email || 'Admin'}...`);
      const result = await mailService.sendAdminAlert(
        'System Test', 
        'Manually triggered system SMTP test from Vasavi Mart Admin.', 
        `Target: ${email || 'Admin'} | Timestamp: ${new Date().toISOString()}`,
        '#2F8F4C', // Green for success test
        true // bypassQueue — send directly, not through the queue
      );
      if (result.success) {
        logger.info(`Background SMTP test email sent successfully to ${email || 'Admin'}.`);
      } else {
        logger.error('Background SMTP test failed:', result.error);
      }
    } catch (err) {
      logger.error('Background SMTP test exception:', err.stack || err.message);
    }
  })();
});

// POST /api/notify/order-test
router.post('/order-test', async (req, res) => {
  try {
    const { email, name } = req.body;
    const mockOrder = {
      orderId: 'VM' + Math.floor(1000 + Math.random() * 9000),
      customerName: name || 'Test Customer',
      items: [
        { name: 'Organic Tomatoes', quantity: 2, price: 45.00 },
        { name: 'Basmati Rice 5kg', quantity: 1, price: 550.00 }
      ],
      totalAmount: 640.00,
      shippingAddress: '123 Test Lane, Bangalore, KA 560001',
      estimatedDelivery: 'Tomorrow, by 6:00 PM'
    };

    await mailService.sendOrderConfirmation(email, mockOrder);
    
    res.status(200).json({ 
      success: true, 
      message: "Order confirmation test queued" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/notify/signup-test
router.post('/signup-test', async (req, res) => {
  try {
    const { email, name } = req.body;
    await mailService.sendWelcome(email, name || 'New Shopper');
    
    res.status(200).json({ 
      success: true, 
      message: "Welcome email test queued" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/notify/low-stock-alert
router.post('/low-stock-alert', async (req, res) => {
  try {
    const { productName, stock, productId } = req.body;
    await mailService.sendAdminAlert(
      'Low Stock Warning',
      `Product "${productName}" is running low on stock.`,
      `Product: ${productName}\nCurrent Stock: ${stock}\nProduct ID: ${productId}`,
      '#e11d48' // Red alert
    );
    
    res.status(200).json({ 
      success: true, 
      message: "Low stock alert queued" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/notify/status
router.get('/status', async (req, res) => {
  const isConfigured = !!(process.env.MAIL_USER && process.env.MAIL_PASS);
  res.status(200).json({
    success: true,
    smtp: isConfigured,
    message: isConfigured ? "Email system configured" : "Email system missing credentials"
  });
});

export default router;
