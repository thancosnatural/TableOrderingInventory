// src/components/auth/RoleSelector.jsx
import React from "react";

export function RoleSelector({ roles, selectedRole, onSelect }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
        Select Role
      </p>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = selectedRole === role.key;

          return (
            <button
              key={role.key}
              onClick={() => onSelect(role.key)}
              className={
                "flex items-start gap-3 rounded-xl border px-3.5 py-3 transition-all " +
                (isActive
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300")
              }
            >
              <div
                className={
                  "h-8 w-8 flex items-center justify-center rounded-xl border " +
                  (isActive
                    ? "border-emerald-500 bg-emerald-100 text-emerald-600"
                    : "border-slate-200 bg-slate-50 text-slate-600")
                }
              >
                <Icon className="h-4 w-4" />
              </div>

              <div>
                <p
                  className={
                    "text-xs font-semibold " +
                    (isActive ? "text-emerald-700" : "text-slate-800")
                  }
                >
                  {role.label}
                </p>
                <p className="text-[11px] text-slate-500">
                  {role.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ActiveRoleBadge({ role }) {
  if (!role) return null;

  return (
    <div className="mb-6 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex justify-between items-center shadow-sm">
      <div>
        <p className="text-xs text-slate-500">Current role</p>
        <p className="text-sm font-semibold text-slate-900">{role.label}</p>
      </div>

      <span className="border border-slate-300 bg-white px-3 py-1 rounded-full text-[11px] text-slate-700">
        {role.key}
      </span>
    </div>
  );
}
