import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FullPageLoader } from '../components/common/Loader';

export default function AuthGuard({ children }) {
    const location = useLocation();
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <FullPageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
}
