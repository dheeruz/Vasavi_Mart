import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, MapPin, Package, LogOut, ChevronRight } from 'lucide-react';
import MyOrders from './MyOrders';
import './Account.css';

type AccountSection = 'profile' | 'addresses' | 'orders';

const Account: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState<AccountSection>('profile');
  
  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    mobile: user?.mobile || '',
    gender: user?.gender || '' as any
  });

  // Address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: 'Home' as 'Home' | 'Work' | 'Other',
    name: (user?.name || '') + ' ' + (user?.lastName || ''),
    mobile: user?.mobile || '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  if (!user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress = {
      ...addressForm,
      id: Math.random().toString(36).substring(2, 9),
      isDefault: (!user.addresses || user.addresses.length === 0)
    };
    
    const updatedAddresses = [...(user.addresses || []), newAddress];
    updateProfile({ addresses: updatedAddresses });
    setIsAddingAddress(false);
    setAddressForm({ ...addressForm, street: '', city: '', state: '', zipCode: '' });
  };

  const handleDeleteAddress = (id: string) => {
    const updatedAddresses = (user.addresses || []).filter(addr => addr.id !== id);
    updateProfile({ addresses: updatedAddresses });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'orders':
        return <MyOrders />;
      case 'addresses':
        return (
          <div className="section-content animate-fade-in">
            <div className="section-header">
               <h2 className="section-title">Manage Addresses</h2>
               {!isAddingAddress && (
                 <span className="edit-link" onClick={() => setIsAddingAddress(true)}>+ Add a new address</span>
               )}
            </div>

            {isAddingAddress ? (
              <div className="address-form-container animate-slide-up">
                <form className="address-form" onSubmit={handleAddAddress}>
                  <div className="form-grid">
                    <div className="profile-input-wrapper">
                      <label>Address Type</label>
                      <select 
                        className="profile-input"
                        value={addressForm.type}
                        onChange={(e) => setAddressForm({...addressForm, type: e.target.value as any})}
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="profile-input-wrapper">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        className="profile-input"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="profile-input-wrapper">
                      <label>Mobile Number</label>
                      <input 
                        type="tel" 
                        className="profile-input"
                        value={addressForm.mobile}
                        onChange={(e) => setAddressForm({...addressForm, mobile: e.target.value})}
                        required
                      />
                    </div>
                    <div className="profile-input-wrapper">
                      <label>Pincode</label>
                      <input 
                        type="text" 
                        className="profile-input"
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="profile-input-wrapper mb-4">
                    <label>Street Address (Area and Colony)</label>
                    <textarea 
                      className="profile-input"
                      rows={3}
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                      required
                    ></textarea>
                  </div>

                  <div className="form-grid">
                    <div className="profile-input-wrapper">
                      <label>City/District/Town</label>
                      <input 
                        type="text" 
                        className="profile-input"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="profile-input-wrapper">
                      <label>State</label>
                      <input 
                        type="text" 
                        className="profile-input"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions mt-6 flex gap-4">
                    <button type="submit" className="save-button" style={{margin: 0}}>SAVE ADDRESS</button>
                    <button type="button" className="cancel-button" onClick={() => setIsAddingAddress(false)}>CANCEL</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="address-list">
                {user.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr) => (
                    <div key={addr.id} className="address-card animate-fade-in">
                      <div className="address-type-badge">{addr.type}</div>
                      <div className="address-card-content">
                        <div className="addr-name-row">
                          <strong>{addr.name}</strong>
                          <span className="addr-mobile">{addr.mobile}</span>
                        </div>
                        <p className="addr-details">
                          {addr.street}, {addr.city}, {addr.state} - <strong>{addr.zipCode}</strong>
                        </p>
                      </div>
                      <div className="address-card-actions">
                         <button className="delete-addr-btn" onClick={() => handleDeleteAddress(addr.id)}>Remove</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="address-placeholder p-8 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-400">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No addresses saved yet. Add one to speed up checkout!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'profile':
      default:
        return (
          <div className="section-content animate-fade-in">
            <div className="section-header">
               <h2 className="section-title">Personal Information</h2>
               <span 
                 className="edit-link" 
                 onClick={() => setIsEditing(!isEditing)}
               >
                 {isEditing ? 'Cancel' : 'Edit'}
               </span>
            </div>

            <form className="profile-form" onSubmit={handleSaveProfile}>
              <div className="form-grid">
                <div className="profile-input-wrapper">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    className="profile-input" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="profile-input-wrapper">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    className="profile-input" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="gender-section-wrapper">
                <label className="text-sm font-medium mb-3 block">Your Gender</label>
                <div className="gender-selection">
                  <label className="gender-option">
                    <input 
                      type="radio" 
                      name="gender" 
                      className="gender-radio" 
                      checked={formData.gender === 'Male'}
                      onChange={() => setFormData({...formData, gender: 'Male'})}
                      disabled={!isEditing}
                    />
                    <span>Male</span>
                  </label>
                  <label className="gender-option">
                    <input 
                      type="radio" 
                      name="gender" 
                      className="gender-radio"
                      checked={formData.gender === 'Female'}
                      onChange={() => setFormData({...formData, gender: 'Female'})}
                      disabled={!isEditing}
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>

              <div className="form-grid">
                <div className="profile-input-wrapper form-group-full">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="profile-input" 
                    value={user.email}
                    disabled={true} 
                  />
                  <p className="text-xs text-slate-400 mt-1">Email cannot be changed for security reasons.</p>
                </div>
                
                <div className="profile-input-wrapper form-group-full">
                  <label>Mobile Number</label>
                  <input 
                    type="tel" 
                    className="profile-input" 
                    placeholder="+91"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <button type="submit" className="save-button animate-slide-up">
                  SAVE CHANGES
                </button>
              )}
            </form>

            <div className="faq-section">
               <h3 className="faq-title">FAQs</h3>
               <div className="faq-item">
                  <h4 className="faq-q">What happens when I update my email address?</h4>
                  <p className="faq-a">For security reasons, your email address is locked to your account. If you need to change it, please contact our support team.</p>
               </div>
               <div className="faq-item">
                  <h4 className="faq-q">When will my account be updated?</h4>
                  <p className="faq-a">Changes are applied immediately after you click the "Save" button.</p>
               </div>
            </div>

            <div className="account-actions">
               <span className="action-link">Deactivate Account</span>
               <span className="action-link delete-link">Delete Account</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="account-container">
      {/* SIDEBAR */}
      <aside className="account-sidebar">
        <div className="user-profile-header">
          <div className="user-avatar-circle">
            {(user.name[0] || '?').toUpperCase()}
          </div>
          <div className="user-welcome">
            <span className="welcome-text">Hello,</span>
            <span className="user-full-name">{user.name} {user.lastName}</span>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-group">
            <div 
              className={`menu-header ${activeSection === 'orders' ? 'menu-header-active' : ''}`}
              onClick={() => setActiveSection('orders')}
              style={{cursor: 'pointer'}}
            >
              <Package className="w-5 h-5 text-blue-600" />
              <span>MY ORDERS</span>
              <ChevronRight className="w-5 h-5 ml-auto" />
            </div>
          </div>

          <div className="menu-group">
            <div className="menu-header">
               <UserIcon className="w-5 h-5 text-blue-600" />
               <span>ACCOUNT SETTINGS</span>
            </div>
            <div className="menu-items">
              <div 
                className={`menu-item ${activeSection === 'profile' ? 'menu-item-active' : ''}`}
                onClick={() => setActiveSection('profile')}
              >
                Profile Information
              </div>
              <div 
                className={`menu-item ${activeSection === 'addresses' ? 'menu-item-active' : ''}`}
                onClick={() => setActiveSection('addresses')}
              >
                Manage Addresses
              </div>
            </div>
          </div>

          <div className="menu-group">
            <div className="logout-menu-item" onClick={logout}>
              <LogOut className="w-5 h-5 text-blue-600" />
              <span>Log out</span>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="account-content">
        {renderSection()}
      </main>
    </div>
  );
};

export default Account;
