import { ShieldCheck } from "lucide-react";

const RolesSummary = ({
  rolesConfigState,
  getRoleLabel,
  getRoleDescription,
}) => {
  if (!rolesConfigState.length) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 text-xs text-slate-500">
        No roles yet. Once roles exist, their usage will appear here.
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <ShieldCheck size={16} />
          Roles Overview
        </h2>
        <span className="text-[11px] text-slate-500">
          Snapshot of your RBAC model.
        </span>
      </div>

      <div className="space-y-3">
        {rolesConfigState.map((r) => (
          <div
            key={r.key}
            className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
          >
            <div>
              <div className="text-xs font-semibold text-slate-900">
                {getRoleLabel(r.key)}{" "}
                <span className="text-[10px] text-slate-400">({r.key})</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {getRoleDescription(r.key)}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-900">
                {r.user_count}
              </span>
              <span className="text-[10px] text-slate-500">users</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RolesSummary;