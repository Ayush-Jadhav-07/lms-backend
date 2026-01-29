import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "../services/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const logged = isLoggedIn();
  const role = getRole();

  if (!logged) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
}
