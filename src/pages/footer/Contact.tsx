import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import './Contact.css';
import '../../styles/animations.css';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message sent successfully!");
    }, 2000);
  };

  return (
    <div className="contact-page animate-fade">
      {/* Hero Section */}
      <section className="contact-hero animate-slide">
        <div className="container">
          <div className="contact-hero-content">
            <h1 className="hero-title">Get in <span className="text-primary">Touch</span></h1>
            <p className="hero-subtitle">
              Have questions or feedback? We'd love to hear from you. 
              Our team is here to help you with your shopping experience.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-main-section section-padding">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info-cards animate-slide">
              <div className="info-card">
                <div className="info-icon"><Mail /></div>
                <div className="info-text">
                  <h3>Email Us</h3>
                  <p>support@vasavimart.com</p>
                  <p>hello@vasavimart.com</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon"><Phone /></div>
                <div className="info-text">
                  <h3>Call Us</h3>
                  <p>+91 12345 67890</p>
                  <p>Mon - Sun, 9am - 9pm</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon"><MapPin /></div>
                <div className="info-text">
                  <h3>Visit Our Office</h3>
                  <p>123 Green Valley Road, Jubilee Hills,</p>
                  <p>Hyderabad, Telangana - 500033</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper animate-scale delay-1">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-title">
                  <MessageSquare className="text-primary" />
                  <h2>Send a Message</h2>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      required 
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      required 
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    placeholder="What is this about?" 
                    required 
                    value={formState.subject}
                    onChange={(e) => setFormState({...formState, subject: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Message</label>
                  <textarea 
                    rows={5} 
                    placeholder="Enter your message" 
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className={`btn btn-primary btn-animate submit-btn ${isSubmitting ? 'submitting' : ''}`}>
                  {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="support-hours section-padding bg-light">
        <div className="container">
          <div className="hours-card animate-slide">
            <div className="hours-head">
              <Clock className="text-primary" size={32} />
              <h2>Customer Support Hours</h2>
            </div>
            <div className="hours-grid">
              <div className="hours-item">
                <span>Monday - Friday</span>
                <strong>9:00 AM - 10:00 PM</strong>
              </div>
              <div className="hours-item">
                <span>Saturday</span>
                <strong>10:00 AM - 8:00 PM</strong>
              </div>
              <div className="hours-item">
                <span>Sunday</span>
                <strong>10:00 AM - 4:00 PM</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
