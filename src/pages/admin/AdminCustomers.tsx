import React, { useState, useEffect } from 'react';
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
import { useOrders } from '../../context/OrderContext';
import { API_ENDPOINTS } from '../../config/api';

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

const AdminCustomers: React.FC = () => {
  const { orders } = useOrders();
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

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('vasavi_token');
      const res = await fetch(`${API_ENDPOINTS.ADMIN}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      
      const customersList: Customer[] = data.customers.map((c: any) => ({
        id: c.id,
        name: `${c.first_name} ${c.last_name || ''}`.trim(),
        email: c.email,
        phone: c.phone || '+91 0000000000',
        location: c.address || 'Not Provided',
        orders: c.orders?.length || 0,
        totalSpent: c.totalSpent || 0,
        status: c.role === 'blocked' ? 'Blocked' : 'Active'
      }));
      setCustomers(customersList);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [orders]);

  const toggleStatus = async (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    const isBlocked = customer.status === 'Active';
    try {
      const token = localStorage.getItem('vasavi_token');
      const res = await fetch(`${API_ENDPOINTS.ADMIN}/users/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isBlocked })
      });
      if (res.ok) {
        setCustomers(prev => prev.map(c => 
          c.id === id ? { ...c, status: isBlocked ? 'Blocked' : 'Active' } : c
        ));
      }
    } catch (e) {
      console.error(e);
    }
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

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        const token = localStorage.getItem('vasavi_token');
        const res = await fetch(`${API_ENDPOINTS.ADMIN}/users/${customerToDelete.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
          setIsDeleteModalOpen(false);
          setCustomerToDelete(null);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('vasavi_token');
      if (editingCustomer) {
        const res = await fetch(`${API_ENDPOINTS.ADMIN}/users/${editingCustomer.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          fetchCustomers();
        }
      } else {
        const res = await fetch(`${API_ENDPOINTS.ADMIN}/users`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          fetchCustomers();
        }
      }
      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', location: '' });
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
