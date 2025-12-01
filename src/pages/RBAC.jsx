import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit3, Trash2, Check, X, Save } from "lucide-react";
import { Card } from "@/components/ReusableComponents";




export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full sm:max-w-2xl mx-auto">
        <div className="bg-white rounded-t-lg sm:rounded-2xl shadow overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={18} /></button>
          </div>
          <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Helpers ----------------
function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// Simple policy evaluator for demo: checks if subjectAttrs satisfy policy conditions
function evaluatePolicy(policy, subject, resource, action, context = {}) {
  // policy example: { effect: 'allow'|'deny', conditions: [{ path: 'department', op: 'equals', value: 'HR' }], actions: ['read'] }
  const matchActions = Array.isArray(policy.actions) ? policy.actions.includes(action) : policy.actions === action;
  if (!matchActions) return false;
  const conds = policy.conditions || [];
  const allMatch = conds.every((c) => {
    const val = subject[c.path] ?? resource[c.path] ?? context[c.path];
    if (c.op === 'equals') return String(val) === String(c.value);
    if (c.op === 'in') return Array.isArray(c.value) ? c.value.includes(val) : String(c.value).split(',').includes(String(val));
    if (c.op === 'gt') return Number(val) > Number(c.value);
    if (c.op === 'lt') return Number(val) < Number(c.value);
    return false;
  });
  return allMatch && policy.effect === 'allow';
}

// ---------------- Small Components ----------------
export function KeyValueRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input value={label} onChange={(e) => onChange('key', e.target.value)} className="w-1/3 rounded-md border px-2 py-1 text-sm" />
      <input value={value} onChange={(e) => onChange('value', e.target.value)} className="flex-1 rounded-md border px-2 py-1 text-sm" />
    </div>
  );
}

// ---------------- Sections ----------------
function RolesSection({ roles, setRoles }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function addRole() {
    if (!name.trim()) return;
    setRoles((r) => [...r, { id: uid('role'), name: name.trim() }]);
    setName("");
    setOpen(false);
  }

  function removeRole(id) {
    setRoles((r) => r.filter((x) => x.id !== id));
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Roles</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-yellow-500 text-white text-sm"><Plus size={14}/> Add</button>
        </div>
      </div>

      <div className="space-y-2">
        {roles.map((r) => (
          <div key={r.id} className="flex items-center justify-between">
            <div className="text-sm">{r.name}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigator.clipboard?.writeText(r.id)} className="text-xs text-gray-400">ID</button>
              <button onClick={() => removeRole(r.id)} className="text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Role">
        <div className="space-y-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Role name (e.g. manager)" className="block w-full rounded-md border px-3 py-2" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-3 py-2 rounded bg-white border">Cancel</button>
            <button onClick={addRole} className="px-3 py-2 rounded bg-yellow-500 text-white">Create</button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}

function AttributesSection({ attributes, setAttributes }) {
  const [k, setK] = useState("");
  const [v, setV] = useState("");

  function addAttr() {
    if (!k.trim()) return;
    setAttributes((s) => [...s, { id: uid('attr'), key: k.trim(), type: 'string', description: '', values: v ? v.split(',').map(s=>s.trim()) : [] }]);
    setK(''); setV('');
  }

  function removeAttr(id) { setAttributes((s)=>s.filter(x => x.id !== id)); }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Attributes</div>
      </div>

      <div className="space-y-2">
        {attributes.map(a => (
          <div key={a.id} className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-medium">{a.key}</div>
              <div className="text-xs text-gray-400">{a.values?.slice(0,3).join(', ')}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigator.clipboard?.writeText(a.key)} className="text-xs text-gray-400">copy</button>
              <button onClick={() => removeAttr(a.id)} className="text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input value={k} onChange={(e)=>setK(e.target.value)} placeholder="attribute key (dept)" className="rounded-md border px-2 py-1" />
        <input value={v} onChange={(e)=>setV(e.target.value)} placeholder="possible values (comma)" className="rounded-md border px-2 py-1" />
        <button onClick={addAttr} className="px-3 py-1 rounded bg-white border">Add</button>
      </div>
    </Card>
  );
}

function FeaturesSection({ roles = [], permissions = {}, setPermissions = () => {} }) {

  const sections = [
    {
      key: 'employees',
      title: 'Employees',
      features: [
        { key: 'employee_record', label: 'Employee record', actions: ['view','create','edit','delete'] },
        { key: 'employee_profile', label: 'Profile update', actions: ['view','edit'] },
      ],
    },
    {
      key: 'attendance',
      title: 'Attendance',
      features: [
        { key: 'attendance_view', label: 'View attendance', actions: ['view','export'] },
        { key: 'attendance_mark', label: 'Mark attendance', actions: ['create','edit'] },
      ],
    },
    {
      key: 'payroll',
      title: 'Payroll',
      features: [
        { key: 'payroll_view', label: 'View payroll', actions: ['view','export'] },
        { key: 'payroll_run', label: 'Run payroll', actions: ['create'] },
      ],
    },
    {
      key: 'leave',
      title: 'Leave',
      features: [
        { key: 'leave_request', label: 'Request leave', actions: ['create','view'] },
        { key: 'leave_approve', label: 'Approve/reject', actions: ['edit'] },
      ],
    },
    {
      key: 'reports',
      title: 'Reports',
      features: [
        { key: 'reports_view', label: 'View reports', actions: ['view','export'] },
      ],
    },
    {
      key: 'admin',
      title: 'Admin',
      features: [
        { key: 'manage_roles', label: 'Manage roles', actions: ['view','create','edit','delete'] },
        { key: 'manage_policies', label: 'Manage policies', actions: ['view','create','edit','delete'] },
      ],
    },
  ];

  function toggle(featureKey, action, roleId) {
    const next = JSON.parse(JSON.stringify(permissions || {}));
    if (!next[featureKey]) next[featureKey] = {};
    if (!next[featureKey][action]) next[featureKey][action] = {};
    next[featureKey][action][roleId] = !next[featureKey][action][roleId];
    setPermissions(next);
  }

  function isChecked(featureKey, action, roleId) {
    return !!(permissions && permissions[featureKey] && permissions[featureKey][action] && permissions[featureKey][action][roleId]);
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Feature Permissions</div>
        <div className="text-xs text-gray-400">Toggle permissions per role</div>
      </div>

      <div className="space-y-4">
        {sections.map((sec) => (
          <div key={sec.key}>
            <div className="text-sm font-semibold mb-2">{sec.title}</div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left text-xs text-gray-500">
                    <th className="py-2 px-2">Feature</th>
                    <th className="py-2 px-2">Action</th>
                    {roles.map((r) => (
                      <th key={r.id} className="py-2 px-2 text-center">{r.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sec.features.map((f) => (
                    f.actions.map((act, idx) => (
                      <tr key={`${f.key}_${act}`} className="border-t">
                        <td className="py-2 px-2 align-top">{idx===0 ? <div className="text-sm font-medium">{f.label}</div> : null}</td>
                        <td className="py-2 px-2 align-top"><div className="text-sm">{act}</div></td>
                        {roles.map((r) => (
                          <td key={r.id} className="py-2 px-2 text-center">
                            <input type="checkbox" checked={isChecked(f.key, act, r.id)} onChange={() => toggle(f.key, act, r.id)} aria-label={`${r.name}-${f.label}-${act}`} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button onClick={() => setPermissions({})} className="px-3 py-2 rounded bg-white border text-sm">Clear</button>
        <button onClick={() => alert('Permissions saved (demo)')} className="px-3 py-2 rounded bg-yellow-500 text-white text-sm">Save</button>
      </div>
    </Card>
  );
}

function PoliciesSection({ policies, setPolicies, roles, attributes, resources }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  function addNew() { setEditing({ id: uid('pol'), name: '', effect: 'allow', actions: ['read'], conditions: [] }); setOpen(true); }
  function savePolicy(pol) {
    setPolicies((p) => {
      const exists = p.find(x => x.id === pol.id);
      if (exists) return p.map(x => x.id === pol.id ? pol : x);
      return [...p, pol];
    });
    setOpen(false); setEditing(null);
  }
  function remove(id) { setPolicies((p)=>p.filter(x=>x.id!==id)); }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Policies</div>
        <div>
          <button onClick={addNew} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-yellow-500 text-white text-sm"><Plus size={14}/> New</button>
        </div>
      </div>

      <div className="space-y-2">
        {policies.map(pol => (
          <div key={pol.id} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{pol.name || pol.id}</div>
              <div className="text-xs text-gray-400">Effect: {pol.effect} • Actions: {Array.isArray(pol.actions)?pol.actions.join(', '):pol.actions}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(pol); setOpen(true); }} className="text-sm text-slate-700">Edit</button>
              <button onClick={() => remove(pol.id)} className="text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Policy' : 'New Policy'}>
        {editing && <PolicyEditor initial={editing} onCancel={() => { setOpen(false); setEditing(null); }} onSave={savePolicy} attributes={attributes} roles={roles} resources={resources} />}
      </Modal>
    </Card>
  );
}

function PolicyEditor({ initial, onSave, onCancel, attributes = [], roles = [], resources = [] }) {
  const [state, setState] = useState(initial);

  useEffect(() => setState(initial), [initial]);

  function update(k, v) { setState(s => ({ ...s, [k]: v })); }

  function addCondition() {
    setState(s => ({ ...s, conditions: [...(s.conditions||[]), { id: uid('c'), path: attributes[0]?.key || 'department', op: 'equals', value: attributes[0]?.values?.[0] || '' }] }));
  }

  function updateCondition(id, key, val) {
    setState(s => ({ ...s, conditions: s.conditions.map(c => c.id === id ? { ...c, [key]: val } : c) }));
  }

  function removeCondition(id) { setState(s => ({ ...s, conditions: (s.conditions||[]).filter(c=>c.id!==id) })); }

  function save() {
    onSave(state);
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm text-gray-600">Policy name</label>
        <input value={state.name} onChange={(e)=>update('name', e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="text-sm text-gray-600">Effect</label>
          <select value={state.effect} onChange={(e)=>update('effect', e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm">
            <option value="allow">Allow</option>
            <option value="deny">Deny</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Actions (comma)</label>
          <input value={Array.isArray(state.actions)?state.actions.join(',') : state.actions} onChange={(e)=>update('actions', e.target.value.split(',').map(s=>s.trim()))} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="text-sm text-gray-600">Resource (optional)</label>
          <select value={state.resource || ''} onChange={(e)=>update('resource', e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm">
            <option value="">Any</option>
            {resources.map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Conditions</div>
          <button onClick={addCondition} className="px-2 py-1 rounded bg-white border text-sm">Add</button>
        </div>

        <div className="mt-2 space-y-2">
          {(state.conditions||[]).map(c => (
            <div key={c.id} className="flex gap-2 items-center">
              <select value={c.path} onChange={(e)=>updateCondition(c.id, 'path', e.target.value)} className="rounded-md border px-2 py-1 text-sm">
                {attributes.map(a => <option key={a.id} value={a.key}>{a.key}</option>)}
              </select>

              <select value={c.op} onChange={(e)=>updateCondition(c.id, 'op', e.target.value)} className="rounded-md border px-2 py-1 text-sm">
                <option value="equals">equals</option>
                <option value="in">in</option>
                <option value="gt">gt</option>
                <option value="lt">lt</option>
              </select>

              <input value={c.value} onChange={(e)=>updateCondition(c.id, 'value', e.target.value)} className="rounded-md border px-2 py-1 text-sm" />

              <button onClick={()=>removeCondition(c.id)} className="text-red-500"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-2 rounded bg-white border">Cancel</button>
        <button onClick={save} className="px-3 py-2 rounded bg-yellow-500 text-white">Save</button>
      </div>
    </div>
  );
}

function SimulationSection({ policies, subjects, resources }) {
  const [subId, setSubId] = useState(subjects[0]?.id || '');
  const [resId, setResId] = useState(resources[0]?.id || '');
  const [action, setAction] = useState('read');
  const [result, setResult] = useState(null);

  useEffect(()=>{ setSubId(subjects[0]?.id || ''); setResId(resources[0]?.id || ''); }, [subjects, resources]);

  function run() {
    const subject = subjects.find(s => s.id === subId) || {};
    const resource = resources.find(r => r.id === resId) || {};
    // find first allow policy
    const allowed = policies.some(pol => evaluatePolicy(pol, subject.attributes || {}, resource.attributes || {}, action, {}));
    setResult(allowed ? 'allowed' : 'denied');
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Policy Simulator</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select value={subId} onChange={(e)=>setSubId(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={resId} onChange={(e)=>setResId(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
          <option value="">Any resource</option>
          {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <input value={action} onChange={(e)=>setAction(e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button onClick={run} className="px-3 py-2 rounded bg-yellow-500 text-white">Evaluate</button>
        {result && <div className={`px-3 py-2 rounded ${result==='allowed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{result}</div>}
      </div>

    </Card>
  );
}

// ---------------- Main ABAC Page ----------------
export default function ABACPage() {
  // seed mock state (in production load from API)
  const [roles, setRoles] = useState([{ id: 'role_admin', name: 'admin' }, { id: 'role_hr', name: 'hr' }]);
  const [attributes, setAttributes] = useState([{ id: 'a_dept', key: 'department', values: ['HR','Engineering','Sales'] }, { id: 'a_level', key: 'level', values: ['1','2','3'] }]);
  const [resources, setResources] = useState([{ id: 'res_employee', name: 'employee-records' }, { id: 'res_payroll', name: 'payroll' }]);

  // policies state
  const [policies, setPolicies] = useState([
    { id: 'pol_1', name: 'HR can read payroll', effect: 'allow', actions: ['read'], resource: 'res_payroll', conditions: [{ id: 'c1', path: 'department', op: 'equals', value: 'HR' }] }
  ]);

  // permissions state (feature × action × role)
  const [permissions, setPermissions] = useState({});

  // demo subjects (users)
  const [subjects, setSubjects] = useState([
    { id: 'u1', name: 'Anita Sharma', attributes: { department: 'HR', level: '2' } },
    { id: 'u2', name: 'Ravi Kumar', attributes: { department: 'Sales', level: '1' } },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">ABAC — Permissions</h1>
            <div className="text-sm text-gray-500">Manage roles, attributes, resources and policies.</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-4 lg:col-span-1">
            <RolesSection roles={roles} setRoles={setRoles} />
            <AttributesSection attributes={attributes} setAttributes={setAttributes} />
            <Card>
              <div className="text-sm font-medium">Resources</div>
              <div className="mt-2 space-y-2">
                {resources.map(r => (
                  <div key={r.id} className="flex items-center justify-between">
                    <div className="text-sm">{r.name}</div>
                    <div className="flex items-center gap-2"><button onClick={()=>navigator.clipboard?.writeText(r.id)} className="text-xs text-gray-400">id</button></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <FeaturesSection roles={roles} permissions={permissions} setPermissions={setPermissions} />
            <PoliciesSection policies={policies} setPolicies={setPolicies} roles={roles} attributes={attributes} resources={resources} />
            <SimulationSection policies={policies} subjects={subjects} resources={resources} />

            <Card>
              <div className="text-sm font-medium mb-2">Subjects (demo users)</div>
              <div className="space-y-2">
                {subjects.map(s => (
                  <div key={s.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-gray-400">{Object.entries(s.attributes).map(([k,v])=>`${k}:${v}`).join(', ')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigator.clipboard?.writeText(JSON.stringify(s.attributes))} className="text-xs text-gray-400">copy attrs</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
