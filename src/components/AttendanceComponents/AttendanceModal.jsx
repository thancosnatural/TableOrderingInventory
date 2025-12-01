import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function AttendanceModal({ open, onClose, onSave, initial = {} }) {
  const [status, setStatus] = useState(initial.status || "present");
  const [note, setNote] = useState(initial.note || "");

  useEffect(() => {
    setStatus(initial.status || "present");
    setNote(initial.note || "");
  }, [initial]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative z-10 w-full sm:max-w-md mx-auto bg-white rounded-t-lg sm:rounded-2xl shadow overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Mark Attendance</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><XCircle size={18} /></button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-600">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half">Half day</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Note (optional)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"></textarea>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 rounded bg-white border">Cancel</button>
            <button onClick={() => onSave({ status, note })} className="px-3 py-2 rounded bg-yellow-500 text-white">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}