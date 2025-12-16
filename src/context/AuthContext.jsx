// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { changePassword, forgotPassword, resetPassword, userLogin, userLogout } from "@/services/authService";

// import {
//   setAccessToken as persistAccessToken,
//   setRefreshToken as persistRefreshToken,
//   setUserData,
//   getAccessToken as getStoredAccessToken,
//   getRefreshToken as getStoredRefreshToken,
//   getUserData as getStoredUserData,
//   clearAllAuth,
// } from "@/utils/authStorage";
// import { postErrorHandler } from "@/components/ErrorHandler";

// const AuthContext = createContext(null);

// export function AuthProvider({ children, baseUrl = "/api" }) {
//   // 🔹 hydrate from localStorage on first render
//   const [user, setUser] = useState(() => getStoredUserData());
//   const [accessToken, setAccessToken] = useState(() => getStoredAccessToken());
//   const [refreshToken, setRefreshToken] = useState(() => getStoredRefreshToken());
//   const [loadingAuth, setLoadingAuth] = useState(true);

//   const api = useRef(axios.create({ baseURL: baseUrl })).current;

//   // refs for timers so we can clear on change
//   const logoutTimerRef = useRef(null);
//   const refreshTimerRef = useRef(null);

//   // helper to clear timers
//   const clearTimers = () => {
//     if (logoutTimerRef.current) {
//       clearTimeout(logoutTimerRef.current);
//       logoutTimerRef.current = null;
//     }
//     if (refreshTimerRef.current) {
//       clearTimeout(refreshTimerRef.current);
//       refreshTimerRef.current = null;
//     }
//   };

//   // Attach access token to all axios requests (keeps in sync when accessToken changes)
//   useEffect(() => {
//     const id = api.interceptors.request.use((cfg) => {
//       if (accessToken) {
//         cfg.headers = {
//           ...(cfg.headers || {}),
//           Authorization: `Bearer ${accessToken}`,
//         };
//       } else {
//         if (cfg.headers) delete cfg.headers.Authorization;
//       }
//       return cfg;
//     });
//     return () => api.interceptors.request.eject(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [accessToken]);

//   // Response interceptor to catch 401 and force logout
//   useEffect(() => {
//     const id = api.interceptors.response.use(
//       (res) => res,
//       (error) => {
//         if (error?.response?.status === 401) {
//           console.warn("API responded 401 - logging out");
//           window.dispatchEvent(new Event("auth:logout"));
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => api.interceptors.response.eject(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---- Token timing logic: schedule refresh and logout based on accessToken exp ----
//   const scheduleTimersForToken = (jwt) => {
//     clearTimers();
//     if (!jwt) return;

//     let decoded;
//     try {
//       decoded = jwtDecode(jwt);
//     } catch (err) {
//       // invalid token => force logout
//       console.error("Invalid access token, logging out", err);
//       window.dispatchEvent(new Event("auth:logout"));
//       return;
//     }

//     // decoded.exp is seconds since epoch
//     const expiryMs = decoded.exp * 1000 - Date.now();

//     // If already expired: logout immediately
//     if (expiryMs <= 0) {
//       console.info("Access token already expired — logging out");
//       logout()
//       window.dispatchEvent(new Event("auth:logout"));
//       return;
//     }

//     // Schedule exact logout at expiry
//     logoutTimerRef.current = setTimeout(() => {
//       console.info("Access token expired — auto-logout triggered");
//       logout()
//       window.dispatchEvent(new Event("auth:logout"));
//     }, expiryMs);

//     // Schedule refresh attempt 60s before expiry if we have a refresh token
//     // (avoid negative timeout)
//     const refreshBeforeMs = 60 * 1000; // 1 minute
//     if (getStoredRefreshToken()) {
//       const refreshIn = Math.max(expiryMs - refreshBeforeMs, 0);
//       refreshTimerRef.current = setTimeout(async () => {
//         try {
//           console.info("Attempting background refresh before token expiry");
//           await refreshSession();
//           // refreshSession() will setAccessToken and reschedule timers via useEffect below
//         } catch (e) {
//           console.warn("Background refresh failed, will logout on expiry or earlier", e);
//         }
//       }, refreshIn);
//     }
//   };

//   // Reschedule timers whenever accessToken changes
//   useEffect(() => {
//     scheduleTimersForToken(accessToken);
//     return () => clearTimers();
//   }, [accessToken]);

//   // ---- Refresh session using refresh token from storage ----
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

//       // Update access token in state + localStorage
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
//       postErrorHandler(err)
//       setAccessToken(null);
//       setRefreshToken(null);
//       clearAllAuth();
//       setLoadingAuth(false);
//       return null;
//     }
//   }

//   // On initial mount:
//   useEffect(() => {
//     if (getStoredAccessToken()) {
//       setLoadingAuth(false);
//       return;
//     }
//     refreshSession();
//   }, []);

//   // ---- Login ----
//   async function login({ email, password, role, remember, company_code }) {
//     try {
//       const payload = {
//         email,
//         password,
//         company_code,
//         role,
//         remember,
//         device_info: window.navigator.userAgent,
//       };

//       const resp = await userLogin(payload);
//       const apiData = resp?.data?.data;
//       const loggedInUser = apiData?.user;
//       const tokens = apiData?.tokens;

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

//       // Persist to localStorage
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

//   // ---- Logout: call backend + clear state + localStorage ----
//   async function logout() {
//     try {
//       const storedRefresh = getStoredRefreshToken();
//       if (storedRefresh) {
//         await userLogout({ refresh: storedRefresh });
//       }
//     } catch (e) {
//       console.warn("Logout error:", e);
//     }

//     clearTimers();
//     setAccessToken(null);
//     setRefreshToken(null);
//     setUser(null);
//     clearAllAuth();
//   }

//   async function userForgotPassword(payload) {
//     try {
//       await forgotPassword(payload);
//     } catch (error) {
//       postErrorHandler(error)
//     }
//   }

//   async function userResetPassword(payload) {
//     console.log(payload)
//     try {
//       await resetPassword(payload);
//     } catch (error) {
//       postErrorHandler(error)
//     }
//   }

//   async function userChangePassword(payload) {
//     try {
//       await changePassword(payload);
//     } catch (error) {
//       postErrorHandler(error)
//     }
//   }

//   // React to cross-tab storage events (login/logout in other tab)
//   useEffect(() => {
//     const onStorage = (e) => {
//       if (e.key === "token" || e.key === "accessToken") {
//         const newToken = e.newValue;
//         if (!newToken) {
//           // token removed in another tab -> logout here too
//           logout();
//         } else {
//           // token added/changed in another tab -> update and reschedule
//           setAccessToken(newToken);
//           try {
//             setUser(jwtDecode(newToken));
//           } catch {
//             setUser(null);
//           }
//         }
//       }

//       // if refresh token cleared elsewhere, clear here too
//       if (e.key === "refreshToken" && !e.newValue) {
//         setRefreshToken(null);
//       }
//     };

//     window.addEventListener("storage", onStorage);

//     // Also listen for programmatic auth:logout events we dispatch above
//     const onAuthLogout = () => logout();
//     window.addEventListener("auth:logout", onAuthLogout);

//     return () => {
//       window.removeEventListener("storage", onStorage);
//       window.removeEventListener("auth:logout", onAuthLogout);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

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
//         userForgotPassword,
//         userResetPassword,
//         userChangePassword,
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
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

import {
  changePassword,
  forgotPassword,
  resetPassword,
  userLogin,
  userLogout,
} from "@/services/authService";

import {
  setAccessToken as persistAccessToken,
  setRefreshToken as persistRefreshToken,
  setUserData as persistUserData,
  getAccessToken as getStoredAccessToken,
  getRefreshToken as getStoredRefreshToken,
  getUserData as getStoredUserData,
  clearAllAuth,
} from "@/utils/authStorage";

import { postErrorHandler } from "@/components/ErrorHandler";
import { API_STATUS_CONSTANTS } from "@/constants/branding";

const AuthContext = createContext(null);

export function AuthProvider({ children, baseUrl = "/api" }) {
  // ✅ status like CompaniesContext
  const [apiStatus, setApiStatus] = useState(API_STATUS_CONSTANTS.INITIAL);

  // hydrate from storage
  const [user, setUser] = useState(() => getStoredUserData());
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken());
  const [refreshToken, setRefreshToken] = useState(() => getStoredRefreshToken());
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [error, setError] = useState(null);

  const api = useRef(axios.create({ baseURL: baseUrl })).current;

  const logoutTimerRef = useRef(null);
  const refreshTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(async () => {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    setError(null);

    try {
      const storedRefresh = getStoredRefreshToken();
      if (storedRefresh) {
        await userLogout({ refresh: storedRefresh });
      }
    } catch (e) {
      // don't block logout
      console.warn("Logout error:", e);
    } finally {
      clearTimers();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      clearAllAuth();
      setLoadingAuth(false);
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
    }
  }, [clearTimers]);

  // Attach access token to axios requests (keeps in sync)
  useEffect(() => {
    const id = api.interceptors.request.use((cfg) => {
      if (accessToken) {
        cfg.headers = {
          ...(cfg.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        };
      } else {
        if (cfg.headers) delete cfg.headers.Authorization;
      }
      return cfg;
    });
    return () => api.interceptors.request.eject(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Response interceptor to catch 401 and force logout
  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          window.dispatchEvent(new Event("auth:logout"));
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleTimersForToken = useCallback(
    (jwt) => {
      clearTimers();
      if (!jwt) return;

      let decoded;
      try {
        decoded = jwtDecode(jwt);
      } catch (e) {
        window.dispatchEvent(new Event("auth:logout"));
        return;
      }

      const expiryMs = decoded.exp * 1000 - Date.now();
      if (expiryMs <= 0) {
        window.dispatchEvent(new Event("auth:logout"));
        return;
      }

      // logout exactly on expiry
      logoutTimerRef.current = setTimeout(() => {
        window.dispatchEvent(new Event("auth:logout"));
      }, expiryMs);

      // refresh 60s before expiry if refresh token exists
      const refreshBeforeMs = 60 * 1000;
      if (getStoredRefreshToken()) {
        const refreshIn = Math.max(expiryMs - refreshBeforeMs, 0);
        refreshTimerRef.current = setTimeout(() => {
          // silent background refresh
          refreshSession().catch(() => {});
        }, refreshIn);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clearTimers] // refreshSession is declared below but safe due to function hoisting usage pattern
  );

  // Re-schedule timers whenever accessToken changes
  useEffect(() => {
    scheduleTimersForToken(accessToken);
    return () => clearTimers();
  }, [accessToken, scheduleTimersForToken, clearTimers]);

  // ---- Refresh session ----
  const refreshSession = useCallback(async () => {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    setError(null);

    try {
      const storedRefresh = getStoredRefreshToken();
      if (!storedRefresh) {
        setLoadingAuth(false);
        setApiStatus(API_STATUS_CONSTANTS.INITIAL);
        return null;
      }

      const resp = await api.post("/users/refresh", { refresh: storedRefresh });
      const apiData = resp?.data?.data;

      if (!apiData?.access) {
        setLoadingAuth(false);
        setApiStatus(API_STATUS_CONSTANTS.FAILURE);
        return null;
      }

      setAccessToken(apiData.access);
      persistAccessToken(apiData.access);

      if (apiData.refresh) {
        setRefreshToken(apiData.refresh);
        persistRefreshToken(apiData.refresh);
      }

      setLoadingAuth(false);
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return apiData.access;
    } catch (err) {
      postErrorHandler(err);
      setError(err?.response?.data || err);

      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      clearAllAuth();

      setLoadingAuth(false);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }, [api]);

  // initial mount
  useEffect(() => {
    const token = getStoredAccessToken();
    if (token) {
      setLoadingAuth(false);
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return;
    }
    refreshSession().catch(() => {});
  }, [refreshSession]);

  // ---- Login ----
  const login = useCallback(async ({ email, password, role, remember, company_code }) => {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    setError(null);

    try {
      const payload = {
        email,
        password,
        company_code,
        role,
        remember,
        device_info: window.navigator.userAgent,
      };

      const resp = await userLogin(payload);
      const apiData = resp?.data?.data;
      const loggedInUser = apiData?.user;
      const tokens = apiData?.tokens;

      if (!tokens?.access) {
        setApiStatus(API_STATUS_CONSTANTS.FAILURE);
        return { success: false, message: "Invalid response from server (no access token)." };
      }

      setAccessToken(tokens.access);
      setRefreshToken(tokens.refresh || null);
      setUser(loggedInUser || null);

      persistUserData(loggedInUser || null);
      persistAccessToken(tokens.access);
      if (tokens.refresh) persistRefreshToken(tokens.refresh);

      toast.success("Logged in successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);

      return { success: true, user: loggedInUser, tokens };
    } catch (err) {
      postErrorHandler(err);
      setError(err?.response?.data || err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);

      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Login failed";

      return { success: false, message };
    }
  }, []);

  // ---- Forgot / Reset / Change password ----
  const userForgotPassword = useCallback(async (payload) => {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    setError(null);
    try {
      await forgotPassword(payload);
      toast.success("Reset link / OTP sent successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return true;
    } catch (err) {
      postErrorHandler(err);
      setError(err?.response?.data || err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }, []);

  const userResetPassword = useCallback(async (payload) => {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    setError(null);
    try {
      await resetPassword(payload);
      toast.success("Password reset successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return true;
    } catch (err) {
      postErrorHandler(err);
      setError(err?.response?.data || err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }, []);

  const userChangePassword = useCallback(async (payload) => {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    setError(null);
    try {
      await changePassword(payload);
      toast.success("Password changed successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return true;
    } catch (err) {
      postErrorHandler(err);
      setError(err?.response?.data || err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }, []);

  // Cross-tab sync + programmatic logout event
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token" || e.key === "accessToken") {
        const newToken = e.newValue;
        if (!newToken) {
          logout();
        } else {
          setAccessToken(newToken);
          try {
            setUser(jwtDecode(newToken));
          } catch {
            setUser(null);
          }
        }
      }
      if (e.key === "refreshToken" && !e.newValue) {
        setRefreshToken(null);
      }
    };

    const onAuthLogout = () => logout();

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:logout", onAuthLogout);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:logout", onAuthLogout);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        api,
        user,
        accessToken,
        refreshToken,
        loadingAuth,

        apiStatus,
        API_STATUS_CONSTANTS,
        error,

        login,
        logout,
        refreshSession,

        userForgotPassword,
        userResetPassword,
        userChangePassword,

        // exposed setters if you need them elsewhere
        setUser,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
