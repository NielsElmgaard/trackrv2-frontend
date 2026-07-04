import { Outlet } from "react-router-dom";
import Navigate from "../navigation/Navigate.jsx";

function ProtectedRoute({accessToken}) {
    const isAuthenticated = !!accessToken;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;