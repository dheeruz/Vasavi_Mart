import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('[Email Service] Connection Error:', error.message);
  } else {
    console.log('[Email Service] Server is ready to take our messages');
  }
});

/**
 * Reusable email sending function with logging
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Vasavi Mart" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Email sent: ${subject} to ${to} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Service] Error sending email: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Send Welcome Email to New User
 */
export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <div style="background-color: #2F8F4C; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Vasavi Mart!</h1>
      </div>
      <div style="padding: 30px; background-color: #fff; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; color: #2F8F4C;"><strong>Hello ${user.name},</strong></p>
        <p>We are absolutely thrilled to have you join the Vasavi Mart family! Get ready to experience the freshest groceries delivered straight to your doorstep.</p>
        <p>Whether you're looking for organic vegetables, pantry staples, or delicious local treats, we've got you covered.</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="http://localhost:5173/shop" style="background-color: #2F8F4C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Start Shopping Now</a>
        </div>
        
        <p>If you have any questions, our support team is always here to help.</p>
        <p>Warm regards,<br>The Vasavi Mart Team</p>
      </div>
      <div style="text-align: center; padding-top: 20px; font-size: 12px; color: #999;">
        © 2026 Vasavi Mart. All rights reserved.
      </div>
    </div>
  `;
  return await sendEmail(user.email, "Welcome to Vasavi Mart", html);
};

/**
 * Send New User Notification to Admin
 */
export const sendAdminNewUserEmail = async (user, adminEmail) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
      <h2 style="color: #2F8F4C; border-bottom: 2px solid #2F8F4C; padding-bottom: 10px;">New User Registered</h2>
      <p>System Alert: A new customer has successfully created an account.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #555;">User Identity</h3>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Registered On:</strong> ${new Date().toLocaleString()}</p>
      </div>

      <div style="margin-top: 20px;">
        <a href="http://localhost:5174/admin/customers" style="background: #2F8F4C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Manage Customers</a>
      </div>
    </div>
  `;
  return await sendEmail(adminEmail || process.env.MAIL_USER, "System Alert: New User Registered", html);
};

/**
 * Send Order Confirmation to User
 */
export const sendOrderConfirmationEmail = async (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x ${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #2F8F4C; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Order Confirmed!</h1>
        <p style="color: #EBF7EE; margin-top: 5px;">Order ID: #${order.id}</p>
      </div>
      
      <div style="padding: 30px; background-color: #fff; border: 1px solid #eee; border-top: none;">
        <p>Hi ${order.customer.firstName},</p>
        <p>Thank you for shopping at Vasavi Mart! Your order has been placed successfully and is being prepared for delivery.</p>
        
        <h3 style="border-bottom: 2px solid #EBF7EE; padding-bottom: 10px; margin-top: 30px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 15px 10px; font-weight: bold;">Total</td>
            <td style="padding: 15px 10px; text-align: right; font-weight: bold; color: #2F8F4C; font-size: 18px;">₹${order.total.toFixed(2)}</td>
          </tr>
        </table>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Delivery Address</h4>
          <p style="margin: 5px 0;">${order.customer.firstName} ${order.customer.lastName}</p>
          <p style="margin: 5px 0;">${order.customer.address}, ${order.customer.city}</p>
          <p style="margin: 5px 0;">${order.customer.zipCode}</p>
        </div>
        
        <p style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:5173/account" style="color: #2F8F4C; font-weight: bold; text-decoration: underline;">Track your order status</a>
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
        If you have any issues with your order, please reply to this email or contact support.
      </div>
    </div>
  `;
  return await sendEmail(order.customer.email, `Order Confirmation - #${order.id}`, html);
};

/**
 * Send New Order Notification to Admin
 */
export const sendAdminOrderNotification = async (order, adminEmail) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
      <h2 style="color: #F8961E; border-bottom: 2px solid #F8961E; padding-bottom: 10px;">New Order Received</h2>
      <div style="background: #FFF8E1; border-left: 4px solid #F8961E; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Order ID:</strong> #${order.id}</p>
        <p style="margin: 5px 0 0 0;"><strong>Revenue:</strong> ₹${order.total.toFixed(2)}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #555;">Customer Info</h3>
        <p><strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      </div>

      <div style="margin-top: 30px;">
        <a href="http://localhost:5174/admin/orders" style="background: #F8961E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Open Admin Dashboard</a>
      </div>
    </div>
  `;
  return await sendEmail(adminEmail || process.env.MAIL_USER, `URGENT: New Order #${order.id}`, html);
};
