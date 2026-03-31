import { useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, PackageSearch, Trash2 } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import './Admin.css';

const AdminDashboard: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  return (
    <div className="admin-dashboard container animate-fade-in">
      <div className="admin-header">
        <div>
          <h1>Store Owner Dashboard</h1>
          <p>Manage incoming customer orders</p>
        </div>
        <button onClick={handleLogout} className="btn outline logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <PackageSearch size={64} color="var(--text-muted)" />
          <h2>No orders yet</h2>
          <p>When customers check out, their orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Fragment key={order.id}>
                  <tr className="order-row">
                    <td className="font-mono">{order.id}</td>
                    <td>{new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td>
                      <strong>{order.customer.firstName} {order.customer.lastName}</strong><br/>
                      <small className="text-muted">{order.customer.email}</small>
                    </td>
                    <td className="capitalize">{order.paymentMethod}</td>
                    <td className="font-bold">₹{order.total.toFixed(2)}</td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={`status-select ${order.status.toLowerCase()}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => deleteOrder(order.id)} className="btn-icon delete-btn" title="Delete Order">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                  <tr className="order-details-row">
                    <td colSpan={7}>
                      <div className="order-items-grid">
                        <div className="shipping-address">
                          <strong>Shipping Address:</strong><br />
                          {order.customer.address}, {order.customer.city} {order.customer.zipCode}
                        </div>
                        <div className="purchased-items">
                          <strong>Items Purchased:</strong>
                          <ul>
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.quantity}x {item.name} <span className="item-price">(₹{(item.price * item.quantity).toFixed(2)})</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
