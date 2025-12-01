import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";


export function PayrollModal({ open, onClose, initial = {}, onSave }) {
  const [gross, setGross] = useState(initial.gross || 0);
  const [deductions, setDeductions] = useState(initial.deductions || 0);

  useEffect(() => {
    setGross(initial.gross || 0);
    setDeductions(initial.deductions || 0);
  }, [initial]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative z-10 w-full sm:max-w-md mx-auto bg-white rounded-t-lg sm:rounded-2xl shadow overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Payroll</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><ChevronDown size={18} /></button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-600">Gross Salary</label>
            <input type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Deductions</label>
            <input type="number" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 rounded bg-white border">Cancel</button>
            <button onClick={() => onSave({ gross, deductions })} className="px-3 py-2 rounded bg-yellow-500 text-white">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}