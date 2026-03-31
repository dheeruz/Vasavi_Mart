import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import './Checkout.css';

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
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

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate secure payment processing API call
    setTimeout(() => {
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
        paymentMethod: paymentMethod
      });

      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
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

              <div className="payment-method-selector">
                <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentOption" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>UPI / QR</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentOption" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Credit / Debit Card</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentOption" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Net Banking</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentOption" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="form-grid">
                  <div className="input-group full-width">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      name="cardNumber" 
                      placeholder="0000 0000 0000 0000" 
                      maxLength={19}
                      required={paymentMethod === 'card'} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="input-group">
                    <label>Expiry Date (MM/YY)</label>
                    <input 
                      type="text" 
                      name="expiry" 
                      placeholder="MM/YY" 
                      maxLength={5}
                      required={paymentMethod === 'card'} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="input-group">
                    <label>CVC</label>
                    <input 
                      type="text" 
                      name="cvc" 
                      placeholder="123" 
                      maxLength={4}
                      required={paymentMethod === 'card'} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="form-grid">
                  <div className="input-group full-width">
                    <label>Enter UPI ID (VPA)</label>
                    <input 
                      type="text" 
                      name="upiId" 
                      placeholder="mobile_number@upi or name@okbank" 
                      required={paymentMethod === 'upi'} 
                      onChange={handleChange} 
                    />
                    <small className="help-text">A payment request will be sent to your UPI app. Please approve it within 5 minutes.</small>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="form-grid">
                  <div className="input-group full-width">
                    <label>Select Your Bank</label>
                    <select 
                      name="bank" 
                      className="bank-select" 
                      required={paymentMethod === 'netbanking'} 
                      onChange={() => {}}
                    >
                      <option value="">Choose a bank...</option>
                      <option value="sbi">State Bank of India (SBI)</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
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
