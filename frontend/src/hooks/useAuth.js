import { useAuthContext } from '../context/AuthContext.jsx';

/**
 * Convenience hook to access auth state & actions.
 * Usage: const { user, login, logout, isAuthenticated } = useAuth();
 */
const useAuth = () => useAuthContext();

export default useAuth;
