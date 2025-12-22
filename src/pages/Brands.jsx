// // src/pages/Companies.jsx
// import React, { useState, useMemo, useEffect, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import { useCompanies } from "@/context/CompaniesContext";

// // layout + sections you already have
// import PageShell from "@/components/PageSections/PageShell";
// import PageHeaderSection from "@/components/PageSections/PageHeader";
// import PageSearchBar from "@/components/PageSections/PageSearchBar";
// import PageFilterBarSection from "@/components/PageSections/PageFilterSection";
// import PageContentSection from "@/components/PageSections/PageContentSection";
// import { Pagination } from "@/components/ReusableComponents";

// // modal
// import CompanyModal from "@/components/CompanyComponents/CompanyModal";

// // ✅ reusable table
// import ResponsiveDataTable from "@/components/TableComponents/ResponsiveDataTable";

// export default function CompaniesPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const industryOptions = useMemo(
//     () => ["All", "Agriculture", "SaaS", "Ecommerce", "Healthcare", "Fintech"],
//     []
//   );

//   const urlSearchParams = new URLSearchParams(location.search);

//   const companyParam = urlSearchParams.get("company");
//   const modalOpen = !!companyParam;
//   const isNew = companyParam === "new";
//   const editingId = !isNew && companyParam ? Number(companyParam) : null;

//   const initialQuery = urlSearchParams.get("q") || "";
//   const initialIndustry = urlSearchParams.get("industry") || "All";
//   const initialPerPage = Number(urlSearchParams.get("perPage")) || 12;
//   const initialPage = Number(urlSearchParams.get("page")) || 1;

//   const [query, setQuery] = useState(initialQuery);
//   const [industry, setIndustry] = useState(initialIndustry);
//   const [perPage, setPerPage] = useState(initialPerPage);
//   const [page, setPage] = useState(initialPage);
//   const [editing, setEditing] = useState(null);

//   const {
//     companies,
//     companiesLoading,
//     companiesTotal,
//     addCompany,
//     editCompany,
//     removeCompany,
//     getCompany,
//     apiStatus,
//     API_STATUS_CONSTANTS,
//     fetchCompanies,
//     lastQuery,
//     error,
//   } = useCompanies();

//   const syncQueryInUrl = useCallback(
//     (next = {}) => {
//       const sp = new URLSearchParams(location.search);

//       const q = next.query ?? query;
//       const ind = next.industry ?? industry;
//       const p = next.page ?? page;
//       const limit = next.perPage ?? perPage;

//       if (q) sp.set("q", q);
//       else sp.delete("q");

//       if (ind && ind !== "All") sp.set("industry", ind);
//       else sp.delete("industry");

//       if (p && p !== 1) sp.set("page", String(p));
//       else sp.delete("page");

//       if (limit && limit !== 12) sp.set("perPage", String(limit));
//       else sp.delete("perPage");

//       navigate(`/companies?${sp.toString()}`, { replace: true });
//     },
//     [location.search, navigate, query, industry, page, perPage]
//   );

//   const openCreate = useCallback(() => {
//     const sp = new URLSearchParams(location.search);
//     sp.set("company", "new");
//     navigate(`/companies?${sp.toString()}`);
//   }, [location.search, navigate]);

//   const openEdit = useCallback(
//     (company) => {
//       if (!company?.id) return;
//       const sp = new URLSearchParams(location.search);
//       sp.set("company", String(company.id));
//       navigate(`/companies?${sp.toString()}`);
//     },
//     [location.search, navigate]
//   );

//   const closeModal = useCallback(() => {
//     const sp = new URLSearchParams(location.search);
//     sp.delete("company");
//     navigate(`/companies?${sp.toString()}`);
//     setEditing(null);
//   }, [location.search, navigate]);

//   useEffect(() => {
//     if (!modalOpen) {
//       setEditing(null);
//       return;
//     }
//     if (isNew) {
//       setEditing(null);
//       return;
//     }
//     if (editingId) {
//       (async () => {
//         const resp = await getCompany(editingId);
//         const data = resp?.data ?? resp;
//         if (!data) {
//           closeModal();
//           return;
//         }
//         setEditing(data);
//       })();
//     }
//   }, [modalOpen, isNew, editingId, getCompany, closeModal]);

//   const onSearchChange = useCallback(
//     (v) => {
//       setQuery(v);
//       setPage(1);
//       syncQueryInUrl({ query: v, page: 1 });
//     },
//     [syncQueryInUrl]
//   );

//   const onIndustryChange = useCallback(
//     (v) => {
//       setIndustry(v);
//       setPage(1);
//       syncQueryInUrl({ industry: v, page: 1 });
//     },
//     [syncQueryInUrl]
//   );

//   const onPerPageChange = useCallback(
//     (n) => {
//       setPerPage(n);
//       setPage(1);
//       syncQueryInUrl({ perPage: n, page: 1 });
//     },
//     [syncQueryInUrl]
//   );

//   const onPageChange = useCallback(
//     (p) => {
//       setPage(p);
//       syncQueryInUrl({ page: p });
//     },
//     [syncQueryInUrl]
//   );

//   const onSave = useCallback(
//     async (payload) => {
//       const ok =
//         editing?.id && !isNew
//           ? await editCompany(editing.id, payload)
//           : await addCompany(payload);

//       if (!ok) return;

//       setPage(1);
//       syncQueryInUrl({ page: 1 });
//       closeModal();
//     },
//     [editing, isNew, editCompany, addCompany, syncQueryInUrl, closeModal]
//   );

//   const onView = useCallback((company) => {
//     alert(`Viewing ${company?.name}`);
//   }, []);

//   // ✅ helpers for table rendering
//   const getInitials = (name) =>
//     !name
//       ? "--"
//       : name
//           .split(" ")
//           .filter(Boolean)
//           .slice(0, 2)
//           .map((w) => w[0]?.toUpperCase() ?? "")
//           .join("");

//   return (
//     <PageShell>
//       <PageHeaderSection
//         title="Companies"
//         subtitle="Manage companies, view details, and edit company information."
//         rightSlot={
//           <>
//             <PageSearchBar
//               value={query}
//               onChange={onSearchChange}
//               placeholder="Search companies or location..."
//               ariaLabel="Search companies"
//             />
//             <button
//               onClick={openCreate}
//               className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap"
//             >
//               Add company
//             </button>
//           </>
//         }
//       />

//       <div className="bg-white border rounded-lg p-4">
//         <PageFilterBarSection
//           industryOptions={industryOptions}
//           selectedIndustry={industry}
//           onSelectIndustry={onIndustryChange}
//           perPage={perPage}
//           onPerPageChange={onPerPageChange}
//         />

//         <PageContentSection
//           apiStatus={apiStatus}
//           API_STATUS_CONSTANTS={API_STATUS_CONSTANTS}
//           loading={companiesLoading}
//           error={error}
//           isEmpty={!companies || companies.length === 0}
//           errorTitle="Failed to load companies"
//           errorDescription="Something went wrong while fetching company data."
//           onRetry={() => fetchCompanies(lastQuery)}
//           renderSuccess={() => (
//             <ResponsiveDataTable
//               items={companies || []}
//               loading={companiesLoading}
//               loadingText="Loading companies..."
//               emptyText="No companies found."
//               rowKey={(c) => c.id}
//               getItemLabel={(c) => c?.name ?? "Company"}
//               columns={[
//                 {
//                   key: "company",
//                   header: "Company",
//                   render: (c) => (
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
//                         {getInitials(c?.name)}
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-900">
//                           {c?.name ?? "—"}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {c?.industry ?? ""}
//                         </div>
//                       </div>
//                     </div>
//                   ),
//                 },
//                 {
//                   key: "industry",
//                   header: "Industry",
//                   className: "text-sm text-gray-700",
//                   render: (c) => c?.industry ?? "—",
//                 },
//                 {
//                   key: "headquarters",
//                   header: "Location",
//                   className: "text-sm text-gray-700",
//                   render: (c) => c?.headquarters ?? "—",
//                 },
//                 {
//                   key: "status",
//                   header: "Status",
//                   render: (c) => (
//                     <div className="text-center">
//                       {c?.verified ? (
//                         <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
//                           Verified
//                         </span>
//                       ) : (
//                         <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-full">
//                           Unverified
//                         </span>
//                       )}
//                       <div
//                         className={`mt-1 text-xs ${
//                           c?.is_active ? "text-green-500" : "text-gray-500"
//                         }`}
//                       >
//                         {c?.is_active ? "Active" : "Disabled"}
//                       </div>
//                     </div>
//                   ),
//                 },
//               ]}
//               actions={(company) => [
//                 { key: "view", label: "View", onClick: () => onView(company) },
//                 { key: "edit", label: "Edit", onClick: () => openEdit(company) },
//                 {
//                   key: "delete",
//                   label: "Delete",
//                   variant: "danger",
//                   requireConfirm: true,
//                   confirmTitle: (c) => `Delete company "${c?.name ?? ""}"?`,
//                   confirmDescription:
//                     "This action will permanently remove the company. This cannot be undone.",
//                   confirmLabel: "Delete",
//                   onClick: async (c) => await removeCompany(c.id),
//                 },
//               ]}
//               renderMobileCard={(company, openActions) => (
//                 <article className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="flex items-start gap-3">
//                       <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
//                         {getInitials(company?.name)}
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-900">
//                           {company?.name ?? "—"}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {company?.industry ?? "—"}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {company?.headquarters ?? "—"}
//                         </div>
//                       </div>
//                     </div>

//                     <button
//                       onClick={openActions}
//                       className="p-2 rounded-md hover:bg-gray-100 inline-flex items-center justify-center"
//                       aria-haspopup="true"
//                       title="Actions"
//                     >
//                       <span className="sr-only">Open actions</span>
//                       <svg
//                         width="18"
//                         height="18"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                         aria-hidden="true"
//                       >
//                         <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
//                       </svg>
//                     </button>
//                   </div>
//                 </article>
//               )}
//             />
//           )}
//         />

//         <Pagination
//           show={companiesTotal > perPage}
//           page={page}
//           total={companiesTotal}
//           perPage={perPage}
//           onPageChange={onPageChange}
//         />
//       </div>

//       <CompanyModal
//         open={modalOpen}
//         onClose={closeModal}
//         company={isNew ? null : editing}
//         onSave={onSave}
//       />
//     </PageShell>
//   );
// }



















// src/pages/Companies.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useCompanies } from "@/context/CompaniesContext";

// layout + sections you already have
import PageShell from "@/components/PageSections/PageShell";
import PageHeaderSection from "@/components/PageSections/PageHeader";
import PageSearchBar from "@/components/PageSections/PageSearchBar";
import PageFilterBarSection from "@/components/PageSections/PageFilterSection";
import PageContentSection from "@/components/PageSections/PageContentSection";
import { Pagination } from "@/components/ReusableComponents";

// modal
import CompanyModal from "@/components/CompanyComponents/CompanyModal";

// ✅ reusable table
import ResponsiveDataTable from "@/components/TableComponents/ResponsiveDataTable";

export default function CompaniesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const industryOptions = useMemo(
    () => ["All", "Agriculture", "SaaS", "Ecommerce", "Healthcare", "Fintech"],
    []
  );

  const urlSearchParams = new URLSearchParams(location.search);

  // modal controller: ?company=new or ?company=123
  const companyParam = urlSearchParams.get("company");
  const modalOpen = !!companyParam;
  const isNew = companyParam === "new";
  const editingId = !isNew && companyParam ? Number(companyParam) : null;

  // filters from URL
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

  // ---------- sync URL (DO NOT TOUCH "company" param here) ----------
  const syncQueryInUrl = useCallback(
    (next = {}) => {
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

      navigate(`/companies?${sp.toString()}`, { replace: true });
    },
    [location.search, navigate, query, industry, page, perPage]
  );

  // ---------- modal open/close ----------
  const openCreate = useCallback(() => {
    const sp = new URLSearchParams(location.search);
    sp.set("company", "new");
    navigate(`/companies?${sp.toString()}`);
  }, [location.search, navigate]);

  const openEdit = useCallback(
    (company) => {
      if (!company?.id) return;
      const sp = new URLSearchParams(location.search);
      sp.set("company", String(company.id));
      navigate(`/companies?${sp.toString()}`);
    },
    [location.search, navigate]
  );

  const closeModal = useCallback(() => {
    const sp = new URLSearchParams(location.search);
    sp.delete("company");
    navigate(`/companies?${sp.toString()}`);
    setEditing(null);
  }, [location.search, navigate]);

  // ---------- fetch list when filters change (✅ THIS FIXES SEARCH) ----------
  useEffect(() => {
    fetchCompanies({
      query,
      industry,
      page,
      perPage,
    }).catch(() => {});
  }, [query, industry, page, perPage, fetchCompanies]);

  // ---------- load edit company when modal has id ----------
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
      const resp = await getCompany(editingId);
      const data = resp?.data ?? resp;

      if (cancelled) return;

      if (!data) {
        closeModal();
        return;
      }

      setEditing(data);
    })();

    return () => {
      cancelled = true;
    };
  }, [modalOpen, isNew, editingId, getCompany, closeModal]);

  // ---------- handlers ----------
  const onSearchChange = useCallback(
    (v) => {
      setQuery(v);
      setPage(1);
      syncQueryInUrl({ query: v, page: 1 });
    },
    [syncQueryInUrl]
  );

  const onIndustryChange = useCallback(
    (v) => {
      setIndustry(v);
      setPage(1);
      syncQueryInUrl({ industry: v, page: 1 });
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

  // ---------- save ----------
  const onSave = useCallback(
    async (payload) => {
      const ok =
        editing?.id && !isNew
          ? await editCompany(editing.id, payload)
          : await addCompany(payload);

      if (!ok) return;

      setPage(1);
      syncQueryInUrl({ page: 1 });
      closeModal();
    },
    [editing, isNew, editCompany, addCompany, syncQueryInUrl, closeModal]
  );

  const onView = useCallback((company) => {
    alert(`Viewing ${company?.name}`);
  }, []);

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
        title="Companies"
        subtitle="Manage companies, view details, and edit company information."
        rightSlot={
          <>
            <PageSearchBar
              value={query}
              onChange={onSearchChange}
              placeholder="Search companies or location..."
              ariaLabel="Search companies"
            />
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap"
            >
              Add company
            </button>
          </>
        }
      />

      <div className="bg-white border rounded-lg p-4">
        <PageFilterBarSection
          industryOptions={industryOptions}
          selectedIndustry={industry}
          onSelectIndustry={onIndustryChange}
          perPage={perPage}
          onPerPageChange={onPerPageChange}
        />

        <PageContentSection
          apiStatus={apiStatus}
          API_STATUS_CONSTANTS={API_STATUS_CONSTANTS}
          loading={companiesLoading}
          error={error}
          isEmpty={!companies || companies.length === 0}
          errorTitle="Failed to load companies"
          errorDescription="Something went wrong while fetching company data."
          onRetry={() => fetchCompanies(lastQuery)}
          renderSuccess={() => (
            <ResponsiveDataTable
              items={companies || []}
              loading={companiesLoading}
              loadingText="Loading companies..."
              emptyText="No companies found."
              rowKey={(c) => c.id}
              getItemLabel={(c) => c?.name ?? "Company"}
              columns={[
                {
                  key: "company",
                  header: "Company",
                  render: (c) => (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                        {getInitials(c?.name)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {c?.name ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {c?.industry ?? ""}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "industry",
                  header: "Industry",
                  className: "text-sm text-gray-700",
                  render: (c) => c?.industry ?? "—",
                },
                {
                  key: "headquarters",
                  header: "Location",
                  className: "text-sm text-gray-700",
                  render: (c) => c?.headquarters ?? "—",
                },
                {
                  key: "status",
                  header: "Status",
                  render: (c) => (
                    <div className="text-center">
                      {c?.verified ? (
                        <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-full">
                          Unverified
                        </span>
                      )}
                      <div
                        className={`mt-1 text-xs ${
                          c?.is_active ? "text-green-500" : "text-gray-500"
                        }`}
                      >
                        {c?.is_active ? "Active" : "Disabled"}
                      </div>
                    </div>
                  ),
                },
              ]}
              actions={(company) => [
                { key: "view", label: "View", onClick: () => onView(company) },
                { key: "edit", label: "Edit", onClick: () => openEdit(company) },
                {
                  key: "delete",
                  label: "Delete",
                  variant: "danger",
                  requireConfirm: true,
                  confirmTitle: (c) => `Delete company "${c?.name ?? ""}"?`,
                  confirmDescription:
                    "This action will permanently remove the company. This cannot be undone.",
                  confirmLabel: "Delete",
                  onClick: async (c) => await removeCompany(c.id),
                },
              ]}
              renderMobileCard={(company, openActions) => (
                <article className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                        {getInitials(company?.name)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {company?.name ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {company?.industry ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {company?.headquarters ?? "—"}
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
          )}
        />

        {/* ✅ Choose ONE prop name based on your Pagination component.
            If your Pagination expects onChange (like Branches page), use onChange. */}
        <Pagination
          show={companiesTotal > perPage}
          page={page}
          total={companiesTotal}
          perPage={perPage}
          onChange={onPageChange}
        />
      </div>

      <CompanyModal
        open={modalOpen}
        onClose={closeModal}
        company={isNew ? null : editing}
        onSave={onSave}
      />
    </PageShell>
  );
}
