import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface ProtectedRouteProps {
  element?: React.ReactNode;
  allowedRoles: string[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ element, allowedRoles, children }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useUser();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={`/auth?type=signin&redirect=${location.pathname}`} replace />;
  }

  // If authenticated but not authorized for this route, redirect to dashboard
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and authorized, render the component or children
  if (children) {
    return <>{children}</>;
  }
  
  return <>{element}</>;
};

export default ProtectedRoute;
