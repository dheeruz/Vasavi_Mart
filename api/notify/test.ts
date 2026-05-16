import type { VercelRequest, VercelResponse } from '@vercel/node';
import { transporter, adminEmail } from '../_utils/transporter.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: adminEmail,
    subject: `Test Notification from Vasavi Mart`,
    html: `
      <h2>System Test Successful!</h2>
      <p>This is a test notification from your Vasavi Mart Admin panel.</p>
      <p>Your email notification system is now properly configured and working.</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
    `,
  };

  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      return res.status(500).json({ 
        error: 'Environment variables MAIL_USER or MAIL_PASS are not set on Vercel.' 
      });
    }

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Test notification sent successfully' });
  } catch (error: any) {
    console.error('Email error:', error);
    
    let userMessage = error.message;
    if (userMessage.includes('535')) {
      userMessage = "Invalid Gmail Login. Please ensure 2-Step Verification is ON and you are using a 16-character App Password (NOT your normal password).";
    }
    
    return res.status(500).json({ error: `Failed: ${userMessage}` });
  }
}
