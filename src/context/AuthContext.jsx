// // src/context/AuthContext.jsx (or similar)
// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { userLogin } from "@/services/authService";
// import {
//   setAccessToken as persistAccessToken,
//   setRefreshToken as persistRefreshToken,
//   setUserData,
//   getRefreshToken as getStoredRefreshToken,
//   clearAllAuth,
//   getUserData,
// } from "@/utils/cookieUtils";

// const AuthContext = createContext(null);

// export function AuthProvider({ children, baseUrl = "/api" }) {
//   const [user, setUser] = useState(getUserData());
//   const [accessToken, setAccessToken] = useState(null);
//   const [refreshToken, setRefreshToken] = useState(null);
//   const [loadingAuth, setLoadingAuth] = useState(true);

//   console.log(getUserData())

//   const api = axios.create({ baseURL: baseUrl });

//   // Attach access token to all requests
//   useEffect(() => {
//     const id = api.interceptors.request.use((cfg) => {
//       if (accessToken) {
//         cfg.headers = {
//           ...(cfg.headers || {}),
//           Authorization: `Bearer ${accessToken}`,
//         };
//       }
//       return cfg;
//     });
//     return () => api.interceptors.request.eject(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [accessToken]);

//   // 🔁 Refresh session using refresh token from cookies
//   async function refreshSession() {
//     try {
//       const storedRefresh = getStoredRefreshToken();
//       if (!storedRefresh) {
//         setLoadingAuth(false);
//         return null;
//       }

//       const resp = await api.post("/users/refresh", {
//         refresh: storedRefresh,
//       });

//       const apiData = resp?.data?.data;
//       if (!apiData?.access) {
//         setLoadingAuth(false);
//         return null;
//       }

//       // Update access token in state + cookies
//       setAccessToken(apiData.access);
//       persistAccessToken(apiData.access);

//       // If backend rotated refresh token, update it too
//       if (apiData.refresh) {
//         setRefreshToken(apiData.refresh);
//         persistRefreshToken(apiData.refresh);
//       }

//       setLoadingAuth(false);
//       return apiData.access;
//     } catch (err) {
//       console.error("Refresh session failed:", err);
//       setAccessToken(null);
//       setRefreshToken(null);
//       clearAllAuth();
//       setLoadingAuth(false);
//       return null;
//     }
//   }

//   // On initial mount: try to refresh session
//   useEffect(() => {
//     refreshSession();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // 🔐 Login using backend /users/login
//   async function login({ email, password, selectedRole }) {
//     try {
//       const payload = {
//         email,
//         password,
//         role: selectedRole, // 'super_admin', 'brand_admin', etc.
//         device_info: window.navigator.userAgent,
//       };

//       const resp = await userLogin(payload);
//       const apiData = resp?.data?.data;
//       const loggedInUser = apiData?.user;
//       const tokens = apiData?.tokens;

//       console.log(apiData)
//       console.log(loggedInUser)
//       console.log(tokens)

//       if (!tokens?.access) {
//         return {
//           success: false,
//           message: "Invalid response from server (no access token).",
//         };
//       }

//       // Put into React state
//       setAccessToken(tokens.access);
//       setRefreshToken(tokens.refresh || null);
//       setUser(loggedInUser || null);

//       // Persist to cookies (or localStorage, depending on your utils)
//       setUserData(loggedInUser || null);
//       persistAccessToken(tokens.access);
//       if (tokens.refresh) {
//         persistRefreshToken(tokens.refresh);
//       }

//       return {
//         success: true,
//         user: loggedInUser,
//         tokens,
//       };
//     } catch (err) {
//       console.error("Login error:", err);
//       const message =
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         err.message ||
//         "Login failed";
//       return { success: false, message };
//     }
//   }

//   // 🚪 Logout: call backend + clear state + cookies
//   async function logout() {
//     try {
//       const storedRefresh = getStoredRefreshToken();
//       if (storedRefresh) {
//         await api.post("/users/logout", { refresh: storedRefresh });
//       }
//     } catch (e) {
//       // ignore errors on logout
//       console.warn("Logout error:", e);
//     }

//     // Clear all client-side auth
//     setAccessToken(null);
//     setRefreshToken(null);
//     setUser(null);
//     clearAllAuth();
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         api,
//         user,
//         accessToken,
//         refreshToken,
//         loadingAuth,
//         login,
//         logout,
//         refreshSession,
//         setUser,
//         setAccessToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }













// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { userLogin } from "@/services/authService";

const LS_ACCESS = "th_to_access_token";
const LS_REFRESH = "th_to_refresh_token";
const LS_USER = "th_to_user";

const AuthContext = createContext(null);

export function AuthProvider({ children, baseUrl = "/api" }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const api = axios.create({ baseURL: baseUrl });

  // 🔗 Attach access token to all API calls
  useEffect(() => {
    const id = api.interceptors.request.use((cfg) => {
      if (accessToken) {
        cfg.headers = {
          ...(cfg.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        };
      }
      return cfg;
    });
    return () => api.interceptors.request.eject(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // 🧠 1) HYDRATE FROM LOCAL STORAGE ONCE ON MOUNT
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LS_USER);
      const storedAccess = localStorage.getItem(LS_ACCESS);
      const storedRefresh = localStorage.getItem(LS_REFRESH);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedAccess) {
        setAccessToken(storedAccess);
      }
      if (storedRefresh) {
        setRefreshToken(storedRefresh);
      }
    } catch (err) {
      console.error("Failed to read auth from localStorage:", err);
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  // ❌ Do NOT clear localStorage here.
  // ❌ Do NOT call logout/clear if refresh API fails on mount.

  // 🔐 2) LOGIN
  async function login({ email, password, selectedRole }) {
    try {
      const payload = {
        email,
        password,
        role: selectedRole,
        device_info: window.navigator.userAgent,
      };

      const resp = await userLogin(payload); // axios -> /api/users/login
      const apiData = resp?.data?.data;
      const loggedInUser = apiData?.user;
      const tokens = apiData?.tokens;

      if (!tokens?.access) {
        return {
          success: false,
          message: "Invalid response from server (no access token).",
        };
      }

      // 1) React state
      setUser(loggedInUser || null);
      setAccessToken(tokens.access);
      setRefreshToken(tokens.refresh || null);

      // 2) Persist to localStorage
      if (loggedInUser) {
        localStorage.setItem(LS_USER, JSON.stringify(loggedInUser));
      }
      localStorage.setItem(LS_ACCESS, tokens.access);
      if (tokens.refresh) {
        localStorage.setItem(LS_REFRESH, tokens.refresh);
      }

      return {
        success: true,
        user: loggedInUser,
        tokens,
      };
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Login failed";
      return { success: false, message };
    }
  }

  // 🔁 3) OPTIONAL – manual refresh using backend /users/refresh
  async function refreshSession() {
    try {
      const storedRefresh = localStorage.getItem(LS_REFRESH);
      if (!storedRefresh) return null;

      const resp = await api.post("/users/refresh", {
        refresh: storedRefresh,
      });

      const apiData = resp?.data?.data;
      if (!apiData?.access) return null;

      setAccessToken(apiData.access);
      localStorage.setItem(LS_ACCESS, apiData.access);

      if (apiData.refresh) {
        setRefreshToken(apiData.refresh);
        localStorage.setItem(LS_REFRESH, apiData.refresh);
      }

      return apiData.access;
    } catch (err) {
      console.error("refreshSession failed:", err);
      // 👇 VERY IMPORTANT:
      // Do NOT clear localStorage automatically here on mount.
      // You can choose to logout only on 401 from normal requests.
      return null;
    }
  }

  // 🚪 4) LOGOUT
  async function logout() {
    try {
      const storedRefresh = localStorage.getItem(LS_REFRESH);
      if (storedRefresh) {
        await api.post("/users/logout", { refresh: storedRefresh });
      }
    } catch (e) {
      console.warn("Logout error:", e);
    }

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_ACCESS);
    localStorage.removeItem(LS_REFRESH);
  }

  return (
    <AuthContext.Provider
      value={{
        api,
        user,
        accessToken,
        refreshToken,
        loadingAuth,
        login,
        logout,
        refreshSession,
        setUser,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
