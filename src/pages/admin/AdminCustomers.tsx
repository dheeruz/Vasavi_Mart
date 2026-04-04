import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  UserMinus,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: number;
  status: 'Active' | 'Blocked';
}

const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Dheeraj Kumar', email: 'dheeraj@example.com', phone: '+91 9876543210', location: 'Nellore, Andhra Pradesh', orders: 12, totalSpent: 4500, status: 'Active' },
  { id: 'c2', name: 'Anita Sharma', email: 'anita@example.com', phone: '+91 9876543211', location: 'Hyderabad, Telangana', orders: 5, totalSpent: 2100, status: 'Active' },
  { id: 'c3', name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 9876543212', location: 'Bangalore, Karnataka', orders: 8, totalSpent: 3200, status: 'Blocked' },
  { id: 'c4', name: 'Priya Singh', email: 'priya@example.com', phone: '+91 9876543213', location: 'Chennai, Tamil Nadu', orders: 2, totalSpent: 850, status: 'Active' },
  { id: 'c5', name: 'Suresh Raina', email: 'suresh@example.com', phone: '+91 9876543214', location: 'Vizag, Andhra Pradesh', orders: 15, totalSpent: 6700, status: 'Active' },
];

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });

  // Load and sync with localStorage
  React.useEffect(() => {
    const storedUsers = localStorage.getItem('vasavi_users_db');
    let dbUsers: any[] = [];
    
    if (storedUsers) {
      dbUsers = JSON.parse(storedUsers);
    } else {
      // Seed with initial mock users if DB is empty
      dbUsers = mockCustomers.map(mc => ({
        id: mc.id,
        name: mc.name.split(' ')[0],
        lastName: mc.name.split(' ').slice(1).join(' '),
        email: mc.email,
        mobile: mc.phone,
        address: mc.location,
        role: 'user',
        isBlocked: mc.status === 'Blocked',
        ordersCount: mc.orders,
        totalSpent: mc.totalSpent
      }));
      localStorage.setItem('vasavi_users_db', JSON.stringify(dbUsers));
    }

    const customersList: Customer[] = dbUsers.map((u: any) => ({
      id: u.id,
      name: u.name + (u.lastName ? ' ' + u.lastName : ''),
      email: u.email,
      phone: u.mobile || '+91 0000000000',
      location: u.address || 'Not Provided',
      orders: u.ordersCount || 0,
      totalSpent: u.totalSpent || 0,
      status: (u.isBlocked ? 'Blocked' : 'Active') as 'Active' | 'Blocked'
    }));

    setCustomers(customersList);
  }, []);

  const saveToDB = (updatedCustomers: Customer[]) => {
    // Sync UI customers back to the underlying DB format
    const storedUsers = localStorage.getItem('vasavi_users_db');
    if (storedUsers) {
      const db = JSON.parse(storedUsers);
      
      // Update existing users or add new ones
      const newDB = updatedCustomers.map(c => {
        const existing = db.find((u: any) => u.email === c.email);
        const nameParts = c.name.split(' ');
        
        const userData = {
          id: c.id,
          name: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
          email: c.email,
          mobile: c.phone,
          address: c.location,
          isBlocked: c.status === 'Blocked',
          ordersCount: c.orders,
          totalSpent: c.totalSpent,
          role: existing ? existing.role : 'user',
          pass: existing ? existing.pass : 'user123' // Default pass for new ones added via Admin
        };
        
        return userData;
      });

      localStorage.setItem('vasavi_users_db', JSON.stringify(newDB));
    }
    setCustomers(updatedCustomers);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    const updated = customers.map(c => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Blocked' : 'Active' } : c
    );
    saveToDB(updated);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      location: customer.location
    });
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      const updated = customers.filter(c => c.id !== customerToDelete.id);
      saveToDB(updated);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Customer[];
    if (editingCustomer) {
      updated = customers.map(c => 
        c.id === editingCustomer.id ? { ...c, ...formData } : c
      );
    } else {
      const newCustomer: Customer = {
        ...formData,
        id: `c${Date.now()}`,
        orders: 0,
        totalSpent: 0,
        status: 'Active'
      };
      updated = [newCustomer, ...customers];
    }
    saveToDB(updated);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', location: '' });
  };

  return (
    <AdminLayout>
      <div className="customers-page">
        <div className="welcome-section" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Customer Management</h2>
            <p style={{ color: 'var(--admin-text-secondary)' }}>View and manage your registered customer base.</p>
          </div>
          <button className="btn primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', gap: '8px' }}>
             <UserPlus size={20} /> Add Customer
          </button>
        </div>

        <div className="table-container">
          <div className="table-header">
            <div className="header-search" style={{ width: '400px' }}>
              <Search size={18} color="var(--admin-text-secondary)" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Info</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="admin-avatar" style={{ width: '36px', height: '36px', fontSize: '0.875rem' }}>{customer.name[0]}</div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontWeight: 600 }}>{customer.name}</span>
                         <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={10} /> {customer.location}
                         </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.875rem', gap: '4px' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {customer.email}</span>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {customer.phone}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{customer.orders}</td>
                  <td style={{ fontWeight: 700 }}>₹{customer.totalSpent.toFixed(2)}</td>
                  <td>
                     <span className={`status-badge ${customer.status === 'Active' ? 'status-delivered' : 'status-cancelled'}`}>
                       {customer.status === 'Active' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                       {customer.status}
                     </span>
                  </td>
                  <td>
                     <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="action-btn" 
                          onClick={() => handleEdit(customer)}
                          title="Edit Customer"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn" 
                          onClick={() => toggleStatus(customer.id)}
                          title={customer.status === 'Active' ? 'Block Customer' : 'Unblock Customer'}
                          style={{ color: customer.status === 'Active' ? '#ef4444' : '#10b981' }}
                        >
                          {customer.status === 'Active' ? <UserMinus size={16} /> : <UserPlus size={16} />}
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => handleDeleteTrigger(customer)}
                          title="Delete Customer"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="admin-modal animate-slide-down">
            <div className="modal-header">
              <h3>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button className="close-modal" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', padding: '10px', borderRadius: '8px', color: 'white', width: '100%' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Email</label>
                      <input 
                        type="email" 
                        required 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', padding: '10px', borderRadius: '8px', color: 'white', width: '100%' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Phone</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', padding: '10px', borderRadius: '8px', color: 'white', width: '100%' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Location</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.location} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', padding: '10px', borderRadius: '8px', color: 'white', width: '100%' }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">
                  {editingCustomer ? 'Update Customer' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && customerToDelete && (
        <div className="modal-overlay">
          <div className="admin-modal animate-slide-down" style={{ maxWidth: '400px' }}>
            <div className="modal-body" style={{ padding: '32px', textAlign: 'center' }}>
               <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#ef4444' }}>
                  <AlertTriangle size={32} />
               </div>
               <h3 style={{ marginBottom: '12px' }}>Delete Customer?</h3>
               <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
                 Are you sure you want to delete <strong>{customerToDelete.name}</strong>? This action cannot be undone.
               </p>
               <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn outline" style={{ flex: 1 }} onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                  <button className="btn primary" style={{ flex: 1, background: '#ef4444' }} onClick={confirmDelete}>Delete</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomers;
