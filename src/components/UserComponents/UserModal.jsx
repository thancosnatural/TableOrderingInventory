// src/components/UserComponents/UserModal.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useCompanies } from "@/context/CompaniesContext";

/* ----------------------- CONFIG ----------------------- */

const SUPER_ADMIN_ROLE_ID_FALLBACK = 1;

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  role_id: "",
  company_id: "",
  branch_id: "",
  profile_pic: "",
  is_active: true,
  is_blocked: false,
};

const BASE_FIELDS = [
  {
    key: "full_name",
    label: "Full Name *",
    placeholder: "User name",
    required: true,
    colSpan: 2,
  },
  {
    key: "email",
    label: "Email *",
    placeholder: "name@company.com",
    required: true,
  },
  { key: "phone", label: "Phone", placeholder: "+91 9XXXXXXXXX" },
];

/* ----------------------- HELPERS ----------------------- */

function normalizeRoleCode(role) {
  return (
    role?.code ??
    role?.name ??
    role?.key ??
    role?.label ??
    ""
  )
    .toString()
    .trim()
    .toLowerCase();
}

function findRoleById(roles, roleIdNum) {
  const list = Array.isArray(roles) ? roles : [];
  return list.find((r) => Number(r?.id ?? r?.value) === Number(roleIdNum));
}

function isSuperAdminRole(roleIdNum, roles) {
  if (!roleIdNum) return false;
  if (Number(roleIdNum) === Number(SUPER_ADMIN_ROLE_ID_FALLBACK)) return true;
  const r = findRoleById(roles, roleIdNum);
  const code = normalizeRoleCode(r);
  return code === "super_admin" || code.includes("super_admin");
}

function isCompanyAdminRole(roleIdNum, roles) {
  if (!roleIdNum) return false;
  const r = findRoleById(roles, roleIdNum);
  const code = normalizeRoleCode(r);
  return code === "company_admin" || code.includes("company_admin");
}

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

export default function UserModal({
  roles = [],
  branches = [],
  open,
  onClose,
  user,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const isEditing = !!user?.id;

  const { companies, companiesLoading: companiesListLoading, fetchCompanies } =
    useCompanies();

  const inputClass = useCallback(
    (hasErr) =>
      `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
        hasErr ? "border-red-500" : "border-gray-200"
      }`,
    []
  );

  // normalize roles for select
  const roleOptions = useMemo(() => {
    const list = Array.isArray(roles) ? roles : [];
    return list
      .map((r) => {
        const id = r?.id ?? r?.value;
        if (!id) return null;
        const label =
          r?.display_name ??
          r?.label ??
          r?.name ??
          r?.code ??
          `Role ${id}`;
        return { id: Number(id), label: String(label) };
      })
      .filter(Boolean);
  }, [roles]);

  const roleIdNum = useMemo(() => Number(form.role_id) || null, [form.role_id]);

  const isRoleSuperAdmin = useMemo(
    () => isSuperAdminRole(roleIdNum, roles),
    [roleIdNum, roles]
  );

  const isRoleCompanyAdmin = useMemo(
    () => isCompanyAdminRole(roleIdNum, roles),
    [roleIdNum, roles]
  );

  // requirements
  const requiresCompany = useMemo(
    () => !!roleIdNum && !isRoleSuperAdmin,
    [roleIdNum, isRoleSuperAdmin]
  );

  const requiresBranch = useMemo(
    () => !!roleIdNum && !isRoleSuperAdmin && !isRoleCompanyAdmin,
    [roleIdNum, isRoleSuperAdmin, isRoleCompanyAdmin]
  );

  const companyOptions = useMemo(() => {
    const list = Array.isArray(companies) ? companies : [];
    return list
      .filter((c) => c && c.id)
      .map((c) => ({
        id: Number(c.id),
        label: `${c.name ?? "Company"}${
          c.company_code ? ` • ${c.company_code}` : ""
        }`,
      }));
  }, [companies]);

  const branchOptions = useMemo(() => {
    const list = Array.isArray(branches) ? branches : [];
    return list
      .filter((b) => b && (b.id ?? b.value))
      .map((b) => ({
        id: Number(b.id ?? b.value),
        label: String(b.label ?? b.name ?? b.branch_name ?? `Branch ${b.id}`),
        company_id: b.company_id ?? b.companyId ?? null,
      }));
  }, [branches]);

  const filteredBranchOptions = useMemo(() => {
    const cid = form.company_id ? Number(form.company_id) : null;
    if (!cid) return branchOptions;
    const hasCompanyId = branchOptions.some((b) => b.company_id != null);
    if (!hasCompanyId) return branchOptions;
    return branchOptions.filter((b) => Number(b.company_id) === cid);
  }, [branchOptions, form.company_id]);

  // fetch companies once when modal opens
  useEffect(() => {
    if (!open) return;
    if (Array.isArray(companies) && companies.length > 0) return;
    fetchCompanies?.({ page: 1, perPage: 200 }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // sync incoming user -> form
  useEffect(() => {
    if (!open) return;

    if (user) {
      const roleId =
        user.role_id ??
        user?.roles?.[0]?.id ??
        user?.role?.id ??
        user?.roleId ??
        "";

      const companyId =
        user.company_id ??
        user?.companies?.[0]?.id ??
        user?.company?.id ??
        "";

      const branchId =
        user.branch_id ?? user?.branch?.id ?? user?.branchId ?? "";

      const pic = user.profile_pic ?? user.avatar_url ?? user.avatar ?? "";

      setForm({
        full_name: user.full_name ?? user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        role_id: roleId ? String(roleId) : "",
        company_id: companyId ? String(companyId) : "",
        branch_id: branchId ? String(branchId) : "",
        profile_pic: pic || "",
        is_active: user.is_active === undefined ? true : !!user.is_active,
        is_blocked: user.is_blocked === undefined ? false : !!user.is_blocked,
      });

      setAvatarPreview(pic || null);
    } else {
      setForm(EMPTY_FORM);
      setAvatarPreview(null);
    }

    setErrors({});
  }, [user, open]);

  // enforce rules when role changes
  useEffect(() => {
    if (!open) return;

    // super_admin => clear company + branch
    if (isRoleSuperAdmin) {
      setForm((p) => ({ ...p, company_id: "", branch_id: "" }));
      setErrors((p) => {
        const { company_id, branch_id, ...rest } = p || {};
        return rest;
      });
      return;
    }

    // company_admin => clear branch
    if (isRoleCompanyAdmin) {
      setForm((p) => ({ ...p, branch_id: "" }));
      setErrors((p) => {
        const { branch_id, ...rest } = p || {};
        return rest;
      });
    }
  }, [open, isRoleSuperAdmin, isRoleCompanyAdmin]);

  // if company changes AND branch is required => reset branch
  useEffect(() => {
    if (!open) return;
    if (!requiresBranch) return;
    setForm((p) => ({ ...p, branch_id: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.company_id]);

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

  const validate = useCallback(
    (payload) => {
      const e = {};

      if (!payload.full_name?.trim()) e.full_name = "Name is required.";

      if (!payload.email?.trim()) e.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim()))
        e.email = "Enter a valid email.";

      if (payload.phone && payload.phone.trim().length > 30)
        e.phone = "Phone is too long.";

      if (!payload.role_id) e.role_id = "Role is required.";

      if (requiresCompany) {
        if (!String(payload.company_id ?? "").trim())
          e.company_id = "Company is required for this role.";
      }

      if (requiresBranch) {
        if (!String(payload.branch_id ?? "").trim())
          e.branch_id = "Branch is required for this role.";
      }

      return e;
    },
    [requiresCompany, requiresBranch]
  );

  const handleAvatarUpload = (file) => {
    if (!file) return;

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrors((p) => ({
        ...(p || {}),
        profile_pic: "Image is too large. Max 2MB.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result || "");
      setAvatarPreview(base64);
      setForm((p) => ({ ...p, profile_pic: base64 }));
      setErrors((p) => {
        const { profile_pic, ...rest } = p || {};
        return rest;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const payloadForValidation = {
      full_name: String(form.full_name || "").trim(),
      email: String(form.email || "").trim(),
      phone: form.phone ? String(form.phone).trim() : "",
      role_id: form.role_id ? Number(form.role_id) : null,
      company_id: requiresCompany ? String(form.company_id || "") : null,
      branch_id: requiresBranch ? String(form.branch_id || "") : null,
      profile_pic: form.profile_pic ? String(form.profile_pic) : "",
      is_active: !!form.is_active,
      is_blocked: !!form.is_blocked,
    };

    const v = validate(payloadForValidation);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      const firstKey = Object.keys(v)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el) el.focus();
      return;
    }

    const sendPayload = {
      full_name: payloadForValidation.full_name,
      email: payloadForValidation.email,
      phone: payloadForValidation.phone,
      role_id: payloadForValidation.role_id,
      company_id: payloadForValidation.company_id
        ? Number(payloadForValidation.company_id)
        : null,
      branch_id: payloadForValidation.branch_id
        ? Number(payloadForValidation.branch_id)
        : null,
      profile_pic: payloadForValidation.profile_pic,
      is_active: payloadForValidation.is_active,
      is_blocked: payloadForValidation.is_blocked,
    };

    try {
      setSaving(true);
      const ok = await onSave(sendPayload);
      if (!ok) return;
    } catch (err) {
      setErrors({ _global: err?.message || "Failed to save user" });
      console.error("UserModal save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label={isEditing ? "Edit User" : "Add User"}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl sm:mx-auto">
        <div className="bg-white sm:rounded-xl sm:shadow-lg w-full h-[92vh] sm:h-auto max-h-[92vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div>
              <h3 className="text-lg font-semibold">
                {isEditing ? "Edit User" : "Add User"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                User details & access controls
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
              {/* Profile pic */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-2">Profile Picture</label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 border rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="profile preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No Photo</span>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                      className="block w-full text-sm text-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      PNG/JPG. Stored as Base64 (max 2MB).
                    </p>
                    {errors.profile_pic && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.profile_pic}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Base fields */}
              {BASE_FIELDS.map((field) => {
                const spanBoth = field.colSpan === 2 ? "md:col-span-2" : "";
                const hasErr = !!errors[field.key];

                // ✅ FINAL: EMAIL IS EDITABLE EVEN IN EDIT MODE
                const disabled = false;

                return (
                  <div key={field.key} className={spanBoth}>
                    <label className="block text-sm mb-1">
                      {field.label}
                      {field.required ? (
                        <span className="text-red-500"> *</span>
                      ) : null}
                    </label>

                    <input
                      name={field.key}
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [field.key]: e.target.value }))
                      }
                      placeholder={field.placeholder}
                      disabled={disabled}
                      className={`${inputClass(hasErr)} ${
                        disabled ? "bg-gray-50 text-gray-700" : ""
                      }`}
                    />

                    {hasErr && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors[field.key]}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Role select */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">
                  Role <span className="text-red-500">*</span>
                </label>

                <select
                  name="role_id"
                  value={form.role_id ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, role_id: e.target.value }))
                  }
                  className={inputClass(!!errors.role_id)}
                >
                  <option value="">Select role</option>
                  {roleOptions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>

                {errors.role_id && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.role_id}
                  </div>
                )}
              </div>

              {/* Company selector */}
              {requiresCompany ? (
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="company_id"
                    value={form.company_id ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, company_id: e.target.value }))
                    }
                    className={inputClass(!!errors.company_id)}
                    disabled={companiesListLoading}
                  >
                    <option value="">
                      {companiesListLoading
                        ? "Loading companies..."
                        : "Select a company"}
                    </option>
                    {companyOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  {errors.company_id && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.company_id}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Branch selector ONLY when required (NOT for company_admin) */}
              {requiresBranch ? (
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">
                    Branch <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="branch_id"
                    value={form.branch_id ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, branch_id: e.target.value }))
                    }
                    className={inputClass(!!errors.branch_id)}
                  >
                    <option value="">Select a branch</option>
                    {filteredBranchOptions.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>

                  {errors.branch_id && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.branch_id}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Active / Blocked */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
                <div className="flex items-center gap-3">
                  <Toggle
                    checked={!!form.is_active}
                    onChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
                    color="green"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Active
                    </div>
                    <div className="text-xs text-gray-500">
                      Allow login & usage
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Toggle
                    checked={!!form.is_blocked}
                    onChange={(v) => setForm((p) => ({ ...p, is_blocked: v }))}
                    color="indigo"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Blocked
                    </div>
                    <div className="text-xs text-gray-500">
                      Disable access instantly
                    </div>
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
              <div>
                Blocked:{" "}
                <span className="font-medium ml-1">
                  {form.is_blocked ? "Yes" : "No"}
                </span>
              </div>
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






















// // src/components/UserComponents/UserModal.jsx
// import { useEffect, useMemo, useState, useCallback } from "react";
// import { useCompanies } from "@/context/CompaniesContext";

// /* ----------------------- CONFIG ----------------------- */

// const SUPER_ADMIN_ROLE_ID_FALLBACK = 1;

// const EMPTY_FORM = {
//   full_name: "",
//   email: "",
//   phone: "",
//   role_id: "",
//   company_id: "",
//   branch_id: "",
//   profile_pic: "",
//   is_active: true,
//   is_blocked: false,

//   // ✅ only for ADD mode
//   password: "",
//   confirm_password: "",
// };

// const BASE_FIELDS = [
//   { key: "full_name", label: "Full Name *", placeholder: "User name", required: true, colSpan: 2 },
//   { key: "email", label: "Email *", placeholder: "name@company.com", required: true },
//   { key: "phone", label: "Phone", placeholder: "+91 9XXXXXXXXX" },
// ];

// /* ----------------------- HELPERS ----------------------- */

// function normalizeRoleCode(role) {
//   return (role?.code ?? role?.name ?? role?.key ?? role?.label ?? "")
//     .toString()
//     .trim()
//     .toLowerCase();
// }

// function findRoleById(roles, roleIdNum) {
//   const list = Array.isArray(roles) ? roles : [];
//   return list.find((r) => Number(r?.id ?? r?.value) === Number(roleIdNum));
// }

// function isSuperAdminRole(roleIdNum, roles) {
//   if (!roleIdNum) return false;
//   if (Number(roleIdNum) === Number(SUPER_ADMIN_ROLE_ID_FALLBACK)) return true;
//   const r = findRoleById(roles, roleIdNum);
//   const code = normalizeRoleCode(r);
//   return code === "super_admin" || code.includes("super_admin");
// }

// function isCompanyAdminRole(roleIdNum, roles) {
//   if (!roleIdNum) return false;
//   const r = findRoleById(roles, roleIdNum);
//   const code = normalizeRoleCode(r);
//   return code === "company_admin" || code.includes("company_admin");
// }

// /* ----------------------- UI PARTS ----------------------- */

// function Toggle({ checked, onChange, color = "indigo" }) {
//   const bgOn = color === "green" ? "bg-green-600" : "bg-indigo-600";
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={!!checked}
//       onClick={() => onChange(!checked)}
//       className={`inline-flex items-center h-7 w-12 rounded-full p-1 transition-colors focus:outline-none ${
//         checked ? bgOn : "bg-gray-200"
//       }`}
//     >
//       <span
//         className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${
//           checked ? "translate-x-5" : "translate-x-0"
//         }`}
//       />
//     </button>
//   );
// }

// function EyeIcon({ open }) {
//   return open ? (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
//       <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="2" />
//       <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
//     </svg>
//   ) : (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
//       <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a18.16 18.16 0 0 1-3.22 4.52" stroke="currentColor" strokeWidth="2" />
//       <path d="M6.61 6.61A18.65 18.65 0 0 0 2 12s3.5 7 10 7a10.64 10.64 0 0 0 3.13-.46" stroke="currentColor" strokeWidth="2" />
//       <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" stroke="currentColor" strokeWidth="2" />
//       <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" />
//     </svg>
//   );
// }

// function PasswordField({
//   name,
//   label,
//   value,
//   placeholder,
//   error,
//   required,
//   show,
//   onToggleShow,
//   onChange,
//   inputClass,
// }) {
//   return (
//     <div className="md:col-span-2">
//       <label className="block text-sm mb-1">
//         {label}
//         {required ? <span className="text-red-500"> *</span> : null}
//       </label>

//       <div className="relative">
//         <input
//           type={show ? "text" : "password"}
//           name={name}
//           value={value ?? ""}
//           onChange={onChange}
//           placeholder={placeholder}
//           autoComplete="new-password"
//           className={`${inputClass(!!error)} pr-10`}
//         />

//         <button
//           type="button"
//           tabIndex={-1}
//           onMouseDown={(e) => e.preventDefault()}
//           onClick={onToggleShow}
//           className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-600 hover:text-gray-900"
//           aria-label={show ? "Hide password" : "Show password"}
//         >
//           <EyeIcon open={show} />
//         </button>
//       </div>

//       {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
//     </div>
//   );
// }

// /* ------------------------------ MAIN ------------------------------ */

// export default function UserModal({ roles = [], branches = [], open, onClose, user, onSave }) {
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [errors, setErrors] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [avatarPreview, setAvatarPreview] = useState(null);

//   const [showPwd, setShowPwd] = useState({ password: false, confirm_password: false });

//   const isEditing = !!user?.id;

//   const { companies, companiesLoading: companiesListLoading, fetchCompanies } = useCompanies();

//   const inputClass = useCallback(
//     (hasErr) =>
//       `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
//         hasErr ? "border-red-500" : "border-gray-200"
//       }`,
//     []
//   );

//   const roleOptions = useMemo(() => {
//     const list = Array.isArray(roles) ? roles : [];
//     return list
//       .map((r) => {
//         const id = r?.id ?? r?.value;
//         if (!id) return null;
//         const label = r?.display_name ?? r?.label ?? r?.name ?? r?.code ?? `Role ${id}`;
//         return { id: Number(id), label: String(label) };
//       })
//       .filter(Boolean);
//   }, [roles]);

//   const roleIdNum = useMemo(() => Number(form.role_id) || null, [form.role_id]);

//   const isRoleSuperAdmin = useMemo(() => isSuperAdminRole(roleIdNum, roles), [roleIdNum, roles]);
//   const isRoleCompanyAdmin = useMemo(() => isCompanyAdminRole(roleIdNum, roles), [roleIdNum, roles]);

//   const requiresCompany = useMemo(() => !!roleIdNum && !isRoleSuperAdmin, [roleIdNum, isRoleSuperAdmin]);
//   const requiresBranch = useMemo(
//     () => !!roleIdNum && !isRoleSuperAdmin && !isRoleCompanyAdmin,
//     [roleIdNum, isRoleSuperAdmin, isRoleCompanyAdmin]
//   );

//   const companyOptions = useMemo(() => {
//     const list = Array.isArray(companies) ? companies : [];
//     return list
//       .filter((c) => c && c.id)
//       .map((c) => ({
//         id: Number(c.id),
//         label: `${c.name ?? "Company"}${c.company_code ? ` • ${c.company_code}` : ""}`,
//       }));
//   }, [companies]);

//   const branchOptions = useMemo(() => {
//     const list = Array.isArray(branches) ? branches : [];
//     return list
//       .filter((b) => b && (b.id ?? b.value))
//       .map((b) => ({
//         id: Number(b.id ?? b.value),
//         label: String(b.label ?? b.name ?? b.branch_name ?? `Branch ${b.id}`),
//         company_id: b.company_id ?? b.companyId ?? null,
//       }));
//   }, [branches]);

//   const filteredBranchOptions = useMemo(() => {
//     const cid = form.company_id ? Number(form.company_id) : null;
//     if (!cid) return branchOptions;
//     const hasCompanyId = branchOptions.some((b) => b.company_id != null);
//     if (!hasCompanyId) return branchOptions;
//     return branchOptions.filter((b) => Number(b.company_id) === cid);
//   }, [branchOptions, form.company_id]);

//   // fetch companies once when modal opens
//   useEffect(() => {
//     if (!open) return;
//     if (Array.isArray(companies) && companies.length > 0) return;
//     fetchCompanies?.({ page: 1, perPage: 200 }).catch(() => {});
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   // sync incoming user -> form
//   useEffect(() => {
//     if (!open) return;

//     if (user) {
//       const roleId = user.role_id ?? user?.roles?.[0]?.id ?? user?.role?.id ?? user?.roleId ?? "";
//       const companyId = user.company_id ?? user?.companies?.[0]?.id ?? user?.company?.id ?? "";
//       const branchId = user.branch_id ?? user?.branch?.id ?? user?.branchId ?? "";
//       const pic = user.profile_pic ?? user.avatar_url ?? user.avatar ?? "";

//       setForm({
//         full_name: user.full_name ?? user.name ?? "",
//         email: user.email ?? "",
//         phone: user.phone ?? "",
//         role_id: roleId ? String(roleId) : "",
//         company_id: companyId ? String(companyId) : "",
//         branch_id: branchId ? String(branchId) : "",
//         profile_pic: pic || "",
//         is_active: user.is_active === undefined ? true : !!user.is_active,
//         is_blocked: user.is_blocked === undefined ? false : !!user.is_blocked,

//         // ✅ clear passwords in edit
//         password: "",
//         confirm_password: "",
//       });

//       setAvatarPreview(pic || null);
//     } else {
//       setForm(EMPTY_FORM);
//       setAvatarPreview(null);
//     }

//     setShowPwd({ password: false, confirm_password: false });
//     setErrors({});
//   }, [user, open]);

//   // enforce rules when role changes
//   useEffect(() => {
//     if (!open) return;

//     if (isRoleSuperAdmin) {
//       setForm((p) => ({ ...p, company_id: "", branch_id: "" }));
//       setErrors((p) => {
//         const { company_id, branch_id, ...rest } = p || {};
//         return rest;
//       });
//       return;
//     }

//     if (isRoleCompanyAdmin) {
//       setForm((p) => ({ ...p, branch_id: "" }));
//       setErrors((p) => {
//         const { branch_id, ...rest } = p || {};
//         return rest;
//       });
//     }
//   }, [open, isRoleSuperAdmin, isRoleCompanyAdmin]);

//   // company changes => reset branch ONLY when branch is required
//   useEffect(() => {
//     if (!open) return;
//     if (!requiresBranch) return;
//     setForm((p) => ({ ...p, branch_id: "" }));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [form.company_id]);

//   // prevent background scroll
//   useEffect(() => {
//     if (!open) return;
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, [open]);

//   // close on ESC
//   useEffect(() => {
//     if (!open) return;
//     const handler = (e) => e.key === "Escape" && onClose?.();
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [open, onClose]);

//   const validate = useCallback(
//     (payload) => {
//       const e = {};

//       if (!payload.full_name?.trim()) e.full_name = "Name is required.";

//       if (!payload.email?.trim()) e.email = "Email is required.";
//       else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim()))
//         e.email = "Enter a valid email.";

//       if (payload.phone && payload.phone.trim().length > 30) e.phone = "Phone is too long.";

//       if (!payload.role_id) e.role_id = "Role is required.";

//       if (requiresCompany && !String(payload.company_id ?? "").trim())
//         e.company_id = "Company is required for this role.";

//       if (requiresBranch && !String(payload.branch_id ?? "").trim())
//         e.branch_id = "Branch is required for this role.";

//       // ✅ password only for ADD
//       if (!isEditing) {
//         const p = String(payload.password || "").trim();
//         const c = String(payload.confirm_password || "").trim();

//         if (!p) e.password = "Password is required.";
//         if (!c) e.confirm_password = "Confirm password is required.";
//         if (p && p.length < 6) e.password = "Min 6 characters.";
//         if (p && c && p !== c) e.confirm_password = "Passwords do not match.";
//       }

//       return e;
//     },
//     [requiresCompany, requiresBranch, isEditing]
//   );

//   const handleAvatarUpload = (file) => {
//     if (!file) return;

//     const maxBytes = 2 * 1024 * 1024;
//     if (file.size > maxBytes) {
//       setErrors((p) => ({ ...(p || {}), profile_pic: "Image is too large. Max 2MB." }));
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       const base64 = String(reader.result || "");
//       setAvatarPreview(base64);
//       setForm((p) => ({ ...p, profile_pic: base64 }));
//       setErrors((p) => {
//         const { profile_pic, ...rest } = p || {};
//         return rest;
//       });
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSave = async () => {
//     const payloadForValidation = {
//       full_name: String(form.full_name || "").trim(),
//       email: String(form.email || "").trim(),
//       phone: form.phone ? String(form.phone).trim() : "",
//       role_id: form.role_id ? Number(form.role_id) : null,
//       company_id: requiresCompany ? String(form.company_id || "") : null,
//       branch_id: requiresBranch ? String(form.branch_id || "") : null,
//       profile_pic: form.profile_pic ? String(form.profile_pic) : "",
//       is_active: !!form.is_active,
//       is_blocked: !!form.is_blocked,

//       // ✅ only for ADD
//       password: String(form.password || ""),
//       confirm_password: String(form.confirm_password || ""),
//     };

//     const v = validate(payloadForValidation);
//     if (Object.keys(v).length > 0) {
//       setErrors(v);
//       const firstKey = Object.keys(v)[0];
//       const el = document.querySelector(`[name="${firstKey}"]`);
//       if (el) el.focus();
//       return;
//     }

//     const sendPayload = {
//       full_name: payloadForValidation.full_name,
//       email: payloadForValidation.email,
//       phone: payloadForValidation.phone,
//       role_id: payloadForValidation.role_id,
//       company_id: payloadForValidation.company_id ? Number(payloadForValidation.company_id) : null,
//       branch_id: payloadForValidation.branch_id ? Number(payloadForValidation.branch_id) : null,
//       profile_pic: payloadForValidation.profile_pic,
//       is_active: payloadForValidation.is_active,
//       is_blocked: payloadForValidation.is_blocked,
//     };

//     // ✅ include password only for ADD
//     if (!isEditing) sendPayload.password = String(payloadForValidation.password || "").trim();

//     try {
//       setSaving(true);
//       const ok = await onSave(sendPayload);
//       if (!ok) return;
//     } catch (err) {
//       setErrors({ _global: err?.message || "Failed to save user" });
//       console.error("UserModal save error:", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" aria-modal="true" role="dialog">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

//       <div className="relative z-10 w-full max-w-3xl sm:mx-auto">
//         <div className="bg-white sm:rounded-xl sm:shadow-lg w-full h-[92vh] sm:h-auto max-h-[92vh] flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3 border-b">
//             <div>
//               <h3 className="text-lg font-semibold">{isEditing ? "Edit User" : "Add User"}</h3>
//               <p className="text-xs text-gray-500 mt-0.5">User details & access controls</p>
//             </div>

//             <button onClick={onClose} aria-label="Close" className="text-gray-600 hover:text-gray-900 p-2 rounded">
//               ✕
//             </button>
//           </div>

//           {/* Body */}
//           <div className="overflow-auto px-4 py-4 sm:py-6" style={{ paddingBottom: 112 }}>
//             {errors._global && <div className="mb-3 text-sm text-red-600">{errors._global}</div>}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Profile pic */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm mb-2">Profile Picture</label>

//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                   <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 border rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
//                     {avatarPreview ? (
//                       <img src={avatarPreview} alt="profile preview" className="object-cover w-full h-full" />
//                     ) : (
//                       <span className="text-xs text-gray-500">No Photo</span>
//                     )}
//                   </div>

//                   <div className="flex-1 w-full">
//                     <input type="file" accept="image/*" onChange={(e) => handleAvatarUpload(e.target.files?.[0])} className="block w-full text-sm text-gray-700" />
//                     <p className="text-xs text-gray-500 mt-2">PNG/JPG. Stored as Base64 (max 2MB).</p>
//                     {errors.profile_pic && <div className="text-xs text-red-600 mt-1">{errors.profile_pic}</div>}
//                   </div>
//                 </div>
//               </div>

//               {/* Base fields */}
//               {BASE_FIELDS.map((field) => {
//                 const spanBoth = field.colSpan === 2 ? "md:col-span-2" : "";
//                 const hasErr = !!errors[field.key];

//                 return (
//                   <div key={field.key} className={spanBoth}>
//                     <label className="block text-sm mb-1">
//                       {field.label}
//                       {field.required ? <span className="text-red-500"> *</span> : null}
//                     </label>

//                     <input
//                       name={field.key}
//                       value={form[field.key] ?? ""}
//                       onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
//                       placeholder={field.placeholder}
//                       className={inputClass(hasErr)}
//                     />

//                     {hasErr && <div className="text-xs text-red-600 mt-1">{errors[field.key]}</div>}
//                   </div>
//                 );
//               })}

//               {/* ✅ Password only for ADD */}
//               {!isEditing ? (
//                 <>
//                   <PasswordField
//                     name="password"
//                     label="Password"
//                     value={form.password}
//                     placeholder="Enter password"
//                     error={errors.password}
//                     required
//                     show={showPwd.password}
//                     inputClass={inputClass}
//                     onToggleShow={() => setShowPwd((p) => ({ ...p, password: !p.password }))}
//                     onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
//                   />

//                   <PasswordField
//                     name="confirm_password"
//                     label="Confirm Password"
//                     value={form.confirm_password}
//                     placeholder="Re-enter password"
//                     error={errors.confirm_password}
//                     required
//                     show={showPwd.confirm_password}
//                     inputClass={inputClass}
//                     onToggleShow={() =>
//                       setShowPwd((p) => ({ ...p, confirm_password: !p.confirm_password }))
//                     }
//                     onChange={(e) => setForm((p) => ({ ...p, confirm_password: e.target.value }))}
//                   />
//                 </>
//               ) : null}

//               {/* Role */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm mb-1">
//                   Role <span className="text-red-500">*</span>
//                 </label>

//                 <select
//                   name="role_id"
//                   value={form.role_id ?? ""}
//                   onChange={(e) => setForm((p) => ({ ...p, role_id: e.target.value }))}
//                   className={inputClass(!!errors.role_id)}
//                 >
//                   <option value="">Select role</option>
//                   {roleOptions.map((r) => (
//                     <option key={r.id} value={r.id}>
//                       {r.label}
//                     </option>
//                   ))}
//                 </select>

//                 {errors.role_id && <div className="text-xs text-red-600 mt-1">{errors.role_id}</div>}
//               </div>

//               {/* Company */}
//               {requiresCompany ? (
//                 <div className="md:col-span-2">
//                   <label className="block text-sm mb-1">
//                     Company <span className="text-red-500">*</span>
//                   </label>

//                   <select
//                     name="company_id"
//                     value={form.company_id ?? ""}
//                     onChange={(e) => setForm((p) => ({ ...p, company_id: e.target.value }))}
//                     className={inputClass(!!errors.company_id)}
//                     disabled={companiesListLoading}
//                   >
//                     <option value="">
//                       {companiesListLoading ? "Loading companies..." : "Select a company"}
//                     </option>
//                     {companyOptions.map((c) => (
//                       <option key={c.id} value={c.id}>
//                         {c.label}
//                       </option>
//                     ))}
//                   </select>

//                   {errors.company_id && <div className="text-xs text-red-600 mt-1">{errors.company_id}</div>}
//                 </div>
//               ) : null}

//               {/* Branch (only when required; NOT for company_admin) */}
//               {requiresBranch ? (
//                 <div className="md:col-span-2">
//                   <label className="block text-sm mb-1">
//                     Branch <span className="text-red-500">*</span>
//                   </label>

//                   <select
//                     name="branch_id"
//                     value={form.branch_id ?? ""}
//                     onChange={(e) => setForm((p) => ({ ...p, branch_id: e.target.value }))}
//                     className={inputClass(!!errors.branch_id)}
//                   >
//                     <option value="">Select a branch</option>
//                     {filteredBranchOptions.map((b) => (
//                       <option key={b.id} value={b.id}>
//                         {b.label}
//                       </option>
//                     ))}
//                   </select>

//                   {errors.branch_id && <div className="text-xs text-red-600 mt-1">{errors.branch_id}</div>}
//                 </div>
//               ) : null}

//               {/* Active / Blocked */}
//               <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
//                 <div className="flex items-center gap-3">
//                   <Toggle checked={!!form.is_active} onChange={(v) => setForm((p) => ({ ...p, is_active: v }))} color="green" />
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">Active</div>
//                     <div className="text-xs text-gray-500">Allow login & usage</div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Toggle checked={!!form.is_blocked} onChange={(v) => setForm((p) => ({ ...p, is_blocked: v }))} color="indigo" />
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">Blocked</div>
//                     <div className="text-xs text-gray-500">Disable access instantly</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div
//             className="absolute left-0 right-0 bottom-0 bg-white border-t px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
//             style={{ boxShadow: "0 -6px 18px rgba(0,0,0,0.06)" }}
//           >
//             <div className="flex items-center gap-3">
//               <button onClick={onClose} className="px-4 py-2 rounded border bg-white text-gray-700">
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className={`px-4 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-indigo-600"} min-w-[96px]`}
//               >
//                 {saving ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
