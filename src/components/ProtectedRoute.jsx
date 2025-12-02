// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
  requireRole = null,     // e.g. 'super_admin'
  requireVerified = false // if you use email/phone verification
}) {
  const location = useLocation();

  const { user, accessToken } = useAuth();

  // 1️⃣ Not logged in → go to /login
  if (!accessToken) {
    // Important: if we are *already* on /login, do NOT redirect again
    if (location.pathname === "/login") {
      return children;
    }

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // 2️⃣ Optional: must be verified
  if (requireVerified && !user?.is_verified) {
    return (
      <Navigate
        to="/verify"
        replace
        state={{ from: location }}
      />
    );
  }

  // 3️⃣ Optional: role-based guard
  //   Backend sends: user.role = 'super_admin' | 'brand_admin' | 'outlet_admin' | 'staff'
  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4️⃣ Auth OK → render protected content
  return children;
}
