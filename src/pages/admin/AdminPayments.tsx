import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  Wallet,
  Receipt
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import { useOrders } from '../../context/OrderContext';

interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  amount: number;
  method: 'Card' | 'COD' | 'UPI';
  status: 'Successful' | 'Pending' | 'Failed';
}

const AdminPayments: React.FC = () => {
  const { orders } = useOrders();
  const [statusFilter, setStatusFilter] = useState('All');

  const transactions = useMemo<Transaction[]>(() => {
    return orders.map(order => ({
      id: `tx_${order.id.replace('ORD-', '')}`,
      orderId: order.id.replace('ORD-', ''),
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
      date: order.date,
      amount: order.total,
      method: (order.paymentMethod === 'UPI' || order.paymentMethod === 'Card' ? order.paymentMethod : 'COD') as any,
      status: order.status === 'Cancelled' ? 'Failed' : (order.status === 'Pending' ? 'Pending' : 'Successful')
    }));
  }, [orders]);

  const filteredTransactions = transactions.filter(t => 
    statusFilter === 'All' || t.status === statusFilter
  );

  const handleDownload = () => {
    const headers = ['Tx ID', 'Order ID', 'Customer', 'Method', 'Amount', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.id,
        t.orderId,
        t.customer,
        t.method,
        t.amount,
        t.status,
        new Date(t.date).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalSuccessful = transactions
    .filter(t => t.status === 'Successful')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AdminLayout>
      <div className="payments-page">
        <div className="welcome-section" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Payments & Transactions</h2>
          <p style={{ color: 'var(--admin-text-secondary)' }}>Monitor real-time revenue and payment health.</p>
        </div>

        <div className="stats-grid">
           <StatsCard 
              title="Total Revenue" 
              value={`₹${totalSuccessful.toLocaleString()}`} 
              icon={<TrendingUp size={24} />} 
              iconBg="#10b981"
              trend="+14% vs last week"
              increasing={true}
            />
            <StatsCard 
              title="Active Balance" 
              value="₹12,450" 
              icon={<Wallet size={24} />} 
              iconBg="#3b82f6"
              trend="Available to withdraw"
              increasing={true}
            />
            <StatsCard 
              title="Avg. Transaction" 
              value="₹1,840" 
              icon={<Receipt size={24} />} 
              iconBg="#f59e0b"
              trend="+2% increase"
              increasing={true}
            />
        </div>

        <div className="table-container">
          <div className="table-header">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Transaction History</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', color: 'white', padding: '8px 16px', borderRadius: '10px', outline: 'none' }}
              >
                <option value="All">All Status</option>
                <option value="Successful">Successful</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <button className="icon-btn" onClick={handleDownload} title="Download CSV"><Download size={18} /></button>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--admin-text-secondary)' }}>{tx.id}</td>
                  <td style={{ fontWeight: 600 }}>#{tx.orderId}</td>
                  <td>{tx.customer}</td>
                  <td>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={14} /> {tx.method}
                     </div>
                  </td>
                  <td style={{ fontWeight: 700, color: tx.status === 'Failed' ? '#ef4444' : 'white' }}>
                     {tx.status === 'Successful' ? <ArrowUpRight size={14} color="#10b981" /> : <ArrowDownLeft size={14} color="#ef4444" />}
                     ₹{tx.amount.toFixed(2)}
                  </td>
                  <td>
                    <span className={`status-badge status-${tx.status === 'Successful' ? 'delivered' : tx.status === 'Pending' ? 'pending' : 'cancelled'}`}>
                       {tx.status === 'Successful' ? <CheckCircle size={12} /> : tx.status === 'Pending' ? <Clock size={12} /> : <XCircle size={12} />}
                       {tx.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>
                     {new Date(tx.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
