import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Order } from '../../context/OrderContext';

interface DashboardChartsProps {
  orders?: Order[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ orders = [] }) => {
  // Compute weekly revenue (last 7 days)
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: 0
    };
  });

  orders.forEach(order => {
    const orderDateStr = new Date(order.date).toISOString().split('T')[0];
    const dayMatch = last7Days.find(d => d.dateStr === orderDateStr);
    if (dayMatch) {
      dayMatch.revenue += order.total;
    }
  });

  const maxRevenue = Math.max(...last7Days.map(d => d.revenue), 1000); // minimum 1000 to avoid division by 0
  
  // Compute Order Types (Using shipping > 0 as Delivery, == 0 as Pickup proxy)
  const totalOrders = orders.length || 1;
  const deliveryCount = orders.filter(o => o.shipping > 0).length;
  
  const deliveryPercent = Math.round((deliveryCount / totalOrders) * 100);
  const pickupPercent = 100 - deliveryPercent;

  return (
    <div className="charts-grid">
      <div className="chart-card glass animate-fade-in">
        <div className="chart-title">
          <span>Weekly Revenue Overview</span>
          <MoreHorizontal size={20} color="var(--admin-text-secondary)" />
        </div>
        <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '20px', paddingBottom: '20px' }}>
             {last7Days.map((d, i) => {
                const heightPercent = Math.max((d.revenue / maxRevenue) * 100, 5); // min 5% height
                return (
                  <div key={i} style={{ flex: 1, backgroundColor: i === 6 ? 'var(--admin-primary)' : 'rgba(255, 255, 255, 0.05)', height: `${heightPercent}%`, borderRadius: '8px', position: 'relative', transition: 'all 0.3s' }}>
                      <div className="bar-hover" style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--admin-primary)', opacity: 0 }}>₹{d.revenue.toFixed(0)}</div>
                  </div>
                );
             })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-text-secondary)', fontSize: '0.75rem' }}>
            {last7Days.map((d, i) => <span key={i}>{d.dayName}</span>)}
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
                    <span>{deliveryPercent}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ width: `${deliveryPercent}%`, height: '100%', background: 'var(--admin-primary)', borderRadius: '4px' }}></div>
                </div>
            </div>
            <div className="order-stat">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                    <span>In-Store Pickup</span>
                    <span>{pickupPercent}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ width: `${pickupPercent}%`, height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;

