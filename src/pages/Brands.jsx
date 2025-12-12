// src/pages/Companies.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CompaniesGrid from "@/components/CompanyComponents/CompanyTable";
import CompanyModal from "@/components/CompanyComponents/CompanyModal";
import FilterBar from "@/components/CompanyComponents/FilterBar";
import SearchBar from "@/components/CompanyComponents/SearchBar";
import { Pagination } from "@/components/ReusableComponents";
import { useCompanies } from "@/context/CompaniesContext";
import { Loader } from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

export default function CompaniesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const industryOptions = useMemo(
    () => ["All", "Agriculture", "SaaS", "Ecommerce", "Healthcare", "Fintech"],
    []
  );

  // ---------- URL search params ----------
  const urlSearchParams = new URLSearchParams(location.search);

  // modal controller: ?company=new or ?company=123
  const companyParam = urlSearchParams.get("company"); // "new", "123", or null
  const modalOpen = !!companyParam;
  const isNew = companyParam === "new";
  const editingId = !isNew && companyParam ? Number(companyParam) : null;

  // filter + pagination initial values from URL
  const initialQuery = urlSearchParams.get("q") || "";
  const initialIndustry = urlSearchParams.get("industry") || "All";
  const initialPerPage = Number(urlSearchParams.get("perPage")) || 12;
  const initialPage = Number(urlSearchParams.get("page")) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [industry, setIndustry] = useState(initialIndustry);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [page, setPage] = useState(initialPage);

  const [editing, setEditing] = useState(null);

  const {
    companies,
    companiesLoading,
    companiesTotal,
    addCompany,
    editCompany,
    removeCompany,
    getCompany,
    apiStatus,
    API_STATUS_CONSTANTS,
    fetchCompanies,
    lastQuery,
    error,
  } = useCompanies();

  // ---------- Helper: sync q/industry/page/perPage back to URL (keep ?company= if present) ----------
  const syncQueryInUrl = (next = {}) => {
    const sp = new URLSearchParams(location.search);

    const q = next.query ?? query;
    const ind = next.industry ?? industry;
    const p = next.page ?? page;
    const limit = next.perPage ?? perPage;

    if (q) sp.set("q", q);
    else sp.delete("q");

    if (ind && ind !== "All") sp.set("industry", ind);
    else sp.delete("industry");

    if (p && p !== 1) sp.set("page", String(p));
    else sp.delete("page");

    if (limit && limit !== 12) sp.set("perPage", String(limit));
    else sp.delete("perPage");

    // DO NOT TOUCH "company" here — so modal stays open if it was open
    navigate(`/companies?${sp.toString()}`, { replace: true });
  };

  // ---------- Load company data when ?company=123 (edit mode) ----------
  useEffect(() => {
    // Modal closed: clear editing state
    if (!modalOpen) {
      setEditing(null);
      return;
    }

    // New company: empty form
    if (isNew) {
      setEditing(null);
      return;
    }

    // Editing: load from context
    if (editingId) {
      (async () => {
        // getCompany handles try/catch + toasts and returns data or null
        const { data } = await getCompany(editingId);

        if (!data) {
          // If context already showed error, we just close the modal
          const sp = new URLSearchParams(location.search);
          sp.delete("company");
          navigate(`/companies?${sp.toString()}`, { replace: true });
          return;
        }

        setEditing(data);
      })();
    }
  }, [modalOpen, isNew, editingId]);

  // ---------- Handlers for filters ----------
  function handleSearchChange(v) {
    setQuery(v);
    setPage(1);
    syncQueryInUrl({ query: v, page: 1 });
  }

  function handleIndustryChange(v) {
    setIndustry(v);
    setPage(1);
    syncQueryInUrl({ industry: v, page: 1 });
  }

  function handlePerPageChange(n) {
    setPerPage(n);
    setPage(1);
    syncQueryInUrl({ perPage: n, page: 1 });
  }

  function handlePageChange(p) {
    setPage(p);
    syncQueryInUrl({ page: p });
  }

  // ---------- Modal open/close via ?company= ----------
  function openCreate() {
    const sp = new URLSearchParams(location.search);
    sp.set("company", "new");
    navigate(`/companies?${sp.toString()}`);
  }

  function handleEditClick(company) {
    if (!company?.id) return;
    const sp = new URLSearchParams(location.search);
    sp.set("company", String(company.id));
    navigate(`/companies?${sp.toString()}`);
  }

  function handleCloseModal() {
    const sp = new URLSearchParams(location.search);
    sp.delete("company");
    navigate(`/companies?${sp.toString()}`);
    setEditing(null);
  }

  function handleView(company) {
    // Later you can navigate to /companies/:id if you want details page
    alert(`Viewing ${company.name}`);
  }

  // ---------- Save (create or update) ----------
  async function handleSave(payload) {
    const isEditingExisting = !!editing && !!editing.id && !isNew;

    let ok;
    if (isEditingExisting) {
      ok = await editCompany(editing.id, payload);
    } else {
      ok = await addCompany(payload);
    }

    if (!ok) return;

    setPage(1);
    syncQueryInUrl({ page: 1 });
    handleCloseModal();
  }

  // ---------- RENDER ----------

  const renderContent = () => {
    if (companiesLoading && apiStatus === API_STATUS_CONSTANTS.LOADING) {
      return <Loader />;
    }

    switch (apiStatus) {
      case API_STATUS_CONSTANTS.LOADING:
        return <Loader />;

      case API_STATUS_CONSTANTS.FAILURE:
        return (
          <ErrorState
            error={error}
            title="Failed to load companies"
            description="Something went wrong while fetching company data."
            onRetry={() => fetchCompanies(lastQuery)}
            retryLabel="Retry"
          />
        );

      case API_STATUS_CONSTANTS.SUCCESS:
        if (!companies || companies.length === 0) {
          return <EmptyState />;
        }
        return (
          <CompaniesGrid
            companies={companies}
            onEdit={handleEditClick}
            onView={handleView}
            onDelete={removeCompany}
          />
        );

      case API_STATUS_CONSTANTS.INITIAL:
      default:
        return <Loader />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Companies</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage companies, view details, and edit company information.
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3 w-full sm:w-auto">
            <SearchBar value={query} onChange={handleSearchChange} />
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap"
            >
              Add company
            </button>
          </div>
        </header>

        <div className="bg-white border rounded-lg p-4">
          <div className="mb-4">
            <FilterBar
              industryOptions={industryOptions}
              selectedIndustry={industry}
              onSelectIndustry={handleIndustryChange}
              perPage={perPage}
              onPerPageChange={handlePerPageChange}
            />
          </div>

          <div className="py-2">{renderContent()}</div>

          <div className="mt-6">
            <Pagination
              page={page}
              total={companiesTotal}
              perPage={perPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <CompanyModal
        open={modalOpen}
        onClose={handleCloseModal}
        company={isNew ? null : editing}
        onSave={handleSave}
      />
    </div>
  );
}
