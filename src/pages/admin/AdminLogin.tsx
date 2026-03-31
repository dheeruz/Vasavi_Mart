import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import './Admin.css';

const AdminLogin: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect Passcode');
    }
  };

  return (
    <div className="admin-login-page container">
      <div className="admin-login-card">
        <ShieldAlert size={48} color="var(--primary-color)" className="admin-icon" />
        <h2>Admin Authentication</h2>
        <p>Enter the store manager passcode to access the Orders Dashboard.</p>
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="input-group full-width">
            <input 
              type="password" 
              placeholder="Enter passcode (admin123)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary w-full">Access Dashboard</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
