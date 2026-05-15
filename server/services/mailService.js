import { renderTemplate } from '../utils/templateLoader.js';
import emailQueue from '../utils/emailQueue.js';
import logger from '../utils/logger.js';
import branding from '../config/branding.js';

/**
 * Vasavi Mart - Transactional Email Service
 * Uses a queue to handle sends asynchronously and prevent blocking APIs.
 */

const mailService = {
  /**
   * General purpose sender with template rendering
   */
  send: async (to, subject, templateName, data = {}, text = '') => {
    try {
      const html = await renderTemplate(templateName, data);
      await emailQueue.add(to, subject, html, text);
      return { success: true };
    } catch (error) {
      logger.error(`Mail service error for ${templateName}`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Welcome Email for New Users
   */
  sendWelcome: async (email, name) => {
    return await mailService.send(
      email,
      `Welcome to ${branding.companyName}!`,
      'welcome',
      { name, CLIENT_URL: process.env.CLIENT_URL }
    );
  },

  /**
   * Order Confirmation for Customers
   */
  sendOrderConfirmation: async (email, order) => {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td>
          <div class="product-name">${item.name}</div>
          <div class="product-qty">Qty: ${item.quantity} x ₹${item.price}</div>
        </td>
        <td style="text-align: right; font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const plainText = `
      Hi ${order.customer.firstName},
      Your order #${order.id} has been confirmed!
      Total: ₹${order.total}
      Delivery to: ${order.customer.address}, ${order.customer.city}
      Estimated Delivery: 2-3 Business Days
      Thank you for shopping at Vasavi Mart!
    `;

    return await mailService.send(
      email,
      `Your Vasavi Mart Order Has Been Confirmed - #${order.id}`,
      'customerOrderConfirmation',
      { 
        orderId: order.id,
        customerName: order.customer.firstName,
        subtotal: order.subtotal.toFixed(2),
        tax: order.tax.toFixed(2),
        shippingText: order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`,
        total: order.total.toFixed(2),
        shippingAddress: `${order.customer.address}, ${order.customer.city} - ${order.customer.zipCode}`,
        paymentMethod: order.paymentMethod,
        estimatedDelivery: '2-3 Business Days',
        itemsHtml,
        CLIENT_URL: process.env.CLIENT_URL 
      },
      plainText
    );
  },

  /**
   * Admin Alert for New Orders
   */
  sendAdminNewOrderAlert: async (order) => {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td>${item.name} (x${item.quantity})</td>
        <td style="text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    return await mailService.send(
      process.env.MAIL_USER,
      `New Order Received - Vasavi Mart (#${order.id})`,
      'adminNewOrderAlert',
      {
        orderId: order.id,
        date: new Date(order.date).toLocaleString(),
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        customerEmail: order.customer.email,
        shippingAddress: `${order.customer.address}, ${order.customer.city}`,
        total: order.total.toFixed(2),
        paymentMethod: order.paymentMethod,
        itemsHtml,
        CLIENT_URL: process.env.CLIENT_URL
      }
    );
  },

  /**
   * Order Status Update (Processing/Shipped/Delivered)
   */
  sendStatusUpdate: async (email, orderId, customerName, status) => {
    let statusMessage = '';
    switch(status.toLowerCase()) {
      case 'shipped':
        statusMessage = 'Your order has been shipped and is on its way to you!';
        break;
      case 'delivered':
        statusMessage = 'Your order has been successfully delivered. We hope you enjoy your purchase!';
        break;
      default:
        statusMessage = `Your order status has been updated to ${status}.`;
    }

    return await mailService.send(
      email,
      `Order Status Update - #${orderId}`,
      'order-status',
      { 
        orderId, 
        customerName, 
        status, 
        statusMessage,
        CLIENT_URL: process.env.CLIENT_URL 
      }
    );
  },

  /**
   * Password Reset Email
   */
  sendPasswordReset: async (email, name, resetToken) => {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    return await mailService.send(
      email,
      'Password Reset Request',
      'password-reset',
      { name, resetLink }
    );
  },

  /**
   * Admin Alert (New Order / Low Stock)
   */
  sendAdminAlert: async (type, message, details, color = '#F8961E') => {
    return await mailService.send(
      process.env.MAIL_USER, // Admin email
      `[ADMIN ALERT] ${type}`,
      'admin-alert',
      { 
        alertType: type, 
        alertMessage: message, 
        alertDetails: details, 
        alertColor: color,
        timestamp: new Date().toLocaleString(),
        CLIENT_URL: process.env.CLIENT_URL 
      }
    );
  }
};

export default mailService;
