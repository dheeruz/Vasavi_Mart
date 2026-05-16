import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import './Toast.css';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast-message ${type}`}>
      <div className="toast-icon">
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
