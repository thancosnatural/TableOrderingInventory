import { FileText, Trash2 } from "lucide-react";
import { Badge, IconButton } from "../ReusableComponents";

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

export function LeaveRow({ leaf, onApprove, onReject, onView, onDelete }) {
  return (
    <tr className="border-t">
      <td className="py-3 px-2">{leaf.id}</td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">{leaf.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
          <div>
            <div className="text-sm font-medium text-slate-900">{leaf.name}</div>
            <div className="text-xs text-gray-500">{leaf.type} • {leaf.duration} days</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 hidden sm:table-cell"><div className="text-sm text-gray-700">{formatDate(leaf.from)} — {formatDate(leaf.to)}</div></td>
      <td className="py-3 px-3"><div className="text-sm">{leaf.reason}</div></td>
      <td className="py-3 px-3"><div>{leaf.status==='approved' ? <Badge color="green">Approved</Badge> : leaf.status==='rejected' ? <Badge color="red">Rejected</Badge> : <Badge color="yellow">Pending</Badge>}</div></td>
      <td className="py-3 px-3 w-44">
        <div className="flex items-center gap-2 justify-end">
          {leaf.status === 'pending' && (
            <>
              <button onClick={() => onApprove(leaf)} className="px-2 py-1 rounded bg-green-50 text-green-700 text-sm">Approve</button>
              <button onClick={() => onReject(leaf)} className="px-2 py-1 rounded bg-red-50 text-red-700 text-sm">Reject</button>
            </>
          )}
          <IconButton title="View" onClick={() => onView(leaf)}><FileText size={16} /></IconButton>
          <IconButton title="Delete" onClick={() => onDelete(leaf)}><Trash2 size={16} /></IconButton>
        </div>
      </td>
    </tr>
  );
}