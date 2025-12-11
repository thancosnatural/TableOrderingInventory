// // src/routes/ProtectedRoute.jsx
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";

// export default function ProtectedRoute({
//   children,
//   requireRole = null,     // e.g. 'super_admin'
//   requireVerified = false // if you use email/phone verification
// }) {
//   const location = useLocation();

//   const { user, accessToken } = useAuth();

//   // 1️⃣ Not logged in → go to /login
//   if (!accessToken) {
//     // Important: if we are *already* on /login, do NOT redirect again
//     if (location.pathname === "/login" || location.pathname === "/forgot-password" || location.pathname === "/reset-password" || location.pathname === "/change-password") {
//       return children;
//     }

//     return (
//       <Navigate
//         to="/login"
//         replace
//         state={{ from: location }}
//       />
//     );
//   }

//   // 2️⃣ Optional: must be verified
//   if (requireVerified && !user?.is_verified) {
//     return (
//       <Navigate
//         to="/verify"
//         replace
//         state={{ from: location }}
//       />
//     );
//   }

//   // 3️⃣ Optional: role-based guard
//   //   Backend sends: user.role = 'super_admin' | 'brand_admin' | 'outlet_admin' | 'staff'
//   if (requireRole && user?.role !== requireRole) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // 4️⃣ Auth OK → render protected content
//   return children;
// }



// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
  requireRole = null,        // 'super_admin' or ['admin', 'staff']
  requireVerified = false    // optional
}) {
  const location = useLocation();
  const { user, accessToken } = useAuth();

  // 🔓 Routes that should NOT require authentication
  const publicRoutes = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/change-password"
  ];

  const isPublicRoute = publicRoutes.includes(location.pathname);

  // 1️⃣ If not logged in → allow public routes, block others
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
