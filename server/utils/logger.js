/**
 * Vasavi Mart - Structured Logger Utility
 */
const logger = {
  info: (message, meta = {}) => {
    console.log(`[${new Date().toISOString()}] [INFO] ${message}`, Object.keys(meta).length ? meta : '');
  },
  warn: (message, meta = {}) => {
    console.warn(`[${new Date().toISOString()}] [WARN] ${message}`, Object.keys(meta).length ? meta : '');
  },
  error: (message, error = null, meta = {}) => {
    console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, {
      errorMessage: error?.message || error,
      stack: error?.stack,
      ...meta
    });
  }
};

export default logger;
