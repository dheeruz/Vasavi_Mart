import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

/**
 * Vasavi Mart - Centralized Email Configuration
 */

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
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
