import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/useAuthStore';

export const RootRedirect: React.FC = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default RootRedirect;
