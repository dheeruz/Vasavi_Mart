import React from 'react';
import { Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';
import './Blog.css';
import '../../styles/animations.css';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      title: "10 Superfoods for a Healthy Lifestyle",
      category: "Nutrition",
      author: "Dr. Anjali",
      date: "Mar 28, 2024",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
      excerpt: "Discover the power of nature's best fuels. From blueberries to spinach, find out what your body truly needs..."
    },
    {
      title: "The Art of Selecting Fresh Produce",
      category: "Shopping Tips",
      author: "Rajesh Kumar",
      date: "Mar 25, 2024",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
      excerpt: "Ever wondered how to tell if a mango is perfectly ripe? Our master pickers share their top secrets..."
    },
    {
      title: "Sustainable Living: Reducing Plastic in Groceries",
      category: "Sustainability",
      author: "Priya Sharma",
      date: "Mar 22, 2024",
      image: "https://images.unsplash.com/photo-1532884928231-ef40895eb654?auto=format&fit=crop&q=80&w=800",
      excerpt: "Step-by-step guide to eco-friendly shopping. Learn how small changes in your kitchen can impact the planet..."
    },
    {
      title: "Low Carb Recipes for Busy Evenings",
      category: "Recipes",
      author: "Chef Vikram",
      date: "Mar 19, 2024",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
      excerpt: "Delicious and fast dinner ideas that won't compromise your health goals. Perfect for mid-week hustle..."
    }
  ];

  return (
    <div className="blog-page animate-fade">
      {/* Hero Section */}
      <section className="blog-hero animate-slide">
        <div className="container">
          <div className="blog-hero-content">
            <div className="trending-badge"><TrendingUp size={16} /> Trending Updates</div>
            <h1 className="hero-title">Wellness & <span className="text-primary">Life Blog</span></h1>
            <p className="hero-subtitle">
              Insights, recipes, and tips from the experts at Vasavi Mart. 
              Stay informed about everything fresh and healthy.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="blog-grid-section section-padding">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((post, index) => (
              <article key={index} className={`blog-card animate-scale delay-${(index % 3) + 1}`}>
                <div className="blog-image-wrapper hover-zoom">
                  <img src={post.image} alt={post.title} />
                  <span className="blog-category">{post.category}</span>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span><Calendar size={14} /> {post.date}</span>
                    <span><User size={14} /> {post.author}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <button className="read-more-btn btn-animate">
                    Read Full Story <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section section-padding bg-light">
        <div className="container">
          <div className="newsletter-card animate-slide">
            <h2>Get fresh updates in your inbox</h2>
            <p>Subscribe to our newsletter and never miss a healthy recipe or seasonal deal.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn btn-primary btn-animate">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
