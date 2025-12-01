// src/pages/UsersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/components/RBACComponents/PermissionModel";

// IMPORTED COMPONENTS
import UsersTab from "@/components/UserComponents/UsersTab";
import PermissionsTab from "@/components/UserComponents/PermissionsTab";
import { getRoles } from "@/services/authService";

// Base roles if backend/rolesConfig not yet wired
const DEFAULT_ROLES_CONFIG = [
  {
    key: "super_admin",
    label: "Super Admin",
    description: "Full platform access across all brands and outlets.",
    defaultModules: "all",
  },
  {
    key: "brand_admin",
    label: "Brand Admin",
    description: "Manages one brand and all its outlets.",
    defaultModules: [
      "manage_outlets",
      "manage_tables",
      "manage_categories",
      "manage_products",
      "manage_addons",
      "manage_orders",
      "manage_kot",
      "manage_billing",
      "manage_customers",
      "manage_users",
      "view_reports",
    ],
  },
  {
    key: "outlet_admin",
    label: "Outlet Admin",
    description: "Manages a single outlet, its staff and operations.",
    defaultModules: [
      "manage_tables",
      "manage_products",
      "manage_addons",
      "manage_orders",
      "manage_kot",
      "manage_billing",
      "manage_customers",
      "view_reports",
    ],
  },
  {
    key: "staff",
    label: "Staff",
    description: "Handles day-to-day tables, orders and billing.",
    defaultModules: ["manage_orders", "manage_kot"],
  },
];

export default function UsersPage() {
  const { role, user, rolesConfig } = useAuth() || {};

  const [searchParams, setSearchParams] = useSearchParams();
  const mainTab =
    searchParams.get("tab") === "permissions" ? "permissions" : "users";

  function setMainTab(tabKey) {
    setSearchParams({ tab: tabKey });
  }

  // ---------- USERS STATE ----------

const [rolesLoading, setRolesLoading] = useState(false);
const [rolesError, setRolesError] = useState(null);


  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);

  const canManageUsers =
    role === "super_admin" || role === "brand_admin" || role === "outlet_admin";
  const isUserReadOnly = role === "staff";

  // ---------- ROLES & PERMISSIONS STATE ----------
  const [rolesConfigState, setRolesConfigState] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [editingRoleKey, setEditingRoleKey] = useState(null);

  const canEditRoles = role === "super_admin";

  // Seed roles + rolePermissions on mount / rolesConfig change
  useEffect(() => {
    const baseRoles =
      Array.isArray(rolesConfig) && rolesConfig.length > 0
        ? rolesConfig
        : DEFAULT_ROLES_CONFIG;

    setRolesConfigState(baseRoles);

    const matrix = {};
    baseRoles.forEach((r) => {
      matrix[r.key] = {};
      PERMISSIONS.forEach((perm) => {
        const moduleEnabled =
          r.defaultModules === "all" ||
          (Array.isArray(r.defaultModules) &&
            r.defaultModules.includes(perm.key));

        const actionsState = {};
        perm.actions.forEach((a) => {
          actionsState[a.key] = moduleEnabled;
        });

        matrix[r.key][perm.key] = {
          module: moduleEnabled,
          actions: actionsState,
        };
      });
    });

    setRolePermissions(matrix);
  }, [rolesConfig]);

  // Helpers: role meta
  const roleMetaMap = useMemo(() => {
    const map = {};
    rolesConfigState.forEach((r) => {
      const cleanLabel =
        r.label ||
        r.key
          ?.split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") ||
        "Role";

      map[r.key] = {
        label: cleanLabel,
        description: r.description || r.help_text || "",
      };
    });
    return map;
  }, [rolesConfigState]);

  function getRoleLabel(roleKey) {
    if (!roleKey) return "Unknown Role";
    return (
      roleMetaMap[roleKey]?.label ||
      roleKey
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    );
  }

  function getRoleDescription(roleKey) {
    return (
      roleMetaMap[roleKey]?.description || "System-defined application role."
    );
  }

  const allRoleKeys = useMemo(
    () => rolesConfigState.map((r) => r.key),
    [rolesConfigState]
  );

  // ---------- ✅ Allowed roles for user creation (fully dynamic) ----------
  const allowedRolesForCreate = useMemo(() => {
    if (!canManageUsers) return [];
    if (!allRoleKeys.length) return [];

    // Super admin: can assign any role that exists in the system (from backend)
    if (role === "super_admin") {
      return allRoleKeys;
    }

    // Brand admin: everything except super_admin
    if (role === "brand_admin") {
      return allRoleKeys.filter((k) => k !== "super_admin");
    }

    // Outlet admin: only "lower" roles.
    // For now we treat super_admin, brand_admin, outlet_admin as non-assignable.
    // If backend later sends role hierarchy, you can drive this from there.
    if (role === "outlet_admin") {
      return allRoleKeys.filter(
        (k) => k !== "super_admin" && k !== "brand_admin" && k !== "outlet_admin"
      );
    }

    return [];
  }, [role, allRoleKeys, canManageUsers]);

  // ---------- DUMMY USERS LOAD ----------
//   useEffect(() => {
//     setLoadingUsers(true);
//     let data = [];

//     if (role === "super_admin") {
//       data = [
//         {
//           id: 1,
//           full_name: "Platform Owner",
//           email: "owner@platform.com",
//           phone: "+91 90000 00001",
//           role: "super_admin",
//           brand_name: "-",
//           outlet_name: "-",
//           is_active: true,
//         },
//         {
//           id: 2,
//           full_name: "Thanco's Brand Admin",
//           email: "brand@thancos.com",
//           phone: "+91 90000 00002",
//           role: "brand_admin",
//           brand_name: "Thanco's",
//           outlet_name: "-",
//           is_active: true,
//         },
//         {
//           id: 3,
//           full_name: "Indiranagar Outlet Manager",
//           email: "indiranagar@thancos.com",
//           phone: "+91 90000 00003",
//           role: "outlet_admin",
//           brand_name: "Thanco's",
//           outlet_name: "Indiranagar",
//           is_active: true,
//         },
//         {
//           id: 4,
//           full_name: "Counter Staff - Indiranagar",
//           email: "staff.indiranagar@thancos.com",
//           phone: "+91 90000 00004",
//           role: "staff",
//           brand_name: "Thanco's",
//           outlet_name: "Indiranagar",
//           is_active: true,
//         },
//       ];
//     } else if (role === "brand_admin") {
//       data = [
//         {
//           id: 11,
//           full_name: "You (Brand Admin)",
//           email: user?.email || "brand@mybrand.com",
//           phone: user?.phone || "+91 90000 00010",
//           role: "brand_admin",
//           brand_name: user?.brand_name || "My Brand",
//           outlet_name: "-",
//           is_active: true,
//         },
//         {
//           id: 12,
//           full_name: "Outlet Manager - Jayanagar",
//           email: "jayanagar@mybrand.com",
//           phone: "+91 90000 00011",
//           role: "outlet_admin",
//           brand_name: user?.brand_name || "My Brand",
//           outlet_name: "Jayanagar",
//           is_active: true,
//         },
//         {
//           id: 13,
//           full_name: "Outlet Manager - HSR",
//           email: "hsr@mybrand.com",
//           phone: "+91 90000 00012",
//           role: "outlet_admin",
//           brand_name: user?.brand_name || "My Brand",
//           outlet_name: "HSR Layout",
//           is_active: true,
//         },
//       ];
//     } else if (role === "outlet_admin") {
//       data = [
//         {
//           id: 21,
//           full_name: "You (Outlet Admin)",
//           email: user?.email || "outlet@mybrand.com",
//           phone: user?.phone || "+91 90000 00020",
//           role: "outlet_admin",
//           brand_name: user?.brand_name || "My Brand",
//           outlet_name: user?.outlet_name || "My Outlet",
//           is_active: true,
//         },
//         {
//           id: 22,
//           full_name: "Counter Staff 1",
//           email: "staff1@outlet.com",
//           phone: "+91 90000 00021",
//           role: "staff",
//           brand_name: user?.brand_name || "My Brand",
//           outlet_name: user?.outlet_name || "My Outlet",
//           is_active: true,
//         },
//       ];
//     } else {
//       // staff
//       data = [
//         {
//           id: 31,
//           full_name: "Outlet Admin",
//           email: "admin@outlet.com",
//           phone: "+91 90000 00030",
//           role: "outlet_admin",
//           brand_name: user?.brand_name || "Brand",
//           outlet_name: user?.outlet_name || "Outlet",
//           is_active: true,
//         },
//         {
//           id: 32,
//           full_name: user?.name || "You (Staff)",
//           email: user?.email || "staff@outlet.com",
//           phone: user?.phone || "+91 90000 00031",
//           role: "staff",
//           brand_name: user?.brand_name || "Brand",
//           outlet_name: user?.outlet_name || "Outlet",
//           is_active: true,
//         },
//       ];
//     }

//     setTimeout(() => {
//       setUsers(data);
//       setLoadingUsers(false);
//     }, 400);
//   }, [role, user]);



useEffect(() => {
  async function fetchRolesFromApi() {
    setRolesLoading(true);
    setRolesError(null);
    try {
      // If your AuthContext already gives rolesConfig from backend,
      // you can skip this fetch and only use rolesConfig.
    //   const res = await fetch("/api/user-roles", {
    //     credentials: "include",
    //   });

      const res = await getRoles()

      if (!res.ok) {
        throw new Error("Failed to load roles");
      }

      const data = await res.json();
      /**
       * Expected shape (you can adjust):
       * {
       *   roles: [
       *     { key: "super_admin", label: "...", description: "..." },
       *     ...
       *   ],
       *   permissions: {
       *     super_admin: {
       *       manage_outlets: { module: true, actions: { view: true, create: true, ... } },
       *       manage_orders:  { ... },
       *       ...
       *     },
       *     brand_admin: { ... },
       *     ...
       *   }
       * }
       */

      const rolesFromBackend =
        Array.isArray(data.roles) && data.roles.length
          ? data.roles
          : rolesConfig && rolesConfig.length
          ? rolesConfig
          : DEFAULT_ROLES_CONFIG;

      const permsFromBackend =
        data.permissions && Object.keys(data.permissions).length
          ? data.permissions
          : null;

      setRolesConfigState(rolesFromBackend);

      if (permsFromBackend) {
        setRolePermissions(permsFromBackend);
      } else {
        // fallback: derive from defaultModules + PERMISSIONS (old behaviour)
        const matrix = {};
        rolesFromBackend.forEach((r) => {
          matrix[r.key] = {};
          PERMISSIONS.forEach((perm) => {
            const moduleEnabled =
              r.defaultModules === "all" ||
              (Array.isArray(r.defaultModules) &&
                r.defaultModules.includes(perm.key));

            const actionsState = {};
            perm.actions.forEach((a) => {
              actionsState[a.key] = moduleEnabled;
            });

            matrix[r.key][perm.key] = {
              module: moduleEnabled,
              actions: actionsState,
            };
          });
        });
        setRolePermissions(matrix);
      }
    } catch (err) {
      console.error(err);
      setRolesError(err.message || "Error loading roles");
      // last resort fallback
      if (!rolesConfig || !rolesConfig.length) {
        setRolesConfigState(DEFAULT_ROLES_CONFIG);
      } else {
        setRolesConfigState(rolesConfig);
      }
    } finally {
      setRolesLoading(false);
    }
  }

  fetchRolesFromApi();
}, [rolesConfig]);


  // ---------- FILTERED USERS ----------
  const filteredUsers = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const inText =
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.brand_name && u.brand_name.toLowerCase().includes(q)) ||
        (u.outlet_name && u.outlet_name.toLowerCase().includes(q));
      if (!inText) return false;
    }
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter === "active" && !u.is_active) return false;
    if (statusFilter === "inactive" && u.is_active) return false;
    return true;
  });

  const roleCounts = useMemo(() => {
    const counts = {};
    users.forEach((u) => {
      if (!u.role) return;
      counts[u.role] = (counts[u.role] || 0) + 1;
    });
    return counts;
  }, [users]);

  const rolesForFilter = useMemo(() => {
    const keys = Object.keys(roleCounts);
    return ["all", ...keys];
  }, [roleCounts]);

  const existingRoleKeys = useMemo(
    () => rolesConfigState.map((r) => r.key),
    [rolesConfigState]
  );

  // ---------- HANDLERS: CREATE / UPDATE ROLE ----------
  async function handleCreateRole(roleConfigNew, permsNew) {
    setRolesConfigState((prev) => [...prev, roleConfigNew]);

    setRolePermissions((prev) => {
      const updated = { ...prev };
      const k = roleConfigNew.key;
      updated[k] = {};

      PERMISSIONS.forEach((perm) => {
        const local = permsNew[perm.key] || { module: false, actions: {} };
        const actionsState = { ...local.actions };
        perm.actions.forEach((a) => {
          if (actionsState[a.key] === undefined) {
            actionsState[a.key] = false;
          }
        });
        updated[k][perm.key] = {
          module: local.module,
          actions: actionsState,
        };
      });

      return updated;
    });
  }

  async function handleUpdateRole(updatedConfig, updatedPerms) {
    const key = updatedConfig.key;
    setRolesConfigState((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...updatedConfig } : r))
    );

    setRolePermissions((prev) => {
      const updated = { ...prev };
      updated[key] = {};

      PERMISSIONS.forEach((perm) => {
        const local = updatedPerms[perm.key] || { module: false, actions: {} };
        const actionsState = { ...local.actions };
        perm.actions.forEach((a) => {
          if (actionsState[a.key] === undefined) {
            actionsState[a.key] = false;
          }
        });
        updated[key][perm.key] = {
          module: local.module,
          actions: actionsState,
        };
      });

      return updated;
    });

    setEditingRoleKey(null);
  }

  const editingRoleConfig = rolesConfigState.find(
    (r) => r.key === editingRoleKey
  );
  const editingPerms =
    editingRoleKey && rolePermissions ? rolePermissions[editingRoleKey] : null;

  // ---------- RENDER ----------
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Users size={22} />
            Users & Permissions
          </h1>
          <p className="text-sm text-slate-500">
            Manage user accounts and define role-based access in one place.
          </p>
        </div>
      </div>

      {/* Main Tabs (URL linked) */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMainTab("users")}
            className={
              "px-4 py-2 text-xs sm:text-sm font-medium border-b-2 " +
              (mainTab === "users"
                ? "border-slate-900 text-slate-900 bg-slate-50"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50")
            }
          >
            Users
          </button>
          <button
            type="button"
            onClick={() => setMainTab("permissions")}
            className={
              "px-4 py-2 text-xs sm:text-sm font-medium border-b-2 " +
              (mainTab === "permissions"
                ? "border-slate-900 text-slate-900 bg-slate-50"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50")
            }
          >
            Permissions (RBAC)
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {mainTab === "users" ? (
        <UsersTab
          canManageUsers={canManageUsers}
          isUserReadOnly={isUserReadOnly}
          allowedRolesForCreate={allowedRolesForCreate}
          getRoleLabel={getRoleLabel}
          role={role}
          user={user}
          users={users}
          setUsers={setUsers}
          loadingUsers={loadingUsers}
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredUsers={filteredUsers}
          rolesForFilter={rolesForFilter}
          rolesConfigState={rolesConfigState}
          roleCounts={roleCounts}
          getRoleDescription={getRoleDescription}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
        />
      ) : (
        <PermissionsTab
          canEditRoles={canEditRoles}
          rolesConfigState={rolesConfigState}
          roleCounts={roleCounts}
          getRoleLabel={getRoleLabel}
          getRoleDescription={getRoleDescription}
          existingRoleKeys={existingRoleKeys}
          handleCreateRole={handleCreateRole}
          editingRoleConfig={editingRoleConfig}
          editingPerms={editingPerms}
          setEditingRoleKey={setEditingRoleKey}
          handleUpdateRole={handleUpdateRole}
        />
      )}
    </div>
  );
}
