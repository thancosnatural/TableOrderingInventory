// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { getUserData } from "@/utils/cookieUtils";

export default function ProtectedRoute({
  children,
  requireRole = null,         // e.g., 'admin' (optional)
  requireVerified = false,     // set true if you need verified users only
}) {
  const location = useLocation();
  const isAuthed = Boolean(Cookies.get("th_to_access_token"));
  const { user } = getUserData() || {};

  // Not logged in → add ?auth=open once to trigger your login modal
  if (!isAuthed) {
    const params = new URLSearchParams(location.search);
    if (params.get("auth") !== "open") {
      params.set("auth", "open");
      return (
        <Navigate
          to={`${location.pathname}?${params.toString()}`}
          replace
          state={{ from: location }}
        />
      );
    }
    // auth=open is already present; let the page render so the modal can show
    return children;
  }

  // (Optional) must be verified
  if (requireVerified && !user?.is_verified) {
    return <Navigate to="/verify" replace state={{ from: location }} />;
  }

  // (Optional) must match role
  if (requireRole && user?.user_type !== requireRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
