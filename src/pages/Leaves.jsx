import React, { useEffect, useState } from "react";
import { Search, Calendar, Upload, Download, Plus, CheckCircle, XCircle, Trash2, FileText } from "lucide-react";
import { Card, Pagination } from "@/components/ReusableComponents";
import { LeaveRow } from "@/components/LeaveComponents/LeaveRow";
import { LeaveModal } from "@/components/LeaveComponents/LeaveModal";


// ---------------- Filters / Toolbar ----------------
export function LeaveFilters({ query, setQuery, from, setFrom, to, setTo, onImport, onExport, onApply }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={16} /></span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, ID or reason" className="pl-10 pr-3 py-2 w-full rounded-md border text-sm" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border rounded-md px-3 py-2 text-sm">
            <Calendar size={16} />
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="text-sm" />
            <span className="mx-1">—</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="text-sm" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer bg-white rounded-md px-3 py-2 border">
          <Upload size={16} />
          <input type="file" accept=".csv" onChange={(e) => onImport?.(e.target.files?.[0])} className="hidden" />
          <span className="text-sm hidden sm:inline">Import</span>
        </label>
        <button onClick={onExport} className="hidden sm:inline-flex items-center gap-2 bg-white border px-3 py-2 rounded-md"><Download size={16} /> Export</button>
        <button onClick={onApply} className="inline-flex items-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-md"><Plus size={16} /> New Leave</button>
      </div>
    </div>
  );
}

// ---------------- Main Leave Page ----------------
export default function LeavePage() {
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchData(); }, [query, from, to, page]);

  function fetchData() {
    setLoading(true);
    const all = Array.from({ length: 37 }).map((_, i) => {
      const start = new Date();
      start.setDate(start.getDate() - i);
      const end = new Date(start);
      end.setDate(start.getDate() + (i%3));
      return {
        id: 3000 + i,
        name: [`Aarav Patel`,`Anita Sharma`,`Ravi Kumar`,`Maya Iyer`,`Sneha R`][i%5] + ` ${i+1}`,
        type: ["Casual","Sick","Paid"][i%3],
        from: start.toISOString().slice(0,10),
        to: end.toISOString().slice(0,10),
        duration: (Math.abs((new Date(end) - new Date(start)) / (1000*60*60*24))) + 1,
        reason: ["Family event","Medical","Personal"][i%3],
        status: i%5===0 ? 'approved' : i%7===0 ? 'rejected' : 'pending',
      };
    });

    let filtered = all.filter(it => {
      const q = query.toLowerCase().trim();
      if (q && !(it.name.toLowerCase().includes(q) || String(it.id).includes(q) || it.reason.toLowerCase().includes(q))) return false;
      if (from && new Date(it.to) < new Date(from)) return false;
      if (to && new Date(it.from) > new Date(to)) return false;
      return true;
    });

    const tp = Math.max(1, Math.ceil(filtered.length / perPage));
    setTotalPages(tp);
    const startIdx = (page-1)*perPage;
    setItems(filtered.slice(startIdx, startIdx+perPage));
    setLoading(false);
  }

  function handleImport(file) { alert('Import leave CSV - implement parsing'); }
  function handleExport() {
    const rows = items.map(it => [it.id,it.name,it.type,it.from,it.to,it.duration,it.reason,it.status]);
    const csv = ['id,name,type,from,to,duration,reason,status', ...rows.map(r=>r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `leaves-export.csv`; a.click(); URL.revokeObjectURL(a.href);
  }

  function openNew() { setEditing(null); setModalOpen(true); }
  function openEdit(item) { setEditing(item); setModalOpen(true); }

  function handleSave(payload) {
    // call API to save
    setModalOpen(false); setEditing(null); fetchData();
  }

  function handleApprove(item) { if (confirm('Approve this leave?')) { /* API */ fetchData(); } }
  function handleReject(item) { if (confirm('Reject this leave?')) { /* API */ fetchData(); } }
  function handleView(item) { alert(JSON.stringify(item, null, 2)); }
  function handleDelete(item) { if (confirm('Delete leave request?')) { /* API */ fetchData(); } }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Leaves</h1>
            <div className="text-sm text-gray-500 mt-1">Manage leave requests and approvals.</div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => alert('Open leave settings (not implemented)')} className="px-3 py-2 bg-white rounded-md border">Settings</button>
          </div>
        </div>

        <Card className="mb-4">
          <LeaveFilters query={query} setQuery={setQuery} from={from} setFrom={setFrom} to={to} setTo={setTo} onImport={handleImport} onExport={handleExport} onApply={openNew} />
        </Card>

        <Card>
          

          {/* Desktop table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Dates</th>
                  <th className="py-3 px-3">Reason</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 w-44">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-6 text-center">Loading...</td></tr>
                ) : items.length===0 ? (
                  <tr><td colSpan={6} className="py-6 text-center">No leave requests</td></tr>
                ) : (
                  items.map(it => (
                    <LeaveRow key={it.id} leaf={it} onApprove={handleApprove} onReject={handleReject} onView={handleView} onDelete={handleDelete} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {items.length} of {perPage * totalPages} items</div>
            <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
          </div>
        </Card>

      </div>

      <LeaveModal open={modalOpen} onClose={() => setModalOpen(false)} initial={editing || {}} onSave={handleSave} />
    </div>
  );
}
