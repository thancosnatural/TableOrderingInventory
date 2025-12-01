import { Edit3, Trash2 } from "lucide-react";
import { Badge, IconButton } from "../ReusableComponents";

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

export function AttendanceRow({ item, onEdit, onDelete, onToggle }) {
  return (
    <tr className="border-t">
      <td className="py-3 px-2">{item.id}</td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">{item.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
          <div>
            <div className="text-sm font-medium text-slate-900">{item.name}</div>
            <div className="text-xs text-gray-500">{item.designation}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 hidden sm:table-cell"><div className="text-sm text-gray-700">{item.shift}</div></td>
      <td className="py-3 px-3"><div className="text-sm">{formatDate(item.date)}</div></td>
      <td className="py-3 px-3"><div>{item.status === 'present' ? <Badge color="green">Present</Badge> : <Badge color="red">Absent</Badge>}</div></td>
      <td className="py-3 px-3 w-28">
        <div className="flex items-center gap-2 justify-end">
          <IconButton title="Edit" onClick={() => onEdit(item)}><Edit3 size={16} /></IconButton>
          <IconButton title="Delete" onClick={() => onDelete(item)}><Trash2 size={16} /></IconButton>
        </div>
      </td>
    </tr>
  );
}