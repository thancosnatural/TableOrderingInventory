// src/pages/Branches.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Pagination } from "@/components/ReusableComponents";
import { Loader } from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

import BranchTable from "@/components/BranchComponents/BranchesTable";
import BranchModal from "@/components/BranchComponents/BranchModal";
import BranchFilterBar from "@/components/BranchComponents/BranchFilterBar";
import SearchBar from "@/components/BranchComponents/SearchBar";

import { useBranches } from "@/context/BranchesContext";
import { useCompanies } from "@/context/CompaniesContext";
import { useAuth } from "@/context/AuthContext";

export default function BranchesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const isSuperAdmin = String(user?.role || "").toLowerCase() === "super_admin";

  const stateOptions = useMemo(
    () => [
      "All",
      "Karnataka",
      "Tamil Nadu",
      "Kerala",
      "Telangana",
      "Andhra Pradesh",
    ],
    []
  );

  // ---------- URL search params ----------
  const urlSearchParams = new URLSearchParams(location.search);

  // modal controller: ?branch=new or ?branch=123
  const branchParam = urlSearchParams.get("branch"); // "new", "123", or null
  const modalOpen = !!branchParam;
  const isNew = branchParam === "new";
  const editingId = !isNew && branchParam ? Number(branchParam) : null;

  // filter + pagination initial values from URL
  const initialQuery = urlSearchParams.get("q") || "";
  const initialState = urlSearchParams.get("state") || "All";
  const initialPerPage = Number(urlSearchParams.get("perPage")) || 12;
  const initialPage = Number(urlSearchParams.get("page")) || 1;

  // super admin company selection (from URL)
  const initialCompanyId = urlSearchParams.get("company_id")
    ? Number(urlSearchParams.get("company_id"))
    : "";

  const [query, setQuery] = useState(initialQuery);
  const [state, setState] = useState(initialState);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [page, setPage] = useState(initialPage);

  const [editing, setEditing] = useState(null);

  const {
    branches,
    branchesLoading,
    branchesTotal,
    addBranch,
    editBranch,
    removeBranch,
    getBranch,
    apiStatus,
    API_STATUS_CONSTANTS,
    fetchBranches,
    lastQuery,
    error,
  } = useBranches();

  const {
    companies,
    companiesLoading: companiesListLoading,
    selectedCompany,
    setSelectedCompany,
  } = useCompanies();

  // ---------- Helper: sync q/state/page/perPage back to URL (keep ?branch= and super_admin company_id) ----------
  const syncQueryInUrl = (next = {}) => {
    const sp = new URLSearchParams(location.search);

    const q = next.query ?? query;
    const st = next.state ?? state;
    const p = next.page ?? page;
    const limit = next.perPage ?? perPage;

    if (q) sp.set("q", q);
    else sp.delete("q");

    if (st && st !== "All") sp.set("state", st);
    else sp.delete("state");

    if (p && p !== 1) sp.set("page", String(p));
    else sp.delete("page");

    if (limit && limit !== 12) sp.set("perPage", String(limit));
    else sp.delete("perPage");

    // super_admin company selection in URL
    const cid = next.company_id ?? selectedCompany?.id ?? "";
    if (isSuperAdmin) {
      if (cid) sp.set("company_id", String(cid));
      else sp.delete("company_id");
    } else {
      sp.delete("company_id");
    }

    // DO NOT TOUCH "branch" here — so modal stays open if it was open
    navigate(`/branches?${sp.toString()}`, { replace: true });
  };

  // ---------- Apply initialCompanyId -> selectedCompany once companies are loaded ----------
  useEffect(() => {
    if (!isSuperAdmin) return;
    if (!companies || companies.length === 0) return;

    // don't override if already selected
    if (selectedCompany?.id) return;

    if (initialCompanyId) {
      const found = companies.find(
        (c) => Number(c.id) === Number(initialCompanyId)
      );
      if (found) setSelectedCompany(found);
    }
  }, [
    isSuperAdmin,
    companies,
    initialCompanyId,
    selectedCompany,
    setSelectedCompany,
  ]);

  function handleCompanyChange(companyIdStr) {
    const cid = companyIdStr ? Number(companyIdStr) : "";
    const found =
      companies.find((c) => Number(c.id) === Number(cid)) || null;

    setSelectedCompany(found);
    setPage(1);
    syncQueryInUrl({ company_id: cid, page: 1 });
  }

  // ---------- Fetch branches when filters change (super_admin requires selectedCompany) ----------
  useEffect(() => {
    if (isSuperAdmin && !selectedCompany?.id) return;

    fetchBranches({
      query,
      state,
      page,
      perPage,
      ...(isSuperAdmin ? { company_id: selectedCompany?.id } : {}),
    }).catch(() => {});
  }, [
    query,
    state,
    page,
    perPage,
    isSuperAdmin,
    selectedCompany?.id,
    fetchBranches,
  ]);

  // ---------- Load branch data when ?branch=123 (edit mode) ----------
  useEffect(() => {
    if (!modalOpen) {
      setEditing(null);
      return;
    }

    if (isNew) {
      setEditing(null);
      return;
    }

    if (!editingId) return;

    let cancelled = false;

    (async () => {
      const resp = await getBranch(editingId);
      const data = resp?.data ?? resp;

      if (cancelled) return;

      if (!data) {
        const sp = new URLSearchParams(location.search);
        sp.delete("branch");
        navigate(`/branches?${sp.toString()}`, { replace: true });
        return;
      }

      setEditing(data);
    })();

    return () => {
      cancelled = true;
    };
  }, [modalOpen, isNew, editingId, getBranch, location.search, navigate]);

  // ---------- Handlers for filters ----------
  function handleSearchChange(v) {
    setQuery(v);
    setPage(1);
    syncQueryInUrl({ query: v, page: 1 });
  }

  function handleStateChange(v) {
    setState(v);
    setPage(1);
    syncQueryInUrl({ state: v, page: 1 });
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

  // ---------- Modal open/close via ?branch= ----------
  function openCreate() {
    const sp = new URLSearchParams(location.search);
    sp.set("branch", "new");
    navigate(`/branches?${sp.toString()}`);
  }

  function handleEditClick(branch) {
    if (!branch?.id) return;
    const sp = new URLSearchParams(location.search);
    sp.set("branch", String(branch.id));
    navigate(`/branches?${sp.toString()}`);
  }

  function handleCloseModal() {
    const sp = new URLSearchParams(location.search);
    sp.delete("branch");
    navigate(`/branches?${sp.toString()}`);
    setEditing(null);
  }

  function handleView(branch) {
    alert(`Viewing ${branch.name}`);
  }

  // ---------- Save (create or update) ----------
  async function handleSave(payload) {
    const isEditingExisting = !!editing && !!editing.id && !isNew;

    const finalPayload =
      !isEditingExisting && isSuperAdmin && selectedCompany?.id
        ? { ...payload, company_id: selectedCompany.id }
        : payload;

    let ok;
    if (isEditingExisting) ok = await editBranch(editing.id, finalPayload);
    else ok = await addBranch(finalPayload);

    if (!ok) return;

    setPage(1);
    syncQueryInUrl({ page: 1 });
    handleCloseModal();
  }

  // ---------- RENDER ----------
  const renderContent = () => {
    if (branchesLoading && apiStatus === API_STATUS_CONSTANTS.LOADING)
      return <Loader />;

    switch (apiStatus) {
      case API_STATUS_CONSTANTS.LOADING:
        return <Loader />;

      case API_STATUS_CONSTANTS.FAILURE:
        return (
          <ErrorState
            error={error}
            title="Failed to load outlets"
            description="Something went wrong while fetching outlet data."
            onRetry={() =>
              fetchBranches({
                ...lastQuery,
                ...(isSuperAdmin ? { company_id: selectedCompany?.id } : {}),
              })
            }
            retryLabel="Retry"
          />
        );

      case API_STATUS_CONSTANTS.SUCCESS:
        if (!branches || branches.length === 0) return <EmptyState />;
        return (
          <BranchTable
            branches={branches}
            onEdit={handleEditClick}
            onView={handleView}
            onDelete={removeBranch}
          />
        );

      case API_STATUS_CONSTANTS.INITIAL:
      default:
        return <Loader />;
    }
  };

  const disableActionsForSuperAdmin = isSuperAdmin && !selectedCompany?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Outlets</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage outlets, update outlet details, and control availability.
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3 w-full sm:w-auto">
            <SearchBar value={query} onChange={handleSearchChange} />
            <button
              onClick={openCreate}
              disabled={disableActionsForSuperAdmin}
              title={
                disableActionsForSuperAdmin ? "Select a company first" : "Add outlet"
              }
              className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap disabled:opacity-60"
            >
              Add outlet
            </button>
          </div>
        </header>

        {/* Super admin company selector */}
        {isSuperAdmin && (
          <div className="bg-white border rounded-lg p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="text-sm font-medium text-gray-900">Company</div>

              <select
                value={selectedCompany?.id ?? ""}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className="w-full sm:w-[360px] py-2 px-3 rounded-md border bg-white shadow-sm focus:outline-none"
              >
                <option value="">Select company</option>
                {companies?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company_code ? `(${c.company_code})` : ""}
                  </option>
                ))}
              </select>

              {companiesListLoading ? (
                <div className="text-xs text-gray-500">Loading companies...</div>
              ) : null}
            </div>

            {!selectedCompany?.id ? (
              <div className="mt-2 text-xs text-amber-600">
                Select a company to view/manage its outlets.
              </div>
            ) : null}
          </div>
        )}

        <div className="bg-white border rounded-lg p-4">
          <div className="mb-4">
            <BranchFilterBar
              stateOptions={stateOptions}
              selectedState={state}
              onSelectState={handleStateChange}
              perPage={perPage}
              onPerPageChange={handlePerPageChange}
            />
          </div>

          <div className="py-2">
            {disableActionsForSuperAdmin ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Select a company to view outlets.
              </div>
            ) : (
              renderContent()
            )}
          </div>

          <div className="mt-6">
            <Pagination
              page={page}
              total={branchesTotal}
              perPage={perPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <BranchModal
        open={modalOpen}
        onClose={handleCloseModal}
        branch={isNew ? null : editing}
        onSave={handleSave}
      />
    </div>
  );
}
