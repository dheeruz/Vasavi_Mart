import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  Printer,
  Mail as MailIcon
} from 'lucide-react';
import { useOrders, type Order } from '../../context/OrderContext';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const itemsPerPage = 8;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownload = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Total', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(o => [
        o.id,
        `${o.customer.firstName} ${o.customer.lastName}`,
        o.customer.email,
        new Date(o.date).toLocaleDateString(),
        o.total,
        o.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="orders-page">
        <div className="welcome-section" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Manage Orders</h2>
          <p style={{ color: 'var(--admin-text-secondary)' }}>Track, update, and manage all customer transactions.</p>
        </div>

        <div className="table-container">
          <div className="table-header">
            <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
              <div className="header-search" style={{ width: '320px' }}>
                <Search size={18} color="var(--admin-text-secondary)" />
                <input 
                  type="text" 
                  placeholder="Search order ID, customer name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="header-search" style={{ width: '180px' }}>
                <Filter size={18} color="var(--admin-text-secondary)" />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <button className="icon-btn" title="Export CSV" onClick={handleDownload}>
              <Download size={20} />
            </button>
          </div>

          {paginatedOrders.length === 0 ? (
            <div style={{ padding: '80px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
              <Package size={64} style={{ marginBottom: '20px', opacity: 0.2 }} />
              <h3>No orders found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--admin-primary)', fontWeight: 600 }}>#{order.id.slice(-6)}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{order.customer.firstName} {order.customer.lastName}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>{order.customer.email}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.875rem' }}>
                          {new Date(order.date).toLocaleDateString()}
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                            {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>₹{order.total.toFixed(2)}</td>
                      <td>
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className={`status-badge status-${order.status.toLowerCase()}`}
                          style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="action-btn" 
                            title="View Details"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="action-btn delete" 
                            title="Delete"
                            onClick={() => { if(window.confirm('Delete this order?')) deleteOrder(order.id); }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <button className="action-btn" title="More"><MoreVertical size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-footer" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>
                  Showing {(currentPage-1)*itemsPerPage + 1} to {Math.min(currentPage*itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="action-btn" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    className="action-btn" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="admin-modal animate-slide-down" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Order Details: #{selectedOrder.id}</h3>
              <button className="close-modal" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '24px' }}>
                <div>
                  <h4 style={{ color: 'var(--admin-text-secondary)', marginBottom: '12px' }}>Customer Info</h4>
                  <div style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                    <p><strong>Name:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                    <p><strong>Address:</strong> {selectedOrder.customer.address}, {selectedOrder.customer.city} - {selectedOrder.customer.zipCode}</p>
                  </div>
                </div>
                <div>
                  <h4 style={{ color: 'var(--admin-text-secondary)', marginBottom: '12px' }}>Order Status</h4>
                  <div className={`status-badge status-${selectedOrder.status.toLowerCase()}`} style={{ fontSize: '1rem', padding: '8px 16px', marginBottom: '16px' }}>
                    {selectedOrder.status}
                  </div>
                  <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <h4 style={{ color: 'var(--admin-text-secondary)', marginBottom: '16px' }}>Products</h4>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '8px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid var(--admin-border)' : 'none' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#333' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600 }}>{item.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>{item.quantity} x ₹{item.price}</p>
                      </div>
                    </div>
                    <p style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', padding: '20px', borderTop: '1px solid var(--admin-border)' }}>
                <div style={{ textAlign: 'right', minWidth: '200px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--admin-text-secondary)' }}>Subtotal:</span>
                    <span style={{ fontWeight: 600 }}>₹{(selectedOrder.subtotal ?? (selectedOrder.total / 1.08)).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--admin-text-secondary)' }}>Tax (8%):</span>
                    <span style={{ fontWeight: 600 }}>₹{(selectedOrder.tax ?? (selectedOrder.total - (selectedOrder.total / 1.08))).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed var(--admin-border)' }}>
                    <span style={{ color: 'var(--admin-text-secondary)' }}>Shipping:</span>
                    <span style={{ fontWeight: 600 }}>₹{(selectedOrder.shipping ?? 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--admin-text-secondary)', fontSize: '1rem' }}>Order Total:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--admin-primary)' }}>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={() => window.print()}>
                <Printer size={18} /> Print Invoice
              </button>
              <button className="btn outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <MailIcon size={18} /> Resend Email
              </button>
              <button className="btn primary" onClick={() => setSelectedOrder(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
