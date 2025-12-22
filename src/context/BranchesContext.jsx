// src/context/BranchesContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
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
import { useCompanies } from "./CompaniesContext";

const BranchesContext = createContext(null);

export function BranchesProvider({ children }) {
  const [apiStatus, setApiStatus] = useState(API_STATUS_CONSTANTS.INITIAL);

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesTotal, setBranchesTotal] = useState(0);
  const [error, setError] = useState(null);

  const { accessToken } = useAuth();
  const { selectedCompany } = useCompanies();

  const selectedCompanyId = useMemo(() => {
    const id =
      selectedCompany?.id ??
      selectedCompany?.company_id ??
      selectedCompany?.value ??
      null;
    return id == null || String(id).trim() === "" ? null : Number(id);
  }, [selectedCompany]);

  const [lastQuery, setLastQuery] = useState({
    query: "",
    company_id: null,
    branch_code: "",
    page: 1,
    perPage: 12,
  });

  const lastQueryRef = useRef(lastQuery);
  useEffect(() => {
    lastQueryRef.current = lastQuery;
  }, [lastQuery]);

  // prevent stale responses overriding newer ones
  const requestSeq = useRef(0);

  const fetchBranches = useCallback(
    async (params = {}) => {
      if (!accessToken) {
        setBranches([]);
        setBranchesTotal(0);
        setBranchesLoading(false);
        setApiStatus(API_STATUS_CONSTANTS.INITIAL);
        return null;
      }

      const prev = lastQueryRef.current;

      // ✅ ALWAYS force company_id from selectedCompanyId
      // (ignore params.company_id unless you explicitly want to override)
      const finalQuery = {
        query: params.query ?? prev.query ?? "",
        company_id: selectedCompanyId, // ✅ filtered by selected company
        branch_code: params.branch_code ?? prev.branch_code ?? "",
        page: params.page ?? prev.page ?? 1,
        perPage: params.perPage ?? prev.perPage ?? 12,
      };

      // if no company selected, don't call API (and clear list)
      if (!finalQuery.company_id) {
        setBranches([]);
        setBranchesTotal(0);
        setLastQuery((p) => ({ ...p, company_id: null }));
        setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
        return { items: [], total: 0 };
      }

      setBranchesLoading(true);
      setApiStatus(API_STATUS_CONSTANTS.LOADING);
      setError(null);

      const seq = ++requestSeq.current;

      try {
        const resp = await getBranches(finalQuery);
        if (seq !== requestSeq.current) return null;

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
        } else if (Array.isArray(data?.branches)) {
          items = data.branches;
          total = data.total ?? data.branches.length;
        } else if (Array.isArray(data?.rows)) {
          items = data.rows;
          total = data.count ?? data.total ?? data.rows.length;
        } else {
          items = [];
          total = 0;
        }

        setBranches(items);
        setBranchesTotal(typeof total === "number" ? total : items.length);

        // ✅ keep lastQuery in sync, but company_id always equals selectedCompanyId
        setLastQuery((prevState) => {
          const next = { ...finalQuery };
          const same =
            prevState.query === next.query &&
            prevState.company_id === next.company_id &&
            prevState.branch_code === next.branch_code &&
            prevState.page === next.page &&
            prevState.perPage === next.perPage;
          return same ? prevState : next;
        });

        setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
        return { items, total };
      } catch (err) {
        if (seq !== requestSeq.current) return null;
        getErrorHandler(err);
        setError(err?.response?.data || err);
        setApiStatus(API_STATUS_CONSTANTS.FAILURE);
        return null;
      } finally {
        if (seq === requestSeq.current) setBranchesLoading(false);
      }
    },
    [accessToken, selectedCompanyId]
  );

  // ✅ Auto-fetch whenever selectedCompanyId changes
  useEffect(() => {
    if (!accessToken) return;

    // reset selected branch on company switch
    setSelectedBranch(null);

    // fetch page 1 for the new company
    fetchBranches({ page: 1 }).catch(() => {});
  }, [accessToken, selectedCompanyId, fetchBranches]);

  async function addBranch(payload) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await createBranch(payload);
      await fetchBranches({ page: 1 }); // refresh current company list
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
      await fetchBranches(lastQueryRef.current); // keep current filters/page
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
      await fetchBranches(lastQueryRef.current); // keep current filters/page
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
    selectedCompanyId, // optional: useful in UI
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
