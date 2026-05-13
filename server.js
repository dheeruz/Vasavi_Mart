import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { registerNotification } from './server/controllers/authController.js';
import { orderNotification } from './server/controllers/orderController.js';

import { sendTestEmail } from './server/services/mailService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.url}`);
  next();
});

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'dummy_key_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'dummy_api_secret';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Email Service Helper Routes
app.post('/api/auth/register-notify', registerNotification);
app.post('/api/order/place-notify', orderNotification);
app.post('/api/notify/test', async (req, res) => {
  try {
    const result = await sendTestEmail();
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: "Test notification route working and email sent!" 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.post('/api/payment/order', async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    if (RAZORPAY_KEY_ID === 'dummy_key_id') {
      return res.status(500).json({ error: 'Server configuration error: Razorpay keys are missing from Setup' });
    }

    // Convert to Paise precisely
    const amountInPaise = Math.round(Number(amount) * 100);
    console.log(`[Payment] Creating order for ₹${amount} (${amountInPaise} Paise)`);

    const options = {
      amount: amountInPaise, 
      currency: "INR",
      receipt: receipt || `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).json({ error: "Error creating Razorpay order" });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.post('/api/payment/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.status(200).json({ message: "Payment verified successfully", verified: true });
    } else {
      res.status(400).json({ message: "Invalid signature sent!", verified: false });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`[Local Backend] Running on http://localhost:${PORT}`);
});
