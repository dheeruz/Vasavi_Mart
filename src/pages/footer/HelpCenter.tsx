import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, LifeBuoy, Package, CreditCard, User, Truck, HelpCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HelpCenter.css';
import '../../styles/animations.css';

const HelpCenter: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    { icon: <Package />, title: "Orders & Shipping", desc: "Track status, change delivery address, or reschedule." },
    { icon: <CreditCard />, title: "Payments & Refunds", desc: "View payment methods, troubleshoot failed payments." },
    { icon: <User />, title: "My Account", desc: "Manage profile, address book, and security settings." },
    { icon: <LifeBuoy />, title: "Returns & Exchanges", desc: "Start a return, check return status, policy details." },
    { icon: <TrendingUp className="text-secondary" />, title: "Promotions & Deals", desc: "Using coupons, seasonal offers, and reward points." },
    { icon: <Truck />, title: "Delivery Partners", desc: "Delivery executive guidelines and feedback." }
  ];

  const faqs = [
    {
      q: "How do I track my order?",
      a: "Go to 'My Orders' in your account section. Click on the specific order to see real-time tracking updates provided by our delivery partners."
    },
    {
      q: "What if my products are damaged?",
      a: "We have a hassle-free return policy. If any items are damaged, please notify the delivery partner immediately or raise a ticket within 2 hours of delivery."
    },
    {
      q: "Can I cancel my order?",
      a: "Orders can be cancelled before they are dispatched. Once the order is 'Out for Delivery', cancellation is not possible through the app."
    },
    {
      q: "What are the delivery charges?",
      a: "Delivery is free for orders above ₹499. For orders below that, a nominal fee of ₹40 applies to ensure quality and speed."
    }
  ];

  return (
    <div className="help-center-page animate-fade">
      {/* Search Hero */}
      <section className="help-hero animate-slide">
        <div className="container">
          <div className="help-hero-content">
            <h1>How can we <span className="text-primary">help?</span></h1>
            <div className="search-bar-wrapper animate-scale">
              <Search size={24} className="search-icon" />
              <input type="text" placeholder="Search for articles, topics, or keywords..." />
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="support-categories section-padding">
        <div className="container">
          <div className="categories-grid">
            {categories.map((cat, index) => (
              <div key={index} className={`category-card animate-scale delay-${(index % 3) + 1}`}>
                <div className="cat-icon-box">{cat.icon}</div>
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
                <button className="learn-more-btn">Explore <ArrowRight size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-accordion-section section-padding bg-light">
        <div className="container">
          <div className="section-header animate-slide">
            <h2 className="section-title">Popular Questions</h2>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-accordion-item animate-slide delay-${index + 1}`}>
                <button 
                  className={`faq-question ${activeFaq === index ? 'active' : ''}`}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span>{faq.q}</span>
                  {activeFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div className={`faq-answer ${activeFaq === index ? 'show' : ''}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="support-cta section-padding">
        <div className="container">
          <div className="support-cta-card animate-scale">
            <HelpCircle size={48} className="text-primary" />
            <h2>Still need help?</h2>
            <p>Our dedicated support team is available 24/7 to assist you with any queries.</p>
            <div className="support-cta-btns">
              <Link to="/contact" className="btn btn-primary btn-lg btn-animate">Contact Us</Link>
              <button className="btn btn-outline btn-lg btn-animate">Live Chat</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
