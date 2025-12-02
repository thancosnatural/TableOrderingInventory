// // src/components/rbac/RolePermissionForm.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import PropTypes from "prop-types";
// import {
//   ShieldCheck,
//   KeyRound,
//   Info,
//   Check,
//   X,
//   Lock,
//   Loader2,
// } from "lucide-react";
// import { createRole } from "@/services/authService";

// /**
//  * permissionsModel shape (expected):
//  * [
//  *   {
//  *     key: "manage_products",
//  *     label: "Products",
//  *     description: "Add products, variants, pricing.",
//  *     section: "Menu & Items",
//  *     actions: [
//  *       { key: "view", label: "View" },
//  *       { key: "create", label: "Create / Edit" },
//  *       { key: "delete", label: "Delete" },
//  *     ]
//  *   },
//  *   ...
//  * ]
//  */

// /**
//  * internal helper to build default perms state
//  */
// function buildDefaultPermsState(permissionsModel, initialPerms) {
//   const result = {};
//   (permissionsModel || []).forEach((perm) => {
//     const base = initialPerms?.[perm.key] || {};
//     const moduleEnabled = !!base.module;

//     const actionsState = {};
//     (perm.actions || []).forEach((a) => {
//       const existing = base.actions ? base.actions[a.key] : undefined;
//       actionsState[a.key] = existing ?? false;
//     });

//     result[perm.key] = {
//       module: moduleEnabled,
//       actions: actionsState,
//     };
//   });
//   return result;
// }

// export function RolePermissionForm({
//   mode = "create",
//   permissionsModel = [],
//   canEdit = false,
//   existingRoleKeys = [],
//   initialRoleConfig = null,
//   initialPerms = null,
//   onSubmit,
//   onCancel,
// }) {
//   const isEdit = mode === "edit";

//   // track whether user manually edited key (so we don't overwrite it on label change)
//   const [keyTouched, setKeyTouched] = useState(false);

//   // ---------- ROLE CONFIG STATE ----------
//   const [roleConfig, setRoleConfig] = useState(() => {
//     if (initialRoleConfig) {
//       return {
//         key: initialRoleConfig.key || "",
//         label: initialRoleConfig.label || "",
//         description: initialRoleConfig.description || "",
//       };
//     }
//     return {
//       key: "",
//       label: "",
//       description: "",
//     };
//   });

//   // ---------- PERMISSIONS STATE ----------
//   const [perms, setPerms] = useState(() =>
//     buildDefaultPermsState(permissionsModel, initialPerms)
//   );

//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   // auto-generate role key from label for CREATE mode
//   useEffect(() => {
//     if (isEdit) return;
//     if (keyTouched) return;
//     if (!roleConfig.label?.trim()) return;

//     const generated = roleConfig.label
//       .trim()
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/gi, "_")
//       .replace(/^_+|_+$/g, "");

//     setRoleConfig((prev) => ({ ...prev, key: generated }));
//   }, [roleConfig.label, isEdit, keyTouched]);

//   const sections = useMemo(() => {
//     const map = new Map();
//     (permissionsModel || []).forEach((p) => {
//       const sec = p.section || "General";
//       if (!map.has(sec)) map.set(sec, []);
//       map.get(sec).push(p);
//     });
//     return Array.from(map.entries()); // [ [sectionName, [perm, perm]], ... ]
//   }, [permissionsModel]);

//   function updateRoleField(field, value) {
//     setRoleConfig((prev) => ({ ...prev, [field]: value }));
//   }

//   function toggleModule(permKey) {
//     if (!canEdit) return;
//     setPerms((prev) => {
//       const current = prev[permKey] || { module: false, actions: {} };
//       const newModule = !current.module;
//       const newActions = { ...current.actions };

//       if (!newModule) {
//         // disabling module → disable all actions
//         Object.keys(newActions).forEach((k) => {
//           newActions[k] = false;
//         });
//       } else {
//         // enabling module – keep previous actions or at least ensure keys exist
//         const permDef = permissionsModel.find((p) => p.key === permKey);
//         if (permDef?.actions?.length) {
//           permDef.actions.forEach((a) => {
//             if (newActions[a.key] === undefined) newActions[a.key] = false;
//           });
//         }
//       }

//       return {
//         ...prev,
//         [permKey]: {
//           module: newModule,
//           actions: newActions,
//         },
//       };
//     });
//   }

//   function toggleAction(permKey, actionKey) {
//     if (!canEdit) return;
//     setPerms((prev) => {
//       const currPerm = prev[permKey] || { module: false, actions: {} };
//       const actions = { ...currPerm.actions };
//       const newValue = !actions[actionKey];

//       // if toggling an action on, ensure module is enabled
//       const newModule = newValue ? true : currPerm.module;

//       actions[actionKey] = newValue;

//       // if all actions off, optional: you may auto-disable module
//       const anyOn = Object.values(actions).some(Boolean);
//       const finalModule = anyOn ? newModule : false;

//       return {
//         ...prev,
//         [permKey]: {
//           module: finalModule,
//           actions,
//         },
//       };
//     });
//   }

//   function validate() {
//     setError("");
//     const key = (roleConfig.key || "").trim();
//     const label = (roleConfig.label || "").trim();

//     if (!label) {
//       setError("Role name is required.");
//       return false;
//     }
//     if (!key) {
//       setError("Role key is required.");
//       return false;
//     }
//     if (!/^[a-z0-9_]+$/i.test(key)) {
//       setError("Role key must contain only letters, numbers, and underscores.");
//       return false;
//     }

//     const lowerKey = key.toLowerCase();
//     const duplicates = (existingRoleKeys || []).some(
//       (k) => k.toLowerCase() === lowerKey && (!isEdit || k !== initialRoleConfig?.key)
//     );
//     if (!isEdit && duplicates) {
//       setError("A role with this key already exists.");
//       return false;
//     }

//     return true;
//   }

//   async function handleSubmit(e) {
//     e?.preventDefault();
//     if (!canEdit) return;
//     if (!validate()) return;

//     setSubmitting(true);
//     try {
//       const cleanConfig = {
//         key: roleConfig.key.trim(),
//         label: roleConfig.label.trim(),
//         description: roleConfig.description.trim(),
//       };

//       // await Promise.resolve(onSubmit?.(cleanConfig, perms));
//       const res = await createRole(cleanConfig, perms);
//       console.log("Role created:", res.data);

//       if (!isEdit) {
//         // reset for next create
//         setRoleConfig({ key: "", label: "", description: "" });
//         setPerms(buildDefaultPermsState(permissionsModel, null));
//         setKeyTouched(false);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   const disabled = !canEdit || submitting;

//   return (
//     <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
//       {/* Header */}
//       <div className="flex items-center justify-between gap-2">
//         <div>
//           <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//             <ShieldCheck size={16} />
//             {isEdit ? "Edit Role & Permissions" : "Create Role & Permissions"}
//           </h2>
//           <p className="text-[11px] text-slate-500">
//             Define role name and control access at module & action level.
//           </p>
//         </div>

//         {!canEdit && (
//           <div className="flex items-center gap-1 text-[11px] text-slate-500">
//             <Lock size={14} />
//             Read-only
//           </div>
//         )}
//       </div>

//       {/* Role meta form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-1 sm:grid-cols-[1.2fr,1fr] gap-3">
//           <div className="space-y-2">
//             <label className="block text-xs font-medium text-slate-600 mb-1">
//               Role Name *
//             </label>
//             <input
//               type="text"
//               value={roleConfig.label}
//               onChange={(e) => updateRoleField("label", e.target.value)}
//               placeholder="e.g. Kitchen Only, Auditor, Supervisor"
//               className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
//               disabled={!canEdit}
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
//               <span>Role Key *</span>
//               <span className="flex items-center gap-1 text-[10px] text-slate-400">
//                 <KeyRound size={11} />
//                 used in backend / API
//               </span>
//             </label>
//             <input
//               type="text"
//               value={roleConfig.key}
//               onChange={(e) => {
//                 setKeyTouched(true);
//                 updateRoleField("key", e.target.value.toLowerCase());
//               }}
//               placeholder="e.g. kitchen_staff, auditor"
//               className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
//               disabled={isEdit || !canEdit}
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <label className="block text-xs font-medium text-slate-600 mb-1">
//             Description (optional)
//           </label>
//           <textarea
//             value={roleConfig.description}
//             onChange={(e) =>
//               updateRoleField("description", e.target.value)
//             }
//             placeholder="Short note on what this role is supposed to do."
//             className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
//             rows={2}
//             disabled={!canEdit}
//           />
//         </div>

//         {/* Permission sections */}
//         <div className="mt-4 space-y-4">
//           <div className="flex items-center justify-between gap-2">
//             <div className="flex items-center gap-2 text-xs text-slate-600">
//               <Info size={13} className="text-slate-400" />
//               <span>
//                 Toggle entire module, or enable specific actions like view /
//                 create / update / delete.
//               </span>
//             </div>
//           </div>

//           <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
//             {sections.map(([sectionName, sectionPerms]) => (
//               <div key={sectionName} className="p-3 space-y-2">
//                 <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
//                   {sectionName}
//                 </div>

//                 <div className="space-y-1.5">
//                   {sectionPerms.map((perm) => {
//                     const state = perms[perm.key] || {
//                       module: false,
//                       actions: {},
//                     };
//                     const actions = perm.actions || [];
//                     const anyActionEnabled = actions.some(
//                       (a) => state.actions[a.key]
//                     );

//                     return (
//                       <div
//                         key={perm.key}
//                         className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md bg-slate-50 px-2.5 py-2"
//                       >
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 text-xs font-medium text-slate-900">
//                             <span>{perm.label}</span>
//                             <span className="text-[10px] text-slate-400">
//                               ({perm.key})
//                             </span>
//                           </div>
//                           {perm.description && (
//                             <div className="text-[11px] text-slate-500">
//                               {perm.description}
//                             </div>
//                           )}
//                         </div>

//                         <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                          
//                           <button
//                             type="button"
//                             onClick={() => toggleModule(perm.key)}
//                             disabled={!canEdit}
//                             className={
//                               "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border transition " +
//                               (state.module
//                                 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                                 : "bg-white text-slate-500 border-slate-200")
//                             }
//                           >
//                             {state.module ? (
//                               <Check size={11} />
//                             ) : (
//                               <X size={11} className="text-slate-400" />
//                             )}
//                             Module
//                           </button>

                          
//                           {actions.map((a) => {
//                             const active = !!state.actions[a.key];
//                             return (
//                               <button
//                                 key={a.key}
//                                 type="button"
//                                 onClick={() =>
//                                   toggleAction(perm.key, a.key)
//                                 }
//                                 disabled={!canEdit}
//                                 className={
//                                   "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border transition " +
//                                   (active
//                                     ? "bg-indigo-50 text-indigo-700 border-indigo-200"
//                                     : "bg-white text-slate-500 border-slate-200")
//                                 }
//                               >
//                                 {active ? (
//                                   <Check size={11} />
//                                 ) : (
//                                   <X size={11} className="text-slate-400" />
//                                 )}
//                                 {a.label}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>

        
//           {!Object.values(perms).some(
//             (p) => p.module || Object.values(p.actions || {}).some(Boolean)
//           ) && (
//             <div className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2 flex items-center gap-2">
//               <Info size={13} />
//               <span>
//                 No permissions selected yet. This role will exist but won&apos;t
//                 be able to access anything until you enable at least some
//                 modules or actions.
//               </span>
//             </div>
//           )}
//         </div>

      
//         {error && (
//           <div className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
//             {error}
//           </div>
//         )}

//         <div className="flex items-center justify-between gap-2 pt-1">
//           {isEdit && onCancel && (
//             <button
//               type="button"
//               onClick={onCancel}
//               className="inline-flex items-center justify-center px-3 py-1.5 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
//             >
//               Cancel
//             </button>
//           )}

//           <div className="flex-1" />

//           <button
//             type="submit"
//             disabled={disabled}
//             className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs hover:bg-slate-800 disabled:opacity-60"
//           >
//             {submitting ? (
//               <>
//                 <Loader2 size={14} className="animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <ShieldCheck size={14} />
//                 {isEdit ? "Save Role" : "Create Role"}
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// }

// RolePermissionForm.propTypes = {
//   mode: PropTypes.oneOf(["create", "edit"]),
//   permissionsModel: PropTypes.arrayOf(
//     PropTypes.shape({
//       key: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//       description: PropTypes.string,
//       section: PropTypes.string,
//       actions: PropTypes.arrayOf(
//         PropTypes.shape({
//           key: PropTypes.string.isRequired,
//           label: PropTypes.string.isRequired,
//         })
//       ),
//     })
//   ),
//   canEdit: PropTypes.bool,
//   existingRoleKeys: PropTypes.arrayOf(PropTypes.string),
//   initialRoleConfig: PropTypes.shape({
//     key: PropTypes.string,
//     label: PropTypes.string,
//     description: PropTypes.string,
//   }),
//   initialPerms: PropTypes.object,
//   onSubmit: PropTypes.func,
//   onCancel: PropTypes.func,
// };













// src/components/rbac/RoleForm.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ShieldCheck, KeyRound, Lock, Loader2 } from "lucide-react";
import { createRole, updateRole } from "@/services/authService";

/**
 * NOTE: Backend model:
 *   id:            BIGINT (auto)
 *   name:          STRING(100)  [unique, required]   -> API / internal key
 *   display_name:  STRING(120)  [optional]          -> human label
 *   description:   TEXT         [optional]
 *   is_system_role: BOOLEAN     [default: false]
 */

export function RoleForm({
  mode = "create",
  canEdit = false,
  existingRoleNames = [],        // array of existing `name` values
  initialRoleConfig = null,      // { id, name, display_name, description, is_system_role }
  onSubmit,                      // optional callback (cleanPayload, apiData)
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
