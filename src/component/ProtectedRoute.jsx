import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// লগইন না থাকলে /login এ পাঠায়; adminOnly হলে ইউজার অ্যাডমিন কিনা চেক করে
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center py-24 text-gray-500">Loading...</div>;
  }
  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  if (adminOnly && !isAdmin) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold text-gray-900">Access denied</h1>
        <p className="text-gray-500 mt-2">You need an admin account to view this page.</p>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;
