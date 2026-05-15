import logger from '../utils/logger.js';

/**
 * Vasavi Mart - Environment Variable Validator
 */

export const validateEnv = () => {
  const requiredEnv = [
    'MAIL_USER',
    'MAIL_PASS',
    'CLIENT_URL',
    'JWT_SECRET'
  ];

  const missing = requiredEnv.filter(key => !process.env[key]);

  if (missing.length > 0) {
    const errorMsg = `CRITICAL: Missing environment variables: ${missing.join(', ')}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  logger.info('Environment variables validated successfully');
};
