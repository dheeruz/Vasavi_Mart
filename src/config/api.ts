/**
 * Vasavi Mart - Global API Configuration
 * 
 * Automatically switches between local and production API endpoints
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  ORDER: `${API_BASE_URL}/api/order`,
  NOTIFY: `${API_BASE_URL}/api/notify`,
  PAYMENT: `${API_BASE_URL}/api/payment`
};
