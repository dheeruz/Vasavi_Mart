import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, UserCircle, Mail, Lock, UserPlus } from 'lucide-react';
import './Auth.css';

const Signup: React.FC = () => {
  const { signup, isAuthenticated, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in
  if (isAuthenticated && user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      await signup(name, email, password);
      
      // Read notification settings
      const savedNotify = localStorage.getItem('admin_notifications');
      const notifyPrefs = savedNotify ? JSON.parse(savedNotify) : { customers: false };

      // Trigger Notification if enabled
      if (notifyPrefs.customers) {
        fetch('/api/auth/register-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        }).catch(err => console.error('Signup notification failed', err));
      }
      
      // Navigation handled inside context
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
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
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join Vasavi Mart today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="name">Full Name</label>
            <div className="auth-input-container">
              <UserCircle className="auth-input-icon" />
              <input
                id="name"
                type="text"
                className="auth-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

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

          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-container">
              <Lock className="auth-input-icon" />
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="auth-button flex items-center justify-center gap-2" disabled={isLoading}>
            {isLoading ? 'Creating account...' : (
              <>
                <UserPlus className="w-5 h-5" />
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
