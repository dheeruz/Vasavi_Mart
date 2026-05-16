import logger from './logger.js';
import getTransporter from '../config/emailConfig.js';
import branding from '../config/branding.js';

/**
 * Vasavi Mart - Lightweight In-Memory Email Queue
 */

class EmailQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.maxRetries = 3;
  }

  /**
   * Add a job to the queue
   */
  async add(to, subject, html, text = '', retries = 0) {
    this.queue.push({ to, subject, html, text, retries });
    logger.info(`Email added to queue: ${subject} to ${to}`);
    this.processQueue();
  }

  /**
   * Process jobs in the queue one by one
   */
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const job = this.queue.shift();

    try {
      const mailOptions = {
        from: `"${branding.companyName}" <${process.env.MAIL_USER}>`,
        to: job.to,
        subject: job.subject,
        text: job.text,
        html: job.html,
      };

      const transporter = await getTransporter();
      await transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully from queue: ${job.subject} to ${job.to}`);
    } catch (error) {
      logger.error(`Queue send error: ${job.subject} to ${job.to}`, error);

      if (job.retries < this.maxRetries) {
        job.retries++;
        logger.warn(`Retrying email (${job.retries}/${this.maxRetries}): ${job.subject}`);
        this.queue.push(job);
      } else {
        logger.error(`Email failed after ${this.maxRetries} retries: ${job.subject}`);
      }
    } finally {
      this.isProcessing = false;
      // Continue processing next job if any
      setImmediate(() => this.processQueue());
    }
  }
}

const emailQueue = new EmailQueue();
export default emailQueue;
