// src/context/RolesContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getRole as apiGetRole,
  deleteRole,
  updateRole,
  createRole,
  getRoles,
} from "@/services/roleService";
import { toast } from "react-hot-toast";
import { getErrorHandler, postErrorHandler } from "@/components/ErrorHandler";
import { useAuth } from "./AuthContext";
import { API_STATUS_CONSTANTS } from "@/constants/branding";

const RolesContext = createContext(null);

export function RolesProvider({ children }) {
  const [apiStatus, setApiStatus] = useState(API_STATUS_CONSTANTS.INITIAL);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesTotal, setRolesTotal] = useState(0);

  const [error, setError] = useState(null);

  const { accessToken, user } = useAuth();

  console.log("Current User in RolesContext:", user);

    const [lastQuery, setLastQuery] = useState({
    query: "",
    role: user?.role,
    company_id: "", 
    page: 1,
    perPage: 12,
  });

  const fetchRoles = useCallback(
    async ({ query, role, company_id, page, perPage } = {}) => {
      if (!accessToken) {
        setRolesLoading(false);
        setApiStatus(API_STATUS_CONSTANTS.INITIAL);
        return;
      }

      setRolesLoading(true);
      setApiStatus(API_STATUS_CONSTANTS.LOADING);
      setError(null);

      const finalQuery = {
        query: query ?? lastQuery.query ?? "",
        role: role ?? lastQuery.role ?? "All",
        company_id: company_id ?? lastQuery.company_id ?? "",
        page: page ?? lastQuery.page ?? 1,
        perPage: perPage ?? lastQuery.perPage ?? 12,
      };

      try {
        const resp = await getRoles(finalQuery);
        const data = resp?.data;

        let items = [];
        let total = 0;

        if (Array.isArray(data)) {
          items = data;
          total = data.length;
        } else if (Array.isArray(data?.items)) {
          items = data.items;
          total = data.total ?? data.items.length;
        } else if (Array.isArray(data?.data)) {
          items = data.data;
          total = data.total ?? data.data.length;
        } else if (data?.roles && Array.isArray(data.roles)) {
          items = data.roles;
          total = data.total ?? data.roles.length;
        } else {
          items = data || [];
          total = Array.isArray(items) ? items.length : 0;
        }

        setRoles(items);
        setRolesTotal(typeof total === "number" ? total : items.length);

        setLastQuery((prev) => {
          const same =
            prev.query === finalQuery.query &&
            prev.role === finalQuery.role &&
            String(prev.company_id ?? "") === String(finalQuery.company_id ?? "") &&
            prev.page === finalQuery.page &&
            prev.perPage === finalQuery.perPage;

          return same ? prev : finalQuery;
        });

        setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
        return { items, total };
      } catch (err) {
        getErrorHandler(err);
        setError(err?.response?.data || err);
        setApiStatus(API_STATUS_CONSTANTS.FAILURE);
        return null;
      } finally {
        setRolesLoading(false);
      }
    },
    [lastQuery, accessToken]
  );

  useEffect(() => {
    fetchRoles().catch(() => {});
  }, [fetchRoles]);

  async function addRole(payload) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await createRole(payload);
      await fetchRoles(lastQuery);
      toast.success("Role created successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function editRole(id, payload) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await updateRole(id, payload);
      await fetchRoles(lastQuery);
      toast.success("Role updated successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function removeRole(id) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await deleteRole(id);
      await fetchRoles(lastQuery);
      toast.success("Role deleted successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function getRole(id) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await apiGetRole(id);
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data;
    } catch (err) {
      getErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  const value = {
    selectedRole,
    setSelectedRole,
    roles,
    rolesLoading,
    rolesTotal,
    error,
    apiStatus,
    API_STATUS_CONSTANTS,
    fetchRoles,
    addRole,
    editRole,
    removeRole,
    getRole,
    lastQuery,
    setLastQuery,
  };

  return <RolesContext.Provider value={value}>{children}</RolesContext.Provider>;
}

export function useRoles() {
  const ctx = useContext(RolesContext);
  if (!ctx) throw new Error("useRoles must be used inside RolesProvider");
  return ctx;
}
