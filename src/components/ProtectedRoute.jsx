import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Import remains unchanged

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and preserve attempted path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
