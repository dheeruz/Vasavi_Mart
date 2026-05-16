import type { VercelRequest, VercelResponse } from '@vercel/node';
import { transporter, adminEmail } from '../_utils/transporter.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { order } = req.body;

  if (!order) {
    return res.status(400).json({ error: 'Order data is missing' });
  }

  const itemsHtml = order.items
    .map((item: any) => `<li>${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>`)
    .join('');

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: adminEmail,
    subject: `New Order Received - #${order.id}`,
    html: `
      <h2>New Order Placed!</h2>
      <p><strong>Order ID:</strong> #${order.id}</p>
      <p><strong>Customer:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
      <p><strong>Email:</strong> ${order.customer.email}</p>
      <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.zipCode}</p>
      <h3>Items:</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Subtotal:</strong> ₹${order.subtotal.toFixed(2)}</p>
      <p><strong>Tax:</strong> ₹${order.tax.toFixed(2)}</p>
      <p><strong>Shipping:</strong> ₹${order.shipping.toFixed(2)}</p>
      <p><strong>Total Amount:</strong> ₹${order.total.toFixed(2)}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Order notification sent successfully' });
  } catch (error: any) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email notification' });
  }
}
