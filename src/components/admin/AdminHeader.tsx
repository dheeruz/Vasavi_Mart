import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  return (
    <header className="admin-header-new">
      <div className="header-search">
        <Search size={18} color="var(--admin-text-secondary)" />
        <input type="text" placeholder="Search analytics, orders..." />
      </div>
      
      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <div className="admin-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Dheeraj</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>Store Owner</span>
          </div>
          <button onClick={handleLogout} className="icon-btn" title="Logout">
             <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
