// import React, { useEffect, useMemo, useState } from "react";
// import { Plus, Search, Edit3, Trash2, Check, X, Save } from "lucide-react";
// import { Card } from "@/components/ReusableComponents";




// export function Modal({ open, onClose, title, children }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
//       <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />
//       <div className="relative z-10 w-full sm:max-w-2xl mx-auto">
//         <div className="bg-white rounded-t-lg sm:rounded-2xl shadow overflow-hidden">
//           <div className="flex items-center justify-between px-4 py-3 border-b">
//             <h3 className="text-lg font-semibold">{title}</h3>
//             <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={18} /></button>
//           </div>
//           <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------------- Helpers ----------------
// function uid(prefix = "id") {
//   return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
// }

// // Simple policy evaluator for demo: checks if subjectAttrs satisfy policy conditions
// function evaluatePolicy(policy, subject, resource, action, context = {}) {
//   // policy example: { effect: 'allow'|'deny', conditions: [{ path: 'department', op: 'equals', value: 'HR' }], actions: ['read'] }
//   const matchActions = Array.isArray(policy.actions) ? policy.actions.includes(action) : policy.actions === action;
//   if (!matchActions) return false;
//   const conds = policy.conditions || [];
//   const allMatch = conds.every((c) => {
//     const val = subject[c.path] ?? resource[c.path] ?? context[c.path];
//     if (c.op === 'equals') return String(val) === String(c.value);
//     if (c.op === 'in') return Array.isArray(c.value) ? c.value.includes(val) : String(c.value).split(',').includes(String(val));
//     if (c.op === 'gt') return Number(val) > Number(c.value);
//     if (c.op === 'lt') return Number(val) < Number(c.value);
//     return false;
//   });
//   return allMatch && policy.effect === 'allow';
// }

// // ---------------- Small Components ----------------
// export function KeyValueRow({ label, value, onChange }) {
//   return (
//     <div className="flex items-center gap-2">
//       <input value={label} onChange={(e) => onChange('key', e.target.value)} className="w-1/3 rounded-md border px-2 py-1 text-sm" />
//       <input value={value} onChange={(e) => onChange('value', e.target.value)} className="flex-1 rounded-md border px-2 py-1 text-sm" />
//     </div>
//   );
// }

// // ---------------- Sections ----------------
// function RolesSection({ roles, setRoles }) {
//   const [open, setOpen] = useState(false);
//   const [name, setName] = useState("");

//   function addRole() {
//     if (!name.trim()) return;
//     setRoles((r) => [...r, { id: uid('role'), name: name.trim() }]);
//     setName("");
//     setOpen(false);
//   }

//   function removeRole(id) {
//     setRoles((r) => r.filter((x) => x.id !== id));
//   }

//   return (
//     <Card>
//       <div className="flex items-center justify-between mb-3">
//         <div className="text-sm font-medium">Roles</div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-yellow-500 text-white text-sm"><Plus size={14}/> Add</button>
//         </div>
//       </div>

//       <div className="space-y-2">
//         {roles.map((r) => (
//           <div key={r.id} className="flex items-center justify-between">
//             <div className="text-sm">{r.name}</div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => navigator.clipboard?.writeText(r.id)} className="text-xs text-gray-400">ID</button>
//               <button onClick={() => removeRole(r.id)} className="text-red-500"><Trash2 size={16} /></button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Modal open={open} onClose={() => setOpen(false)} title="Add Role">
//         <div className="space-y-3">
//           <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Role name (e.g. manager)" className="block w-full rounded-md border px-3 py-2" />
//           <div className="flex justify-end gap-2">
//             <button onClick={() => setOpen(false)} className="px-3 py-2 rounded bg-white border">Cancel</button>
//             <button onClick={addRole} className="px-3 py-2 rounded bg-yellow-500 text-white">Create</button>
//           </div>
//         </div>
//       </Modal>
//     </Card>
//   );
// }

// function AttributesSection({ attributes, setAttributes }) {
//   const [k, setK] = useState("");
//   const [v, setV] = useState("");

//   function addAttr() {
//     if (!k.trim()) return;
//     setAttributes((s) => [...s, { id: uid('attr'), key: k.trim(), type: 'string', description: '', values: v ? v.split(',').map(s=>s.trim()) : [] }]);
//     setK(''); setV('');
//   }

//   function removeAttr(id) { setAttributes((s)=>s.filter(x => x.id !== id)); }

//   return (
//     <Card>
//       <div className="flex items-center justify-between mb-3">
//         <div className="text-sm font-medium">Attributes</div>
//       </div>

//       <div className="space-y-2">
//         {attributes.map(a => (
//           <div key={a.id} className="flex items-center justify-between gap-2">
//             <div>
//               <div className="text-sm font-medium">{a.key}</div>
//               <div className="text-xs text-gray-400">{a.values?.slice(0,3).join(', ')}</div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => navigator.clipboard?.writeText(a.key)} className="text-xs text-gray-400">copy</button>
//               <button onClick={() => removeAttr(a.id)} className="text-red-500"><Trash2 size={16} /></button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
//         <input value={k} onChange={(e)=>setK(e.target.value)} placeholder="attribute key (dept)" className="rounded-md border px-2 py-1" />
//         <input value={v} onChange={(e)=>setV(e.target.value)} placeholder="possible values (comma)" className="rounded-md border px-2 py-1" />
//         <button onClick={addAttr} className="px-3 py-1 rounded bg-white border">Add</button>
//       </div>
//     </Card>
//   );
// }

// function FeaturesSection({ roles = [], permissions = {}, setPermissions = () => {} }) {

//   const sections = [
//     {
//       key: 'employees',
//       title: 'Employees',
//       features: [
//         { key: 'employee_record', label: 'Employee record', actions: ['view','create','edit','delete'] },
//         { key: 'employee_profile', label: 'Profile update', actions: ['view','edit'] },
//       ],
//     },
//     {
//       key: 'attendance',
//       title: 'Attendance',
//       features: [
//         { key: 'attendance_view', label: 'View attendance', actions: ['view','export'] },
//         { key: 'attendance_mark', label: 'Mark attendance', actions: ['create','edit'] },
//       ],
//     },
//     {
//       key: 'payroll',
//       title: 'Payroll',
//       features: [
//         { key: 'payroll_view', label: 'View payroll', actions: ['view','export'] },
//         { key: 'payroll_run', label: 'Run payroll', actions: ['create'] },
//       ],
//     },
//     {
//       key: 'leave',
//       title: 'Leave',
//       features: [
//         { key: 'leave_request', label: 'Request leave', actions: ['create','view'] },
//         { key: 'leave_approve', label: 'Approve/reject', actions: ['edit'] },
//       ],
//     },
//     {
//       key: 'reports',
//       title: 'Reports',
//       features: [
//         { key: 'reports_view', label: 'View reports', actions: ['view','export'] },
//       ],
//     },
//     {
//       key: 'admin',
//       title: 'Admin',
//       features: [
//         { key: 'manage_roles', label: 'Manage roles', actions: ['view','create','edit','delete'] },
//         { key: 'manage_policies', label: 'Manage policies', actions: ['view','create','edit','delete'] },
//       ],
//     },
//   ];

//   function toggle(featureKey, action, roleId) {
//     const next = JSON.parse(JSON.stringify(permissions || {}));
//     if (!next[featureKey]) next[featureKey] = {};
//     if (!next[featureKey][action]) next[featureKey][action] = {};
//     next[featureKey][action][roleId] = !next[featureKey][action][roleId];
//     setPermissions(next);
//   }

//   function isChecked(featureKey, action, roleId) {
//     return !!(permissions && permissions[featureKey] && permissions[featureKey][action] && permissions[featureKey][action][roleId]);
//   }

//   return (
//     <Card>
//       <div className="flex items-center justify-between mb-3">
//         <div className="text-sm font-medium">Feature Permissions</div>
//         <div className="text-xs text-gray-400">Toggle permissions per role</div>
//       </div>

//       <div className="space-y-4">
//         {sections.map((sec) => (
//           <div key={sec.key}>
//             <div className="text-sm font-semibold mb-2">{sec.title}</div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full table-auto border-collapse">
//                 <thead>
//                   <tr className="text-left text-xs text-gray-500">
//                     <th className="py-2 px-2">Feature</th>
//                     <th className="py-2 px-2">Action</th>
//                     {roles.map((r) => (
//                       <th key={r.id} className="py-2 px-2 text-center">{r.name}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sec.features.map((f) => (
//                     f.actions.map((act, idx) => (
//                       <tr key={`${f.key}_${act}`} className="border-t">
//                         <td className="py-2 px-2 align-top">{idx===0 ? <div className="text-sm font-medium">{f.label}</div> : null}</td>
//                         <td className="py-2 px-2 align-top"><div className="text-sm">{act}</div></td>
//                         {roles.map((r) => (
//                           <td key={r.id} className="py-2 px-2 text-center">
//                             <input type="checkbox" checked={isChecked(f.key, act, r.id)} onChange={() => toggle(f.key, act, r.id)} aria-label={`${r.name}-${f.label}-${act}`} />
//                           </td>
//                         ))}
//                       </tr>
//                     ))
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-4 flex items-center justify-end gap-2">
//         <button onClick={() => setPermissions({})} className="px-3 py-2 rounded bg-white border text-sm">Clear</button>
//         <button onClick={() => alert('Permissions saved (demo)')} className="px-3 py-2 rounded bg-yellow-500 text-white text-sm">Save</button>
//       </div>
//     </Card>
//   );
// }

// function PoliciesSection({ policies, setPolicies, roles, attributes, resources }) {
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState(null);

//   function addNew() { setEditing({ id: uid('pol'), name: '', effect: 'allow', actions: ['read'], conditions: [] }); setOpen(true); }
//   function savePolicy(pol) {
//     setPolicies((p) => {
//       const exists = p.find(x => x.id === pol.id);
//       if (exists) return p.map(x => x.id === pol.id ? pol : x);
//       return [...p, pol];
//     });
//     setOpen(false); setEditing(null);
//   }
//   function remove(id) { setPolicies((p)=>p.filter(x=>x.id!==id)); }

//   return (
//     <Card>
//       <div className="flex items-center justify-between mb-3">
//         <div className="text-sm font-medium">Policies</div>
//         <div>
//           <button onClick={addNew} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-yellow-500 text-white text-sm"><Plus size={14}/> New</button>
//         </div>
//       </div>

//       <div className="space-y-2">
//         {policies.map(pol => (
//           <div key={pol.id} className="flex items-center justify-between">
//             <div>
//               <div className="text-sm font-medium">{pol.name || pol.id}</div>
//               <div className="text-xs text-gray-400">Effect: {pol.effect} • Actions: {Array.isArray(pol.actions)?pol.actions.join(', '):pol.actions}</div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => { setEditing(pol); setOpen(true); }} className="text-sm text-slate-700">Edit</button>
//               <button onClick={() => remove(pol.id)} className="text-red-500"><Trash2 size={16} /></button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Policy' : 'New Policy'}>
//         {editing && <PolicyEditor initial={editing} onCancel={() => { setOpen(false); setEditing(null); }} onSave={savePolicy} attributes={attributes} roles={roles} resources={resources} />}
//       </Modal>
//     </Card>
//   );
// }

// function PolicyEditor({ initial, onSave, onCancel, attributes = [], roles = [], resources = [] }) {
//   const [state, setState] = useState(initial);

//   useEffect(() => setState(initial), [initial]);

//   function update(k, v) { setState(s => ({ ...s, [k]: v })); }

//   function addCondition() {
//     setState(s => ({ ...s, conditions: [...(s.conditions||[]), { id: uid('c'), path: attributes[0]?.key || 'department', op: 'equals', value: attributes[0]?.values?.[0] || '' }] }));
//   }

//   function updateCondition(id, key, val) {
//     setState(s => ({ ...s, conditions: s.conditions.map(c => c.id === id ? { ...c, [key]: val } : c) }));
//   }

//   function removeCondition(id) { setState(s => ({ ...s, conditions: (s.conditions||[]).filter(c=>c.id!==id) })); }

//   function save() {
//     onSave(state);
//   }

//   return (
//     <div className="space-y-3">
//       <div>
//         <label className="text-sm text-gray-600">Policy name</label>
//         <input value={state.name} onChange={(e)=>update('name', e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//         <div>
//           <label className="text-sm text-gray-600">Effect</label>
//           <select value={state.effect} onChange={(e)=>update('effect', e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm">
//             <option value="allow">Allow</option>
//             <option value="deny">Deny</option>
//           </select>
//         </div>

//         <div>
//           <label className="text-sm text-gray-600">Actions (comma)</label>
//           <input value={Array.isArray(state.actions)?state.actions.join(',') : state.actions} onChange={(e)=>update('actions', e.target.value.split(',').map(s=>s.trim()))} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
//         </div>

//         <div>
//           <label className="text-sm text-gray-600">Resource (optional)</label>
//           <select value={state.resource || ''} onChange={(e)=>update('resource', e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm">
//             <option value="">Any</option>
//             {resources.map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
//           </select>
//         </div>
//       </div>

//       <div>
//         <div className="flex items-center justify-between">
//           <div className="text-sm font-medium">Conditions</div>
//           <button onClick={addCondition} className="px-2 py-1 rounded bg-white border text-sm">Add</button>
//         </div>

//         <div className="mt-2 space-y-2">
//           {(state.conditions||[]).map(c => (
//             <div key={c.id} className="flex gap-2 items-center">
//               <select value={c.path} onChange={(e)=>updateCondition(c.id, 'path', e.target.value)} className="rounded-md border px-2 py-1 text-sm">
//                 {attributes.map(a => <option key={a.id} value={a.key}>{a.key}</option>)}
//               </select>

//               <select value={c.op} onChange={(e)=>updateCondition(c.id, 'op', e.target.value)} className="rounded-md border px-2 py-1 text-sm">
//                 <option value="equals">equals</option>
//                 <option value="in">in</option>
//                 <option value="gt">gt</option>
//                 <option value="lt">lt</option>
//               </select>

//               <input value={c.value} onChange={(e)=>updateCondition(c.id, 'value', e.target.value)} className="rounded-md border px-2 py-1 text-sm" />

//               <button onClick={()=>removeCondition(c.id)} className="text-red-500"><Trash2 size={16} /></button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-end gap-2">
//         <button onClick={onCancel} className="px-3 py-2 rounded bg-white border">Cancel</button>
//         <button onClick={save} className="px-3 py-2 rounded bg-yellow-500 text-white">Save</button>
//       </div>
//     </div>
//   );
// }

// function SimulationSection({ policies, subjects, resources }) {
//   const [subId, setSubId] = useState(subjects[0]?.id || '');
//   const [resId, setResId] = useState(resources[0]?.id || '');
//   const [action, setAction] = useState('read');
//   const [result, setResult] = useState(null);

//   useEffect(()=>{ setSubId(subjects[0]?.id || ''); setResId(resources[0]?.id || ''); }, [subjects, resources]);

//   function run() {
//     const subject = subjects.find(s => s.id === subId) || {};
//     const resource = resources.find(r => r.id === resId) || {};
//     // find first allow policy
//     const allowed = policies.some(pol => evaluatePolicy(pol, subject.attributes || {}, resource.attributes || {}, action, {}));
//     setResult(allowed ? 'allowed' : 'denied');
//   }

//   return (
//     <Card>
//       <div className="flex items-center justify-between mb-3">
//         <div className="text-sm font-medium">Policy Simulator</div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//         <select value={subId} onChange={(e)=>setSubId(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
//           {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//         </select>
//         <select value={resId} onChange={(e)=>setResId(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
//           <option value="">Any resource</option>
//           {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
//         </select>
//         <input value={action} onChange={(e)=>setAction(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
//       </div>

//       <div className="mt-3 flex items-center gap-2">
//         <button onClick={run} className="px-3 py-2 rounded bg-yellow-500 text-white">Evaluate</button>
//         {result && <div className={`px-3 py-2 rounded ${result==='allowed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{result}</div>}
//       </div>

//     </Card>
//   );
// }

// // ---------------- Main ABAC Page ----------------
// export default function ABACPage() {
//   // seed mock state (in production load from API)
//   const [roles, setRoles] = useState([{ id: 'role_admin', name: 'admin' }, { id: 'role_hr', name: 'hr' }]);
//   const [attributes, setAttributes] = useState([{ id: 'a_dept', key: 'department', values: ['HR','Engineering','Sales'] }, { id: 'a_level', key: 'level', values: ['1','2','3'] }]);
//   const [resources, setResources] = useState([{ id: 'res_employee', name: 'employee-records' }, { id: 'res_payroll', name: 'payroll' }]);

//   // policies state
//   const [policies, setPolicies] = useState([
//     { id: 'pol_1', name: 'HR can read payroll', effect: 'allow', actions: ['read'], resource: 'res_payroll', conditions: [{ id: 'c1', path: 'department', op: 'equals', value: 'HR' }] }
//   ]);

//   // permissions state (feature × action × role)
//   const [permissions, setPermissions] = useState({});

//   // demo subjects (users)
//   const [subjects, setSubjects] = useState([
//     { id: 'u1', name: 'Anita Sharma', attributes: { department: 'HR', level: '2' } },
//     { id: 'u2', name: 'Ravi Kumar', attributes: { department: 'Sales', level: '1' } },
//   ]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-8xl mx-auto space-y-4">
//         <div className="flex items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold">ABAC — Permissions</h1>
//             <div className="text-sm text-gray-500">Manage roles, attributes, resources and policies.</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div className="space-y-4 lg:col-span-1">
//             <RolesSection roles={roles} setRoles={setRoles} />
//             <AttributesSection attributes={attributes} setAttributes={setAttributes} />
//             <Card>
//               <div className="text-sm font-medium">Resources</div>
//               <div className="mt-2 space-y-2">
//                 {resources.map(r => (
//                   <div key={r.id} className="flex items-center justify-between">
//                     <div className="text-sm">{r.name}</div>
//                     <div className="flex items-center gap-2"><button onClick={()=>navigator.clipboard?.writeText(r.id)} className="text-xs text-gray-400">id</button></div>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           </div>

//           <div className="space-y-4 lg:col-span-2">
//             <FeaturesSection roles={roles} permissions={permissions} setPermissions={setPermissions} />
//             <PoliciesSection policies={policies} setPolicies={setPolicies} roles={roles} attributes={attributes} resources={resources} />
//             <SimulationSection policies={policies} subjects={subjects} resources={resources} />

//             <Card>
//               <div className="text-sm font-medium mb-2">Subjects (demo users)</div>
//               <div className="space-y-2">
//                 {subjects.map(s => (
//                   <div key={s.id} className="flex items-center justify-between">
//                     <div>
//                       <div className="text-sm font-medium">{s.name}</div>
//                       <div className="text-xs text-gray-400">{Object.entries(s.attributes).map(([k,v])=>`${k}:${v}`).join(', ')}</div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button onClick={() => navigator.clipboard?.writeText(JSON.stringify(s.attributes))} className="text-xs text-gray-400">copy attrs</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Card>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









// // src/pages/RBACPage.jsx
// import React, { useEffect, useState } from "react";
// import {
//   ShieldCheck,
//   Check,
//   X,
//   Lock,
//   Loader2,
//   Settings,
//   Users,
//   Store,
//   UtensilsCrossed,
//   FileText,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// const ROLES = ["super_admin", "brand_admin", "outlet_admin", "staff"];

// const ROLE_LABELS = {
//   super_admin: "Super Admin",
//   brand_admin: "Brand Admin",
//   outlet_admin: "Outlet Admin",
//   staff: "Staff",
// };

// const PERMISSIONS = [
//   {
//     key: "manage_brands",
//     label: "Manage Brands",
//     desc: "Create, edit, and manage brands.",
//   },
//   {
//     key: "manage_outlets",
//     label: "Manage Outlets",
//     desc: "Add outlets, assign admins, configure data.",
//   },
//   {
//     key: "manage_tables",
//     label: "Manage Tables",
//     desc: "Control dine-in tables and QR.",
//   },
//   {
//     key: "manage_categories",
//     label: "Manage Categories",
//     desc: "Create menu categories.",
//   },
//   {
//     key: "manage_products",
//     label: "Manage Products",
//     desc: "Add products, variants, pricing.",
//   },
//   {
//     key: "manage_addons",
//     label: "Manage Add-ons",
//     desc: "Create toppings, extras, sides.",
//   },
//   {
//     key: "manage_orders",
//     label: "Orders Access",
//     desc: "View and manage all outlet orders.",
//   },
//   {
//     key: "manage_kot",
//     label: "Kitchen Access",
//     desc: "KOT updates (Preparing → Ready).",
//   },
//   {
//     key: "manage_billing",
//     label: "Billing Access",
//     desc: "Generate bills and settle payments.",
//   },
//   {
//     key: "manage_users",
//     label: "Manage Users",
//     desc: "Create & control user access.",
//   },
//   {
//     key: "view_reports",
//     label: "Reports Access",
//     desc: "Daily sales, order reports.",
//   },
// ];

// export default function RBACPage() {
//   const { role } = useAuth();

//   const canEdit = role === "super_admin";       // Only super admin can change permissions
//   const isReadOnly = !canEdit;

//   const [loading, setLoading] = useState(true);
//   const [permissions, setPermissions] = useState({});

//   useEffect(() => {
//     setLoading(true);

//     // Dummy Data: Default Permission Structure
//     const dummy = {
//       super_admin: {
//         manage_brands: true,
//         manage_outlets: true,
//         manage_tables: true,
//         manage_categories: true,
//         manage_products: true,
//         manage_addons: true,
//         manage_orders: true,
//         manage_kot: true,
//         manage_billing: true,
//         manage_users: true,
//         view_reports: true,
//       },
//       brand_admin: {
//         manage_brands: false,
//         manage_outlets: true,
//         manage_tables: true,
//         manage_categories: true,
//         manage_products: true,
//         manage_addons: true,
//         manage_orders: true,
//         manage_kot: true,
//         manage_billing: true,
//         manage_users: true,
//         view_reports: true,
//       },
//       outlet_admin: {
//         manage_brands: false,
//         manage_outlets: false,
//         manage_tables: true,
//         manage_categories: false,
//         manage_products: true,
//         manage_addons: true,
//         manage_orders: true,
//         manage_kot: true,
//         manage_billing: true,
//         manage_users: false,
//         view_reports: true,
//       },
//       staff: {
//         manage_brands: false,
//         manage_outlets: false,
//         manage_tables: false,
//         manage_categories: false,
//         manage_products: false,
//         manage_addons: false,
//         manage_orders: true,
//         manage_kot: true,
//         manage_billing: false,
//         manage_users: false,
//         view_reports: false,
//       },
//     };

//     setTimeout(() => {
//       setPermissions(dummy);
//       setLoading(false);
//     }, 600);
//   }, []);

//   function togglePermission(roleKey, permKey) {
//     if (!canEdit) return;
//     setPermissions((prev) => ({
//       ...prev,
//       [roleKey]: {
//         ...prev[roleKey],
//         [permKey]: !prev[roleKey][permKey],
//       },
//     }));
//   }

//   return (
//     <div className="max-w-7xl mx-auto flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
//             <ShieldCheck size={22} />
//             RBAC – Role Based Access Control
//           </h1>
//           <p className="text-sm text-slate-500">
//             Control what each role can access across the platform.
//           </p>
//         </div>

//         {isReadOnly && (
//           <div className="flex items-center gap-2 text-sm text-slate-500">
//             <Lock size={16} />
//             Read-only mode: You are not a Super Admin.
//           </div>
//         )}
//       </div>

//       {/* Loading */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 size={28} className="animate-spin text-slate-500" />
//         </div>
//       ) : (
//         <section className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
//           <table className="min-w-full">
//             <thead className="bg-slate-50 border-b border-slate-200">
//               <tr>
//                 <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
//                   Permission
//                 </th>

//                 {ROLES.map((r) => (
//                   <th
//                     key={r}
//                     className="px-4 py-3 text-center text-[11px] font-semibold text-slate-600 uppercase tracking-wide"
//                   >
//                     {ROLE_LABELS[r]}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {PERMISSIONS.map((perm) => (
//                 <tr key={perm.key} className="text-sm">
//                   {/* Permission name */}
//                   <td className="px-4 py-3">
//                     <div className="font-medium text-slate-900">{perm.label}</div>
//                     <div className="text-xs text-slate-500">{perm.desc}</div>
//                   </td>

//                   {/* Permission toggles */}
//                   {ROLES.map((r) => {
//                     const enabled = permissions[r]?.[perm.key];

//                     return (
//                       <td
//                         key={r}
//                         className="px-4 py-3 text-center cursor-pointer"
//                         onClick={() => togglePermission(r, perm.key)}
//                       >
//                         {enabled ? (
//                           <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-emerald-50 border border-emerald-200">
//                             <Check size={14} className="text-emerald-600" />
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-50 border border-slate-200">
//                             <X size={14} className="text-slate-400" />
//                           </span>
//                         )}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>
//       )}
//     </div>
//   );
// }










// src/pages/RBACPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Check, X, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// ====== MODULES + ACTIONS (STATIC RBAC MODEL) ======
// Only this block is static; everything else is role-dynamic.

const PERMISSIONS = [
  {
    key: "manage_auth",
    label: "Auth Settings",
    desc: "Global authentication and security configuration.",
    actions: [
      { key: "view", label: "View" },
      { key: "update", label: "Update Settings" },
    ],
  },
  {
    key: "manage_rbac",
    label: "RBAC & Permissions",
    desc: "Control which role can access which modules and actions.",
    actions: [
      { key: "view", label: "View Matrix" },
      { key: "edit", label: "Edit Permissions" },
    ],
  },
  {
    key: "manage_brands",
    label: "Brands",
    desc: "Create and configure brands in the platform.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "deactivate", label: "Activate/Deactivate" },
    ],
  },
  {
    key: "manage_outlets",
    label: "Outlets",
    desc: "Per-brand outlet creation and configuration.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "deactivate", label: "Activate/Deactivate" },
    ],
  },
  {
    key: "manage_tables",
    label: "Tables",
    desc: "Handle dine-in table configuration and QR codes.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "manage_categories",
    label: "Categories",
    desc: "Organise the menu into logical sections.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "manage_products",
    label: "Products",
    desc: "Core menu item management.",
    actions: [
      { key: "view", label: "View/List" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "manage_product_options",
    label: "Product Options",
    desc: "Variant and option group configuration.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "manage_addons",
    label: "Add-ons",
    desc: "Toppings, extras, sauces and sides.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "manage_qr_menu",
    label: "QR Menu",
    desc: "Customer-facing QR ordering configuration.",
    actions: [
      { key: "view", label: "View" },
      { key: "configure", label: "Configure" },
    ],
  },
  {
    key: "manage_orders",
    label: "Orders",
    desc: "Operational access to outlet orders.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create (POS/manual)" },
      { key: "update_status", label: "Update Status" },
      { key: "cancel", label: "Cancel" },
    ],
  },
  {
    key: "manage_kot",
    label: "Kitchen (KOT)",
    desc: "Kitchen display and preparation flow.",
    actions: [
      { key: "view", label: "View KOT" },
      { key: "update_status", label: "Update Status" },
    ],
  },
  {
    key: "manage_billing",
    label: "Billing",
    desc: "Table billing, discounts and settlement.",
    actions: [
      { key: "view", label: "View Bills" },
      { key: "create", label: "Generate Bill" },
      { key: "apply_discount", label: "Apply Discount" },
      { key: "close", label: "Close / Capture Payment" },
    ],
  },
  {
    key: "manage_customers",
    label: "Customers",
    desc: "Customer directory and basic CRM.",
    actions: [
      { key: "view", label: "View" },
      { key: "edit_notes", label: "Edit Notes" },
      { key: "export", label: "Export (if enabled)" },
    ],
  },
  {
    key: "manage_users",
    label: "Users & Roles",
    desc: "Onboard and control system users.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "deactivate", label: "Activate/Deactivate" },
    ],
  },
  {
    key: "view_reports",
    label: "Reports & Analytics",
    desc: "Read-only insights and performance dashboards.",
    actions: [
      { key: "view_sales", label: "View Sales" },
      { key: "view_products", label: "Product Performance" },
      { key: "view_outlets", label: "Outlet Performance" },
      { key: "export", label: "Export Reports" },
    ],
  },
  {
    key: "manage_integrations",
    label: "Integrations",
    desc: "Third-party connections (POS, aggregators, etc.).",
    actions: [
      { key: "view", label: "View" },
      { key: "configure", label: "Configure" },
      { key: "toggle", label: "Enable/Disable" },
    ],
  },
  {
    key: "manage_platform_settings",
    label: "Platform Settings",
    desc: "System-wide technical and business configuration.",
    actions: [
      { key: "view", label: "View" },
      { key: "edit", label: "Edit Settings" },
    ],
  },
];

// Dummy roles for now. Later you can return this from backend.
// IMPORTANT: Once you swap this with API, the page auto-supports any new role.
const DEFAULT_ROLES_CONFIG = [
  { key: "super_admin", label: "Super Admin", defaultModules: "all" },
  {
    key: "brand_admin",
    label: "Brand Admin",
    defaultModules: [
      "manage_outlets",
      "manage_tables",
      "manage_categories",
      "manage_products",
      "manage_product_options",
      "manage_addons",
      "manage_qr_menu",
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
    defaultModules: [
      "manage_tables",
      "manage_products",
      "manage_product_options",
      "manage_addons",
      "manage_qr_menu",
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
    defaultModules: ["manage_orders", "manage_kot"],
  },
];

export default function RBACPage() {
  const { role } = useAuth();

  const canEdit = role === "super_admin"; // Only Super Admin can edit
  const isReadOnly = !canEdit;

  const [loading, setLoading] = useState(true);

  // dynamic roles list: later replace with API result
  const [rolesConfig, setRolesConfig] = useState([]);

  // permissions[roleKey][moduleKey] = { module: boolean, actions: { [actionKey]: boolean } }
  const [permissions, setPermissions] = useState({});

  const roleKeys = useMemo(() => rolesConfig.map((r) => r.key), [rolesConfig]);
  const roleLabels = useMemo(
    () => Object.fromEntries(rolesConfig.map((r) => [r.key, r.label])),
    [rolesConfig]
  );

  useEffect(() => {
    async function init() {
      setLoading(true);

      // 🚀 In future: fetch this from your backend:
      // const res = await fetch('/api/rbac/config');
      // const data = await res.json();
      // const loadedRoles = data.roles;
      // const loadedMatrix = data.matrix;
      // For now we only use DEFAULT_ROLES_CONFIG and build matrix in FE:
      const loadedRoles = DEFAULT_ROLES_CONFIG;

      const initialMatrix = {};

      loadedRoles.forEach((r) => {
        initialMatrix[r.key] = {};

        PERMISSIONS.forEach((perm) => {
          const moduleEnabled =
            r.defaultModules === "all" ||
            (Array.isArray(r.defaultModules) &&
              r.defaultModules.includes(perm.key));

          const actionsState = {};
          perm.actions.forEach((a) => {
            actionsState[a.key] = moduleEnabled; // all on if module enabled
          });

          initialMatrix[r.key][perm.key] = {
            module: moduleEnabled,
            actions: actionsState,
          };
        });
      });

      // simulate small delay
      setTimeout(() => {
        setRolesConfig(loadedRoles);
        setPermissions(initialMatrix);
        setLoading(false);
      }, 300);
    }

    init();
  }, []);

  function toggleModule(roleKey, permKey) {
    if (!canEdit) return;

    setPermissions((prev) => {
      const current = prev[roleKey]?.[permKey];
      if (!current) return prev;

      const newModuleState = !current.module;
      const newActions = { ...current.actions };

      // when toggling module:
      // - if turning ON: turn all actions ON
      // - if turning OFF: turn all actions OFF
      Object.keys(newActions).forEach((k) => {
        newActions[k] = newModuleState;
      });

      return {
        ...prev,
        [roleKey]: {
          ...prev[roleKey],
          [permKey]: {
            module: newModuleState,
            actions: newActions,
          },
        },
      };
    });
  }

  function toggleAction(roleKey, permKey, actionKey) {
    if (!canEdit) return;

    setPermissions((prev) => {
      const currentModule = prev[roleKey]?.[permKey];
      if (!currentModule) return prev;

      const newActions = {
        ...currentModule.actions,
        [actionKey]: !currentModule.actions[actionKey],
      };

      const anyActionEnabled = Object.values(newActions).some(Boolean);

      return {
        ...prev,
        [roleKey]: {
          ...prev[roleKey],
          [permKey]: {
            module: anyActionEnabled,
            actions: newActions,
          },
        },
      };
    });
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={22} />
            RBAC – Role Based Access Control
          </h1>
          <p className="text-sm text-slate-500">
            Control what each role can access – module level and action level.
          </p>
        </div>

        {isReadOnly && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Lock size={16} />
            Read-only mode: you are not a Super Admin.
          </div>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-slate-500" />
        </div>
      ) : rolesConfig.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-slate-500">
          No roles configured. Please add roles first.
        </div>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                  Permission (Module) & Actions
                </th>

                {roleKeys.map((r) => (
                  <th
                    key={r}
                    className="px-4 py-3 text-center text-[11px] font-semibold text-slate-600 uppercase tracking-wide"
                  >
                    {roleLabels[r] || r}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {PERMISSIONS.map((perm) => (
                <tr key={perm.key} className="text-sm align-top">
                  {/* Permission name + description */}
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-slate-900 mb-0.5">
                      {perm.label}
                    </div>
                    <div className="text-xs text-slate-500 mb-1.5">
                      {perm.desc}
                    </div>
                    {perm.actions && perm.actions.length > 0 && (
                      <div className="text-[11px] text-slate-500">
                        Actions:{" "}
                        {perm.actions.map((a, idx) => (
                          <span key={a.key}>
                            {a.label}
                            {idx < perm.actions.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Cells: per-role module toggle + action chips */}
                  {roleKeys.map((r) => {
                    const moduleState = permissions[r]?.[perm.key];
                    const moduleEnabled = moduleState?.module;
                    const actionsState = moduleState?.actions || {};

                    return (
                      <td
                        key={r}
                        className="px-4 py-3 text-center align-middle"
                      >
                        <div className="flex flex-col items-center gap-2">
                          {/* Module toggle */}
                          <button
                            type="button"
                            onClick={() => toggleModule(r, perm.key)}
                            disabled={!canEdit}
                            className="inline-flex items-center justify-center h-7 w-7 rounded-full border transition-colors"
                            style={{ cursor: canEdit ? "pointer" : "default" }}
                            title={
                              moduleEnabled
                                ? "Click to disable this module for this role"
                                : "Click to enable this module for this role"
                            }
                          >
                            {moduleEnabled ? (
                              <span className="flex items-center justify-center h-full w-full rounded-full bg-emerald-50 border border-emerald-200">
                                <Check size={14} className="text-emerald-600" />
                              </span>
                            ) : (
                              <span className="flex items-center justify-center h-full w-full rounded-full bg-slate-50 border border-slate-200">
                                <X size={14} className="text-slate-400" />
                              </span>
                            )}
                          </button>

                          {/* Actions */}
                          <div className="flex flex-wrap justify-center gap-1 max-w-[150px]">
                            {perm.actions.map((a) => {
                              const enabled = !!actionsState[a.key];

                              return (
                                <button
                                  key={a.key}
                                  type="button"
                                  onClick={() =>
                                    toggleAction(r, perm.key, a.key)
                                  }
                                  disabled={!canEdit}
                                  className={
                                    "px-1.5 py-0.5 rounded-full text-[10px] border leading-snug " +
                                    (enabled
                                      ? "bg-slate-900 text-white border-slate-900"
                                      : "bg-slate-50 text-slate-500 border-slate-200")
                                  }
                                  style={{
                                    cursor: canEdit ? "pointer" : "default",
                                  }}
                                  title={`${a.label} for ${roleLabels[r] || r} on ${perm.label}`}
                                >
                                  {a.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}