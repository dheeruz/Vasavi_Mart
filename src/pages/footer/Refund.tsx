import React from 'react';
import './Legal.css';
import '../../styles/animations.css';

const Refund: React.FC = () => {
  return (
    <div className="legal-page animate-fade">
      <section className="legal-hero animate-slide">
        <div className="container">
          <h1>Refund <span className="text-primary">Policy</span></h1>
          <p>Last updated: April 02, 2024</p>
        </div>
      </section>

      <section className="legal-content section-padding">
        <div className="container">
          <div className="legal-card animate-scale">
            <h2>1. Cancellation Policy</h2>
            <p>Orders can be cancelled before they are processed. Once an order is processed, cancellation is no longer possible.</p>

            <h2>2. Refund Eligibility</h2>
            <p>If you receive a damaged or defective item, you may be eligible for a refund. Please contact our support team within 2 hours of delivery.</p>

            <h2>3. Return Process</h2>
            <p>To initiate a return, go to your order history and select the items you wish to return. Once your return is approved, we will provide instructions for pickup.</p>

            <h2>4. Refund Processing Time</h2>
            <p>Refunds are usually processed within 5-7 business days after we receive the returned item. The refund will be credited to your original payment method.</p>

            <h2>5. Non-Refundable Items</h2>
            <p>Some items, such as fresh produce and perishables, are not eligible for a refund unless they are damaged or defective at the time of delivery.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Refund;
