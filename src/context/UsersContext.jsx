// src/context/UsersContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getUser as apiGetUser,
  deleteUser,
  updateUser,
  createUser,
  getUsers,
} from "@/services/userService";
import { toast } from "react-hot-toast";
import { getErrorHandler, postErrorHandler } from "@/components/ErrorHandler";
import { useAuth } from "./AuthContext";
import { API_STATUS_CONSTANTS } from "@/constants/branding";

const UsersContext = createContext(null);

export function UsersProvider({ children }) {
  const [apiStatus, setApiStatus] = useState(API_STATUS_CONSTANTS.INITIAL);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [usersLoading, setUsersLoading] = useState(false);
  const [usersTotal, setUsersTotal] = useState(0);

  const [error, setError] = useState(null);

  const { accessToken, user } = useAuth();

  const [lastQuery, setLastQuery] = useState({
    query: "",
    role: user?.role,
    company_id: user?.company?.id,
    page: 1,
    perPage: 12,
  });

  const fetchUsers = useCallback(
    async ({ query, role, company_id, page, perPage } = {}) => {
      if (!accessToken) {
        setUsersLoading(false);
        setApiStatus(API_STATUS_CONSTANTS.INITIAL);
        return;
      }

      setUsersLoading(true);
      setApiStatus(API_STATUS_CONSTANTS.LOADING);
      setError(null);

      const finalQuery = {
        query: query ?? lastQuery.query ?? "",
        role: role ?? lastQuery.role ?? "All",
        company_id: company_id ?? lastQuery.company_id ?? "",
        page: page ?? lastQuery.page ?? 1,
        perPage: perPage ?? lastQuery.perPage ?? 12,
      };

      if (user?.role !== "staff") {
        try {
          const resp = await getUsers(finalQuery);
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
          } else if (data?.users && Array.isArray(data.users)) {
            items = data.users;
            total = data.total ?? data.users.length;
          } else {
            items = data || [];
            total = Array.isArray(items) ? items.length : 0;
          }

          setUsers(items);
          setUsersTotal(typeof total === "number" ? total : items.length);

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
          setUsersLoading(false);
        }
      }
    },
    [lastQuery, accessToken]
  );

  useEffect(() => {
    fetchUsers().catch(() => { });
  }, [fetchUsers]);

  async function addUser(payload) {
    console.log(payload)
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await createUser(payload);
      await fetchUsers(lastQuery);
      toast.success("User created successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function editUser(id, payload) {
    console.log(payload)
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await updateUser(id, payload);
      await fetchUsers(lastQuery);
      toast.success("User updated successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function removeUser(id) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await deleteUser(id);
      await fetchUsers(lastQuery);
      toast.success("User deleted successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function getUser(id) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await apiGetUser(id);
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data;
    } catch (err) {
      getErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  const value = {
    selectedUser,
    setSelectedUser,
    users,
    usersLoading,
    usersTotal,
    error,
    apiStatus,
    API_STATUS_CONSTANTS,
    fetchUsers,
    addUser,
    editUser,
    removeUser,
    getUser,
    lastQuery,
    setLastQuery,
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used inside UsersProvider");
  return ctx;
}
