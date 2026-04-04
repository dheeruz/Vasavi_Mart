import React from 'react';
import './Legal.css';
import '../../styles/animations.css';

const Privacy: React.FC = () => {
  return (
    <div className="legal-page animate-fade">
      <section className="legal-hero animate-slide">
        <div className="container">
          <h1>Privacy <span className="text-primary">Policy</span></h1>
          <p>Last updated: April 02, 2024</p>
        </div>
      </section>

      <section className="legal-content section-padding">
        <div className="container">
          <div className="legal-card animate-scale">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly, such as your name, email, and address. We also collect usage data through cookies to improve your experience.</p>

            <h2>2. How We Use Your Information</h2>
            <p>Your data is used to process your orders, provide customer support, and send you relevant updates. We do not sell your personal data to third parties.</p>

            <h2>3. Data Security</h2>
            <p>We use industry-standard security measures to protect your information. However, no method of electronic transmission is 100% secure.</p>

            <h2>4. Third-Party Links</h2>
            <p>Our site may contain links to third-party websites. We are not responsible for their privacy practices or content.</p>

            <h2>5. Changes to This Policy</h2>
            <p>We may update our privacy policy from time to time. You will be notified of any significant changes via email or an on-site notice.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
