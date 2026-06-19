import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser, currentWorkspace, loadWorkspaces, workspaces } = useAuth();
  const location = useLocation();

  // Load workspaces on component mount if not already loaded
  useEffect(() => {
    if (isAuthenticated && workspaces.length === 0) {
      loadWorkspaces();
    }
  }, [isAuthenticated, workspaces.length, loadWorkspaces]);

  if (!isAuthenticated) {
    return <Navigate to="/no-session" replace />;
  }

  if (requireAdmin && !currentUser?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access to workspace management page without workspace selection
  if (location.pathname === '/workspaces') {
    return <>{children}</>;
  }

  // Allow access to SRI connection page globally (independent of workspace)
  if (location.pathname === '/sri-connection') {
    return <>{children}</>;
  }

  // Allow access to reports globally
  if (location.pathname === '/reports') {
    return <>{children}</>;
  }

  // For other pages, require workspace selection
  if (!currentWorkspace) {
    return <Navigate to="/workspaces" replace />;
  }

  return <>{children}</>;
}
