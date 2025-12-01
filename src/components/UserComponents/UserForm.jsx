// src/components/UserComponents/UserForm.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  UserPlus,
  User as UserIcon,
  Building2,
  Store,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const USER_TABS = ["Basic", "Brand & Outlet", "Status & Access"];

export function UserForm({
  mode = "create",
  canEdit = false,
  allowedRoles = [],
  getRoleLabel = (r) => r,
  contextRole = "staff",
  contextBrandName = "",
  contextOutletName = "",
  initialUser = null,
  onSubmit,
  onCancel,
}) {
  const isEdit = mode === "edit";
  const [activeTab, setActiveTab] = useState("Basic");

  const [form, setForm] = useState(() => {
    if (initialUser) {
      return {
        full_name: initialUser.full_name || "",
        email: initialUser.email || "",
        phone: initialUser.phone || "",
        role: initialUser.role || (allowedRoles[0] || ""),
        brand_name: initialUser.brand_name || contextBrandName || "",
        outlet_name: initialUser.outlet_name || contextOutletName || "",
        is_active: initialUser.is_active ?? true,
      };
    }
    return {
      full_name: "",
      email: "",
      phone: "",
      role: allowedRoles[0] || "",
      brand_name: contextBrandName || "",
      outlet_name: contextOutletName || "",
      is_active: true,
    };
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!allowedRoles.includes(form.role)) {
      setForm((prev) => ({
        ...prev,
        role: allowedRoles[0] || "",
      }));
    }
  }, [allowedRoles]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    setError("");
    if (!form.full_name.trim()) {
      setError("Full name is required.");
      setActiveTab("Basic");
      return false;
    }
    if (!form.email.trim()) {
      setError("Email is required.");
      setActiveTab("Basic");
      return false;
    }
    if (!form.role || !allowedRoles.includes(form.role)) {
      setError("Please select a valid role.");
      setActiveTab("Basic");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!canEdit) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        brand_name: form.brand_name.trim() || contextBrandName || "-",
        outlet_name:
          form.role === "outlet_admin" || form.role === "staff"
            ? form.outlet_name.trim() || contextOutletName || "Outlet"
            : form.outlet_name.trim() || "-",
        is_active: !!form.is_active,
      };

      await Promise.resolve(onSubmit?.(payload));

      if (!isEdit) {
        setForm((prev) => ({
          full_name: "",
          email: "",
          phone: "",
          role: prev.role,
          brand_name: contextBrandName || "",
          outlet_name: contextOutletName || "",
          is_active: true,
        }));
        setActiveTab("Basic");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = !canEdit || submitting;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            {isEdit ? <UserIcon size={16} /> : <UserPlus size={16} />}
            {isEdit ? "Edit User" : "Add User"}
          </h2>
          <p className="text-[11px] text-slate-500">
            {isEdit
              ? "Update user details, role and outlet access."
              : "Create a new user with the appropriate role and outlet access."}
          </p>
        </div>

        {!canEdit && (
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck size={14} />
            Read-only
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex min-w-max gap-1">
          {USER_TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  "px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors " +
                  (active
                    ? "border-slate-900 text-slate-900 bg-slate-50"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50")
                }
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* BODY */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "Basic" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => updateField("full_name", e.target.value)}
                  placeholder="e.g. Outlet Manager, Staff Name"
                  className="w-full pl-7 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="user@company.com"
                  className="w-full pl-7 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+91 9xxxxxxxxx"
                  className="w-full pl-7 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Role *
              </label>
              <select
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
                disabled={disabled}
              >
                {allowedRoles.map((rKey) => (
                  <option key={rKey} value={rKey}>
                    {getRoleLabel(rKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {activeTab === "Brand & Outlet" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Brand
              </label>
              <div className="relative">
                <Building2
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={
                    contextRole === "super_admin"
                      ? form.brand_name
                      : contextBrandName || form.brand_name
                  }
                  onChange={(e) => updateField("brand_name", e.target.value)}
                  placeholder={
                    contextRole === "super_admin"
                      ? "e.g. Thanco's, Wow Belgian"
                      : contextBrandName || "Brand"
                  }
                  className="w-full pl-7 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
                  disabled={disabled || contextRole !== "super_admin"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Outlet (for outlet admin / staff)
              </label>
              <div className="relative">
                <Store
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={
                    contextRole === "outlet_admin"
                      ? contextOutletName || form.outlet_name
                      : form.outlet_name
                  }
                  onChange={(e) => updateField("outlet_name", e.target.value)}
                  placeholder={
                    contextRole === "outlet_admin"
                      ? contextOutletName || "My Outlet"
                      : "e.g. Indiranagar, HSR Layout"
                  }
                  className="w-full pl-7 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
                  disabled={disabled || contextRole === "outlet_admin"}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "Status & Access" && (
          <div className="space-y-3">
            <label className="inline-flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300"
                disabled={disabled}
              />
              {form.is_active ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Active user – can log in and use assigned role.</span>
                </>
              ) : (
                <>
                  <XCircle size={14} className="text-slate-400" />
                  <span>Inactive – keeps history but blocks access.</span>
                </>
              )}
            </label>

            <p className="text-[11px] text-slate-500">
              Permissions (modules & actions) are controlled via roles in the{" "}
              <span className="font-semibold">Permissions</span> tab.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
          <div className="flex-1" />
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {isEdit ? <UserIcon size={14} /> : <UserPlus size={14} />}
                {isEdit ? "Save User" : "Create User"}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

UserForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]),
  canEdit: PropTypes.bool,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  getRoleLabel: PropTypes.func,
  contextRole: PropTypes.string,
  contextBrandName: PropTypes.string,
  contextOutletName: PropTypes.string,
  initialUser: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};
