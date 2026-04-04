import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardCharts from '../../components/admin/DashboardCharts';
import StatsCard from '../../components/admin/StatsCard';

const AdminAnalytics: React.FC = () => {
  return (
    <AdminLayout>
      <div className="analytics-page">
        <div className="welcome-section" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Store Analytics</h2>
            <p style={{ color: 'var(--admin-text-secondary)' }}>Deep dive into your store's performance metrics.</p>
          </div>
          <button className="icon-btn" style={{ padding: '12px 20px', borderRadius: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
             <Calendar size={18} /> Last 30 Days
          </button>
        </div>

        <div className="stats-grid">
           <StatsCard 
              title="Conversion Rate" 
              value="3.45%" 
              icon={<TrendingUp size={24} />} 
              iconBg="#10b981"
              trend="+0.25%"
              increasing={true}
            />
            <StatsCard 
              title="Repeat Customers" 
              value="22.1%" 
              icon={<Users size={24} />} 
              iconBg="#3b82f6"
              trend="+1.2%"
              increasing={true}
            />
            <StatsCard 
              title="Avg. Order Value" 
              value="₹1,240" 
              icon={<ShoppingBag size={24} />} 
              iconBg="#f59e0b"
              trend="-40.50"
              increasing={false}
            />
        </div>

        <DashboardCharts />

        <div className="charts-grid" style={{ marginTop: '24px' }}>
           <div className="chart-card glass">
              <div className="chart-title">
                  <span>Customer Retention Rate</span>
                  <MoreHorizontal size={18} />
              </div>
              <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '20px 0' }}>
                 {[30, 45, 60, 55, 75, 80, 70, 85, 90, 75, 80, 95].map((h, i) => (
                    <div key={i} style={{ flex: 1, backgroundColor: 'rgba(34, 197, 94, 0.2)', height: `${h}%`, borderRadius: '4px', position: 'relative' }}>
                       <div style={{ position: 'absolute', bottom: '0', width: '100%', height: '30%', backgroundColor: 'var(--admin-primary)', borderRadius: '4px' }}></div>
                    </div>
                 ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--admin-text-secondary)' }}>
                 {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
              </div>
           </div>
           
           <div className="chart-card glass">
              <div className="chart-title">
                  <span>Product Sales Distribution</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
                 <div className="progress-stat">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                       <span>Fruits & Veggies</span>
                       <span>45%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                       <div style={{ width: '45%', height: '100%', background: 'var(--admin-primary)', borderRadius: '4px' }}></div>
                    </div>
                 </div>
                 <div className="progress-stat">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                       <span>Staples & Grains</span>
                       <span>30%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                       <div style={{ width: '30%', height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
                    </div>
                 </div>
                 <div className="progress-stat">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                       <span>Dairy & Eggs</span>
                       <span>15%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                       <div style={{ width: '15%', height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
