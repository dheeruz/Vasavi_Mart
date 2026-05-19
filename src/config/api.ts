/**
 * Vasavi Mart - Global API Configuration
 * 
 * Automatically switches between local and production API endpoints
 */

const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (isLocal ? 'http://localhost:5000' : 'https://vasavi-mart.onrender.com');

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  ORDER: `${API_BASE_URL}/api/orders`,
  NOTIFY: `${API_BASE_URL}/api/notify`,
  PAYMENT: `${API_BASE_URL}/api/payment`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  ADMIN: `${API_BASE_URL}/api/admin`,
  CART: `${API_BASE_URL}/api/cart`,
  WISHLIST: `${API_BASE_URL}/api/wishlist`
};
