// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
  requireRole = null,
  requireVerified = false
}) {
  const location = useLocation();
  const { user, accessToken } = useAuth();

  const publicRoutes = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/change-password"
  ];

  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (!accessToken) {
    if (isPublicRoute) return children;

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // 2️⃣ If logged in & visiting public route → redirect to dashboard
  if (accessToken && isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Verification guard (optional)
  if (requireVerified && !user?.is_verified) {
    return (
      <Navigate
        to="/verify"
        replace
        state={{ from: location }}
      />
    );
  }

  // 4️⃣ Role-based access guard
  if (requireRole) {
    const userRole = user?.role;

    // Support both single role & array of roles
    const allowed =
      Array.isArray(requireRole)
        ? requireRole.includes(userRole)
        : requireRole === userRole;

    if (!allowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 5️⃣ Auth OK → render protected content
  return children;
}
