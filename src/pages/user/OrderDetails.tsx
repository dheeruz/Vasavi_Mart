import React from 'react';
import type { Order } from '../../context/OrderContext';
import { 
  ChevronLeft, 
  MessageSquare, 
  Star, 
  MapPin, 
  Download,
  CreditCard,
} from 'lucide-react';
import './OrderDetails.css';
import './OrderTracking.css';

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onBack }) => {
  return (
    <div className="order-details-page animate-fade-in">
      <div className="back-to-list" onClick={onBack}>
        <ChevronLeft className="w-5 h-5" />
        <span>Back to Orders</span>
      </div>

      <div className="details-wrapper">
        <div className="details-main">
          {/* Main Product Box */}
          <div className="details-box">
             <div className="product-info-row">
                <div className="product-image-box">
                  {/* Showing first item image as representitive */}
                   <img src={order.items[0]?.image} alt={order.items[0]?.name} />
                </div>
                <div className="product-details-text">
                   <h2 className="product-name-title">{order.items[0]?.name} {order.items.length > 1 && `+ ${order.items.length - 1} more items`}</h2>
                   <div className="product-meta-sub">Seller: Vasavi Mart Official</div>
                   <div className="product-details-price">
                      ₹{order.total.toLocaleString('en-IN')} 
                      <span className="offer-label">1 offer applied</span>
                   </div>
                </div>
             </div>

             {/* Tracking section Integrated */}
             <div className="tracking-embedded">
                <div className="order-tracking-timeline" style={{paddingLeft: '1.5rem'}}>
                   <div className="timeline-line" style={{left: '7px'}}></div>
                   {(order.history || [{ 
                     status: 'Pending', 
                     date: order.date, 
                     message: 'Order Placed successfully!' 
                   }]).slice().reverse().map((update, i) => (
                      <div key={i} className="timeline-event" style={{paddingLeft: '1.5rem'}}>
                        <div className={`timeline-point ${i === 0 ? 'timeline-point-active' : ''}`} style={{left: -8}}></div>
                        <div className="timeline-status">{update.status}</div>
                        <div className="timeline-date">{new Date(update.date).toLocaleString('en-IN', {
                           day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}</div>
                      </div>
                   ))}
                </div>
                <span className="tracking-header-link">See All Updates &gt;</span>
             </div>

             <div className="help-actions">
                <div className="chat-link">
                   <MessageSquare className="w-5 h-5" />
                   <span>Chat with us</span>
                </div>
             </div>
          </div>

          {/* Rating Section */}
          <div className="details-box">
             <h3 className="rating-box-title">Rate your experience</h3>
             <div className="rating-stars">
                {[1,2,3,4,5].map(star => (
                   <Star key={star} className="w-8 h-8 star-outline" />
                ))}
             </div>
          </div>
          
          <div className="text-xs text-slate-400 mt-2 px-2">
            Order #{order.id}
          </div>
        </div>

        {/* Sidebar */}
        <div className="details-sidebar">
           <div className="sidebar-box">
              <h3 className="sidebar-title">Delivery details</h3>
              <div className="sidebar-content-row">
                 <MapPin className="w-5 h-5 flex-shrink-0 text-slate-400" />
                 <div className="sidebar-address-text">
                    <strong>Home</strong><br/>
                    {order.customer.address}, {order.customer.city}, {order.customer.zipCode}
                 </div>
              </div>
              <div className="contact-info-sidebar">
                 {order.customer.firstName} {order.customer.lastName}
              </div>
           </div>

           <div className="sidebar-box">
              <h3 className="sidebar-title">Price details</h3>
              <div className="price-details-table">
                 <div className="price-row">
                    <span>Subtotal</span>
                    <span>₹{(order.subtotal ?? (order.total / 1.08)).toFixed(2)}</span>
                 </div>
                 <div className="price-row">
                    <span>Tax (8%)</span>
                    <span>₹{(order.tax ?? (order.total - (order.total / 1.08))).toFixed(2)}</span>
                 </div>
                 <div className="price-row">
                    <span>Shipping Fee</span>
                    <span>{order.shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${(order.shipping ?? 0).toFixed(2)}`}</span>
                 </div>
                 <div className="price-row price-row-total" style={{marginTop: '12px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px'}}>
                    <span>Total Amount</span>
                    <span>₹{order.total.toFixed(2)}</span>
                 </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">
                       <CreditCard className="w-4 h-4" />
                       Payment method
                    </span>
                    <span className="font-semibold">{order.paymentMethod}</span>
                 </div>
              </div>

              <button className="invoice-btn mt-4">
                 <Download className="w-4 h-4" />
                 <span>Download Invoice</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
