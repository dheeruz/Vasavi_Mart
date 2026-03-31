import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Truck, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { mockProducts } from '../data/mockProducts';
import './Home.css';

const Home: React.FC = () => {
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content animate-fade-in">
            <span className="hero-badge">100% Organic & Fresh</span>
            <h1 className="hero-title">
              Farm Fresh Groceries <br /> Delivered to Your Door.
            </h1>
            <p className="hero-subtitle">
              Shop from our huge selection of fresh produce, dairy, and pantry staples. 
              Quality guaranteed, straight from farm to table.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary hero-btn">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn-outline hero-btn">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img 
              src="/hero_groceries.png" 
              alt="Fresh groceries in a paper bag" 
              className="hero-image"
            />
            <div className="floating-card glass">
              <div className="fc-icon"><Leaf size={24} color="var(--primary-color)" /></div>
              <div className="fc-text">
                <strong>Certified Organic</strong>
                <span>Locally sourced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section bg-light">
        <div className="container features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Truck size={32} /></div>
            <h3>Free Delivery</h3>
            <p>On all orders over ₹500</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={32} /></div>
            <h3>Secure Payments</h3>
            <p>100% secure checkout</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Leaf size={32} /></div>
            <h3>Fresh Quality</h3>
            <p>Picked just for you</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Now</h2>
            <Link to="/shop" className="view-all-link">View All <ArrowRight size={16} /></Link>
          </div>
          
          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
