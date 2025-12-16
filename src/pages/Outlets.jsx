// // src/pages/Branches.jsx
// import React, { useState, useMemo, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import { Pagination } from "@/components/ReusableComponents";
// import { Loader } from "@/components/Loader";
// import EmptyState from "@/components/EmptyState";
// import ErrorState from "@/components/ErrorState";

// import BranchTable from "@/components/BranchComponents/BranchesTable";
// import BranchModal from "@/components/BranchComponents/BranchModal";
// import BranchFilterBar from "@/components/BranchComponents/BranchFilterBar";
// import SearchBar from "@/components/BranchComponents/SearchBar";

// import { useBranches } from "@/context/BranchesContext";
// import { useCompanies } from "@/context/CompaniesContext";
// import { useAuth } from "@/context/AuthContext";

// export default function BranchesPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { user } = useAuth();
//   const isSuperAdmin = String(user?.role || "").toLowerCase() === "super_admin";

//   const stateOptions = useMemo(
//     () => [
//       "All",
//       "Karnataka",
//       "Tamil Nadu",
//       "Kerala",
//       "Telangana",
//       "Andhra Pradesh",
//     ],
//     []
//   );

//   // ---------- URL search params ----------
//   const urlSearchParams = new URLSearchParams(location.search);

//   // modal controller: ?branch=new or ?branch=123
//   const branchParam = urlSearchParams.get("branch"); // "new", "123", or null
//   const modalOpen = !!branchParam;
//   const isNew = branchParam === "new";
//   const editingId = !isNew && branchParam ? Number(branchParam) : null;

//   // filter + pagination initial values from URL
//   const initialQuery = urlSearchParams.get("q") || "";
//   const initialState = urlSearchParams.get("state") || "All";
//   const initialPerPage = Number(urlSearchParams.get("perPage")) || 12;
//   const initialPage = Number(urlSearchParams.get("page")) || 1;

//   // super admin company selection (from URL)
//   const initialCompanyId = urlSearchParams.get("company_id")
//     ? Number(urlSearchParams.get("company_id"))
//     : "";

//   const [query, setQuery] = useState(initialQuery);
//   const [state, setState] = useState(initialState);
//   const [perPage, setPerPage] = useState(initialPerPage);
//   const [page, setPage] = useState(initialPage);

//   const [editing, setEditing] = useState(null);

//   const {
//     branches,
//     branchesLoading,
//     branchesTotal,
//     addBranch,
//     editBranch,
//     removeBranch,
//     getBranch,
//     apiStatus,
//     API_STATUS_CONSTANTS,
//     fetchBranches,
//     lastQuery,
//     error,
//   } = useBranches();

//   const {
//     companies,
//     companiesLoading: companiesListLoading,
//     selectedCompany,
//     setSelectedCompany,
//   } = useCompanies();

//   // ---------- Helper: sync q/state/page/perPage back to URL (keep ?branch= and super_admin company_id) ----------
//   const syncQueryInUrl = (next = {}) => {
//     const sp = new URLSearchParams(location.search);

//     const q = next.query ?? query;
//     const st = next.state ?? state;
//     const p = next.page ?? page;
//     const limit = next.perPage ?? perPage;

//     if (q) sp.set("q", q);
//     else sp.delete("q");

//     if (st && st !== "All") sp.set("state", st);
//     else sp.delete("state");

//     if (p && p !== 1) sp.set("page", String(p));
//     else sp.delete("page");

//     if (limit && limit !== 12) sp.set("perPage", String(limit));
//     else sp.delete("perPage");

//     // super_admin company selection in URL
//     const cid = next.company_id ?? selectedCompany?.id ?? "";
//     if (isSuperAdmin) {
//       if (cid) sp.set("company_id", String(cid));
//       else sp.delete("company_id");
//     } else {
//       sp.delete("company_id");
//     }

//     // DO NOT TOUCH "branch" here — so modal stays open if it was open
//     navigate(`/branches?${sp.toString()}`, { replace: true });
//   };

//   // ---------- Apply initialCompanyId -> selectedCompany once companies are loaded ----------
//   useEffect(() => {
//     if (!isSuperAdmin) return;
//     if (!companies || companies.length === 0) return;

//     // don't override if already selected
//     if (selectedCompany?.id) return;

//     if (initialCompanyId) {
//       const found = companies.find(
//         (c) => Number(c.id) === Number(initialCompanyId)
//       );
//       if (found) setSelectedCompany(found);
//     }
//   }, [
//     isSuperAdmin,
//     companies,
//     initialCompanyId,
//     selectedCompany,
//     setSelectedCompany,
//   ]);

//   function handleCompanyChange(companyIdStr) {
//     const cid = companyIdStr ? Number(companyIdStr) : "";
//     const found =
//       companies.find((c) => Number(c.id) === Number(cid)) || null;

//     setSelectedCompany(found);
//     setPage(1);
//     syncQueryInUrl({ company_id: cid, page: 1 });
//   }

//   // ---------- Fetch branches when filters change (super_admin requires selectedCompany) ----------
//   useEffect(() => {
//     if (isSuperAdmin && !selectedCompany?.id) return;

//     fetchBranches({
//       query,
//       state,
//       page,
//       perPage,
//       ...(isSuperAdmin ? { company_id: selectedCompany?.id } : {}),
//     }).catch(() => {});
//   }, [
//     query,
//     state,
//     page,
//     perPage,
//     isSuperAdmin,
//     selectedCompany?.id,
//     fetchBranches,
//   ]);

//   // ---------- Load branch data when ?branch=123 (edit mode) ----------
//   useEffect(() => {
//     if (!modalOpen) {
//       setEditing(null);
//       return;
//     }

//     if (isNew) {
//       setEditing(null);
//       return;
//     }

//     if (!editingId) return;

//     let cancelled = false;

//     (async () => {
//       const resp = await getBranch(editingId);
//       const data = resp?.data ?? resp;

//       if (cancelled) return;

//       if (!data) {
//         const sp = new URLSearchParams(location.search);
//         sp.delete("branch");
//         navigate(`/branches?${sp.toString()}`, { replace: true });
//         return;
//       }

//       setEditing(data);
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [modalOpen, isNew, editingId, getBranch, location.search, navigate]);

//   // ---------- Handlers for filters ----------
//   function handleSearchChange(v) {
//     setQuery(v);
//     setPage(1);
//     syncQueryInUrl({ query: v, page: 1 });
//   }

//   function handleStateChange(v) {
//     setState(v);
//     setPage(1);
//     syncQueryInUrl({ state: v, page: 1 });
//   }

//   function handlePerPageChange(n) {
//     setPerPage(n);
//     setPage(1);
//     syncQueryInUrl({ perPage: n, page: 1 });
//   }

//   function handlePageChange(p) {
//     setPage(p);
//     syncQueryInUrl({ page: p });
//   }

//   // ---------- Modal open/close via ?branch= ----------
//   function openCreate() {
//     const sp = new URLSearchParams(location.search);
//     sp.set("branch", "new");
//     navigate(`/branches?${sp.toString()}`);
//   }

//   function handleEditClick(branch) {
//     if (!branch?.id) return;
//     const sp = new URLSearchParams(location.search);
//     sp.set("branch", String(branch.id));
//     navigate(`/branches?${sp.toString()}`);
//   }

//   function handleCloseModal() {
//     const sp = new URLSearchParams(location.search);
//     sp.delete("branch");
//     navigate(`/branches?${sp.toString()}`);
//     setEditing(null);
//   }

//   function handleView(branch) {
//     alert(`Viewing ${branch.name}`);
//   }

//   // ---------- Save (create or update) ----------
//   async function handleSave(payload) {
//     const isEditingExisting = !!editing && !!editing.id && !isNew;

//     const finalPayload =
//       !isEditingExisting && isSuperAdmin && selectedCompany?.id
//         ? { ...payload, company_id: selectedCompany.id }
//         : payload;

//     let ok;
//     if (isEditingExisting) ok = await editBranch(editing.id, finalPayload);
//     else ok = await addBranch(finalPayload);

//     if (!ok) return;

//     setPage(1);
//     syncQueryInUrl({ page: 1 });
//     handleCloseModal();
//   }

//   // ---------- RENDER ----------
//   const renderContent = () => {
//     if (branchesLoading && apiStatus === API_STATUS_CONSTANTS.LOADING)
//       return <Loader />;

//     switch (apiStatus) {
//       case API_STATUS_CONSTANTS.LOADING:
//         return <Loader />;

//       case API_STATUS_CONSTANTS.FAILURE:
//         return (
//           <ErrorState
//             error={error}
//             title="Failed to load outlets"
//             description="Something went wrong while fetching outlet data."
//             onRetry={() =>
//               fetchBranches({
//                 ...lastQuery,
//                 ...(isSuperAdmin ? { company_id: selectedCompany?.id } : {}),
//               })
//             }
//             retryLabel="Retry"
//           />
//         );

//       case API_STATUS_CONSTANTS.SUCCESS:
//         if (!branches || branches.length === 0) return <EmptyState />;
//         return (
//           <BranchTable
//             branches={branches}
//             onEdit={handleEditClick}
//             onView={handleView}
//             onDelete={removeBranch}
//           />
//         );

//       case API_STATUS_CONSTANTS.INITIAL:
//       default:
//         return <Loader />;
//     }
//   };

//   const disableActionsForSuperAdmin = isSuperAdmin && !selectedCompany?.id;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-bold">Outlets</h1>
//             <p className="text-sm text-gray-600 mt-1">
//               Manage outlets, update outlet details, and control availability.
//             </p>
//           </div>

//           <div className="ml-auto flex items-center gap-3 w-full sm:w-auto">
//             <SearchBar value={query} onChange={handleSearchChange} />
//             <button
//               onClick={openCreate}
//               disabled={disableActionsForSuperAdmin}
//               title={
//                 disableActionsForSuperAdmin ? "Select a company first" : "Add outlet"
//               }
//               className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap disabled:opacity-60"
//             >
//               Add outlet
//             </button>
//           </div>
//         </header>

//         {/* Super admin company selector */}
//         {isSuperAdmin && (
//           <div className="bg-white border rounded-lg p-4 mb-4">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//               <div className="text-sm font-medium text-gray-900">Company</div>

//               <select
//                 value={selectedCompany?.id ?? ""}
//                 onChange={(e) => handleCompanyChange(e.target.value)}
//                 className="w-full sm:w-[360px] py-2 px-3 rounded-md border bg-white shadow-sm focus:outline-none"
//               >
//                 <option value="">Select company</option>
//                 {companies?.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name} {c.company_code ? `(${c.company_code})` : ""}
//                   </option>
//                 ))}
//               </select>

//               {companiesListLoading ? (
//                 <div className="text-xs text-gray-500">Loading companies...</div>
//               ) : null}
//             </div>

//             {!selectedCompany?.id ? (
//               <div className="mt-2 text-xs text-amber-600">
//                 Select a company to view/manage its outlets.
//               </div>
//             ) : null}
//           </div>
//         )}

//         <div className="bg-white border rounded-lg p-4">
//           <div className="mb-4">
//             <BranchFilterBar
//               stateOptions={stateOptions}
//               selectedState={state}
//               onSelectState={handleStateChange}
//               perPage={perPage}
//               onPerPageChange={handlePerPageChange}
//             />
//           </div>

//           <div className="py-2">
//             {disableActionsForSuperAdmin ? (
//               <div className="py-12 text-center text-sm text-gray-500">
//                 Select a company to view outlets.
//               </div>
//             ) : (
//               renderContent()
//             )}
//           </div>

//           <div className="mt-6">
//             <Pagination
//               page={page}
//               total={branchesTotal}
//               perPage={perPage}
//               onChange={handlePageChange}
//             />
//           </div>
//         </div>
//       </div>

//       <BranchModal
//         open={modalOpen}
//         onClose={handleCloseModal}
//         branch={isNew ? null : editing}
//         onSave={handleSave}
//       />
//     </div>
//   );
// }











// src/pages/Branches.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useBranches } from "@/context/BranchesContext";
import { useCompanies } from "@/context/CompaniesContext";
import { useAuth } from "@/context/AuthContext";

// layout + sections
import PageShell from "@/components/PageSections/PageShell";
import PageHeaderSection from "@/components/PageSections/PageHeader";
import PageSearchBar from "@/components/PageSections/PageSearchBar";
import PageFilterBarSection from "@/components/PageSections/PageFilterSection";
import PageContentSection from "@/components/PageSections/PageContentSection";
import { Pagination } from "@/components/ReusableComponents";

// modal
import BranchModal from "@/components/BranchComponents/BranchModal";

// ✅ reusable table
import ResponsiveDataTable from "@/components/TableComponents/ResponsiveDataTable";

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

  const urlSearchParams = new URLSearchParams(location.search);

  // modal controller: ?branch=new or ?branch=123
  const branchParam = urlSearchParams.get("branch");
  const modalOpen = !!branchParam;
  const isNew = branchParam === "new";
  const editingId = !isNew && branchParam ? Number(branchParam) : null;

  // filters
  const initialQuery = urlSearchParams.get("q") || "";
  const initialState = urlSearchParams.get("state") || "All";
  const initialPerPage = Number(urlSearchParams.get("perPage")) || 12;
  const initialPage = Number(urlSearchParams.get("page")) || 1;

  // super admin company selection
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
    fetchCompanies, // optional if you want to ensure list is loaded
  } = useCompanies();

  // ---------- sync URL ----------
  const syncQueryInUrl = useCallback(
    (next = {}) => {
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

      // super_admin company selection
      const cid = next.company_id ?? selectedCompany?.id ?? "";
      if (isSuperAdmin) {
        if (cid) sp.set("company_id", String(cid));
        else sp.delete("company_id");
      } else {
        sp.delete("company_id");
      }

      // DO NOT TOUCH "branch" here (modal state)
      navigate(`/branches?${sp.toString()}`, { replace: true });
    },
    [location.search, navigate, query, state, page, perPage, isSuperAdmin, selectedCompany?.id]
  );

  // ---------- super admin: apply initial company_id after companies load ----------
  useEffect(() => {
    if (!isSuperAdmin) return;

    // if your CompaniesContext doesn't auto-load, uncomment:
    // if (!companies?.length) fetchCompanies?.();

    if (!companies || companies.length === 0) return;
    if (selectedCompany?.id) return;

    if (initialCompanyId) {
      const found = companies.find((c) => Number(c.id) === Number(initialCompanyId));
      if (found) setSelectedCompany(found);
    }
  }, [isSuperAdmin, companies, initialCompanyId, selectedCompany?.id, setSelectedCompany]);

  const handleCompanyChange = useCallback(
    (companyIdStr) => {
      const cid = companyIdStr ? Number(companyIdStr) : "";
      const found = companies?.find((c) => Number(c.id) === Number(cid)) || null;

      setSelectedCompany(found);
      setPage(1);
      syncQueryInUrl({ company_id: cid, page: 1 });
    },
    [companies, setSelectedCompany, syncQueryInUrl]
  );

  // ---------- Fetch branches when filters change ----------
  useEffect(() => {
    if (isSuperAdmin && !selectedCompany?.id) return;

    fetchBranches({
      query,
      state,
      page,
      perPage,
      ...(isSuperAdmin ? { company_id: selectedCompany?.id } : {}),
    }).catch(() => {});
  }, [query, state, page, perPage, isSuperAdmin, selectedCompany?.id, fetchBranches]);

  // ---------- load edit branch ----------
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

  // ---------- handlers ----------
  const onSearchChange = useCallback(
    (v) => {
      setQuery(v);
      setPage(1);
      syncQueryInUrl({ query: v, page: 1 });
    },
    [syncQueryInUrl]
  );

  const onStateChange = useCallback(
    (v) => {
      setState(v);
      setPage(1);
      syncQueryInUrl({ state: v, page: 1 });
    },
    [syncQueryInUrl]
  );

  const onPerPageChange = useCallback(
    (n) => {
      setPerPage(n);
      setPage(1);
      syncQueryInUrl({ perPage: n, page: 1 });
    },
    [syncQueryInUrl]
  );

  const onPageChange = useCallback(
    (p) => {
      setPage(p);
      syncQueryInUrl({ page: p });
    },
    [syncQueryInUrl]
  );

  // ---------- modal open/close ----------
  const openCreate = useCallback(() => {
    const sp = new URLSearchParams(location.search);
    sp.set("branch", "new");
    navigate(`/branches?${sp.toString()}`);
  }, [location.search, navigate]);

  const openEdit = useCallback(
    (branch) => {
      if (!branch?.id) return;
      const sp = new URLSearchParams(location.search);
      sp.set("branch", String(branch.id));
      navigate(`/branches?${sp.toString()}`);
    },
    [location.search, navigate]
  );

  const closeModal = useCallback(() => {
    const sp = new URLSearchParams(location.search);
    sp.delete("branch");
    navigate(`/branches?${sp.toString()}`);
    setEditing(null);
  }, [location.search, navigate]);

  // ---------- save ----------
  const onSave = useCallback(
    async (payload) => {
      const isEditingExisting = !!editing?.id && !isNew;

      const finalPayload =
        !isEditingExisting && isSuperAdmin && selectedCompany?.id
          ? { ...payload, company_id: selectedCompany.id }
          : payload;

      const ok = isEditingExisting
        ? await editBranch(editing.id, finalPayload)
        : await addBranch(finalPayload);

      if (!ok) return;

      setPage(1);
      syncQueryInUrl({ page: 1 });
      closeModal();
    },
    [editing, isNew, isSuperAdmin, selectedCompany?.id, editBranch, addBranch, syncQueryInUrl, closeModal]
  );

  const onView = useCallback((branch) => {
    alert(`Viewing ${branch?.name}`);
  }, []);

  const disableActionsForSuperAdmin = isSuperAdmin && !selectedCompany?.id;

  // initials helper (for avatar)
  const getInitials = (name) =>
    !name
      ? "--"
      : name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase() ?? "")
          .join("");

  return (
    <PageShell>
      <PageHeaderSection
        title="Outlets"
        subtitle="Manage outlets, update outlet details, and control availability."
        rightSlot={
          <>
            <PageSearchBar
              value={query}
              onChange={onSearchChange}
              placeholder="Search outlets..."
              ariaLabel="Search outlets"
            />
            <button
              onClick={openCreate}
              disabled={disableActionsForSuperAdmin}
              title={disableActionsForSuperAdmin ? "Select a company first" : "Add outlet"}
              className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap disabled:opacity-60"
            >
              Add outlet
            </button>
          </>
        }
      />

      {/* ✅ Super admin company selector (extra filter section) */}
      {isSuperAdmin ? (
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
      ) : null}

      <div className="bg-white border rounded-lg p-4">
        {/* ✅ reuse your common filter component (we pass stateOptions) */}
        <PageFilterBarSection
          // If your PageFilterBarSection is currently "industry" specific,
          // make it accept generic props OR create a PageSelectFilterSection.
          industryOptions={stateOptions}
          selectedIndustry={state}
          onSelectIndustry={onStateChange}
          perPage={perPage}
          onPerPageChange={onPerPageChange}
        />

        <PageContentSection
          apiStatus={apiStatus}
          API_STATUS_CONSTANTS={API_STATUS_CONSTANTS}
          loading={branchesLoading}
          error={error}
          isEmpty={!branches || branches.length === 0}
          errorTitle="Failed to load outlets"
          errorDescription="Something went wrong while fetching outlet data."
          onRetry={() =>
            fetchBranches({
              ...lastQuery,
              ...(isSuperAdmin ? { company_id: selectedCompany?.id } : {}),
            })
          }
          renderSuccess={() => {
            if (disableActionsForSuperAdmin) {
              return (
                <div className="py-12 text-center text-sm text-gray-500">
                  Select a company to view outlets.
                </div>
              );
            }

            return (
              <ResponsiveDataTable
                items={branches || []}
                loading={branchesLoading}
                loadingText="Loading outlets..."
                emptyText="No outlets found."
                rowKey={(b) => b.id}
                getItemLabel={(b) => b?.name ?? "Outlet"}
                columns={[
                  {
                    key: "outlet",
                    header: "Outlet",
                    render: (b) => (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                          {getInitials(b?.name)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {b?.name ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {b?.city ?? b?.location ?? ""}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "state",
                    header: "State",
                    className: "text-sm text-gray-700",
                    render: (b) => b?.state ?? "—",
                  },
                  {
                    key: "address",
                    header: "Address",
                    className: "text-sm text-gray-700",
                    render: (b) => b?.address ?? b?.full_address ?? "—",
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (b) => (
                      <div className="text-center">
                        <div
                          className={`mt-1 text-xs ${
                            b?.is_active ? "text-green-500" : "text-gray-500"
                          }`}
                        >
                          {b?.is_active ? "Active" : "Disabled"}
                        </div>
                      </div>
                    ),
                  },
                ]}
                actions={(branch) => [
                  { key: "view", label: "View", onClick: () => onView(branch) },
                  { key: "edit", label: "Edit", onClick: () => openEdit(branch) },
                  {
                    key: "delete",
                    label: "Delete",
                    variant: "danger",
                    requireConfirm: true,
                    confirmTitle: (b) => `Delete outlet "${b?.name ?? ""}"?`,
                    confirmDescription:
                      "This action will permanently remove the outlet. This cannot be undone.",
                    confirmLabel: "Delete",
                    onClick: async (b) => await removeBranch(b.id),
                  },
                ]}
                renderMobileCard={(branch, openActions) => (
                  <article className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                          {getInitials(branch?.name)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {branch?.name ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {branch?.city ?? branch?.location ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {branch?.state ?? "—"}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={openActions}
                        className="p-2 rounded-md hover:bg-gray-100 inline-flex items-center justify-center"
                        aria-haspopup="true"
                        title="Actions"
                      >
                        <span className="sr-only">Open actions</span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </article>
                )}
              />
            );
          }}
        />

        <Pagination
          show={branchesTotal > perPage}
          page={page}
          total={branchesTotal}
          perPage={perPage}
          onPageChange={onPageChange} // if your Pagination uses onChange, replace with onChange
        />
      </div>

      <BranchModal
        open={modalOpen}
        onClose={closeModal}
        branch={isNew ? null : editing}
        onSave={onSave}
      />
    </PageShell>
  );
}
