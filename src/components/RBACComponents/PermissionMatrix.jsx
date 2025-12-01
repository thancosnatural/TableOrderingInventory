// src/components/rbac/PermissionMatrix.jsx
import React from "react";
import { Check, X } from "lucide-react";
import PropTypes from "prop-types";

export function PermissionMatrix({
  permissionsModel,
  rolesConfig,
  permissions,
  canEdit,
  onToggleModule,
  onToggleAction,
}) {
  const roleKeys = rolesConfig.map((r) => r.key);
  const roleLabels = Object.fromEntries(
    rolesConfig.map((r) => [r.key, r.label || r.key])
  );

  if (!rolesConfig.length) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        No roles configured yet.
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
              Permission (Module) & Actions
            </th>
            {roleKeys.map((r) => (
              <th
                key={r}
                className="px-4 py-3 text-center text-[11px] font-semibold text-slate-600 uppercase tracking-wide"
              >
                {roleLabels[r]}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {permissionsModel.map((perm) => (
            <tr key={perm.key} className="text-sm align-top">
              <td className="px-4 py-3 align-top">
                <div className="font-medium text-slate-900 mb-0.5">
                  {perm.label}
                </div>
                <div className="text-xs text-slate-500 mb-1.5">
                  {perm.desc}
                </div>
                {perm.actions?.length > 0 && (
                  <div className="text-[11px] text-slate-500">
                    Actions:{" "}
                    {perm.actions.map((a, idx) => (
                      <span key={a.key}>
                        {a.label}
                        {idx < perm.actions.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                )}
              </td>

              {roleKeys.map((r) => {
                const moduleState = permissions[r]?.[perm.key];
                const moduleEnabled = moduleState?.module;
                const actionsState = moduleState?.actions || {};

                return (
                  <td
                    key={r}
                    className="px-4 py-3 text-center align-middle"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {/* Module toggle */}
                      <button
                        type="button"
                        disabled={!canEdit}
                        onClick={() => onToggleModule?.(r, perm.key)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-full border transition-colors"
                        style={{
                          cursor: canEdit ? "pointer" : "default",
                        }}
                        title={
                          moduleEnabled
                            ? "Click to disable this module for this role"
                            : "Click to enable this module for this role"
                        }
                      >
                        {moduleEnabled ? (
                          <span className="flex items-center justify-center h-full w-full rounded-full bg-emerald-50 border border-emerald-200">
                            <Check size={14} className="text-emerald-600" />
                          </span>
                        ) : (
                          <span className="flex items-center justify-center h-full w-full rounded-full bg-slate-50 border border-slate-200">
                            <X size={14} className="text-slate-400" />
                          </span>
                        )}
                      </button>

                      {/* Actions */}
                      <div className="flex flex-wrap justify-center gap-1 max-w-[150px]">
                        {perm.actions.map((a) => {
                          const enabled = !!actionsState[a.key];
                          return (
                            <button
                              key={a.key}
                              type="button"
                              disabled={!canEdit}
                              onClick={() =>
                                onToggleAction?.(r, perm.key, a.key)
                              }
                              className={
                                "px-1.5 py-0.5 rounded-full text-[10px] border leading-snug " +
                                (enabled
                                  ? "bg-slate-900 text-white border-slate-900"
                                  : "bg-slate-50 text-slate-500 border-slate-200")
                              }
                              style={{
                                cursor: canEdit ? "pointer" : "default",
                              }}
                              title={`${a.label} for ${roleLabels[r]} on ${perm.label}`}
                            >
                              {a.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

PermissionMatrix.propTypes = {
  permissionsModel: PropTypes.array.isRequired,
  rolesConfig: PropTypes.array.isRequired,
  permissions: PropTypes.object.isRequired,
  canEdit: PropTypes.bool,
  onToggleModule: PropTypes.func,
  onToggleAction: PropTypes.func,
};
