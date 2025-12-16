// // src/pages/Roles.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import { Pagination } from "@/components/ReusableComponents";
// import { Loader } from "@/components/Loader";
// import EmptyState from "@/components/EmptyState";
// import ErrorState from "@/components/ErrorState";

// import { useRoles } from "@/context/RolesContext";

// // ✅ create these (same pattern as Users)
// import RolesTable from "@/components/RolesComponents/RoleTable";
// import RoleModal from "@/components/RolesComponents/RoleModal";
// import SearchBar from "@/components/RolesComponents/SearchBar";

// export default function RolesPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // ---------- URL search params ----------
//   const urlSearchParams = new URLSearchParams(location.search);

//   // modal controller: ?role=new or ?role=123
//   const roleParam = urlSearchParams.get("role"); // "new", "123", or null
//   const modalOpen = !!roleParam;
//   const isNew = roleParam === "new";
//   const editingId = !isNew && roleParam ? Number(roleParam) : null;

//   // pagination initial values from URL
//   const initialQuery = urlSearchParams.get("q") || "";
//   const initialPerPage = Number(urlSearchParams.get("perPage")) || 12;
//   const initialPage = Number(urlSearchParams.get("page")) || 1;

//   const [query, setQuery] = useState(initialQuery);
//   const [perPage, setPerPage] = useState(initialPerPage);
//   const [page, setPage] = useState(initialPage);

//   const [editing, setEditing] = useState(null);

//   const {
//     roles,
//     rolesLoading,
//     rolesTotal,
//     addRole,
//     editRole,
//     removeRole,
//     getRole,
//     apiStatus,
//     API_STATUS_CONSTANTS,
//     fetchRoles,
//     lastQuery,
//     error,
//   } = useRoles();

//   // ---------- Helper: sync q/page/perPage back to URL (keep ?role= if present) ----------
//   const syncQueryInUrl = (next = {}) => {
//     const sp = new URLSearchParams(location.search);

//     const q = next.query ?? query;
//     const p = next.page ?? page;
//     const limit = next.perPage ?? perPage;

//     if (q) sp.set("q", q);
//     else sp.delete("q");

//     if (p && p !== 1) sp.set("page", String(p));
//     else sp.delete("page");

//     if (limit && limit !== 12) sp.set("perPage", String(limit));
//     else sp.delete("perPage");

//     // DO NOT TOUCH "role" here — modal stays open if it was open
//     navigate(`/roles?${sp.toString()}`, { replace: true });
//   };

//   // ---------- Load role data when ?role=123 (edit mode) ----------
// const lastFetchedIdRef = useRef(null);

// useEffect(() => {
//   if (!modalOpen) {
//     setEditing(null);
//     lastFetchedIdRef.current = null;
//     return;
//   }

//   if (isNew) {
//     setEditing(null);
//     lastFetchedIdRef.current = null;
//     return;
//   }

//   if (!editingId) return;

//   // ✅ prevent duplicate calls for same id
//   if (lastFetchedIdRef.current === editingId) return;
//   lastFetchedIdRef.current = editingId;

//   (async () => {
//     const {data} = await getRole(editingId);

//     if (!data) {
//       const sp = new URLSearchParams(location.search);
//       sp.delete("role");
//       navigate(`/roles?${sp.toString()}`, { replace: true });
//       return;
//     }

//     setEditing(data);
//   })();
// }, [modalOpen, isNew, editingId, getRole, location.search, navigate]);



//   // ---------- Handlers ----------
//   function handleSearchChange(v) {
//     setQuery(v);
//     setPage(1);
//     syncQueryInUrl({ query: v, page: 1 });
//   }

//   function handlePageChange(p) {
//     setPage(p);
//     syncQueryInUrl({ page: p });
//   }

//   // ---------- Modal open/close via ?role= ----------
//   function openCreate() {
//     const sp = new URLSearchParams(location.search);
//     sp.set("role", "new");
//     navigate(`/roles?${sp.toString()}`);
//   }

//   function handleEditClick(roleRow) {
//     if (!roleRow?.id) return;
//     const sp = new URLSearchParams(location.search);
//     sp.set("role", String(roleRow.id));
//     navigate(`/roles?${sp.toString()}`);
//   }

//   function handleCloseModal() {
//     const sp = new URLSearchParams(location.search);
//     sp.delete("role");
//     navigate(`/roles?${sp.toString()}`);
//     setEditing(null);
//   }

//   function handleView(roleRow) {
//     alert(`Viewing ${roleRow?.display_name || roleRow?.name || "Role"}`);
//   }

//   // ---------- Save (create or update) ----------
//   async function handleSave(payload) {
//     const isEditingExisting = !!editing && !!editing.id && !isNew;

//     let ok;
//     if (isEditingExisting) ok = await editRole(editing.id, payload);
//     else ok = await addRole(payload);

//     if (!ok) return;

//     setPage(1);
//     syncQueryInUrl({ page: 1 });
//     handleCloseModal();
//   }

//   // ---------- RENDER ----------
//   const renderContent = () => {
//     if (rolesLoading && apiStatus === API_STATUS_CONSTANTS.LOADING) return <Loader />;

//     switch (apiStatus) {
//       case API_STATUS_CONSTANTS.LOADING:
//         return <Loader />;

//       case API_STATUS_CONSTANTS.FAILURE:
//         return (
//           <ErrorState
//             error={error}
//             title="Failed to load roles"
//             description="Something went wrong while fetching role data."
//             onRetry={() => fetchRoles(lastQuery)}
//             retryLabel="Retry"
//           />
//         );

//       case API_STATUS_CONSTANTS.SUCCESS:
//         if (!roles || roles.length === 0) return <EmptyState />;
//         return (
//           <RolesTable
//             roles={roles}
//             onEdit={handleEditClick}
//             onView={handleView}
//             onDelete={removeRole}
//           />
//         );

//       case API_STATUS_CONSTANTS.INITIAL:
//       default:
//         return <Loader />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-bold">Roles</h1>
//             <p className="text-sm text-gray-600 mt-1">
//               Manage roles and permissions.
//             </p>
//           </div>

//           <div className="ml-auto flex items-center gap-3 w-full sm:w-auto">
//             <SearchBar value={query} onChange={handleSearchChange} />
//             <button
//               onClick={openCreate}
//               className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap"
//             >
//               Add role
//             </button>
//           </div>
//         </header>

//         <div className="bg-white border rounded-lg p-4">
//           <div className="py-2">{renderContent()}</div>

//           <div className="mt-6">
//             <Pagination
//               page={page}
//               total={rolesTotal}
//               perPage={perPage}
//               onChange={handlePageChange}
//             />
//           </div>
//         </div>
//       </div>

//       <RoleModal
//         open={modalOpen}
//         onClose={handleCloseModal}
//         role={isNew ? null : editing}
//         onSave={handleSave}
//       />
//     </div>
//   );
// }


































// src/pages/Roles.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useRoles } from "@/context/RolesContext";

// layout + reusable sections
import PageShell from "@/components/PageSections/PageShell";
import PageHeaderSection from "@/components/PageSections/PageHeader";
import PageSearchBar from "@/components/PageSections/PageSearchBar";
import PageContentSection from "@/components/PageSections/PageContentSection";
import { Pagination } from "@/components/ReusableComponents";

// ✅ table (recommended: use ResponsiveDataTable like Companies)
import ResponsiveDataTable from "@/components/TableComponents/ResponsiveDataTable";

// modal
import RoleModal from "@/components/RolesComponents/RoleModal";

export default function RolesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // ---------- URL search params ----------
  const urlSearchParams = new URLSearchParams(location.search);

  // modal controller: ?role=new or ?role=123
  const roleParam = urlSearchParams.get("role"); // "new", "123", or null
  const modalOpen = !!roleParam;
  const isNew = roleParam === "new";
  const editingId = !isNew && roleParam ? Number(roleParam) : null;

  // pagination initial values from URL
  const initialQuery = urlSearchParams.get("q") || "";
  const initialPerPage = Number(urlSearchParams.get("perPage")) || 12;
  const initialPage = Number(urlSearchParams.get("page")) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [page, setPage] = useState(initialPage);

  const [editing, setEditing] = useState(null);

  const {
    roles,
    rolesLoading,
    rolesTotal,
    addRole,
    editRole,
    removeRole,
    getRole,
    apiStatus,
    API_STATUS_CONSTANTS,
    fetchRoles,
    lastQuery,
    error,
  } = useRoles();

  // ---------- Helper: sync q/page/perPage back to URL (keep ?role= if present) ----------
  const syncQueryInUrl = useCallback(
    (next = {}) => {
      const sp = new URLSearchParams(location.search);

      const q = next.query ?? query;
      const p = next.page ?? page;
      const limit = next.perPage ?? perPage;

      if (q) sp.set("q", q);
      else sp.delete("q");

      if (p && p !== 1) sp.set("page", String(p));
      else sp.delete("page");

      if (limit && limit !== 12) sp.set("perPage", String(limit));
      else sp.delete("perPage");

      // DO NOT TOUCH "role" here — modal stays open if it was open
      navigate(`/roles?${sp.toString()}`, { replace: true });
    },
    [location.search, navigate, query, page, perPage]
  );

  // ---------- fetch roles list when query/page/perPage changes ----------
  useEffect(() => {
    fetchRoles({ query, page, perPage }).catch(() => {});
  }, [query, page, perPage, fetchRoles]);

  // ---------- Load role data when ?role=123 (edit mode) ----------
  const lastFetchedIdRef = useRef(null);

  useEffect(() => {
    if (!modalOpen) {
      setEditing(null);
      lastFetchedIdRef.current = null;
      return;
    }

    if (isNew) {
      setEditing(null);
      lastFetchedIdRef.current = null;
      return;
    }

    if (!editingId) return;

    // ✅ prevent duplicate calls for same id
    if (lastFetchedIdRef.current === editingId) return;
    lastFetchedIdRef.current = editingId;

    (async () => {
      const resp = await getRole(editingId);
      const data = resp?.data ?? resp;

      if (!data) {
        const sp = new URLSearchParams(location.search);
        sp.delete("role");
        navigate(`/roles?${sp.toString()}`, { replace: true });
        return;
      }

      setEditing(data);
    })();
  }, [modalOpen, isNew, editingId, getRole, location.search, navigate]);

  // ---------- handlers ----------
  const onSearchChange = useCallback(
    (v) => {
      setQuery(v);
      setPage(1);
      syncQueryInUrl({ query: v, page: 1 });
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

  // ---------- modal open/close via ?role= ----------
  const openCreate = useCallback(() => {
    const sp = new URLSearchParams(location.search);
    sp.set("role", "new");
    navigate(`/roles?${sp.toString()}`);
  }, [location.search, navigate]);

  const openEdit = useCallback(
    (roleRow) => {
      if (!roleRow?.id) return;
      const sp = new URLSearchParams(location.search);
      sp.set("role", String(roleRow.id));
      navigate(`/roles?${sp.toString()}`);
    },
    [location.search, navigate]
  );

  const closeModal = useCallback(() => {
    const sp = new URLSearchParams(location.search);
    sp.delete("role");
    navigate(`/roles?${sp.toString()}`);
    setEditing(null);
  }, [location.search, navigate]);

  const onSave = useCallback(
    async (payload) => {
      const ok =
        editing?.id && !isNew
          ? await editRole(editing.id, payload)
          : await addRole(payload);

      if (!ok) return;

      setPage(1);
      syncQueryInUrl({ page: 1 });
      closeModal();
    },
    [editing, isNew, editRole, addRole, syncQueryInUrl, closeModal]
  );

  const onView = useCallback((roleRow) => {
    alert(`Viewing ${roleRow?.display_name || roleRow?.name || "Role"}`);
  }, []);

  const getInitials = (txt) =>
    !txt
      ? "--"
      : String(txt)
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => (w?.[0] || "").toUpperCase())
          .join("");

  return (
    <PageShell>
      <PageHeaderSection
        title="Roles"
        subtitle="Manage roles and permissions."
        rightSlot={
          <>
            <PageSearchBar
              value={query}
              onChange={onSearchChange}
              placeholder="Search roles..."
              ariaLabel="Search roles"
            />
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap"
            >
              Add role
            </button>
          </>
        }
      />

      <div className="bg-white border rounded-lg p-4">
        <PageContentSection
          apiStatus={apiStatus}
          API_STATUS_CONSTANTS={API_STATUS_CONSTANTS}
          loading={rolesLoading}
          error={error}
          isEmpty={!roles || roles.length === 0}
          errorTitle="Failed to load roles"
          errorDescription="Something went wrong while fetching role data."
          onRetry={() => fetchRoles(lastQuery)}
          renderSuccess={() => (
            <ResponsiveDataTable
              items={roles || []}
              loading={rolesLoading}
              loadingText="Loading roles..."
              emptyText="No roles found."
              rowKey={(r) => r.id}
              getItemLabel={(r) => r?.display_name || r?.name || "Role"}
              columns={[
                {
                  key: "role",
                  header: "Role",
                  render: (r) => (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                        {getInitials(r?.display_name || r?.name)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {r?.display_name ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {r?.name ?? "—"}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "description",
                  header: "Description",
                  className: "text-sm text-gray-700",
                  render: (r) => r?.description ?? "—",
                },
                {
                  key: "status",
                  header: "Status",
                  render: (r) => (
                    <div className="text-center">
                      <div
                        className={`mt-1 text-xs ${
                          r?.is_active ? "text-green-500" : "text-gray-500"
                        }`}
                      >
                        {r?.is_active ? "Active" : "Disabled"}
                      </div>
                    </div>
                  ),
                },
              ]}
              actions={(r) => [
                { key: "view", label: "View", onClick: () => onView(r) },
                { key: "edit", label: "Edit", onClick: () => openEdit(r) },
                {
                  key: "delete",
                  label: "Delete",
                  variant: "danger",
                  requireConfirm: true,
                  confirmTitle: (x) =>
                    `Delete role "${x?.display_name || x?.name || ""}"?`,
                  confirmDescription:
                    "This action will permanently remove the role. This cannot be undone.",
                  confirmLabel: "Delete",
                  onClick: async (x) => await removeRole(x.id),
                },
              ]}
              renderMobileCard={(r, openActions) => (
                <article className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                        {getInitials(r?.display_name || r?.name)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {r?.display_name ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {r?.name ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {r?.description ?? ""}
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

        <Pagination
          show={rolesTotal > perPage}
          page={page}
          total={rolesTotal}
          perPage={perPage}
          onPageChange={onPageChange}
        />
      </div>

      <RoleModal
        open={modalOpen}
        onClose={closeModal}
        role={isNew ? null : editing}
        onSave={onSave}
      />
    </PageShell>
  );
}
