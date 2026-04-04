import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  // If totally unauthenticated, redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If an admin portal is requested but they are just a user
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Valid session detected
  return <Outlet />;
};

export default ProtectedRoute;
