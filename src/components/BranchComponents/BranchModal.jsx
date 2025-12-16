// // src/components/BranchComponents/BranchModal.jsx
// import { useEffect, useMemo, useState, useCallback } from "react";
// import { useCompanies } from "@/context/CompaniesContext";
// import { useAuth } from "@/context/AuthContext";

// const EMPTY_FORM = {
//   company_id: "",
//   name: "",
//   phone: "",
//   city: "",
//   state: "",
//   area: "",
//   opening_time: "",
//   closing_time: "",
//   is_active: true,
//   is_live: true,
//   accepts_dine_in: true,
//   accepts_takeaway: true,
//   accepts_delivery: false,
// };

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

// export default function BranchModal({ open, onClose, branch, onSave }) {
//   const { user } = useAuth();

//   const roleString =
//     user?.role?.code || user?.role?.name || user?.role || user?.user_role || "";
//   const isSuperAdmin = String(roleString).toLowerCase() === "super_admin";

//   const {
//     companies,
//     companiesLoading: companiesListLoading,
//     fetchCompanies,
//     selectedCompany,
//     setSelectedCompany,
//   } = useCompanies();

//   const [form, setForm] = useState(EMPTY_FORM);
//   const [errors, setErrors] = useState({});
//   const [saving, setSaving] = useState(false);

//   // ---- Field config (loop-based) ----
//   const FIELD_CONFIG = useMemo(
//     () => [
//       { key: "name", label: "Outlet Name *", placeholder: "Thanco's Outlet - Indiranagar", required: true },
//       { key: "phone", label: "Phone", placeholder: "+91 9XXXXXXXXX" },
//       { key: "city", label: "City", placeholder: "Bengaluru" },
//       { key: "state", label: "State", placeholder: "Karnataka" },
//       { key: "area", label: "Area", placeholder: "Indiranagar / Koramangala", colSpan: 2 },

//       // timings (selectable)
//       { key: "opening_time", label: "Opening Time", type: "time" },
//       { key: "closing_time", label: "Closing Time", type: "time" },
//     ],
//     []
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

//   // ✅ fetch companies only for super admin, only when needed (prevents infinite calling)
//   useEffect(() => {
//     if (!open) return;
//     if (!isSuperAdmin) return;
//     if (Array.isArray(companies) && companies.length > 0) return;

//     fetchCompanies({ page: 1, perPage: 200 }).catch(() => {});
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, isSuperAdmin]);

//   // Sync incoming branch -> form
//   useEffect(() => {
//     if (!open) return;

//     if (branch) {
//       setForm({
//         company_id: branch.company_id ?? "",
//         name: branch.name ?? branch.outlet_name ?? "",
//         phone: branch.phone ?? "",
//         city: branch.city ?? "",
//         state: branch.state ?? "",
//         area: branch.area ?? "",
//         opening_time: branch.opening_time ? String(branch.opening_time).slice(0, 5) : "",
//         closing_time: branch.closing_time ? String(branch.closing_time).slice(0, 5) : "",
//         is_active: branch.is_active === undefined ? true : !!branch.is_active,
//         is_live: branch.is_live === undefined ? true : !!branch.is_live,
//         accepts_dine_in: branch.accepts_dine_in === undefined ? true : !!branch.accepts_dine_in,
//         accepts_takeaway: branch.accepts_takeaway === undefined ? true : !!branch.accepts_takeaway,
//         accepts_delivery: branch.accepts_delivery === undefined ? false : !!branch.accepts_delivery,
//       });
//     } else {
//       setForm(EMPTY_FORM);
//     }

//     setErrors({});
//   }, [branch, open]);

//   // Non-super admin: force company_id from selectedCompany
//   useEffect(() => {
//     if (!open) return;
//     if (isSuperAdmin) return;

//     if (selectedCompany?.id) {
//       setForm((p) => ({ ...p, company_id: Number(selectedCompany.id) }));
//     }
//   }, [open, isSuperAdmin, selectedCompany?.id]);

//   // Prevent background scroll
//   useEffect(() => {
//     if (!open) return;
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, [open]);

//   // Close on ESC
//   useEffect(() => {
//     if (!open) return;
//     const handler = (e) => e.key === "Escape" && onClose?.();
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [open, onClose]);

//   const validate = useCallback(
//     (payload) => {
//       const e = {};

//       if (isSuperAdmin) {
//         if (!String(payload.company_id ?? "").trim()) e.company_id = "Please select a company.";
//       } else {
//         if (!selectedCompany?.id) e.company_id = "No default company selected. Please select a company first.";
//       }

//       if (!payload.name?.trim()) e.name = "Outlet name is required.";

//       if (payload.opening_time && !/^\d{2}:\d{2}$/.test(payload.opening_time))
//         e.opening_time = "Invalid time (HH:mm).";
//       if (payload.closing_time && !/^\d{2}:\d{2}$/.test(payload.closing_time))
//         e.closing_time = "Invalid time (HH:mm).";

//       return e;
//     },
//     [isSuperAdmin, selectedCompany?.id]
//   );

//   const handleSave = async () => {
//     const finalCompanyId = isSuperAdmin ? form.company_id : selectedCompany?.id;

//     // ✅ No lat/lng here. Backend updates.
//     const payload = {
//       company_id: finalCompanyId ? Number(finalCompanyId) : "",
//       name: String(form.name || "").trim(),
//       phone: form.phone ? String(form.phone).trim() : "",
//       city: form.city ? String(form.city).trim() : "",
//       state: form.state ? String(form.state).trim() : "",
//       area: form.area ? String(form.area).trim() : "",
//       opening_time: form.opening_time ? String(form.opening_time).slice(0, 5) : "",
//       closing_time: form.closing_time ? String(form.closing_time).slice(0, 5) : "",
//       is_active: !!form.is_active,
//       is_live: !!form.is_live,
//       accepts_dine_in: !!form.accepts_dine_in,
//       accepts_takeaway: !!form.accepts_takeaway,
//       accepts_delivery: !!form.accepts_delivery,
//     };

//     const v = validate(payload);
//     if (Object.keys(v).length > 0) {
//       setErrors(v);
//       const firstKey = Object.keys(v)[0];
//       const el = document.querySelector(`[name="${firstKey}"]`);
//       if (el) el.focus();
//       return;
//     }

//     try {
//       setSaving(true);
//       await onSave(payload);
//       setSaving(false);
//       // onClose?.();
//     } catch (err) {
//       setSaving(false);
//       setErrors({ _global: err?.message || "Failed to save outlet" });
//       console.error("BranchModal save error:", err);
//     }
//   };

//   if (!open) return null;

//   const inputClass = (hasError) =>
//     `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
//       hasError ? "border-red-500" : "border-gray-200"
//     }`;

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" aria-modal="true" role="dialog">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

//       <div className="relative z-10 w-full max-w-4xl sm:mx-auto">
//         <div className="bg-white sm:rounded-xl sm:shadow-lg w-full h-[92vh] sm:h-auto max-h-[92vh] flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3 border-b">
//             <div>
//               <h3 className="text-lg font-semibold">{branch ? "Edit Outlet" : "Add Outlet"}</h3>
//               <p className="text-xs text-gray-500 mt-0.5">Outlet setup & ordering controls</p>
//             </div>
//             <button onClick={onClose} aria-label="Close" className="text-gray-600 hover:text-gray-900 p-2 rounded">
//               ✕
//             </button>
//           </div>

//           {/* Body */}
//           <div className="overflow-auto px-4 py-4 sm:py-6" style={{ paddingBottom: 112 }}>
//             {errors._global && <div className="mb-3 text-sm text-red-600">{errors._global}</div>}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Company selection */}
//               {isSuperAdmin ? (
//                 <div className="md:col-span-2">
//                   <label className="block text-sm mb-1">
//                     Company <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="company_id"
//                     value={form.company_id ?? ""}
//                     onChange={(e) => {
//                       const nextId = e.target.value;
//                       setForm((p) => ({ ...p, company_id: nextId }));
//                       const selected = (Array.isArray(companies) ? companies : []).find(
//                         (c) => String(c?.id) === String(nextId)
//                       );
//                       if (selected) setSelectedCompany?.(selected);
//                     }}
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
//               ) : (
//                 <div className="md:col-span-2">
//                   <label className="block text-sm mb-1">Company</label>
//                   <input
//                     readOnly
//                     value={
//                       selectedCompany?.name
//                         ? `${selectedCompany.name}${selectedCompany.company_code ? ` • ${selectedCompany.company_code}` : ""}`
//                         : ""
//                     }
//                     className={`w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-700 ${
//                       errors.company_id ? "border-red-500" : "border-gray-200"
//                     }`}
//                     placeholder="Company will be auto-selected"
//                   />
//                   {errors.company_id && <div className="text-xs text-red-600 mt-1">{errors.company_id}</div>}
//                 </div>
//               )}

//               {/* Loop fields (2 per row by default) */}
//               {FIELD_CONFIG.map((f) => {
//                 const span = f.colSpan === 2 ? "md:col-span-2" : "";
//                 const hasErr = !!errors[f.key];

//                 return (
//                   <div key={f.key} className={span}>
//                     <label className="block text-sm mb-1">
//                       {f.label}
//                       {f.required ? <span className="text-red-500"> *</span> : null}
//                     </label>

//                     <input
//                       type={f.type || "text"}
//                       name={f.key}
//                       value={form[f.key] ?? ""}
//                       onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
//                       placeholder={f.placeholder}
//                       className={inputClass(hasErr)}
//                     />

//                     {hasErr && <div className="text-xs text-red-600 mt-1">{errors[f.key]}</div>}
//                   </div>
//                 );
//               })}

//               {/* Status toggles */}
//               <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
//                 <div className="flex items-center gap-3">
//                   <Toggle checked={!!form.is_active} onChange={(v) => setForm((p) => ({ ...p, is_active: v }))} color="green" />
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">Active</div>
//                     <div className="text-xs text-gray-500">Allow staff access for this outlet</div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Toggle checked={!!form.is_live} onChange={(v) => setForm((p) => ({ ...p, is_live: v }))} color="indigo" />
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">Live</div>
//                     <div className="text-xs text-gray-500">Turn ordering ON/OFF instantly</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Order modes */}
//               <div className="md:col-span-2">
//                 <div className="text-sm font-medium text-gray-900 mb-2">Order Modes</div>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <div className="flex items-center gap-3">
//                     <Toggle checked={!!form.accepts_dine_in} onChange={(v) => setForm((p) => ({ ...p, accepts_dine_in: v }))} />
//                     <div className="text-sm text-gray-800">Dine-in</div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <Toggle checked={!!form.accepts_takeaway} onChange={(v) => setForm((p) => ({ ...p, accepts_takeaway: v }))} />
//                     <div className="text-sm text-gray-800">Takeaway</div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <Toggle checked={!!form.accepts_delivery} onChange={(v) => setForm((p) => ({ ...p, accepts_delivery: v }))} />
//                     <div className="text-sm text-gray-800">Delivery</div>
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
//             <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600">
//               <div>
//                 Active: <span className="font-medium ml-1">{form.is_active ? "Yes" : "No"}</span>
//               </div>
//               <div>
//                 Live: <span className="font-medium ml-1">{form.is_live ? "Yes" : "No"}</span>
//               </div>
//             </div>

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















// // src/components/BranchComponents/BranchModal.jsx
// import { useEffect, useMemo, useState, useCallback } from "react";
// import { useCompanies } from "@/context/CompaniesContext";
// import { useAuth } from "@/context/AuthContext";

// const EMPTY_FORM = {
//   company_id: "",
//   name: "",
//   phone: "",
//   city: "",
//   state: "",
//   area: "",
//   opening_time: "",
//   closing_time: "",
//   is_active: true,
//   is_live: true,
//   accepts_dine_in: true,
//   accepts_takeaway: true,
//   accepts_delivery: false,
// };

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

// export default function BranchModal({ open, onClose, branch, onSave }) {
//   const { user } = useAuth();

//   const roleString =
//     user?.role?.code || user?.role?.name || user?.role || user?.user_role || "";
//   const isSuperAdmin = String(roleString).toLowerCase() === "super_admin";

//   const isEditing = !!branch?.id;

//   const {
//     companies,
//     companiesLoading: companiesListLoading,
//     fetchCompanies,
//     selectedCompany,
//     setSelectedCompany,
//   } = useCompanies();

//   const [form, setForm] = useState(EMPTY_FORM);
//   const [errors, setErrors] = useState({});
//   const [saving, setSaving] = useState(false);

//   // ---- Field config (loop-based) ----
//   const FIELD_CONFIG = useMemo(
//     () => [
//       { key: "name", label: "Outlet Name *", placeholder: "Thanco's Outlet - Indiranagar", required: true },
//       { key: "phone", label: "Phone", placeholder: "+91 9XXXXXXXXX" },
//       { key: "city", label: "City", placeholder: "Bengaluru" },
//       { key: "state", label: "State", placeholder: "Karnataka" },
//       { key: "area", label: "Area", placeholder: "Indiranagar / Koramangala", colSpan: 2 },
//       { key: "opening_time", label: "Opening Time", type: "time" },
//       { key: "closing_time", label: "Closing Time", type: "time" },
//     ],
//     []
//   );

//   const companyOptions = useMemo(() => {
//     const list = Array.isArray(companies) ? companies : [];
//     return list
//       .filter((c) => c && c.id)
//       .map((c) => ({
//         id: Number(c.id),
//         label: `${c.name ?? "Company"}${c.company_code ? ` • ${c.company_code}` : ""}`,
//         raw: c,
//       }));
//   }, [companies]);

//   const selectedCompanyLabel = useMemo(() => {
//     // While editing, show company from branch (authoritative)
//     if (isEditing) {
//       const match = (Array.isArray(companies) ? companies : []).find(
//         (c) => String(c?.id) === String(form.company_id)
//       );
//       const name = match?.name || branch?.company?.name || "";
//       const code = match?.company_code || branch?.company?.company_code || "";
//       return name ? `${name}${code ? ` • ${code}` : ""}` : String(form.company_id || "");
//     }

//     // While creating, show selectedCompany (for non-super admin read-only display)
//     const name = selectedCompany?.name || "";
//     const code = selectedCompany?.company_code || "";
//     return name ? `${name}${code ? ` • ${code}` : ""}` : "";
//   }, [isEditing, companies, form.company_id, branch, selectedCompany]);

//   // ✅ fetch companies only when modal opens & we need list (super_admin create OR to resolve labels)
//   useEffect(() => {
//     if (!open) return;

//     const needCompanies =
//       (isSuperAdmin && !isEditing) || // dropdown needed
//       true; // also useful for label resolving; safe because we guard against already-loaded

//     if (!needCompanies) return;
//     if (Array.isArray(companies) && companies.length > 0) return;

//     fetchCompanies({ page: 1, perPage: 200 }).catch(() => {});
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, isSuperAdmin, isEditing]);

//   // Sync incoming branch -> form
//   useEffect(() => {
//     if (!open) return;

//     if (branch) {
//       setForm({
//         company_id: branch.company_id ?? "",
//         name: branch.name ?? branch.outlet_name ?? "",
//         phone: branch.phone ?? "",
//         city: branch.city ?? "",
//         state: branch.state ?? "",
//         area: branch.area ?? "",
//         opening_time: branch.opening_time ? String(branch.opening_time).slice(0, 5) : "",
//         closing_time: branch.closing_time ? String(branch.closing_time).slice(0, 5) : "",
//         is_active: branch.is_active === undefined ? true : !!branch.is_active,
//         is_live: branch.is_live === undefined ? true : !!branch.is_live,
//         accepts_dine_in: branch.accepts_dine_in === undefined ? true : !!branch.accepts_dine_in,
//         accepts_takeaway: branch.accepts_takeaway === undefined ? true : !!branch.accepts_takeaway,
//         accepts_delivery: branch.accepts_delivery === undefined ? false : !!branch.accepts_delivery,
//       });

//       // keep global selectedCompany in sync (helpful for other screens)
//       const match = (Array.isArray(companies) ? companies : []).find(
//         (c) => String(c?.id) === String(branch.company_id)
//       );
//       if (match) setSelectedCompany?.(match);
//     } else {
//       setForm(EMPTY_FORM);
//     }

//     setErrors({});
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [branch, open]);

//   // Non-super admin (create): force company_id from selectedCompany
//   useEffect(() => {
//     if (!open) return;
//     if (isSuperAdmin) return;
//     if (isEditing) return; // during edit, do not override company_id

//     if (selectedCompany?.id) {
//       setForm((p) => ({ ...p, company_id: Number(selectedCompany.id) }));
//     }
//   }, [open, isSuperAdmin, isEditing, selectedCompany?.id]);

//   // Prevent background scroll
//   useEffect(() => {
//     if (!open) return;
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, [open]);

//   // Close on ESC
//   useEffect(() => {
//     if (!open) return;
//     const handler = (e) => e.key === "Escape" && onClose?.();
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [open, onClose]);

//   const validate = useCallback(
//     (payload) => {
//       const e = {};

//       // Company is required always
//       if (!String(payload.company_id ?? "").trim()) e.company_id = "Company is required.";

//       if (!payload.name?.trim()) e.name = "Outlet name is required.";

//       if (payload.opening_time && !/^\d{2}:\d{2}$/.test(payload.opening_time))
//         e.opening_time = "Invalid time (HH:mm).";
//       if (payload.closing_time && !/^\d{2}:\d{2}$/.test(payload.closing_time))
//         e.closing_time = "Invalid time (HH:mm).";

//       return e;
//     },
//     []
//   );

//   const handleSave = async () => {
//     // ✅ company_id logic:
//     // - editing: do NOT allow changes; use existing form.company_id (from branch)
//     // - creating:
//     //    - super_admin: use chosen form.company_id
//     //    - others: use selectedCompany.id
//     const companyIdToUse = isEditing
//       ? form.company_id
//       : isSuperAdmin
//       ? form.company_id
//       : selectedCompany?.id;

//     const payload = {
//       company_id: companyIdToUse ? Number(companyIdToUse) : "",
//       name: String(form.name || "").trim(),
//       phone: form.phone ? String(form.phone).trim() : "",
//       city: form.city ? String(form.city).trim() : "",
//       state: form.state ? String(form.state).trim() : "",
//       area: form.area ? String(form.area).trim() : "",
//       opening_time: form.opening_time ? String(form.opening_time).slice(0, 5) : "",
//       closing_time: form.closing_time ? String(form.closing_time).slice(0, 5) : "",
//       is_active: !!form.is_active,
//       is_live: !!form.is_live,
//       accepts_dine_in: !!form.accepts_dine_in,
//       accepts_takeaway: !!form.accepts_takeaway,
//       accepts_delivery: !!form.accepts_delivery,
//     };

//     const v = validate(payload);
//     if (Object.keys(v).length > 0) {
//       setErrors(v);
//       const firstKey = Object.keys(v)[0];
//       const el = document.querySelector(`[name="${firstKey}"]`);
//       if (el) el.focus();
//       return;
//     }

//     try {
//       setSaving(true);
//       const resp = await onSave(payload);
//       setSaving(false);

//       // ✅ keep modal open on failure (context returns null/false)
//       if (!resp) return;
//     } catch (err) {
//       setSaving(false);
//       setErrors({ _global: err?.message || "Failed to save outlet" });
//       console.error("BranchModal save error:", err);
//     }
//   };

//   if (!open) return null;

//   const inputClass = (hasError) =>
//     `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
//       hasError ? "border-red-500" : "border-gray-200"
//     }`;

//   // ✅ company selectable ONLY when:
//   // - super_admin
//   // - NOT editing
//   const canSelectCompany = isSuperAdmin && !isEditing;

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" aria-modal="true" role="dialog">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

//       <div className="relative z-10 w-full max-w-4xl sm:mx-auto">
//         <div className="bg-white sm:rounded-xl sm:shadow-lg w-full h-[92vh] sm:h-auto max-h-[92vh] flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3 border-b">
//             <div>
//               <h3 className="text-lg font-semibold">{isEditing ? "Edit Outlet" : "Add Outlet"}</h3>
//               <p className="text-xs text-gray-500 mt-0.5">Outlet setup & ordering controls</p>
//             </div>
//             <button onClick={onClose} aria-label="Close" className="text-gray-600 hover:text-gray-900 p-2 rounded">
//               ✕
//             </button>
//           </div>

//           {/* Body */}
//           <div className="overflow-auto px-4 py-4 sm:py-6" style={{ paddingBottom: 112 }}>
//             {errors._global && <div className="mb-3 text-sm text-red-600">{errors._global}</div>}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Company */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm mb-1">
//                   Company <span className="text-red-500">*</span>
//                 </label>

//                 {canSelectCompany ? (
//                   <select
//                     name="company_id"
//                     value={form.company_id ?? ""}
//                     onChange={(e) => {
//                       const nextId = e.target.value;
//                       setForm((p) => ({ ...p, company_id: nextId }));

//                       const selected = companyOptions.find((x) => String(x.id) === String(nextId))?.raw;
//                       if (selected) setSelectedCompany?.(selected);
//                     }}
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
//                 ) : (
//                   <input
//                     readOnly
//                     name="company_id"
//                     value={selectedCompanyLabel}
//                     className={`w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-700 ${
//                       errors.company_id ? "border-red-500" : "border-gray-200"
//                     }`}
//                     placeholder="Company will be auto-selected"
//                   />
//                 )}

//                 {errors.company_id && <div className="text-xs text-red-600 mt-1">{errors.company_id}</div>}
//                 {isEditing && (
//                   <div className="text-[11px] text-gray-500 mt-1">Company can’t be changed while editing an outlet.</div>
//                 )}
//               </div>

//               {/* Loop fields (2 per row by default) */}
//               {FIELD_CONFIG.map((f) => {
//                 const span = f.colSpan === 2 ? "md:col-span-2" : "";
//                 const hasErr = !!errors[f.key];

//                 return (
//                   <div key={f.key} className={span}>
//                     <label className="block text-sm mb-1">
//                       {f.label}
//                       {f.required ? <span className="text-red-500"> *</span> : null}
//                     </label>

//                     <input
//                       type={f.type || "text"}
//                       name={f.key}
//                       value={form[f.key] ?? ""}
//                       onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
//                       placeholder={f.placeholder}
//                       className={inputClass(hasErr)}
//                     />

//                     {hasErr && <div className="text-xs text-red-600 mt-1">{errors[f.key]}</div>}
//                   </div>
//                 );
//               })}

//               {/* Status toggles */}
//               <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
//                 <div className="flex items-center gap-3">
//                   <Toggle checked={!!form.is_active} onChange={(v) => setForm((p) => ({ ...p, is_active: v }))} color="green" />
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">Active</div>
//                     <div className="text-xs text-gray-500">Allow staff access for this outlet</div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Toggle checked={!!form.is_live} onChange={(v) => setForm((p) => ({ ...p, is_live: v }))} color="indigo" />
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">Live</div>
//                     <div className="text-xs text-gray-500">Turn ordering ON/OFF instantly</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Order modes */}
//               <div className="md:col-span-2">
//                 <div className="text-sm font-medium text-gray-900 mb-2">Order Modes</div>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <div className="flex items-center gap-3">
//                     <Toggle checked={!!form.accepts_dine_in} onChange={(v) => setForm((p) => ({ ...p, accepts_dine_in: v }))} />
//                     <div className="text-sm text-gray-800">Dine-in</div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <Toggle checked={!!form.accepts_takeaway} onChange={(v) => setForm((p) => ({ ...p, accepts_takeaway: v }))} />
//                     <div className="text-sm text-gray-800">Takeaway</div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <Toggle checked={!!form.accepts_delivery} onChange={(v) => setForm((p) => ({ ...p, accepts_delivery: v }))} />
//                     <div className="text-sm text-gray-800">Delivery</div>
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
//             <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600">
//               <div>
//                 Active: <span className="font-medium ml-1">{form.is_active ? "Yes" : "No"}</span>
//               </div>
//               <div>
//                 Live: <span className="font-medium ml-1">{form.is_live ? "Yes" : "No"}</span>
//               </div>
//             </div>

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


















import React, { useMemo, useCallback } from "react";
import EntityModal from "../PageSections/PageEntityModal";
import { useCompanies } from "@/context/CompaniesContext";
import { useAuth } from "@/context/AuthContext";

const EMPTY_FORM = {
  company_id: "",
  name: "",
  phone: "",
  city: "",
  state: "",
  area: "",
  opening_time: "",
  closing_time: "",
  is_active: true,
  is_live: true,
  accepts_dine_in: true,
  accepts_takeaway: true,
  accepts_delivery: false,
};

export default function BranchModal({ open, onClose, branch, onSave }) {
  const { user } = useAuth();

  const roleString =
    user?.role?.code || user?.role?.name || user?.role || "";
  const isSuperAdmin = String(roleString).toLowerCase() === "super_admin";

  const isEditing = !!branch?.id;

  const {
    companies,
    companiesLoading,
    selectedCompany,
    setSelectedCompany,
  } = useCompanies();

  /* ------------------ Fields ------------------ */
  const fields = useMemo(
    () => [
      {
        key: "company_id",
        label: "Company",
        type: "select",
        required: true,
        colSpan: 2,
        options: (companies || []).map((c) => ({
          value: c.id,
          label: `${c.name}${c.company_code ? ` • ${c.company_code}` : ""}`,
        })),
        disabled: !isSuperAdmin || isEditing,
        placeholder: companiesLoading
          ? "Loading companies..."
          : "Select company",
      },
      {
        key: "name",
        label: "Outlet Name",
        placeholder: "Thanco's Outlet - Indiranagar",
        required: true,
      },
      { key: "phone", label: "Phone", placeholder: "+91 9XXXXXXXXX" },
      { key: "city", label: "City", placeholder: "Bengaluru" },
      { key: "state", label: "State", placeholder: "Karnataka" },
      {
        key: "area",
        label: "Area",
        placeholder: "Indiranagar / Koramangala",
        colSpan: 2,
      },
      { key: "opening_time", label: "Opening Time", type: "time" },
      { key: "closing_time", label: "Closing Time", type: "time" },
    ],
    [companies, companiesLoading, isSuperAdmin, isEditing]
  );

  /* ------------------ Toggles ------------------ */
  const toggles = useMemo(
    () => [
      {
        key: "is_active",
        title: "Active",
        description: "Allow staff access for this outlet",
        color: "green",
      },
      {
        key: "is_live",
        title: "Live",
        description: "Turn ordering ON / OFF instantly",
        color: "indigo",
      },
      // {
      //   key: "accepts_dine_in",
      //   title: "Dine-in",
      //   description: "Allow dine-in orders",
      // },
      {
        key: "accepts_takeaway",
        title: "Takeaway",
        description: "Allow takeaway orders",
      },
      {
        key: "accepts_delivery",
        title: "Delivery",
        description: "Allow delivery orders",
      },
    ],
    []
  );

  /* ------------------ Validation ------------------ */
  const validate = useCallback((payload) => {
    const e = {};

    if (!payload.company_id) e.company_id = "Company is required.";
    if (!payload.name?.trim()) e.name = "Outlet name is required.";

    if (
      payload.opening_time &&
      !/^\d{2}:\d{2}$/.test(payload.opening_time)
    ) {
      e.opening_time = "Invalid time (HH:mm)";
    }

    if (
      payload.closing_time &&
      !/^\d{2}:\d{2}$/.test(payload.closing_time)
    ) {
      e.closing_time = "Invalid time (HH:mm)";
    }

    return e;
  }, []);

  /* ------------------ Initial Data ------------------ */
  const initialData = branch
    ? {
        ...branch,
        company_id: branch.company_id ?? selectedCompany?.id ?? "",
        is_active:
          branch.is_active === undefined ? true : !!branch.is_active,
        is_live: branch.is_live === undefined ? true : !!branch.is_live,
        accepts_dine_in:
          branch.accepts_dine_in === undefined
            ? true
            : !!branch.accepts_dine_in,
        accepts_takeaway:
          branch.accepts_takeaway === undefined
            ? true
            : !!branch.accepts_takeaway,
        accepts_delivery:
          branch.accepts_delivery === undefined
            ? false
            : !!branch.accepts_delivery,
        opening_time: branch.opening_time
          ? String(branch.opening_time).slice(0, 5)
          : "",
        closing_time: branch.closing_time
          ? String(branch.closing_time).slice(0, 5)
          : "",
      }
    : null;

  /* ------------------ Save Handler ------------------ */
  const handleSave = async (payload) => {
    const finalPayload = {
      ...payload,
      company_id: isEditing
        ? payload.company_id
        : isSuperAdmin
        ? payload.company_id
        : selectedCompany?.id,
    };

    return onSave(finalPayload);
  };

  return (
    <EntityModal
      open={open}
      onClose={onClose}
      emptyForm={EMPTY_FORM}
      initialData={initialData}
      titleCreate="Add Outlet"
      titleEdit="Edit Outlet"
      ariaLabelCreate="Add Outlet"
      ariaLabelEdit="Edit Outlet"
      fields={fields}
      toggles={toggles}
      validate={validate}
      onSave={handleSave}
      onFieldChange={(key, value) => {
        if (key === "company_id") {
          const found = companies.find(
            (c) => String(c.id) === String(value)
          );
          if (found) setSelectedCompany(found);
        }
      }}
      footerLeftRender={({ form }) => (
        <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600">
          <div>
            Active:{" "}
            <span className="font-medium ml-1">
              {form.is_active ? "Yes" : "No"}
            </span>
          </div>
          <div>
            Live:{" "}
            <span className="font-medium ml-1">
              {form.is_live ? "Yes" : "No"}
            </span>
          </div>
        </div>
      )}
    />
  );
}
