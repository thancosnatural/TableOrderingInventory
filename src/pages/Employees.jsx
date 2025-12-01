import React, { useEffect, useState } from "react";
import {
  Trash2,
  Edit2,
  Plus,
  Search,
  Download,
  Upload,
  XCircle,
} from "lucide-react";
import { Pagination } from "@/components/ReusableComponents";

// ---------- Small UI primitives ----------
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded shadow-sm p-4 ${className}`.trim()}>
      {children}
    </div>
  );
}

function IconButton({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-2 rounded-lg hover:bg-gray-100 inline-flex items-center gap-2"
      aria-label={title}
    >
      {children}
    </button>
  );
}

function Avatar({ name, size = 40 }) {
  const initials = name
    ? name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0"
      aria-hidden
    >
      {initials}
    </div>
  );
}

function Badge({ children, color = "green" }) {
  const colorMap = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
    blue: "bg-blue-50 text-blue-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium ${colorMap[color] || colorMap.blue}`}
    >
      {children}
    </span>
  );
}

// ---------- Modal (responsive) ----------
function Modal({ open, title, onClose, children, size = "md" }) {
  if (!open) return null;
  // mobile full-screen, centered on larger screens
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 w-full sm:max-w-${size} mx-auto`}
      >
        <div className="bg-white rounded-t-lg sm:rounded-2xl shadow-lg overflow-hidden h-[90vh] sm:h-auto flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 id="modal-title" className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100">
              <XCircle size={18} />
            </button>
          </div>

          <div className="p-4 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ---------- Employee Form ----------
function EmployeeForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Staff",
    department: "",
    status: "active",
    ...initial,
  });

  useEffect(() => setForm((f) => ({ ...f, ...initial })), [initial]);

  function update(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email) return alert("Name and email are required");
    onSubmit(form);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Full name</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Role</label>
          <select
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          >
            <option>Staff</option>
            <option>Manager</option>
            <option>HR</option>
            <option>Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Department</label>
          <input
            value={form.department}
            onChange={(e) => update("department", e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 rounded-md bg-white border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 rounded-md bg-yellow-500 text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
}


// ---------- Main Employees Page ----------
export default function EmployeesPage() {
  // local state
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [query, setQuery] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  // fetch data (replace with your API)
  async function fetchEmployees() {
    setLoading(true);
    try {
      const all = Array.from({ length: 87 }).map((_, i) => ({
        id: i + 1,
        name: [`Aarav Patel`, `Anita Sharma`, `Ravi Kumar`, `Maya Iyer`, `Sneha R`][i % 5] + ` ${i + 1}`,
        email: `user${i + 1}@company.com`,
        phone: `+91-9${Math.floor(100000000 + Math.random() * 900000000)}`,
        role: ["Staff", "Manager", "HR"][i % 3],
        department: ["Engineering", "Sales", "HR", "Finance"][i % 4],
        status: i % 7 === 0 ? "inactive" : "active",
      }));

      let filtered = all.filter((e) => {
        const matchQ = !query || e.name.toLowerCase().includes(query.toLowerCase()) || e.email.toLowerCase().includes(query.toLowerCase());
        const matchDept = !filterDept || e.department === filterDept;
        return matchQ && matchDept;
      });

      filtered = filtered.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));

      const tp = Math.max(1, Math.ceil(filtered.length / perPage));
      setTotalPages(tp);

      const start = (page - 1) * perPage;
      const pageItems = filtered.slice(start, start + perPage);

      setEmployees(pageItems);
    } catch (err) {
      console.error(err);
      alert("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterDept, sortKey, page]);

  function toggleSelect(id) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function handleCreate(payload) {
    setOpenCreate(false);
    setPage(1);
    fetchEmployees();
  }

  async function handleUpdate(payload) {
    setOpenEdit(false);
    setEditing(null);
    fetchEmployees();
  }

  async function handleDelete(id) {
    setConfirmDelete({ open: false, id: null });
    fetchEmployees();
  }

  async function handleBulkDelete() {
    clearSelection();
    fetchEmployees();
  }

  function exportCSV() {
    const rows = employees.map((e) => [e.id, e.name, e.email, e.phone, e.role, e.department, e.status]);
    const csv = ["id,name,email,phone,role,department,status", ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importCSV(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      alert("Imported file (demo) - implement parsing + API upload");
    };
    reader.readAsText(file);
  }

  const departments = ["Engineering", "Sales", "HR", "Finance"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Employees</h1>
            <div className="text-sm text-gray-500 mt-1">Manage employees: create, edit, export, and more.</div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex gap-2 w-full">
                <label className="flex items-center gap-2 cursor-pointer bg-white rounded-md px-3 py-2 border shadow-sm w-full sm:w-auto">
                  <Upload size={16} />
                  <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && importCSV(e.target.files[0])} className="hidden" />
                  <span className="text-sm hidden sm:inline">Import</span>
                </label>

                <button onClick={exportCSV} className="hidden sm:inline-flex items-center gap-2 bg-white border px-3 py-2 rounded-md">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            <button
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-md justify-center w-full sm:w-auto"
            >
              <Plus size={16} /> <span className="hidden sm:inline">Add Employee</span>
            </button>
          </div>
        </div>

        <Card>
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-1/2">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={16} /></span>
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search by name or email"
                  className="pl-10 pr-3 py-2 w-full rounded-md border text-sm"
                />
              </div>

              <select value={filterDept} onChange={(e) => { setFilterDept(e.target.value); setPage(1); }} className="rounded-md border px-3 py-2 text-sm w-full sm:w-auto">
                <option value="">All Departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>

              <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="rounded-md border px-3 py-2 text-sm w-full sm:w-auto">
                <option value="name">Sort: Name</option>
                <option value="email">Sort: Email</option>
                <option value="role">Sort: Role</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {selected.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selected.size} selected</span>
                  <button onClick={handleBulkDelete} className="px-3 py-1 rounded bg-red-50 text-red-700 text-sm">Delete</button>
                  <button onClick={clearSelection} className="px-3 py-1 rounded bg-white border text-sm">Clear</button>
                </div>
              )}
            </div>
          </div>


          {/* DESKTOP: Table for md+ */}
          <div className=" overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="py-3 px-2 w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) setSelected(new Set(employees.map((x) => x.id)));
                        else clearSelection();
                      }}
                      checked={employees.length > 0 && employees.every((x) => selected.has(x.id))}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 w-32">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="py-6 text-center">Loading...</td></tr>
                ) : employees.length === 0 ? (
                  <tr><td colSpan={8} className="py-6 text-center">No employees found</td></tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.id} className="border-t">
                      <td className="py-3 px-2">
                        <input type="checkbox" checked={selected.has(emp.id)} onChange={() => toggleSelect(emp.id)} aria-label={`Select ${emp.name}`} />
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={emp.name} size={36} />
                          <div>
                            <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                            <div className="text-xs text-gray-500">ID: {emp.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3"><div className="text-sm text-gray-700">{emp.email}</div></td>
                      <td className="py-3 px-3"><div className="text-sm text-gray-700">{emp.phone}</div></td>

                      <td className="py-3 px-3"><div className="text-sm text-gray-700">{emp.role}</div></td>
                      <td className="py-3 px-3"><div className="text-sm text-gray-700">{emp.department}</div></td>

                      <td className="py-3 px-3">
                        {emp.status === "active" ? <Badge color="green">Active</Badge> : <Badge color="red">Inactive</Badge>}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2 justify-end">
                          <IconButton title="Edit" onClick={() => { setEditing(emp); setOpenEdit(true); }}><Edit2 size={16} /></IconButton>
                          <IconButton title="Delete" onClick={() => setConfirmDelete({ open: true, id: emp.id })}><Trash2 size={16} /></IconButton>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* footer: pagination + meta */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-gray-600">Showing {employees.length} of {perPage * totalPages} items</div>
            <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
          </div>
        </Card>
      </div>

      {/* Create Modal */}
      <Modal open={openCreate} title="Add Employee" onClose={() => setOpenCreate(false)}>
        <EmployeeForm onSubmit={handleCreate} onCancel={() => setOpenCreate(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEdit} title="Edit Employee" onClose={() => { setOpenEdit(false); setEditing(null); }}>
        <EmployeeForm initial={editing || {}} onSubmit={handleUpdate} onCancel={() => { setOpenEdit(false); setEditing(null); }} />
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal open={confirmDelete.open} title="Confirm" onClose={() => setConfirmDelete({ open: false, id: null })}>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">Are you sure you want to delete this employee? This action cannot be undone.</p>
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button onClick={() => setConfirmDelete({ open: false, id: null })} className="px-3 py-2 rounded bg-white border w-full sm:w-auto">Cancel</button>
            <button onClick={() => handleDelete(confirmDelete.id)} className="px-3 py-2 rounded bg-red-600 text-white w-full sm:w-auto">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
