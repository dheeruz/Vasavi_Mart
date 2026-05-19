import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

/**
 * Vasavi Mart - Centralized Email Configuration
 */

import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);

// Initialize transporter asynchronously to ensure IPv4 resolution
let transporter;

const createTransporter = async () => {
  if (transporter) return transporter;
  
  try {
    // Manually resolve to IPv4 to definitively bypass Render's IPv6 ENETUNREACH
    const addresses = await resolve4('smtp.gmail.com');
    const ipv4Address = addresses[0];
    
    logger.info(`Resolved smtp.gmail.com to IPv4: ${ipv4Address}`);
    
    transporter = nodemailer.createTransport({
      host: ipv4Address,
      port: 587,
      secure: false, // Must be false for port 587 (STARTTLS)
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        servername: 'smtp.gmail.com', // Required for SSL certificate validation
        rejectUnauthorized: false,
      },
    });
    
    return transporter;
  } catch (error) {
    logger.error('Failed to resolve smtp.gmail.com to IPv4', error);
    // Fallback to standard initialization if DNS fails
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });
    return transporter;
  }
};

export const verifyEmailConnection = async () => {
  try {
    const t = await createTransporter();
    await t.verify();
    logger.info('SMTP Server connection verified successfully');
    return true;
  } catch (error) {
    logger.error('SMTP Connection Failed', error);
    return false;
  }
};

export const getTransporter = async () => {
  return await createTransporter();
};

export default getTransporter;
