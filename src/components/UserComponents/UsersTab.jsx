// src/components/UserComponents/UsersTab.jsx
import React from "react";
import { Search, Filter, ShieldCheck, Loader2 } from "lucide-react";
import { UserForm } from "@/components/UserComponents/UserForm";
import UserRow from "@/components/UserComponents/UserRow";
import RolesSummary from "./RolesSummary";


export default function UsersTab({
  canManageUsers,
  isUserReadOnly,
  allowedRolesForCreate,
  getRoleLabel,
  role,
  user,
  setUsers,
  loadingUsers,
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  filteredUsers,
  rolesForFilter,
  rolesConfigState,
  getRoleDescription,
  editingUser,
  setEditingUser,
}) {
  
  return (
    <>
      {/* Add User (uses UserForm) */}
      {canManageUsers && !isUserReadOnly ? (
        <UserForm
          mode="create"
          canEdit={canManageUsers}
          allowedRoles={allowedRolesForCreate}
          getRoleLabel={getRoleLabel}
          contextRole={role}
          contextBrandName={user?.brand_name || ""}
          contextOutletName={user?.outlet_name || ""}
          onSubmit={async (payload) => {
            const newUser = {
              id: Date.now(),
              ...payload,
            };
            setUsers((prev) => [newUser, ...prev]);
          }}
        />
      ) : (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 text-xs text-slate-600 flex gap-3 items-start">
          <ShieldCheck size={16} className="text-slate-400 mt-0.5" />
          <div>
            <p className="font-medium text-slate-800 mb-0.5">
              Read-only access
            </p>
            <p>
              Only Super Admin, Brand Admin and Outlet Admin can create and
              manage users. You can still see your outlet team and roles.
            </p>
          </div>
        </section>
      )}

      {/* Users List + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.2fr,1.2fr] gap-5 items-start">
        {/* Left: list as table */}
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative max-w-md w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by name, email, phone, brand or outlet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center text-xs">
              <Filter size={14} className="text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-md border border-slate-200 bg-white"
              >
                {rolesForFilter?.map((rKey) => (
                  <option key={rKey} value={rKey}>
                    {rKey === "all" ? "All Roles" : getRoleLabel(rKey)}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-md border border-slate-200 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          {loadingUsers ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-slate-500" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No users found with current filters.
            </div>
          ) : (
            <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-2 text-left">User</th>
                      <th className="px-4 py-2 text-left">Contact</th>
                      <th className="px-4 py-2 text-left">Brand / Outlet</th>
                      <th className="px-4 py-2 text-right">Role / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <UserRow
                        key={u.id}
                        user={u}
                        getRoleLabel={getRoleLabel}
                        onEdit={
                          canManageUsers ? () => setEditingUser(u) : undefined
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Right: roles snapshot */}
        <RolesSummary
          rolesConfigState={rolesConfigState}
          getRoleLabel={getRoleLabel}
          getRoleDescription={getRoleDescription}
        />
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-5">
            <UserForm
              mode="edit"
              canEdit={canManageUsers}
              allowedRoles={allowedRolesForCreate}
              getRoleLabel={getRoleLabel}
              contextRole={role}
              contextBrandName={user?.brand_name || ""}
              contextOutletName={user?.outlet_name || ""}
              initialUser={editingUser}
              onSubmit={async (payload) => {
                setUsers((prev) =>
                  prev.map((u) =>
                    u.id === editingUser.id ? { ...u, ...payload } : u
                  )
                );
                setEditingUser(null);
              }}
              onCancel={() => setEditingUser(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
