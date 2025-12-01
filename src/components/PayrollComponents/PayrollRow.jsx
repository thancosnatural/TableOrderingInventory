import { Edit3, FileText, Trash2 } from "lucide-react";
import { IconButton } from "../ReusableComponents";

function fmtCurrency(n) {
  return `₹ ${Number(n).toLocaleString()}`;
}

export function PayrollRow({ row, onEdit, onPayslip, onDelete }) {
  return (
    <tr className="border-t">
      <td className="py-3 px-2">{row.id}</td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">{row.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
          <div>
            <div className="text-sm font-medium text-slate-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.designation}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 hidden sm:table-cell"><div className="text-sm text-gray-700">{fmtCurrency(row.gross)}</div></td>
      <td className="py-3 px-3 hidden md:table-cell"><div className="text-sm text-gray-700">{fmtCurrency(row.deductions)}</div></td>
      <td className="py-3 px-3"><div className="text-sm font-semibold">{fmtCurrency(row.net)}</div></td>
      <td className="py-3 px-3"><div className="text-sm text-gray-500">{row.status}</div></td>
      <td className="py-3 px-3 w-36">
        <div className="flex items-center gap-2 justify-end">
          <IconButton title="Payslip" onClick={() => onPayslip(row)}><FileText size={16} /></IconButton>
          <IconButton title="Edit" onClick={() => onEdit(row)}><Edit3 size={16} /></IconButton>
          <IconButton title="Delete" onClick={() => onDelete(row)}><Trash2 size={16} /></IconButton>
        </div>
      </td>
    </tr>
  );
}