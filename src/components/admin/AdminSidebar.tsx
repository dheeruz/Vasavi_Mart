import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Box, 
  CreditCard, 
  BarChart3, 
  Settings,
  Store
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { name: 'Products', icon: <Box size={20} />, path: '/admin/products' },
    { name: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
    { name: 'Payments', icon: <CreditCard size={20} />, path: '/admin/payments' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/admin/analytics' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <Store size={28} />
        <span>Vasavi Admin</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
