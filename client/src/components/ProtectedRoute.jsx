import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div>
        <div></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && requiredRole !== user?.role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
