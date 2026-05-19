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
import { useOrders } from '../../context/OrderContext';

const AdminAnalytics: React.FC = () => {
  const { orders } = useOrders();
  
  // Avg Order Value
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length) : 0;
  
  // Repeat Customers
  const customerCounts: Record<string, number> = {};
  orders.forEach(o => {
    customerCounts[o.customer.email] = (customerCounts[o.customer.email] || 0) + 1;
  });
  const totalUniqueCustomers = Object.keys(customerCounts).length;
  const repeatCustomerCount = Object.values(customerCounts).filter(count => count > 1).length;
  const repeatCustomerRate = totalUniqueCustomers > 0 ? (repeatCustomerCount / totalUniqueCustomers) * 100 : 0;

  // Conversion rate (dummy logic based on unique customers vs simulated traffic)
  const visitors = totalUniqueCustomers * 3 + 120;
  const conversionRate = visitors > 0 ? (orders.length / visitors) * 100 : 0;

  // Sales Distribution
  let fruits = 0, staples = 0, dairy = 0;
  orders.forEach(o => o.items.forEach(item => {
     if (item.category === 'Fruits & Veggies') fruits += item.quantity;
     else if (item.category === 'Staples & Grains') staples += item.quantity;
     else dairy += item.quantity;
  }));
  const totalItems = fruits + staples + dairy || 1;
  const fruitsPercent = Math.round((fruits / totalItems) * 100);
  const staplesPercent = Math.round((staples / totalItems) * 100);
  const dairyPercent = 100 - fruitsPercent - staplesPercent;

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
              value={`${conversionRate.toFixed(2)}%`} 
              icon={<TrendingUp size={24} />} 
              iconBg="#10b981"
              trend="+0.25%"
              increasing={true}
            />
            <StatsCard 
              title="Repeat Customers" 
              value={`${repeatCustomerRate.toFixed(1)}%`} 
              icon={<Users size={24} />} 
              iconBg="#3b82f6"
              trend="+1.2%"
              increasing={true}
            />
            <StatsCard 
              title="Avg. Order Value" 
              value={`₹${avgOrderValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`} 
              icon={<ShoppingBag size={24} />} 
              iconBg="#f59e0b"
              trend="-40.50"
              increasing={false}
            />
        </div>

        <DashboardCharts orders={orders} />

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
                       <span>{fruitsPercent}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                       <div style={{ width: `${fruitsPercent}%`, height: '100%', background: 'var(--admin-primary)', borderRadius: '4px' }}></div>
                    </div>
                 </div>
                 <div className="progress-stat">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                       <span>Staples & Grains</span>
                       <span>{staplesPercent}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                       <div style={{ width: `${staplesPercent}%`, height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
                    </div>
                 </div>
                 <div className="progress-stat">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                       <span>Dairy & Eggs (and others)</span>
                       <span>{dairyPercent}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                       <div style={{ width: `${dairyPercent}%`, height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
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
