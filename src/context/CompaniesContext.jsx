// src/context/CompaniesContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getCompany as apiGetCompany,
  deleteCompany,
  updateCompany,
  createCompany,
  getCompanies,
} from "@/services/companyService";
import { toast } from "react-hot-toast";
import { getErrorHandler, postErrorHandler } from "@/components/ErrorHandler";
import { useAuth } from "./AuthContext";
import { API_STATUS_CONSTANTS } from "@/constants/branding";

const CompaniesContext = createContext(null);

export function CompaniesProvider({ children }) {
  // API status using constants
  const [apiStatus, setApiStatus] = useState(API_STATUS_CONSTANTS.INITIAL);

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesTotal, setCompaniesTotal] = useState(0);
  const [error, setError] = useState(null);

  const { accessToken } = useAuth();

  const [lastQuery, setLastQuery] = useState({
    query: "",
    industry: "All",
    page: 1,
    perPage: 12,
  });

  const fetchCompanies = useCallback(
  async ({ query, industry, page, perPage } = {}) => {
    if (!accessToken) {
      setCompaniesLoading(false);
      setApiStatus(API_STATUS_CONSTANTS.INITIAL);
      return;
    }

    setCompaniesLoading(true);
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    setError(null);

    const finalQuery = {
      query: query ?? lastQuery.query ?? "",
      industry: industry ?? lastQuery.industry ?? "All",
      page: page ?? lastQuery.page ?? 1,
      perPage: perPage ?? lastQuery.perPage ?? 12,
    };

    try {
      const resp = await getCompanies(finalQuery);
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
      } else if (data?.companies && Array.isArray(data.companies)) {
        items = data.companies;
        total = data.total ?? data.companies.length;
      } else {
        items = data || [];
        total = Array.isArray(items) ? items.length : 0;
      }

      setCompanies(items);
      setCompaniesTotal(typeof total === "number" ? total : items.length);

      // ✅ Only update lastQuery if something changed
      setLastQuery((prev) => {
        const same =
          prev.query === finalQuery.query &&
          prev.industry === finalQuery.industry &&
          prev.page === finalQuery.page &&
          prev.perPage === finalQuery.perPage;

        return same ? prev : finalQuery;
      });

      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return { items, total };
    } catch (err) {
      getErrorHandler(err);
      setError(err?.response?.data || err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE); // or ERROR, just be consistent
      return null;
    } finally {
      setCompaniesLoading(false);
    }
  },
  [lastQuery, accessToken]
);


  useEffect(() => {
    // initial load with lastQuery state
    fetchCompanies().catch(() => {});
  }, [fetchCompanies]);

  async function addCompany(payload) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await createCompany(payload);
      await fetchCompanies(lastQuery);
      toast.success("Company created successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null; // don't throw, let UI check return value
    }
  }

  async function editCompany(id, payload) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await updateCompany(id, payload);
      await fetchCompanies(lastQuery);
      toast.success("Company updated successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function removeCompany(id) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await deleteCompany(id);
      await fetchCompanies(lastQuery);
      toast.success("Company deleted successfully");
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      return resp?.data ?? true;
    } catch (err) {
      postErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null;
    }
  }

  async function getCompany(id) {
    setApiStatus(API_STATUS_CONSTANTS.LOADING);
    try {
      const resp = await apiGetCompany(id);
      setApiStatus(API_STATUS_CONSTANTS.SUCCESS);
      // you can normalize here if needed
      return resp?.data;
    } catch (err) {
      getErrorHandler(err);
      setApiStatus(API_STATUS_CONSTANTS.FAILURE);
      return null; // let caller handle null
    }
  }

  const value = {
    selectedCompany,
    setSelectedCompany,
    companies,
    companiesLoading,
    companiesTotal,
    error,
    apiStatus,
    API_STATUS_CONSTANTS,
    fetchCompanies,
    addCompany,
    editCompany,
    removeCompany,
    getCompany,
    lastQuery,
    setLastQuery,
  };

  return (
    <CompaniesContext.Provider value={value}>
      {children}
    </CompaniesContext.Provider>
  );
}

export function useCompanies() {
  const ctx = useContext(CompaniesContext);
  if (!ctx) throw new Error("useCompanies must be used inside CompaniesProvider");
  return ctx;
}
