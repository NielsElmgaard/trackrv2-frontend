import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({accessToken}) {
    const isAuthenticated = !!accessToken;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;