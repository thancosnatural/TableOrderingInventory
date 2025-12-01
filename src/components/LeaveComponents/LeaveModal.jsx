import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function LeaveModal({ open, onClose, initial = {}, onSave }) {
  const [type, setType] = useState(initial.type || "Casual");
  const [from, setFrom] = useState(initial.from || new Date().toISOString().slice(0,10));
  const [to, setTo] = useState(initial.to || new Date().toISOString().slice(0,10));
  const [reason, setReason] = useState(initial.reason || "");

  useEffect(() => {
    setType(initial.type || "Casual");
    setFrom(initial.from || new Date().toISOString().slice(0,10));
    setTo(initial.to || new Date().toISOString().slice(0,10));
    setReason(initial.reason || "");
  }, [initial]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative z-10 w-full sm:max-w-md mx-auto bg-white rounded-t-lg sm:rounded-2xl shadow overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial.id ? 'Edit Leave' : 'New Leave'}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><XCircle size={18} /></button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-600">Leave Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm">
              <option>Casual</option>
              <option>Sick</option>
              <option>Paid</option>
              <option>Unpaid</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600">From</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">To</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Reason</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"></textarea>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 rounded bg-white border">Cancel</button>
            <button onClick={() => onSave({ type, from, to, reason })} className="px-3 py-2 rounded bg-yellow-500 text-white">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}