import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import { OrderProvider } from './context/OrderContext';
import { ProductProvider } from './context/ProductContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Account from './pages/user/Account';
// Footer Pages
import About from './pages/footer/About';
import Careers from './pages/footer/Careers';
import Blog from './pages/footer/Blog';
import Contact from './pages/footer/Contact';
import HelpCenter from './pages/footer/HelpCenter';
import Terms from './pages/footer/Terms';
import Privacy from './pages/footer/Privacy';
import Refund from './pages/footer/Refund';

// Admin Pages
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

import { useEffect } from 'react';

export default function App() {
  // Global theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, []);

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              <div className="app-container">
              {!isAdminRoute && <Navbar />}
              <main className={isAdminRoute ? "admin-main-wrapper" : "main-content"}>
                <Routes>
                  {/* Public Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Public Content Routes */}
                  <Route path="/about" element={<About />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/refund" element={<Refund />} />

                  {/* Protected User Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/account" element={<Account />} />
                  </Route>

                  {/* Protected Admin Routes */}
                  <Route element={<ProtectedRoute adminOnly={true} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/customers" element={<AdminCustomers />} />
                    <Route path="/admin/payments" element={<AdminPayments />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </main>
              {!isAdminRoute && <Footer />}
            </div>
          </CartProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
    </Router>
  );
}
