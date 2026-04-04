import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Order } from '../../context/OrderContext';
import OrderDetails from './OrderDetails';
import './MyOrders.css';
import './OrderTracking.css';

const MyOrders: React.FC = () => {
  const { orders } = useOrders();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [expandedOrders, setExpandedOrders] = React.useState<Record<string, boolean>>({});

  if (selectedOrder) {
    return <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  const toggleTrackOrder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger the detail view when tracking
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter orders for the current logged-in user
  const userOrders = orders.filter(order => order.customer.email === user?.email);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5" />;
      case 'Shipped': return <Package className="w-5 h-5" />;
      case 'Delivered': return <CheckCircle className="w-5 h-5" />;
      case 'Cancelled': return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="my-orders-container animate-fade-in">
      <div className="my-orders-header">
        <Package className="w-8 h-8 text-emerald-600" />
        <h1 className="my-orders-title">My Orders</h1>
      </div>

      {userOrders.length === 0 ? (
        <div className="my-orders-empty">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">No orders yet</h2>
          <p className="text-slate-500 mb-6">Looks like you haven't placed any orders yet. Start shopping to see them here!</p>
          <a href="/shop" className="auth-button inline-block px-8 py-3">Shop Now</a>
        </div>
      ) : (
        <div className="my-orders-list">
          {userOrders.map((order) => (
            <div 
              key={order.id} 
              className="order-card" 
              onClick={() => setSelectedOrder(order)}
              style={{ cursor: 'pointer' }}
            >
              <div className="order-card-header">
                <div className="order-info">
                  <span className="order-id">Order {order.id}</span>
                  <span className="order-date">Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="order-total">₹{order.total.toFixed(2)}</span>
                  <span className={`order-status status-${order.status.toLowerCase()}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={`${order.id}-${index}`} className="order-item">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-details">
                      <h4 className="order-item-name">{item.name}</h4>
                      <div className="order-item-meta">
                        Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="order-item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="track-order-btn" 
                onClick={(e) => toggleTrackOrder(order.id, e)}
              >
                {expandedOrders[order.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                <span>{expandedOrders[order.id] ? 'Hide Track Order' : 'Track Order'}</span>
              </button>

              {expandedOrders[order.id] && (
                <div className="order-tracking-timeline animate-pop-in">
                   <div className="timeline-line"></div>
                   {(order.history || [{ 
                     status: 'Pending', 
                     date: order.date, 
                     message: 'Order Placed successfully!' 
                   }]).slice().reverse().map((update, i) => (
                      <div key={i} className="timeline-event">
                        <div className={`timeline-point ${i === 0 ? 'timeline-point-active' : ''}`}></div>
                        <div className="timeline-status">{update.status}</div>
                        <div className="timeline-date">{new Date(update.date).toLocaleString('en-IN', {
                           day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}</div>
                        <div className="timeline-message">{update.message}</div>
                      </div>
                   ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
