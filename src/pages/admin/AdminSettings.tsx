import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Save, 
  Camera
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('admin_notifications');
    return saved ? JSON.parse(saved) : {
      orders: true,
      customers: false,
      inventory: true,
      system: true
    };
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('admin_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Dheeraj Kumar',
      email: 'admin@vasavimart.com',
      role: 'Store Owner',
      phone: '+91 9876543210'
    };
  });

  const handleSave = () => {
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
    localStorage.setItem('admin_profile', JSON.stringify(profile));
    alert('Settings saved successfully!');
  };

  const sendTestEmail = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email })
      });
      const data = await response.json();
      if (data.success) {
        alert('Test email sent! Please check your inbox.');
      } else {
        alert('Failed to send test email: ' + data.message);
      }
    } catch (error) {
      alert('Error connecting to server. Make sure backend is running.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="settings-page">
        <div className="welcome-section" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Global Settings</h2>
          <p style={{ color: 'var(--admin-text-secondary)' }}>Manage your profile, system preferences, and security.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
           <aside className="settings-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} 
                onClick={() => setActiveTab('profile')}
              >
                 <User size={18} /> Profile
              </button>
              <button 
                className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`} 
                onClick={() => setActiveTab('notifications')}
              >
                 <Bell size={18} /> Notifications
              </button>
              <button 
                className={`nav-link ${activeTab === 'security' ? 'active' : ''}`} 
                onClick={() => setActiveTab('security')}
              >
                 <Shield size={18} /> Security
              </button>
              <button 
                className={`nav-link ${activeTab === 'theme' ? 'active' : ''}`} 
                onClick={() => setActiveTab('theme')}
              >
                 <Moon size={18} /> Appearance
              </button>
           </aside>

           <div className="settings-content chart-card glass">
              {activeTab === 'profile' && (
                <div className="animate-fade-in">
                   <h3 style={{ marginBottom: '24px' }}>Profile Information</h3>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                      <div className="admin-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', position: 'relative', overflow: 'hidden' }}>
                        {profile.name[0]}
                      </div>
                      <div>
                         <input 
                           type="file" 
                           id="photo-upload" 
                           style={{ display: 'none' }} 
                           onChange={(e) => {
                             if(e.target.files?.[0]) alert('Photo uploaded: ' + e.target.files[0].name);
                           }} 
                         />
                         <button 
                           className="btn outline" 
                           onClick={() => document.getElementById('photo-upload')?.click()}
                           style={{ fontSize: '0.875rem', padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}
                         >
                            <Camera size={16} /> Change Photo
                         </button>
                      </div>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div className="form-group">
                         <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Full Name</label>
                         <input 
                            type="text" 
                            className="header-search" 
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white' }} 
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                         />
                      </div>
                      <div className="form-group">
                         <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Email Address</label>
                         <input 
                            type="email" 
                            className="header-search" 
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white' }} 
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                         />
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="animate-fade-in">
                   <h3 style={{ marginBottom: '24px' }}>Notification Preferences</h3>
                   
                   <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.1)', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                         <Bell size={20} style={{ color: '#f59e0b', marginTop: '2px' }} />
                         <div>
                            <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: '4px' }}>Configuration Required</div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                               To receive real emails, ensure you have set <code>MAIL_USER</code> and <code>MAIL_PASS</code> in your <code>.env</code> file.
                            </p>
                         </div>
                      </div>
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <div style={{ fontWeight: 600 }}>Order Notifications</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Get notified when a new order is placed.</div>
                         </div>
                         <input type="checkbox" checked={notifications.orders} onChange={() => setNotifications({...notifications, orders: !notifications.orders})} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <div style={{ fontWeight: 600 }}>Inventory Alerts</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Get notified when products are low in stock.</div>
                         </div>
                         <input type="checkbox" checked={notifications.inventory} onChange={() => setNotifications({...notifications, inventory: !notifications.inventory})} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <div style={{ fontWeight: 600 }}>Customer Signups</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Get notified when a new customer registers.</div>
                         </div>
                         <input type="checkbox" checked={notifications.customers} onChange={() => setNotifications({...notifications, customers: !notifications.customers})} />
                      </div>
                   </div>

                   <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                      <h4 style={{ marginBottom: '8px' }}>Test Configuration</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', marginBottom: '20px' }}>
                         Send a test notification to <strong>{profile.email}</strong> to verify your SMTP settings.
                      </p>
                      <button 
                        className="btn outline" 
                        onClick={sendTestEmail}
                        disabled={isTesting}
                        style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                      >
                         {isTesting ? 'Sending...' : 'Send Test Notification'}
                      </button>
                   </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="animate-fade-in">
                   <h3 style={{ marginBottom: '24px' }}>Security Settings</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>Change Password</label>
                        <input 
                          type="password" 
                          placeholder="Current Password" 
                          className="header-search" 
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', marginBottom: '12px' }} 
                        />
                        <input 
                          type="password" 
                          placeholder="New Password" 
                          className="header-search" 
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white' }} 
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                         <div>
                           <div style={{ fontWeight: 600 }}>Two-Factor Authentication</div>
                           <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Add an extra layer of security to your account.</div>
                         </div>
                         <button className="btn primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Enable</button>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="animate-fade-in">
                   <h3 style={{ marginBottom: '24px' }}>System Appearance</h3>
                   <div style={{ display: 'flex', gap: '24px' }}>
                      <div 
                        onClick={() => setIsDarkMode(true)}
                        style={{ flex: 1, padding: '24px', borderRadius: '16px', border: '2px solid', borderColor: isDarkMode ? 'var(--admin-primary)' : 'transparent', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', textAlign: 'center' }}>
                         <Moon size={32} style={{ marginBottom: '12px', color: isDarkMode ? 'var(--admin-primary)' : 'inherit' }} />
                         <div style={{ fontWeight: 700 }}>Dark Theme</div>
                      </div>
                      <div 
                        onClick={() => setIsDarkMode(false)}
                        style={{ flex: 1, padding: '24px', borderRadius: '16px', border: '2px solid', borderColor: !isDarkMode ? 'var(--admin-primary)' : 'transparent', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', textAlign: 'center' }}>
                         <Sun size={32} style={{ marginBottom: '12px', color: !isDarkMode ? 'var(--admin-primary)' : 'inherit' }} />
                         <div style={{ fontWeight: 700 }}>Light Theme</div>
                      </div>
                   </div>
                </div>
              )}

              <div style={{ marginTop: '32px', borderTop: '1px solid var(--admin-border)', paddingTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                 <button className="btn" onClick={handleSave} style={{ background: 'var(--admin-primary)', border: 'none', color: 'white', padding: '12px 32px', borderRadius: '12px', fontWeight: 600, display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Save size={18} /> Save Settings
                 </button>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
