import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
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
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    upiId: '',
    bank: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const tax = totalPrice * 0.08;
  const shipping = totalPrice > 500 ? 0 : 50;
  const finalTotal = totalPrice + tax + shipping;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === 'cod') {
      // Direct placement for Cash On Delivery
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
        body: JSON.stringify({ amount: finalTotal }),
      });
      
      if (!result.ok) throw new Error("Failed to connect to backend");

      const { orderId, amount, currency, keyId } = await result.json();

      // 2. Open Razorpay Checktout Modal
      const options = {
        key: keyId,
        amount: amount.toString(),
        currency: currency,
        name: 'Vasavi Mart',
        description: 'Grocery Purchase',
        // image: 'https://example.com/logo.png',
        order_id: orderId,
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
          contact: '9999999999' // Demo contact
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

    } catch (error) {
       console.error(error);
       alert("Server error processing payment");
    } finally {
       setIsProcessing(false);
    }
  };

  const finishOrderPlacement = () => {
    placeOrder({
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode
      },
      items: items,
      total: finalTotal,
      paymentMethod: paymentMethod === 'online' ? 'Razorpay' : 'Cash on Delivery'
    });

    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
  };

  if (isSuccess) {
    return (
      <div className="checkout-success container animate-fade-in">
        <div className="success-content">
          <CheckCircle size={80} color="var(--success)" className="success-icon" />
          <h1>Payment Successful!</h1>
          <p>Thank you for shopping at Vasavi Mart.</p>
          <div className="order-details">
            <p><strong>Order Number:</strong> #{Math.floor(100000 + Math.random() * 900000)}</p>
            <p><strong>Shipping to:</strong> {formData.firstName} {formData.lastName}, {formData.address}, {formData.city}</p>
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
              <div className="section-title">
                <MapPin size={24} color="var(--primary-color)" />
                <h2>Shipping Information</h2>
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" required onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" required onChange={handleChange} />
                </div>
                <div className="input-group full-width">
                  <label>Email Address</label>
                  <input type="email" name="email" required onChange={handleChange} />
                </div>
                <div className="input-group full-width">
                  <label>Street Address</label>
                  <input type="text" name="address" required onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input type="text" name="city" required onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>ZIP/Postal Code</label>
                  <input type="text" name="zipCode" required onChange={handleChange} />
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
              {isProcessing ? 'Processing Payment...' : `Pay ₹${finalTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
