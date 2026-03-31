import React from 'react';
import { Store } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="brand-logo">
            <Store className="brand-icon" />
            <span className="brand-text">Vasavi Mart</span>
          </div>
          <p className="footer-desc">
            Your premium online grocery destination. Fresh, healthy, and organic produce delivered straight to your door.
          </p>
        </div>

        <div className="footer-links">
          <h4>Shop</h4>
          <a href="#">Fruits & Vegetables</a>
          <a href="#">Dairy Products</a>
          <a href="#">Staples</a>
          <a href="#">Snacks</a>
          <a href="/admin">Owner Dashboard</a>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Refund Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vasavi Mart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
