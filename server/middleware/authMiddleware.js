import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    logger.warn(`Unauthorized access attempt: No token provided on route ${req.originalUrl}`);
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vasaviMart@2026SecureKey');
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Invalid token attempt: ${error.message} on route ${req.originalUrl}`);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    logger.warn(`Access denied: User ${req.user?.id} attempted to access admin route ${req.originalUrl}`);
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};
