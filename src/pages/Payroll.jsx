import React, { useEffect, useState } from "react";
import { Download, Upload, Search, Plus } from "lucide-react";
import { Card, Pagination } from "@/components/ReusableComponents";
import { PayrollModal } from "@/components/PayrollComponents/PayrollModal";
import { PayrollRow } from "@/components/PayrollComponents/PayrollRow";


// ---------------- Toolbar / Filters ----------------
export function PayrollFilters({ month, setMonth, query, setQuery, onImport, onExport, onRun }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={16} /></span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or ID" className="pl-10 pr-3 py-2 w-full rounded-md border text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <select value={month} onChange={(e)=>setMonth(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
            <option value="2025-11">Nov 2025</option>
            <option value="2025-10">Oct 2025</option>
            <option value="2025-09">Sep 2025</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer bg-white rounded-md px-3 py-2 border">
          <Upload size={16} />
          <input type="file" accept=".csv" onChange={(e)=>onImport?.(e.target.files?.[0])} className="hidden" />
          <span className="text-sm hidden sm:inline">Import</span>
        </label>
        <button onClick={onExport} className="hidden sm:inline-flex items-center gap-2 bg-white border px-3 py-2 rounded-md"><Download size={16} /> Export</button>
        <button onClick={onRun} className="inline-flex items-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-md"><Plus size={16} /> Run Payroll</button>
      </div>
    </div>
  );
}

// ---------------- Payslip generator (mock) ----------------
function downloadPayslip(row) {
  // mock PDF generation: create a text file for demo
  const content = `Payslip for ${row.name}\nNet: ${row.net}\nMonth: ${row.month}`;
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `payslip-${row.id}-${row.month}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------------- Main Payroll Page ----------------
export default function PayrollPage() {
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("2025-11");
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchData(); }, [query, month, page]);

  function fetchData() {
    setLoading(true);
    // mock data
    const all = Array.from({ length: 48 }).map((_, i) => {
      const gross = 30000 + (i % 10) * 1500;
      const deductions = Math.round(gross * (0.08 + (i%5)/100));
      const net = gross - deductions;
      return {
        id: 2000 + i,
        name: [`Aarav Patel`, `Anita Sharma`, `Ravi Kumar`, `Maya Iyer`, `Sneha R`][i%5] + ` ${i+1}`,
        designation: ["Developer","HR","Sales","Designer"][i%4],
        gross,
        deductions,
        net,
        status: i%6===0 ? 'Pending' : 'Processed',
        month,
      };
    });

    let filtered = all.filter(it => {
      const q = query.toLowerCase().trim();
      if (!q) return true;
      return it.name.toLowerCase().includes(q) || String(it.id).includes(q);
    });

    const tp = Math.max(1, Math.ceil(filtered.length / perPage));
    setTotalPages(tp);
    const start = (page-1)*perPage;
    setItems(filtered.slice(start,start+perPage));
    setLoading(false);
  }

  function handleImport(file) {
    alert('Import CSV - implement parsing and API upload');
  }

  function handleExport() {
    const rows = items.map(it => [it.id, it.name, it.designation, it.gross, it.deductions, it.net, it.status]);
    const csv = ['id,name,designation,gross,deductions,net,status', ...rows.map(r=>r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `payroll-${month}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function handleRunPayroll() {
    // simulate processing
    alert('Payroll run triggered (demo). In production, call your payroll processing API');
  }

  function handleEdit(row) { setEditing(row); setModalOpen(true); }
  function handleSave(updated) {
    // update row on server
    setModalOpen(false); setEditing(null); fetchData();
  }
  function handleDelete(row) { if (confirm('Delete payroll entry?')) fetchData(); }
  function handlePayslip(row) { downloadPayslip(row); }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payroll</h1>
            <div className="text-sm text-gray-500 mt-1">Run payroll, generate payslips and export reports.</div>
          </div>

          <div className="flex items-center gap-2">
            <Card className="px-3 py-2">
              <div className="text-sm text-gray-500">Selected Month</div>
              <div className="text-sm font-medium">{month}</div>
            </Card>

            <button onClick={() => alert('Open payroll settings (not implemented)')} className="px-3 py-2 bg-white rounded-md border">Settings</button>
          </div>
        </div>

        <Card className="mb-4">
          <PayrollFilters month={month} setMonth={setMonth} query={query} setQuery={setQuery} onImport={handleImport} onExport={handleExport} onRun={handleRunPayroll} />
        </Card>

        <Card>
        

          {/* Desktop: table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Gross</th>
                  <th className="py-3 px-3">Deductions</th>
                  <th className="py-3 px-3">Net</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 w-36">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-6 text-center">Loading...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={7} className="py-6 text-center">No records</td></tr>
                ) : (
                  items.map(r => (
                    <PayrollRow key={r.id} row={r} onEdit={handleEdit} onPayslip={handlePayslip} onDelete={handleDelete} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-gray-600">Showing {items.length} of {perPage * totalPages} items</div>
            <Pagination page={page} totalPages={totalPages} onChange={(p)=>setPage(p)} />
          </div>
        </Card>

      </div>

      <PayrollModal open={modalOpen} onClose={() => setModalOpen(false)} initial={editing || {}} onSave={handleSave} />
    </div>
  );
}
