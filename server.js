import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { validateEnv } from './server/middleware/validator.js';
import { verifyEmailConnection } from './server/config/emailConfig.js';
import logger from './server/utils/logger.js';

// Route Imports
import authRoutes from './server/routes/authRoutes.js';
import orderRoutes from './server/routes/orderRoutes.js';
import notificationRoutes from './server/routes/notificationRoutes.js';

dotenv.config();

// Validate Environment Variables
validateEnv();

const app = express();

// Security Middleware
app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'https://vasavi-mart-q5b1.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow any localhost port for local development convenience
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// SMTP Verification on startup
verifyEmailConnection();

// Request logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Razorpay Initialization
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'dummy_key_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'dummy_api_secret';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/notify', notificationRoutes);

// Payment Routes (Internal for now)
app.post('/api/payment/order', async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    if (RAZORPAY_KEY_ID === 'dummy_key_id') {
      return res.status(500).json({ error: 'Server configuration error: Razorpay keys are missing' });
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const options = {
      amount: amountInPaise, 
      currency: "INR",
      receipt: receipt || `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID
    });
  } catch (error) {
    logger.error("Error creating Razorpay order", error);
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
    logger.error("Verification error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`[Vasavi Mart Backend] Running on port ${PORT}`);
});
