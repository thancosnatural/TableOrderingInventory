// src/context/BranchesContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getBranch as apiGetBranch,
  deleteBranch,
  updateBranch,
  createBranch,
  getBranches,
} from "@/services/branchService";
import { toast } from "react-hot-toast";
import { getErrorHandler, postErrorHandler } from "@/components/ErrorHandler";
import { useAuth } from "./AuthContext";
import { API_STATUS_CONSTANTS } from "@/constants/branding";

const BranchesContext = createContext(null);

export function BranchesProvider({ children }) {
  const [apiStatus, setApiStatus] = useState(API_STATUS_CONSTANTS.INITIAL);

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesTotal, setBranchesTotal] = useState(0);
  const [error, setError] = useState(null);

  const { accessToken } = useAuth();

  const [lastQuery, setLastQuery] = useState({
    query: "",
    company_id: null,
    branch_code: "",
    page: 1,
    perPage: 12,
  });

  const fetchBranches = useCallback(
    async ({ query, company_id, branch_code, page, perPage } = {}) => {
      if (!accessToken) {
        setBranchesLoading(false);
        setApiStatus(API_STATUS_CONSTANTS.INITIAL);
        return;
      }

      setBranchesLoading(true);
      setApiStatus(API_STATUS_CONSTANTS.LOADING);
      setError(null);

      const finalQuery = {
        query: query ?? lastQuery.query ?? "",
        company_id: company_id ?? lastQuery.company_id ?? null,
        branch_code: branch_code ?? lastQuery.branch_code ?? "",
        page: page ?? lastQuery.page ?? 1,
        perPage: perPage ?? lastQuery.perPage ?? 12,
      };

      try {
        const resp = await getBranches(finalQuery);
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
        } else if (data?.branches && Array.isArray(data.branches)) {
          items = data.branches;
          total = data.total ?? data.branches.length;
        } else {
          items = data || [];
          total = Array.isArray(items) ? items.length : 0;
        }

        setBranches(items);
        setBranchesTotal(typeof total === "number" ? total : items.length);

        setLastQuery((prev) => {
          const same =
            prev.query === finalQuery.query &&
            prev.company_id === finalQuery.company_id &&
            prev.branch_code === finalQuery.branch_code &&
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
        setBranchesLoading(false);
      }
    },
    [lastQuery, accessToken]
  );

  useEffect(() => {
    fetchBranches().catch(() => {});
  }, [fetchBranches]);

  async function addBranch(payload) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await createBranch(payload);
      await fetchBranches(lastQuery);
      toast.success("Branch created successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function editBranch(id, payload) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await updateBranch(id, payload);
      await fetchBranches(lastQuery);
      toast.success("Branch updated successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function removeBranch(id) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await deleteBranch(id);
      await fetchBranches(lastQuery);
      toast.success("Branch deleted successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function getBranch(id) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await apiGetBranch(id);
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data;
    } catch (err) {
      getErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  const value = {
    selectedBranch,
    setSelectedBranch,
    branches,
    branchesLoading,
    branchesTotal,
    error,
    apiStatus,
    API_STATUS_CONSTANTS,
    fetchBranches,
    addBranch,
    editBranch,
    removeBranch,
    getBranch,
    lastQuery,
    setLastQuery,
  };

  return (
    <BranchesContext.Provider value={value}>
      {children}
    </BranchesContext.Provider>
  );
}

export function useBranches() {
  const ctx = useContext(BranchesContext);
  if (!ctx) throw new Error("useBranches must be used inside BranchesProvider");
  return ctx;
}
