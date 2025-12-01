import { Building2, CheckCircle2, Mail, Pencil, Phone, ShieldCheck, Store, XCircle } from "lucide-react";

function UserRow({ user, getRoleLabel, onEdit }) {
  const roleLabel = getRoleLabel(user.role);
  const isActive = user.is_active;

  return (
    <tr className="align-top">
      {/* User */}
      <td className="px-4 py-3">
        <div className="font-medium text-slate-900">{user.full_name}</div>
        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
          <Mail size={11} className="text-slate-400" />
          <span className="truncate max-w-[160px] md:max-w-none">
            {user.email}
          </span>
        </div>
      </td>

      {/* Contact */}
      <td className="px-4 py-3 text-xs text-slate-600">
        {user.phone && (
          <div className="flex items-center gap-1">
            <Phone size={11} className="text-slate-400" />
            <span>{user.phone}</span>
          </div>
        )}
      </td>

      {/* Brand / Outlet */}
      <td className="px-4 py-3 text-xs text-slate-600">
        <div className="flex items-center gap-1 mb-0.5">
          <Building2 size={11} className="text-slate-400" />
          <span>{user.brand_name || "-"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Store size={11} className="text-slate-400" />
          <span>{user.outlet_name || "-"}</span>
        </div>
      </td>

      {/* Role / Status / Edit */}
      <td className="px-4 py-3 text-right text-xs">
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[11px]">
            <ShieldCheck size={10} className="text-slate-500" />
            {roleLabel}
          </span>

          <span
            className={
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border " +
              (isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-slate-50 text-slate-500 border-slate-200")
            }
          >
            {isActive ? (
              <CheckCircle2 size={11} />
            ) : (
              <XCircle size={11} className="text-slate-400" />
            )}
            {isActive ? "Active" : "Inactive"}
          </span>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50"
            >
              <Pencil size={11} />
              Edit
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}


export default UserRow;