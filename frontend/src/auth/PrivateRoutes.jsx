import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p>Chargement...</p>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
