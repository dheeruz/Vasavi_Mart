import React from 'react';
import './Legal.css';
import '../../styles/animations.css';

const Terms: React.FC = () => {
  return (
    <div className="legal-page animate-fade">
      <section className="legal-hero animate-slide">
        <div className="container">
          <h1>Terms of <span className="text-primary">Service</span></h1>
          <p>Last updated: April 02, 2024</p>
        </div>
      </section>

      <section className="legal-content section-padding">
        <div className="container">
          <div className="legal-card animate-scale">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Vasavi Mart, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

            <h2>2. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

            <h2>3. Product Information</h2>
            <p>While we strive to provide accurate product information, including prices and availability, errors may occur. We reserve the right to correct any errors and to change information at any time without prior notice.</p>

            <h2>4. Delivery Policy</h2>
            <p>Delivery times are estimates and not guaranteed. We are not liable for delays beyond our reasonable control, including but not limited to weather conditions or traffic.</p>

            <h2>5. Intellectual Property</h2>
            <p>All content on this site, including text, graphics, logos, and images, is the property of Vasavi Mart and is protected by international copyright laws.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
