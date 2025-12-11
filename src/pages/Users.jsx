// src/pages/UsersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/components/RBACComponents/PermissionModel";

import UsersTab from "@/components/UserComponents/UsersTab";
import PermissionsTab from "@/components/UserComponents/PermissionsTab";
import { getRoles, getUsers } from "@/services/authService";

/* ------------------------------------------------------------------
   1. FALLBACK ROLES (used only if backend / context do not provide)
------------------------------------------------------------------- */
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

/* ------------------------------------------------------------------
   2. HELPER FUNCTIONS
------------------------------------------------------------------- */

/**
 * Normalize roles coming from backend into a consistent structure.
 */
function normalizeBackendRoles(rawRoles = []) {
  return rawRoles.map((r) => {
    const rawKey = r.key || r.name || r.display_name || "";
    const key = String(rawKey).trim().toLowerCase().replace(/\s+/g, "_");

    const label =
      r.label ||
      r.display_name ||
      r.name ||
      key
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return {
      ...r,
      key,
      label,
      description: r.description || "",
      defaultModules: r.defaultModules || [],
    };
  });
}

/**
 * Build permissions matrix (role ➝ permission ➝ { module, actions }).
 * Used if backend does not send a ready-made matrix.
 */
function buildPermissionsMatrix(rolesConfigArray) {
  const matrix = {};

  rolesConfigArray.forEach((role) => {
    matrix[role.key] = {};

    PERMISSIONS.forEach((perm) => {
      const moduleEnabled =
        role.defaultModules === "all" ||
        (Array.isArray(role.defaultModules) &&
          role.defaultModules.includes(perm.key));

      const actionsState = {};
      perm.actions.forEach((a) => {
        actionsState[a.key] = moduleEnabled;
      });

      matrix[role.key][perm.key] = {
        module: moduleEnabled,
        actions: actionsState,
      };
    });
  });

  return matrix;
}

/**
 * Merge / apply permissions for a specific role key.
 * Used for create/update of a role.
 */
function applyRolePerms(prevMatrix, roleKey, newPerms) {
  const updated = { ...prevMatrix, [roleKey]: {} };

  PERMISSIONS.forEach((perm) => {
    const local = newPerms[perm.key] || { module: false, actions: {} };
    const actionsState = { ...local.actions };

    perm.actions.forEach((a) => {
      if (actionsState[a.key] === undefined) {
        actionsState[a.key] = false;
      }
    });

    updated[roleKey][perm.key] = {
      module: local.module,
      actions: actionsState,
    };
  });

  return updated;
}

/* ------------------------------------------------------------------
   3. MAIN COMPONENT
------------------------------------------------------------------- */

export default function UsersPage() {
  const { user, rolesConfig } = useAuth() || {};
  const currentRole = user?.role || null;

  // URL tab handling: ?tab=users | ?tab=permissions
  const [searchParams, setSearchParams] = useSearchParams();
  const mainTab =
    searchParams.get("tab") === "permissions" ? "permissions" : "users";

  const setMainTab = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  /* ---------------- USERS STATE ---------------- */
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);

  const canManageUsers =
    currentRole === "super_admin" ||
    currentRole === "brand_admin" ||
    currentRole === "outlet_admin";

  const isUserReadOnly = currentRole === "staff";

  /* ---------------- ROLES & PERMISSIONS STATE ---------------- */
  const [rolesConfigState, setRolesConfigState] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [editingRoleKey, setEditingRoleKey] = useState(null);

  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState(null);

  const canEditRoles = currentRole === "super_admin";

  /* ------------------------------------------------------------------
     4. LOAD ROLES (ONCE, + WHEN rolesConfig FROM CONTEXT CHANGES)
  ------------------------------------------------------------------- */
  useEffect(() => {
    let isMounted = true;

    async function fetchRoles() {
      setRolesLoading(true);
      setRolesError(null);

      try {
        const { data } = await getRoles();
        const backendRoles = Array.isArray(data?.data) ? data.data : [];

        const normalizedBackend =
          backendRoles.length > 0
            ? normalizeBackendRoles(backendRoles)
            : null;

        const finalRoles =
          normalizedBackend ||
          (Array.isArray(rolesConfig) && rolesConfig.length
            ? rolesConfig
            : DEFAULT_ROLES_CONFIG);

        const permsFromBackend =
          data?.permissions && Object.keys(data.permissions).length
            ? data.permissions
            : null;

        if (!isMounted) return;

        setRolesConfigState(finalRoles);
        setRolePermissions(
          permsFromBackend || buildPermissionsMatrix(finalRoles)
        );
      } catch (err) {
        console.error("Error loading roles:", err);
        if (!isMounted) return;

        setRolesError(err.message || "Error loading roles");

        const fallbackRoles =
          Array.isArray(rolesConfig) && rolesConfig.length
            ? rolesConfig
            : DEFAULT_ROLES_CONFIG;

        setRolesConfigState(fallbackRoles);
        setRolePermissions(buildPermissionsMatrix(fallbackRoles));
      } finally {
        if (isMounted) setRolesLoading(false);
      }
    }

    fetchRoles();
    return () => {
      isMounted = false;
    };
  }, [rolesConfig]);

  /* ------------------------------------------------------------------
     5. LOAD USERS (REAL API)
  ------------------------------------------------------------------- */
  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        setLoadingUsers(true);
        const res = await getUsers();
        const { data } = res;
        if (!isMounted) return;
        setUsers(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Error loading users:", err);
        if (isMounted) setUsers([]);
      } finally {
        if (isMounted) setLoadingUsers(false);
      }
    }

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [currentRole, user]);

  /* ------------------------------------------------------------------
     6. ROLE META, ALLOWED ROLES, FILTERED USERS
  ------------------------------------------------------------------- */

  // Map: roleKey -> { label, description }
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

  const getRoleLabel = (roleKey) => {
    if (!roleKey) return "Unknown Role";
    return (
      roleMetaMap[roleKey]?.label ||
      roleKey
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    );
  };

  const getRoleDescription = (roleKey) =>
    roleMetaMap[roleKey]?.description || "System-defined application role.";

  const allRoleKeys = useMemo(
    () => rolesConfigState.map((r) => r.key),
    [rolesConfigState]
  );

  const existingRoleKeys = allRoleKeys;

  // Which roles current user is allowed to assign when creating users
  const allowedRolesForCreate = useMemo(() => {
    if (!canManageUsers || !allRoleKeys.length) return [];

    switch (currentRole) {
      case "super_admin":
        return allRoleKeys;
      case "brand_admin":
        return allRoleKeys.filter((k) => k !== "super_admin");
      case "outlet_admin":
        return allRoleKeys.filter(
          (k) =>
            k !== "super_admin" &&
            k !== "brand_admin" &&
            k !== "outlet_admin"
        );
      default:
        return [];
    }
  }, [currentRole, allRoleKeys, canManageUsers]);

  // Filter users by search + role + status
  const filteredUsers = users.filter((u) => {
    const q = search.trim().toLowerCase();

    if (q) {
      const inText =
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
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

  /* ------------------------------------------------------------------
     7. ROLE CREATE / UPDATE HANDLERS
  ------------------------------------------------------------------- */

  async function handleCreateRole(roleConfigNew, permsNew) {
    setRolesConfigState((prev) => [...prev, roleConfigNew]);
    setRolePermissions((prev) =>
      applyRolePerms(prev, roleConfigNew.key, permsNew)
    );
    // TODO: Call backend to persist new role + permissions when API is ready
  }

  async function handleUpdateRole(updatedConfig, updatedPerms) {
    const key = updatedConfig.key;

    setRolesConfigState((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...updatedConfig } : r))
    );

    setRolePermissions((prev) => applyRolePerms(prev, key, updatedPerms));
    setEditingRoleKey(null);
    // TODO: Call backend to persist updated role + permissions when API is ready
  }

  const editingRoleConfig = rolesConfigState.find(
    (r) => r.key === editingRoleKey
  );
  const editingPerms =
    editingRoleKey && rolePermissions ? rolePermissions[editingRoleKey] : null;

  /* ------------------------------------------------------------------
     8. RENDER
  ------------------------------------------------------------------- */

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
          {rolesLoading && (
            <p className="text-xs text-slate-400 mt-1">
              Loading roles & permissions…
            </p>
          )}
          {rolesError && (
            <p className="text-xs text-red-500 mt-1">
              {rolesError} (using fallback config)
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      {mainTab === "users" ? (
        <UsersTab
          canManageUsers={canManageUsers}
          isUserReadOnly={isUserReadOnly}
          allowedRolesForCreate={allowedRolesForCreate}
          getRoleLabel={getRoleLabel}
          role={currentRole}
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
          rolesConfigState={rolesConfigState}
          getRoleDescription={getRoleDescription}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
        />
      ) : (
        <PermissionsTab
          canEditRoles={canEditRoles}
          rolesConfigState={rolesConfigState}
          rolePermissions={rolePermissions}
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
