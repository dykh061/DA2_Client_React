import { Navigate, useLocation } from "react-router-dom";
import { decodeAccessToken, getToken } from "../utils/auth";

function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole) {
    const payload = decodeAccessToken(token);

    if (!payload || payload.role !== requiredRole) {
      return <Navigate to="/my-bookings" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
