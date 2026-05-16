import type { VercelRequest, VercelResponse } from '@vercel/node';
import { transporter, adminEmail } from '../_utils/transporter.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: adminEmail,
    subject: `New User Sign Up! - ${name}`,
    html: `
      <h2>New User Notification</h2>
      <p>A new user has just registered at Vasavi Mart.</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Registration Date:</strong> ${new Date().toLocaleString()}</li>
      </ul>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Signup notification sent successfully' });
  } catch (error: any) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email notification' });
  }
}
