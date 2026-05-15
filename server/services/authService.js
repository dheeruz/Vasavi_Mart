import crypto from 'crypto';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';

/**
 * Vasavi Mart - Authentication & Security Service
 */

class AuthService {
  /**
   * Generate a cryptographically secure random token
   */
  generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash a token for secure storage
   */
  async hashToken(token) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(token, salt);
  }

  /**
   * Compare a raw token with a hashed one
   */
  async verifyToken(token, hashedToken) {
    return await bcrypt.compare(token, hashedToken);
  }

  /**
   * Simple mock for demonstration (In a real app, this would be a DB call)
   * This is used for the password reset flow.
   */
  async createPasswordReset(userEmail) {
    const rawToken = this.generateResetToken();
    const hashedToken = await this.hashToken(rawToken);
    const expires = Date.now() + 3600000; // 1 hour expiration

    logger.info(`Created password reset token for ${userEmail}`);

    return {
      rawToken,
      hashedToken,
      expires
    };
  }
}

export default new AuthService();
