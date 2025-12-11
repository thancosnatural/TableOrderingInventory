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
import { getMe } from "@/services/userService";

const CompaniesContext = createContext(null);

export function CompaniesProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesTotal, setCompaniesTotal] = useState(0);
  const [error, setError] = useState(null);

  const { accessToken } = useAuth()

  const [lastQuery, setLastQuery] = useState({
    query: "",
    industry: "All",
    page: 1,
    perPage: 12,
  });

  const fetchCompanies = useCallback(
    async ({ query, industry, page, perPage } = {}) => {
      setCompaniesLoading(true);
      setError(null);

      // merge with lastQuery so we always have consistent values
      const finalQuery = {
        query: query ?? lastQuery.query ?? "",
        industry: industry ?? lastQuery.industry ?? "All",
        page: page ?? lastQuery.page ?? 1,
        perPage: perPage ?? lastQuery.perPage ?? 12,
      };

      if (accessToken) {
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
          setLastQuery(finalQuery);
          return { items, total };
        } catch (err) {
          getErrorHandler(err)
          throw err;
        } finally {
          setCompaniesLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    // initial load with lastQuery state
    fetchCompanies().catch(() => { });
  }, [fetchCompanies]);

  async function addCompany(payload) {
    try {
      const resp = await createCompany(payload);
      await fetchCompanies(lastQuery);
      toast.success("Company created successfully");
      return resp?.data;
    } catch (err) {
      postErrorHandler(err)
      throw err?.response?.data || err;
    }
  }

  async function editCompany(id, payload) {
    try {
      const resp = await updateCompany(id, payload);
      await fetchCompanies(lastQuery);
      toast.success("Company updated successfully");
      return resp?.data;
    } catch (err) {
      postErrorHandler(err)
      throw err?.response?.data || err;
    }
  }

  async function removeCompany(id) {
    try {
      const resp = await deleteCompany(id);
      await fetchCompanies(lastQuery);
      toast.success("Company deleted successfully");
      return resp?.data;
    } catch (err) {
      postErrorHandler(err)
      throw err?.response?.data || err;
    }
  }

  async function getCompany(id) {
    try {
      const resp = await apiGetCompany(id);
      return resp?.data;
    } catch (err) {
      getErrorHandler(err)
      throw err?.response?.data || err;
    }
  }

  const value = {
    selectedCompany,
    setSelectedCompany,
    companies,
    companiesLoading,
    companiesTotal,
    error,
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
