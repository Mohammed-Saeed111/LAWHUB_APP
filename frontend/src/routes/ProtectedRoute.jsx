import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Logo from '../components/ui/Logo.jsx';

/**
 * Guards private routes. Optionally accepts a `roles` prop to restrict
 * access to specific user roles (e.g. ['lawyer', 'office'] for Phase C).
 * While the session bootstraps we show a splash-like loader.
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy">
        <Logo size={80} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  // Role-based guard (Phase C — Lawyer Workspace)
  if (roles && user?.role && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

