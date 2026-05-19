import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  DollarSign, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import DashboardCharts from '../../components/admin/DashboardCharts';
import './Admin.css';

const AdminDashboard: React.FC = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();

  // Stats Calculations
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  return (
    <AdminLayout>
      <div className="dashboard-content animate-fade-in">
        <div className="welcome-section" style={{ marginBottom: '32px' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Store Overview</h2>
           <p style={{ color: 'var(--admin-text-secondary)' }}>Welcome back, Dheeraj. Here's what's happening with your store today.</p>
        </div>

        <div className="stats-grid">
          <StatsCard 
            title="Total Revenue" 
            value={`₹${totalRevenue.toLocaleString()}`} 
            icon={<DollarSign size={24} />} 
            iconBg="#10b981"
            trend="+12.5%"
            increasing={true}
          />
          <StatsCard 
            title="Total Orders" 
            value={orders.length.toString()} 
            icon={<ShoppingBag size={24} />} 
            iconBg="#3b82f6"
            trend="+8.2%"
            increasing={true}
          />
          <StatsCard 
            title="Pending Orders" 
            value={pendingOrders.toString()} 
            icon={<Clock size={24} />} 
            iconBg="#f59e0b"
            trend="-2.4%"
            increasing={false}
          />
          <StatsCard 
            title="Delivered" 
            value={deliveredOrders.toString()} 
            icon={<CheckCircle size={24} />} 
            iconBg="#22c55e"
            trend="+15.3%"
            increasing={true}
          />
        </div>

        <DashboardCharts orders={orders} />

        <div className="table-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="table-header">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Activity</h3>
            <button className="icon-btn" onClick={() => navigate('/admin/orders')}>View All Orders</button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--admin-primary)', fontWeight: 600 }}>#{order.id.slice(-6)}</td>
                  <td>{order.customer.firstName} {order.customer.lastName}</td>
                  <td style={{ fontWeight: 700 }}>₹{order.total.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                       {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
