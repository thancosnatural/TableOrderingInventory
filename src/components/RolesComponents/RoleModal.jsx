// src/components/RoleComponents/RoleModal.jsx
import { useEffect, useMemo, useState, useCallback } from "react";

/* ----------------------- HELPERS ----------------------- */

const toSnakeCaseKey = (value) => {
  const s = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"`]/g, "") // remove quotes
    .replace(/[^a-z0-9]+/g, "_") // anything non-alnum -> _
    .replace(/_+/g, "_") // collapse multiple _
    .replace(/^_+|_+$/g, ""); // trim _

  return s;
};

/* ----------------------- CONFIG ----------------------- */

const EMPTY_FORM = {
  display_name: "",
  name: "", // ✅ this is your key (e.g. super_admin)
  description: "",
  scope_type: "GLOBAL",
  is_active: true,
};

const BASE_FIELDS = [
  {
    key: "display_name",
    label: "Display Name *",
    placeholder: "e.g. Super Admin",
    required: true,
    colSpan: 2,
  },
  {
    key: "name",
    label: "Role Key *",
    placeholder: "auto-generated (e.g. super_admin)",
    required: true,
    colSpan: 2,
  },
  {
    key: "description",
    label: "Description",
    placeholder: "Short description (optional)",
    required: false,
    colSpan: 2,
  },
];

/* ----------------------- UI PARTS ----------------------- */

function Toggle({ checked, onChange, color = "indigo" }) {
  const bgOn = color === "green" ? "bg-green-600" : "bg-indigo-600";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center h-7 w-12 rounded-full p-1 transition-colors focus:outline-none ${
        checked ? bgOn : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ------------------------------ MAIN ------------------------------ */

export default function RoleModal({ open, onClose, role, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEditing = !!role?.id;
  const isSystemRole = !!role?.is_system_role; // ✅ from your API

  const inputClass = useCallback(
    (hasErr) =>
      `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
        hasErr ? "border-red-500" : "border-gray-200"
      }`,
    []
  );

  const scopeOptions = useMemo(
    () => [
      { value: "GLOBAL", label: "GLOBAL" },
      { value: "COMPANY", label: "COMPANY" },
      { value: "BRANCH", label: "BRANCH" },
      { value: "PLATFORM", label: "PLATFORM" },
    ],
    []
  );

  // ✅ sync incoming role -> form (EDIT)
  useEffect(() => {
    if (!open) return;

    if (role) {
      const displayName =
        role.display_name ?? role.displayName ?? role.name ?? "";

      const key =
        role.name ?? role.key ?? role.code ?? toSnakeCaseKey(displayName);

      setForm({
        display_name: String(displayName || ""),
        name: String(key || ""),
        description: role.description ?? "",
        scope_type: role.scope_type ?? role.scopeType ?? "GLOBAL",
        is_active: role.is_active === undefined ? true : !!role.is_active,
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
  }, [role, open]);

  // ✅ AUTO GENERATE KEY from display_name (always) for NON-system roles
  useEffect(() => {
    if (!open) return;
    if (isSystemRole) return;

    const nextKey = toSnakeCaseKey(form.display_name);
    setForm((p) => ({ ...p, name: nextKey }));

    setErrors((p) => {
      const { name, ...rest } = p || {};
      return rest;
    });
  }, [form.display_name, open, isSystemRole]);

  // prevent background scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const validate = useCallback((payload) => {
    const e = {};

    if (!payload.display_name?.trim()) e.display_name = "Display name is required.";

    if (!payload.name?.trim()) e.name = "Role key is required.";
    if (payload.name && !/^[a-z0-9_]+$/.test(payload.name.trim())) {
      e.name = "Role key must be lowercase snake_case (e.g. hr_admin).";
    }

    if (payload.description && String(payload.description).length > 500) {
      e.description = "Description is too long (max 500 chars).";
    }

    if (!payload.scope_type?.trim()) e.scope_type = "scope_type is required.";

    return e;
  }, []);

  const handleSave = async () => {
    const payloadForValidation = {
      display_name: String(form.display_name || "").trim(),
      name: String(form.name || "").trim(),
      description: String(form.description || "").trim(),
      scope_type: String(form.scope_type || "").trim(),
      is_active: !!form.is_active,
    };

    const v = validate(payloadForValidation);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      const firstKey = Object.keys(v)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el) el.focus();
      return;
    }

    // ✅ send payload to backend
    const sendPayload = {
      display_name: payloadForValidation.display_name,
      name: payloadForValidation.name, // ✅ your key
      description: payloadForValidation.description || null,
      scope_type: payloadForValidation.scope_type,
      is_active: payloadForValidation.is_active,
    };

    try {
      setSaving(true);
      const ok = await onSave(sendPayload);
      if (!ok) {
        setSaving(false);
        return;
      }
      setSaving(false);
    } catch (err) {
      setSaving(false);
      setErrors({ _global: err?.message || "Failed to save role" });
      console.error("RoleModal save error:", err);
    }
  };

  if (!open) return null;

  const keyDisabled = true; // ✅ always locked (auto-generated)
  const displayNameDisabled = false; // ✅ editable even in edit mode (you asked key should follow)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label={isEditing ? "Edit Role" : "Add Role"}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl sm:mx-auto">
        <div className="bg-white sm:rounded-xl sm:shadow-lg w-full h-[92vh] sm:h-auto max-h-[92vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div>
              <h3 className="text-lg font-semibold">
                {isEditing ? "Edit Role" : "Add Role"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Role details & scope
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="text-gray-600 hover:text-gray-900 p-2 rounded"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div
            className="overflow-auto px-4 py-4 sm:py-6"
            style={{ paddingBottom: 112 }}
          >
            {errors._global && (
              <div className="mb-3 text-sm text-red-600">{errors._global}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="display_name"
                  value={form.display_name ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, display_name: e.target.value }))
                  }
                  placeholder="e.g. Super Admin"
                  disabled={displayNameDisabled}
                  className={inputClass(!!errors.display_name)}
                />
                {errors.display_name && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.display_name}
                  </div>
                )}
              </div>

              {/* Role Key (auto) */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">
                  Role Key <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="auto-generated (e.g. super_admin)"
                  disabled={keyDisabled || isSystemRole}
                  className={`${inputClass(!!errors.name)} bg-gray-50 text-gray-700`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from Display Name (snake_case). Not editable.
                  {isSystemRole ? " System role key is locked." : ""}
                </p>
                {errors.name && (
                  <div className="text-xs text-red-600 mt-1">{errors.name}</div>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Short description (optional)"
                  rows={3}
                  className={inputClass(!!errors.description)}
                />
                {errors.description && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Scope type */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">
                  Scope Type <span className="text-red-500">*</span>
                </label>

                <select
                  name="scope_type"
                  value={form.scope_type ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, scope_type: e.target.value }))
                  }
                  className={inputClass(!!errors.scope_type)}
                >
                  <option value="">Select scope</option>
                  {scopeOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>

                {errors.scope_type && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.scope_type}
                  </div>
                )}
              </div>

              {/* Active */}
              <div className="md:col-span-2 flex items-center gap-3 mt-1">
                <Toggle
                  checked={!!form.is_active}
                  onChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
                  color="green"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Active</div>
                  <div className="text-xs text-gray-500">
                    Role can be assigned to users
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="absolute left-0 right-0 bottom-0 bg-white border-t px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
            style={{ boxShadow: "0 -6px 18px rgba(0,0,0,0.06)" }}
          >
            <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600">
              <div>
                Active:{" "}
                <span className="font-medium ml-1">
                  {form.is_active ? "Yes" : "No"}
                </span>
              </div>
              {isSystemRole ? (
                <div className="text-xs text-gray-500">System Role</div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded border bg-white text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded text-white ${
                  saving ? "bg-gray-400" : "bg-indigo-600"
                } min-w-[96px]`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







