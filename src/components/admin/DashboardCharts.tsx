import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const DashboardCharts: React.FC = () => {
  return (
    <div className="charts-grid">
      <div className="chart-card glass animate-fade-in">
        <div className="chart-title">
          <span>Weekly Revenue Overview</span>
          <MoreHorizontal size={20} color="var(--admin-text-secondary)" />
        </div>
        <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '20px', paddingBottom: '20px' }}>
             {/* Simple CSS-based bar chart for visualization */}
             {[40, 70, 55, 90, 65, 80, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: i === 6 ? 'var(--admin-primary)' : 'rgba(255, 255, 255, 0.05)', height: `${h}%`, borderRadius: '8px', position: 'relative', transition: 'all 0.3s' }}>
                    <div className="bar-hover" style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--admin-primary)', opacity: 0 }}>₹{h*100}</div>
                </div>
             ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-text-secondary)', fontSize: '0.75rem' }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
      
      <div className="chart-card glass animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="chart-title">
           <span>Order Types</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            <div className="order-stat">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                    <span>Home Delivery</span>
                    <span>75%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ width: '75%', height: '100%', background: 'var(--admin-primary)', borderRadius: '4px' }}></div>
                </div>
            </div>
            <div className="order-stat">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                    <span>In-Store Pickup</span>
                    <span>25%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ width: '25%', height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
