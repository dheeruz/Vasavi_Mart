import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Store, LogOut, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartModal from '../ui/CartModal';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="navbar glass">
        <div className="container nav-container">
          <Link to="/" className="nav-brand">
            <Store className="brand-icon" />
            <span className="brand-text">Vasavi Mart</span>
          </Link>

          {isAuthenticated && (
            <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
              {user?.role === 'admin' ? (
                <>
                  <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                </>
              ) : (
                <>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                  <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>Learn More</Link>
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-1">
                    <User size={18} />
                    Your Account
                  </Link>
                </>
              )}
            </nav>
          )}

          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!isAuthenticated ? (
               <Link to="/login" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">Sign In</Link> 
            ) : (
              <>
                {user?.role !== 'admin' && (
                  <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
                    <ShoppingCart size={24} />
                    {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                  </button>
                )}
                
                <button 
                  className="logout-btn flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors font-medium ml-2" 
                  onClick={logout}
                  title="Sign Out"
                >
                   <LogOut size={20} />
                   <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            <button 
              className="mobile-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {isAuthenticated && user?.role !== 'admin' && (
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
