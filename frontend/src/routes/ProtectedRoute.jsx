import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Logo from '../components/ui/Logo.jsx';

/**
 * Guards private routes. While the session bootstraps we show a splash-like
 * loader; unauthenticated users are sent to the onboarding splash (/welcome).
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
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

  return children;
};

export default ProtectedRoute;
