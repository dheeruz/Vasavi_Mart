import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

/**
 * Vasavi Mart - Centralized Email Configuration
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 10000, // 10s
  greetingTimeout: 10000,
  socketTimeout: 20000, // 20s
});

export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    logger.info('SMTP Server connection verified successfully');
    return true;
  } catch (error) {
    logger.error('SMTP Connection Failed', error);
    return false;
  }
};

export default transporter;
