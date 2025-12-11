// src/components/rbac/RoleForm.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ShieldCheck, KeyRound, Lock, Loader2 } from "lucide-react";
import { createRole, updateRole } from "@/services/roleService";

export function RoleForm({
  mode = "create",
  canEdit = false,
  existingRoleNames = [],      
  initialRoleConfig = null,     
  onSubmit,                      
  onCancel,
}) {
  const isEdit = mode === "edit";

  const [nameTouched, setNameTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [role, setRole] = useState(() => ({
    id: initialRoleConfig?.id ?? null,
    name: initialRoleConfig?.name || "",
    display_name: initialRoleConfig?.display_name || "",
    description: initialRoleConfig?.description || "",
    is_system_role: initialRoleConfig?.is_system_role ?? false,
  }));

  const disabled = !canEdit || submitting;

  // Auto-generate `name` from display_name for CREATE mode until user edits `name`
  useEffect(() => {
    if (isEdit || nameTouched) return;
    if (!role.display_name?.trim()) return;

    const generated = role.display_name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_+|_+$/g, ""); // remove leading/trailing underscores

    setRole((prev) => ({ ...prev, name: generated }));
  }, [role.display_name, isEdit, nameTouched]);

  const updateField = (field, value) => {
    setRole((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    setError("");

    const name = (role.name || "").trim();
    const displayName = (role.display_name || "").trim();

    if (!displayName) {
      setError("Display name is required.");
      return false;
    }
    if (!name) {
      setError("Role `name` (API key) is required.");
      return false;
    }

    if (!/^[a-z0-9_]+$/i.test(name)) {
      setError("Role `name` must contain only letters, numbers, and underscores.");
      return false;
    }

    const lowerName = name.toLowerCase();
    const duplicate = (existingRoleNames || []).some(
      (n) =>
        n.toLowerCase() === lowerName &&
        (!isEdit || n !== initialRoleConfig?.name) // allow same name while editing
    );

    if (!isEdit && duplicate) {
      setError("A role with this `name` already exists.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!canEdit) return;
    if (!validate()) return;

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        name: role.name.trim(),
        display_name: role.display_name.trim(),
        description: role.description.trim() || null,
        // is_system_role: role.is_system_role, // include if your API allows changing this
      };

      let apiRes;

      if (isEdit) {
        const id = role.id ?? initialRoleConfig?.id;
        if (!id) {
          throw new Error("Missing role id for update.");
        }
        apiRes = await updateRole(id, payload);
      } else {
        apiRes = await createRole(payload);
      }

      const apiData = apiRes?.data ?? apiRes;

      if (onSubmit) {
        await onSubmit(payload, apiData);
      }

      if (!isEdit) {
        // reset for next creation
        setRole({
          id: null,
          name: "",
          display_name: "",
          description: "",
          is_system_role: false,
        });
        setNameTouched(false);
      }
    } catch (err) {
      console.error("RoleForm save error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save role. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={16} />
            {isEdit ? "Edit Role" : "Create Role"}
          </h2>
          <p className="text-[11px] text-slate-500">
            Configure a role&apos;s API key, label, and description.
          </p>
        </div>

        {!canEdit && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Lock size={14} />
            Read-only
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Name + name (API key) */}
        <div className="grid grid-cols-1 sm:grid-cols-[1.2fr,1fr] gap-3">
          {/* Display Name */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Display Name *
            </label>
            <input
              type="text"
              value={role.display_name}
              onChange={(e) => updateField("display_name", e.target.value)}
              placeholder="e.g. Super Admin, Outlet Manager, Cashier"
              className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
              disabled={!canEdit}
            />
          </div>

          {/* name (API key) */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Role Name (API key) *</span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <KeyRound size={11} />
                unique, used in backend
              </span>
            </label>
            <input
              type="text"
              value={role.name}
              onChange={(e) => {
                setNameTouched(true);
                updateField("name", e.target.value.toLowerCase());
              }}
              placeholder="e.g. super_admin, outlet_manager"
              className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
              disabled={isEdit || !canEdit}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Description (optional)
          </label>
          <textarea
            value={role.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Short note on what this role is supposed to do."
            className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
            rows={2}
            disabled={!canEdit}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {isEdit && onCancel && (
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
                <ShieldCheck size={14} />
                {isEdit ? "Save Role" : "Create Role"}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

RoleForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]),
  canEdit: PropTypes.bool,
  existingRoleNames: PropTypes.arrayOf(PropTypes.string), // list of `name` values
  initialRoleConfig: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    display_name: PropTypes.string,
    description: PropTypes.string,
    is_system_role: PropTypes.bool,
  }),
  onSubmit: PropTypes.func, // (payload, apiData) => void/Promise
  onCancel: PropTypes.func,
};

export default RoleForm;
