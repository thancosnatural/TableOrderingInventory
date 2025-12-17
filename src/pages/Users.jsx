// // src/pages/Users.jsx
// import React, { useState, useMemo, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import { Pagination } from "@/components/ReusableComponents";
// import { useUsers } from "@/context/UsersContext";
// import { Loader } from "@/components/Loader";
// import EmptyState from "@/components/EmptyState";
// import ErrorState from "@/components/ErrorState";

// import UsersTable from "@/components/UserComponents/UserTable";
// import UserModal from "@/components/UserComponents/UserModal";
// import FilterBar from "@/components/UserComponents/FilterBar";
// import SearchBar from "@/components/UserComponents/SearchBar";
// import { useRoles } from "@/context/RolesContext";

// export default function UsersPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // example role options (edit as you want)
//   const roleOptions = useMemo(
//     () => ["All", "super_admin", "company_admin", "branch_admin", "staff"],
//     []
//   );

//   // ---------- URL search params ----------
//   const urlSearchParams = new URLSearchParams(location.search);

//   // modal controller: ?user=new or ?user=123
//   const userParam = urlSearchParams.get("user"); // "new", "123", or null
//   const modalOpen = !!userParam;
//   const isNew = userParam === "new";
//   const editingId = !isNew && userParam ? Number(userParam) : null;

//   // filters + pagination initial values from URL
//   const initialQuery = urlSearchParams.get("q") || "";
//   const initialRole = urlSearchParams.get("role") || "All";
//   const initialPerPage = Number(urlSearchParams.get("perPage")) || 12;
//   const initialPage = Number(urlSearchParams.get("page")) || 1;

//   const [query, setQuery] = useState(initialQuery);
//   const [role, setRole] = useState(initialRole);
//   const [perPage, setPerPage] = useState(initialPerPage);
//   const [page, setPage] = useState(initialPage);

//   const [editing, setEditing] = useState(null);

//   const {
//     users,
//     usersLoading,
//     usersTotal,
//     addUser,
//     editUser,
//     removeUser,
//     getUser,
//     apiStatus,
//     API_STATUS_CONSTANTS,
//     fetchUsers,
//     lastQuery,
//     error,
//   } = useUsers();

//   const { roles } = useRoles()

//   // ---------- Helper: sync q/role/page/perPage back to URL (keep ?user= if present) ----------
//   const syncQueryInUrl = (next = {}) => {
//     const sp = new URLSearchParams(location.search);

//     const q = next.query ?? query;
//     const r = next.role ?? role;
//     const p = next.page ?? page;
//     const limit = next.perPage ?? perPage;

//     if (q) sp.set("q", q);
//     else sp.delete("q");

//     if (r && r !== "All") sp.set("role", r);
//     else sp.delete("role");

//     if (p && p !== 1) sp.set("page", String(p));
//     else sp.delete("page");

//     if (limit && limit !== 12) sp.set("perPage", String(limit));
//     else sp.delete("perPage");

//     // DO NOT TOUCH "user" here — modal stays open if it was open
//     navigate(`/users?${sp.toString()}`, { replace: true });
//   };

//   // ---------- Load user data when ?user=123 (edit mode) ----------
//   const lastFetchedIdRef = useRef(null);
  
//   useEffect(() => {
//     if (!modalOpen) {
//       setEditing(null);
//       lastFetchedIdRef.current = null;
//       return;
//     }
  
//     if (isNew) {
//       setEditing(null);
//       lastFetchedIdRef.current = null;
//       return;
//     }
  
//     if (!editingId) return;
  
//     // ✅ prevent duplicate calls for same id
//     if (lastFetchedIdRef.current === editingId) return;
//     lastFetchedIdRef.current = editingId;
  
//     (async () => {
//       const {data} = await getUser(editingId);
  
//       if (!data) {
//         const sp = new URLSearchParams(location.search);
//         sp.delete("role");
//         navigate(`/roles?${sp.toString()}`, { replace: true });
//         return;
//       }
  
//       setEditing(data);
//     })();
//   }, [modalOpen, isNew, editingId, getUser, location.search, navigate]);
  

//   // ---------- Handlers for filters ----------
//   function handleSearchChange(v) {
//     setQuery(v);
//     setPage(1);
//     syncQueryInUrl({ query: v, page: 1 });
//   }

//   function handleRoleChange(v) {
//     setRole(v);
//     setPage(1);
//     syncQueryInUrl({ role: v, page: 1 });
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

//   // ---------- Modal open/close via ?user= ----------
//   function openCreate() {
//     const sp = new URLSearchParams(location.search);
//     sp.set("user", "new");
//     navigate(`/users?${sp.toString()}`);
//   }

//   function handleEditClick(user) {
//     if (!user?.id) return;
//     const sp = new URLSearchParams(location.search);
//     sp.set("user", String(user.id));
//     navigate(`/users?${sp.toString()}`);
//   }

//   function handleCloseModal() {
//     const sp = new URLSearchParams(location.search);
//     sp.delete("user");
//     navigate(`/users?${sp.toString()}`);
//     setEditing(null);
//   }

//   function handleView(user) {
//     alert(`Viewing ${user?.name || user?.email || "User"}`);
//   }

//   // ---------- Save (create or update) ----------
//   async function handleSave(payload) {
//     const isEditingExisting = !!editing && !!editing.id && !isNew;

//     let ok;
//     if (isEditingExisting) ok = await editUser(editing.id, payload);
//     else ok = await addUser(payload);

//     if (!ok) return;

//     setPage(1);
//     syncQueryInUrl({ page: 1 });
//     handleCloseModal();
//   }

//   // ---------- RENDER ----------
//   const renderContent = () => {
//     if (usersLoading && apiStatus === API_STATUS_CONSTANTS.LOADING) return <Loader />;

//     switch (apiStatus) {
//       case API_STATUS_CONSTANTS.LOADING:
//         return <Loader />;

//       case API_STATUS_CONSTANTS.FAILURE:
//         return (
//           <ErrorState
//             error={error}
//             title="Failed to load users"
//             description="Something went wrong while fetching user data."
//             onRetry={() => fetchUsers(lastQuery)}
//             retryLabel="Retry"
//           />
//         );

//       case API_STATUS_CONSTANTS.SUCCESS:
//         if (!users || users.length === 0) return <EmptyState />;
//         return (
//           <UsersTable
//             users={users}
//             onEdit={handleEditClick}
//             onView={handleView}
//             onDelete={removeUser}
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
//             <h1 className="text-2xl font-bold">Users</h1>
//             <p className="text-sm text-gray-600 mt-1">
//               Manage users, roles, and access.
//             </p>
//           </div>

//           <div className="ml-auto flex items-center gap-3 w-full sm:w-auto">
//             <SearchBar value={query} onChange={handleSearchChange} />
//             <button
//               onClick={openCreate}
//               className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap"
//             >
//               Add user
//             </button>
//           </div>
//         </header>

//         <div className="bg-white border rounded-lg p-4">
//           <div className="mb-4">
//             <FilterBar
//               roleOptions={roleOptions}
//               selectedRole={role}
//               onSelectRole={handleRoleChange}
//               perPage={perPage}
//               onPerPageChange={handlePerPageChange}
//             />
//           </div>

//           <div className="py-2">{renderContent()}</div>

//           <div className="mt-6">
//             <Pagination
//               page={page}
//               total={usersTotal}
//               perPage={perPage}
//               onChange={handlePageChange}
//             />
//           </div>
//         </div>
//       </div>

//       <UserModal
//         open={modalOpen}
//         roles={roles}
//         onClose={handleCloseModal}
//         user={isNew ? null : editing}
//         onSave={handleSave}
//       />
//     </div>
//   );
// }


import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useUsers } from "@/context/UsersContext";
import { useRoles } from "@/context/RolesContext";

// layout + common sections
import PageShell from "@/components/PageSections/PageShell";
import PageHeaderSection from "@/components/PageSections/PageHeader";
import PageSearchBar from "@/components/PageSections/PageSearchBar";
import PageFilterBarSection from "@/components/PageSections/PageFilterSection";
import PageContentSection from "@/components/PageSections/PageContentSection";
import { Pagination } from "@/components/ReusableComponents";

// modal
import UserModal from "@/components/UserComponents/UserModal";

// ✅ reusable table
import ResponsiveDataTable from "@/components/TableComponents/ResponsiveDataTable";
import { useBranches } from "@/context/BranchesContext";

export default function UsersPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // example role options (kept)
  const roleOptions = useMemo(
    () => ["All", "super_admin", "company_admin", "branch_admin", "staff"],
    []
  );

  // ---------- URL search params ----------
  const urlSearchParams = new URLSearchParams(location.search);

  // modal controller: ?user=new or ?user=123
  const userParam = urlSearchParams.get("user");
  const modalOpen = !!userParam;
  const isNew = userParam === "new";
  const editingId = !isNew && userParam ? Number(userParam) : null;

  // filters + pagination initial values from URL
  const initialQuery = urlSearchParams.get("q") || "";
  const initialRole = urlSearchParams.get("role") || "All";
  const initialPerPage = Number(urlSearchParams.get("perPage")) || 12;
  const initialPage = Number(urlSearchParams.get("page")) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [role, setRole] = useState(initialRole);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [page, setPage] = useState(initialPage);
  const [editing, setEditing] = useState(null);

  const {
    users,
    usersLoading,
    usersTotal,
    addUser,
    editUser,
    removeUser,
    getUser,
    apiStatus,
    API_STATUS_CONSTANTS,
    fetchUsers,
    lastQuery,
    error,
  } = useUsers();

  const { roles } = useRoles();
  const { branches } = useBranches();

  // ---------- Helper: sync q/role/page/perPage back to URL (keep ?user= if present) ----------
  const syncQueryInUrl = useCallback(
    (next = {}) => {
      const sp = new URLSearchParams(location.search);

      const q = next.query ?? query;
      const r = next.role ?? role;
      const p = next.page ?? page;
      const limit = next.perPage ?? perPage;

      if (q) sp.set("q", q);
      else sp.delete("q");

      if (r && r !== "All") sp.set("role", r);
      else sp.delete("role");

      if (p && p !== 1) sp.set("page", String(p));
      else sp.delete("page");

      if (limit && limit !== 12) sp.set("perPage", String(limit));
      else sp.delete("perPage");

      // do not touch "user"
      navigate(`/users?${sp.toString()}`, { replace: true });
    },
    [location.search, navigate, query, role, page, perPage]
  );

  // ---------- Modal open/close via ?user= ----------
  const openCreate = useCallback(() => {
    const sp = new URLSearchParams(location.search);
    sp.set("user", "new");
    navigate(`/users?${sp.toString()}`);
  }, [location.search, navigate]);

  const openEdit = useCallback(
    (u) => {
      if (!u?.id) return;
      const sp = new URLSearchParams(location.search);
      sp.set("user", String(u.id));
      navigate(`/users?${sp.toString()}`);
    },
    [location.search, navigate]
  );

  const closeModal = useCallback(() => {
    const sp = new URLSearchParams(location.search);
    sp.delete("user");
    navigate(`/users?${sp.toString()}`);
    setEditing(null);
  }, [location.search, navigate]);

  // ---------- Load user data when ?user=123 (edit mode) ----------
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
      const resp = await getUser(editingId);
      const data = resp?.data ?? resp;

      if (!data) {
        closeModal();
        return;
      }

      setEditing(data);
    })();
  }, [modalOpen, isNew, editingId, getUser, closeModal]);

  // ---------- Handlers ----------
  const onSearchChange = useCallback(
    (v) => {
      setQuery(v);
      setPage(1);
      syncQueryInUrl({ query: v, page: 1 });
    },
    [syncQueryInUrl]
  );

  const onRoleChange = useCallback(
    (v) => {
      setRole(v);
      setPage(1);
      syncQueryInUrl({ role: v, page: 1 });
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

  // ---------- Save ----------
  const onSave = useCallback(
    async (payload) => {
      const ok =
        editing?.id && !isNew
          ? await editUser(editing.id, payload)
          : await addUser(payload);

      if (!ok) return;

      setPage(1);
      syncQueryInUrl({ page: 1 });
      closeModal();
    },
    [editing, isNew, editUser, addUser, syncQueryInUrl, closeModal]
  );

  const onView = useCallback((u) => {
    alert(`Viewing ${u?.full_name || u?.name || u?.email || "User"}`);
  }, []);

  // helpers for table rendering
  const getInitials = (name) =>
    !name
      ? "--"
      : String(name)
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase?.() ?? "")
          .join("");

  const getRoleLabel = (u) => {
    // supports multiple shapes: {role: 'x'} OR {role:{code}} OR {role_id}
    const code =
      u?.role?.code ||
      u?.role?.name ||
      u?.role ||
      u?.user_role ||
      (u?.role_id ? String(u.role_id) : "");
    return code || "—";
  };

  return (
    <PageShell>
      <PageHeaderSection
        title="Users"
        subtitle="Manage users, roles, and access."
        rightSlot={
          <>
            <PageSearchBar
              value={query}
              onChange={onSearchChange}
              placeholder="Search users..."
              ariaLabel="Search users"
            />
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap"
            >
              Add user
            </button>
          </>
        }
      />

      <div className="bg-white border rounded-lg p-4">
        {/* ✅ filter section (same component you use everywhere) */}
        <PageFilterBarSection
          industryOptions={roleOptions} // reusing same prop name; works because it renders a select list
          selectedIndustry={role}
          onSelectIndustry={onRoleChange}
          perPage={perPage}
          onPerPageChange={onPerPageChange}
        />

        <PageContentSection
          apiStatus={apiStatus}
          API_STATUS_CONSTANTS={API_STATUS_CONSTANTS}
          loading={usersLoading}
          error={error}
          isEmpty={!users || users.length === 0}
          errorTitle="Failed to load users"
          errorDescription="Something went wrong while fetching user data."
          onRetry={() => fetchUsers(lastQuery)}
          renderSuccess={() => (
            <ResponsiveDataTable
              items={users || []}
              loading={usersLoading}
              loadingText="Loading users..."
              emptyText="No users found."
              rowKey={(u) => u.id}
              getItemLabel={(u) => u?.full_name || u?.name || u?.email || "User"}
              columns={[
                {
                  key: "user",
                  header: "User",
                  render: (u) => (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                        {getInitials(u?.full_name || u?.name || u?.email)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {u?.full_name || u?.name || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {u?.email ?? "—"}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "phone",
                  header: "Phone",
                  className: "text-sm text-gray-700",
                  render: (u) => u?.phone ?? "—",
                },
                {
                  key: "role",
                  header: "Role",
                  className: "text-sm text-gray-700",
                  render: (u) => getRoleLabel(u),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (u) => (
                    <div className="text-center">
                      {u?.is_blocked ? (
                        <span className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded-full">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                          Active
                        </span>
                      )}
                      <div className="mt-1 text-xs text-gray-500">
                        {u?.is_active === false ? "Disabled" : "Enabled"}
                      </div>
                    </div>
                  ),
                },
              ]}
              actions={(u) => [
                { key: "view", label: "View", onClick: () => onView(u) },
                { key: "edit", label: "Edit", onClick: () => openEdit(u) },
                {
                  key: "delete",
                  label: "Delete",
                  variant: "danger",
                  requireConfirm: true,
                  confirmTitle: (x) =>
                    `Delete user "${x?.full_name || x?.name || x?.email || ""}"?`,
                  confirmDescription:
                    "This action will permanently remove the user. This cannot be undone.",
                  confirmLabel: "Delete",
                  onClick: async (x) => await removeUser(x.id),
                },
              ]}
              renderMobileCard={(u, openActions) => (
                <article className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                        {getInitials(u?.full_name || u?.name || u?.email)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {u?.full_name || u?.name || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {u?.email ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Role: {getRoleLabel(u)}
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
          show={usersTotal > perPage}
          page={page}
          total={usersTotal}
          perPage={perPage}
          onPageChange={onPageChange}
        />
      </div>

      <UserModal
        open={modalOpen}
        roles={roles}
        branches={branches}
        onClose={closeModal}
        user={isNew ? null : editing}
        onSave={onSave}
      />
    </PageShell>
  );
}
