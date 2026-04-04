import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck, MapPin, Truck, ChevronRight, X, PlusCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth, type AddressItem } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import './Checkout.css';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { products, updateProduct } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    upiId: '',
    bank: ''
  });

  // Auto-fill on load for single address users
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      if (user.addresses.length === 1) {
        handleSelectAddress(user.addresses[0]);
      } else {
        const defaultAddr = user.addresses.find(a => a.isDefault);
        if (defaultAddr) handleSelectAddress(defaultAddr);
      }
    }
  }, [user]);

  const handleSelectAddress = (addr: AddressItem) => {
    const fullNameParts = addr.name.split(' ');
    setFormData({
      ...formData,
      firstName: fullNameParts[0] || user?.name || '',
      lastName: fullNameParts.slice(1).join(' ') || user?.lastName || '',
      email: user?.email || '',
      address: addr.street,
      city: addr.city,
      zipCode: addr.zipCode
    });
    setShowAddressSelector(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Precise financial calculations to prevent floating point errors
  const tax = Math.round(totalPrice * 0.08 * 100) / 100;
  const shipping = totalPrice > 500 ? 0 : 50;
  const finalTotal = Math.round((totalPrice + tax + shipping) * 100) / 100;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === 'cod') {
      finishOrderPlacement();
      return;
    }

    // Razorpay Integration Flow
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create order on backend securely
      const result = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: finalTotal,
          receipt: `rcpt_${Math.floor(Date.now() / 1000)}` 
        }),
      });
      
      if (!result.ok) {
        let errMsg = "Failed to connect to backend";
        try {
           const errData = await result.json();
           if (errData.error) errMsg = errData.error;
        } catch(e) {}
        throw new Error((result.status === 404 ? "API Route Not Found (404) " : "") + errMsg);
      }

      const { orderId: rzpOrderId, amount, currency, keyId } = await result.json();

      // 2. Open Razorpay Checktout Modal
      const options = {
        key: keyId,
        amount: amount.toString(),
        currency: currency,
        name: 'Vasavi Mart',
        description: 'Grocery Purchase',
        order_id: rzpOrderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Signature securely on backend
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyResult = await verifyRes.json();
            if (verifyResult.verified) {
              finishOrderPlacement();
            } else {
              alert('Payment Verification Failed!');
            }
          } catch (e) {
             console.error('Verify error', e);
             alert('Error verifying payment');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: '9999999999' 
        },
        theme: {
          color: '#2F8F4C',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert("Payment Failed. Reason: " + response.error.description);
      });
      
      paymentObject.open();

    } catch (error: any) {
       console.error(error);
       alert("Payment Error: " + error.message);
    } finally {
       setIsProcessing(false);
    }
  };

  const finishOrderPlacement = async () => {
    const orderData = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: user?.email || formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode
      },
      items: items,
      subtotal: totalPrice,
      tax: tax,
      shipping: shipping,
      total: finalTotal,
      paymentMethod: paymentMethod === 'online' ? 'Razorpay' : 'Cash on Delivery'
    };

    const orderId = placeOrder(orderData);
    setPlacedOrderId(orderId);

    // Update Inventory/Stock
    items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product && typeof product.stock === 'number') {
        const newStock = Math.max(0, product.stock - item.quantity);
        updateProduct(product.id, { stock: newStock });
      }
    });

    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
  };

  if (isSuccess) {
    return (
      <div className="checkout-success container animate-fade-in">
        <div className="success-content">
          <div className="success-icon-wrapper">
             <CheckCircle size={80} color="var(--success)" className="success-icon" />
          </div>
          <h1>{paymentMethod === 'cod' ? 'Order Placed Successfully!' : 'Payment Successful!'}</h1>
          <p>
            {paymentMethod === 'cod' 
              ? 'Thank you for your order. Please keep the cash ready for when our delivery partner arrives!' 
              : 'Thank you for shopping at Vasavi Mart. Your payment has been confirmed.'}
          </p>
          <div className="order-details">
            <p><strong>Order Number:</strong> #{placedOrderId || 'ORD-SYNCING'}</p>
            <p><strong>Shipping to:</strong> {formData.firstName} {formData.lastName}, {formData.address}, {formData.city}</p>
            <p className="mt-2 text-emerald-600 font-medium flex items-center justify-center gap-2">
              {paymentMethod === 'cod' ? <Truck size={18} /> : <ShieldCheck size={18} />}
              Total Amount: ₹{finalTotal.toFixed(2)}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-checkout container">
        <h2>Your cart is empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>Go to Shop</button>
      </div>
    );
  }


  return (
    <div className="checkout-page container">
      <div className="checkout-header">
        <h1>Secure Checkout</h1>
        <p>Complete your purchase securely.</p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-section">
          <form id="checkout-form" onSubmit={handlePayment}>
            {/* Shipping Info */}
            <div className="form-group-section">
              <div className="section-title justify-between">
                <div className="flex items-center gap-3">
                  <MapPin size={24} color="var(--primary-color)" />
                  <h2>Shipping Information</h2>
                </div>
                {user && user.addresses && user.addresses.length > 0 && (
                  <button 
                    type="button" 
                    className="change-addr-btn"
                    onClick={() => setShowAddressSelector(true)}
                  >
                    Change
                  </button>
                )}
              </div>
              
              {user && user.addresses && user.addresses.length > 0 && (
                <div className="saved-addr-badge animate-fade-in">
                  <ShieldCheck size={14} /> Using saved address
                </div>
              )}

              <div className="form-grid">
                <div className="input-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} required onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} required onChange={handleChange} />
                </div>
                <div className="input-group full-width">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} required onChange={handleChange} />
                </div>
                <div className="input-group full-width">
                  <label>Street Address</label>
                  <input type="text" name="address" value={formData.address} required onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} required onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>ZIP/Postal Code</label>
                  <input type="text" name="zipCode" value={formData.zipCode} required onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="form-group-section">
              <div className="section-title">
                <CreditCard size={24} color="var(--primary-color)" />
                <h2>Payment Details</h2>
              </div>
              <div className="secure-badge">
                <ShieldCheck size={16} /> All transactions are secure and encrypted.
              </div>

              <div className="payment-method-selector" style={{ gridTemplateColumns: '1fr' }}>
                <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentOption" value="online" checked={paymentMethod === 'online'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Pay Online (UPI, Cards, NetBanking via Razorpay)</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentOption" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'online' && (
                <div className="form-grid">
                  <div className="input-group full-width cod-notice">
                    <p>You will be securely redirected to Razorpay to complete your payment.</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="form-grid">
                  <div className="input-group full-width cod-notice">
                    <p>Pay upon delivery via Cash, UPI, or Card terminal when the executive arrives.</p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="checkout-summary-section">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="summary-item-details">
                    <span className="name">{item.name}</span>
                    <span className="qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-line">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="total-line final">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form" 
              className="btn btn-primary w-full pay-btn"
              disabled={isProcessing}
            >
              {isProcessing 
                ? 'Processing...' 
                : paymentMethod === 'cod' 
                  ? `Place Order (₹${finalTotal.toFixed(2)})` 
                  : `Pay ₹${finalTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>

      {/* Address Selector Modal */}
      {showAddressSelector && (
        <div className="address-modal-overlay animate-fade-in">
          <div className="address-modal animate-slide-down">
            <div className="modal-header">
              <h3>Select Shipping Address</h3>
              <button type="button" className="close-modal" onClick={() => setShowAddressSelector(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="address-options-grid">
                {user?.addresses?.map((addr) => (
                  <div key={addr.id} className="address-option-card" onClick={() => handleSelectAddress(addr)}>
                    <div className="addr-card-header">
                      <span className="addr-type">{addr.type}</span>
                      {addr.isDefault && <span className="default-tag">Default</span>}
                      <ChevronRight size={16} className="addr-arrow" />
                    </div>
                    <p className="addr-name">{addr.name}</p>
                    <p className="addr-text">{addr.street}, {addr.city}</p>
                    <p className="addr-text">{addr.state} - {addr.zipCode}</p>
                    <button type="button" className="use-addr-btn">Use this address</button>
                  </div>
                ))}
                <Link to="/account" className="add-new-addr-card">
                   <PlusCircle size={32} />
                   <span>Add New Address</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
