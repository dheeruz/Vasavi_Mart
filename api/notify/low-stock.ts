import type { VercelRequest, VercelResponse } from '@vercel/node';
import { transporter, adminEmail } from '../_utils/transporter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product } = req.body;

  if (!product || !product.name) {
    return res.status(400).json({ error: 'Product data is missing' });
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: adminEmail,
    subject: `Low Stock Alert: ${product.name}`,
    html: `
      <h2 style="color: #ef4444;">Inventory Alert!</h2>
      <p>The following product is running low on stock:</p>
      <ul>
        <li><strong>Product Name:</strong> ${product.name}</li>
        <li><strong>Current Stock:</strong> <span style="font-weight: bold; color: #ef4444;">${product.stock} units</span> left</li>
        <li><strong>Category:</strong> ${product.category}</li>
      </ul>
      <p>Please restock this item soon to avoid running out.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Low stock alert sent successfully' });
  } catch (error: any) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email notification' });
  }
}
