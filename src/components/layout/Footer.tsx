import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Share2, Globe, Send, Video } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer animate-fade">
      <div className="container footer-container">
        <div className="footer-brand animate-slide">
          <div className="brand-logo">
            <Store className="brand-icon" />
            <span className="brand-text">Vasavi Mart</span>
          </div>
          <p className="footer-desc">
            Your premium online grocery destination. Fresh, healthy, and organic produce delivered straight to your door.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon btn-animate"><Share2 size={20} /></a>
            <a href="#" className="social-icon btn-animate"><Globe size={20} /></a>
            <a href="#" className="social-icon btn-animate"><Send size={20} /></a>
            <a href="#" className="social-icon btn-animate"><Video size={20} /></a>
          </div>
        </div>

        <div className="footer-links animate-slide delay-1">
          <h4>Shop</h4>
          <Link to="/shop">Fruits & Vegetables</Link>
          <Link to="/shop">Dairy Products</Link>
          <Link to="/shop">Staples</Link>
          <Link to="/shop">Snacks</Link>
          <Link to="/admin">Owner Dashboard</Link>
        </div>

        <div className="footer-links animate-slide delay-2">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-links animate-slide delay-3">
          <h4>Support</h4>
          <Link to="/help">Help Center</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/refund">Refund Policy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vasavi Mart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
