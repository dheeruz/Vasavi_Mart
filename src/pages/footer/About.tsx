import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Wallet, 
  ArrowRight, 
  CheckCircle, 
  MousePointerClick,
  ChevronRight
} from 'lucide-react';
import './About.css';
import '../../styles/animations.css';

const About: React.FC = () => {
  const faqItems = [
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit/debit cards, UPI, Wallets, and Netbanking via Razorpay. We also offer Cash on Delivery (COD) for most locations."
    },
    {
      q: "How fast is the delivery?",
      a: "For most urban areas, we offer same-day or next-day delivery. Rural locations may take 2-3 business days. You can track your order in real-time under 'My Account'."
    },
    {
      q: "Is my payment secure?",
      a: "Yes, absolutely! All our online payments are processed through Razorpay, a PCI-DSS compliant payment gateway, ensuring bank-grade security for your transactions."
    },
    {
      q: "Can I return fresh products?",
      a: "We have a 'no-questions-asked' return policy at the time of delivery if you are not satisfied with the quality of fresh produce."
    }
  ];

  return (
    <div className="about-page animate-fade">
      {/* Hero Section */}
      <section className="about-hero animate-slide">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-title">Experience the Best of <span className="text-primary">Vasavi Mart</span></h1>
            <p className="about-subtitle">
              We are committed to bringing fresh, high-quality groceries straight from the farm to your doorstep. 
              Our mission is to simplify your shopping experience with security, speed, and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-features section-padding">
        <div className="container">
          <div className="section-header animate-slide delay-1">
            <h2 className="section-title">Why Choose Us?</h2>
            <p className="section-desc">Reliable service tailored for your convenience.</p>
          </div>
          
          <div className="features-grid-classic">
            <div className="about-feature-card animate-scale delay-1">
              <div className="feature-icon-box"><ShieldCheck size={32} /></div>
              <h3>Secure Payments</h3>
              <p>Your transactions are encrypted and processed through industry-leading security protocols.</p>
            </div>
            <div className="about-feature-card animate-scale delay-2">
              <div className="feature-icon-box"><Truck size={32} /></div>
              <h3>Lightning Fast Delivery</h3>
              <p>Fresh groceries delivered to your door in record time, maintaining perfect quality.</p>
            </div>
            <div className="about-feature-card animate-scale delay-3">
              <div className="feature-icon-box"><CreditCard size={32} /></div>
              <h3>Multiple Payment Methods</h3>
              <p>Pay your way with UPI, Credit Cards, Debit Cards, and Netbanking.</p>
            </div>
            <div className="about-feature-card animate-scale delay-4">
              <div className="feature-icon-box"><Wallet size={32} /></div>
              <h3>Cash on Delivery</h3>
              <p>Check your products first and pay only when you are satisfied with the delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works section-padding bg-light">
        <div className="container">
          <div className="section-header animate-slide">
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">Ordering your groceries is as easy as 1-2-3.</p>
          </div>

          <div className="steps-container">
            <div className="step-card animate-scale">
              <div className="step-number">1</div>
              <div className="step-icon"><MousePointerClick size={24} /></div>
              <h4>Browse & Select</h4>
              <p>Explore our wide range of fresh products and add them to your cart.</p>
            </div>
            <div className="step-arrow"><ChevronRight size={32} /></div>
            <div className="step-card animate-scale delay-1">
              <div className="step-number">2</div>
              <div className="step-icon"><CreditCard size={24} /></div>
              <h4>Secure Checkout</h4>
              <p>Enter your details and choose your preferred payment method.</p>
            </div>
            <div className="step-arrow"><ChevronRight size={32} /></div>
            <div className="step-card animate-scale delay-2">
              <div className="step-number">3</div>
              <div className="step-icon"><Truck size={24} /></div>
              <h4>Fast Delivery</h4>
              <p>Relax while we pick the best products and deliver them to your home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Security */}
      <section className="benefits-security section-padding">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefits-sidebar animate-slide">
              <h2 className="section-title">Customer Benefits</h2>
              <ul className="benefits-list">
                <li><CheckCircle size={20} className="icon-green" /> <span>Convenience of shopping from home</span></li>
                <li><CheckCircle size={20} className="icon-green" /> <span>Secure and seamless checkout flow</span></li>
                <li><CheckCircle size={20} className="icon-green" /> <span>Instant order confirmation & updates</span></li>
                <li><CheckCircle size={20} className="icon-green" /> <span>Exclusive app-only discounts</span></li>
              </ul>
            </div>
            
            <div className="security-box glass animate-slide delay-1">
              <div className="security-header">
                <ShieldCheck size={40} className="icon-primary" />
                <h3>Bank-Grade Security</h3>
              </div>
              <p>
                We use <strong>Razorpay</strong> integration to handle all online payments. 
                Razorpay is a PCI-DSS compliant payment gateway, ensuring that your card data 
                is never stored on our servers and every transaction is 100% secure.
              </p>
              <div className="razorpay-badge">
                <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay Logo" className="rp-logo" />
                <span>Securely Powered by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="about-faq section-padding bg-light">
        <div className="container">
          <div className="section-header animate-slide">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          
          <div className="faq-grid-large">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item-large animate-scale delay-1">
                <h4>{item.q}</h4>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta section-padding">
        <div className="container">
          <div className="cta-card animate-scale btn-animate">
            <h2>Ready to stock your pantry?</h2>
            <p>Join thousands of satisfied customers and experience the Vasavi Mart difference today.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
