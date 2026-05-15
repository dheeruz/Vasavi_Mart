import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import './Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">We'll send you a link to reset your password</p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8 animate-fade-in">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Check your email</h3>
            <p className="text-gray-600 mb-6">
              If an account exists for {email}, we've sent a password reset link.
            </p>
            <Link to="/login" className="auth-button flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="email">Email Address</label>
                <div className="auth-input-container">
                  <Mail className="auth-input-icon" />
                  <input
                    id="email"
                    type="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button type="submit" className="auth-button flex items-center justify-center gap-2" disabled={isLoading}>
                {isLoading ? 'Sending...' : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <Link to="/login" className="auth-link flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
