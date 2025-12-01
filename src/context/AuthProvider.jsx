import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// -----------------------------
// Fixed HRM Auth Components
// -----------------------------

const AuthContext = createContext(null);

export function AuthProvider({ children, baseUrl = '/' }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const api = axios.create({ baseURL: baseUrl });

  // attach access token to requests
  useEffect(() => {
    const id = api.interceptors.request.use((cfg) => {
      if (accessToken) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${accessToken}` };
      return cfg;
    });
    return () => api.interceptors.request.eject(id);
  }, [accessToken]);

  // refresh helper (calls /auth/refresh which should rely on httpOnly cookie)
  async function refreshToken() {
    try {
      const resp = await api.post('/auth/refresh');
      if (resp?.data?.accessToken) {
        setAccessToken(resp.data.accessToken);
        if (resp.data.user) setUser(resp.data.user);
        return resp.data.accessToken;
      }
    } catch (e) {
      // no valid session
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
    return null;
  }

  // get fresh token on mount (so reloads stay logged in if cookie present)
  useEffect(() => {
    refreshToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login({ email, password, selectedRole }) {
    try {
      const resp = await api.post('/auth/login', { email, password, role: selectedRole });
      // server asks client to choose role
      if (resp?.data?.chooseRole) {
        // normalize keys: could be [{role, scopeType, scopeId}] or ['admin','hr']
        const normalized = (resp.data.availableRoles || []).map((r) =>
          typeof r === 'string' ? { role: r } : { role: r.role || r.name || '', scopeType: r.scopeType, scopeId: r.scopeId }
        );
        return { chooseRole: true, availableRoles: normalized };
      }

      if (resp?.data?.accessToken) {
        setAccessToken(resp.data.accessToken);
        if (resp.data.user) setUser(resp.data.user);
        return { success: true };
      }
      return { success: false, message: resp?.data?.message || 'Unknown response' };
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Login failed';
      return { success: false, message };
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) { /* ignore */ }
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ api, user, accessToken, login, logout, refreshToken, loadingAuth, setUser, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}