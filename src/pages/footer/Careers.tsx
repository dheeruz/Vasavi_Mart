import React from 'react';
import { 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Smile
} from 'lucide-react';
import './Careers.css';
import '../../styles/animations.css';

const Careers: React.FC = () => {
  const jobs = [
    { title: "Delivery Specialist", type: "Full-time", location: "Hyderabad", id: "DS001" },
    { title: "Store Operations Manager", type: "Full-time", location: "Warangal", id: "SOM002" },
    { title: "Customer Support Executive", type: "Remote", location: "India", id: "CSE003" },
    { title: "Inventory Associate", type: "Part-time", location: "Nizamabad", id: "IA004" }
  ];

  const benefits = [
    { icon: <Heart />, title: "Health Benefits", desc: "Comprehensive medical insurance for you and your family." },
    { icon: <Star />, title: "Growth Opportunities", desc: "Structured career paths and regular training workshops." },
    { icon: <TrendingUp />, title: "Performance Bonus", desc: "We reward hard work with competitive quarterly bonuses." },
    { icon: <Smile />, title: "Work-Life Balance", desc: "Flexible shifts and generous paid time off policies." }
  ];

  return (
    <div className="careers-page animate-fade">
      {/* Hero Section */}
      <section className="careers-hero animate-slide">
        <div className="container">
          <div className="careers-hero-content">
            <h1 className="hero-title">Join the <span className="text-primary">Vasavi Mart</span> Family</h1>
            <p className="hero-subtitle">
              We are on a mission to revolutionize grocery shopping in India. 
              Be part of a team that values innovation, integrity, and community.
            </p>
            <a href="#openings" className="btn btn-primary btn-lg btn-animate">
              View Current Openings <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="careers-benefits section-padding">
        <div className="container">
          <div className="section-header animate-slide">
            <h2 className="section-title">Why Work With Us?</h2>
            <p className="section-desc">More than just a job, we offer a place to belong and grow.</p>
          </div>

          <div className="benefits-grid-careers">
            {benefits.map((benefit, index) => (
              <div key={index} className={`benefit-card animate-scale delay-${index + 1}`}>
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="careers-openings section-padding bg-light">
        <div className="container">
          <div className="section-header animate-slide">
            <h2 className="section-title">Open Positions</h2>
            <p className="section-desc">Find your next career move at Vasavi Mart.</p>
          </div>

          <div className="jobs-list">
            {jobs.map((job, index) => (
              <div key={index} className={`job-card animate-slide delay-${index + 1}`}>
                <div className="job-info">
                  <div className="job-main">
                    <h3>{job.title}</h3>
                    <div className="job-meta">
                      <span><MapPin size={16} /> {job.location}</span>
                      <span><Clock size={16} /> {job.type}</span>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-animate">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="careers-cta section-padding">
        <div className="container">
          <div className="careers-cta-box glass animate-scale">
            <h2>Don't see a perfect fit?</h2>
            <p>Send your resume to careers@vasavimart.com and we'll keep you in mind for future roles.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
