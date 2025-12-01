// src/components/rbac/NewRoleSection.jsx
import React, { useEffect, useState } from "react";
import { Plus, Loader2, Check, X, Lock } from "lucide-react";
import PropTypes from "prop-types";

export function NewRoleSection({
  permissionsModel,
  canEdit,
  existingRoleKeys,
  onCreateRole,
}) {
  const [label, setLabel] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [perms, setPerms] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // init empty perms
    const empty = {};
    permissionsModel.forEach((perm) => {
      const actionsState = {};
      perm.actions.forEach((a) => {
        actionsState[a.key] = false;
      });
      empty[perm.key] = { module: false, actions: actionsState };
    });
    setPerms(empty);
  }, [permissionsModel]);

  // auto-generate key from label (if key not manually changed)
  useEffect(() => {
    if (!label.trim()) return;
    if (key.trim()) return;

    const generated = label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    setKey(generated);
  }, [label, key]);

  function toggleModule(permKey) {
    setPerms((prev) => {
      const current = prev[permKey] || { module: false, actions: {} };
      const newModuleState = !current.module;
      const newActions = { ...current.actions };

      const permDef = permissionsModel.find((p) => p.key === permKey);
      permDef?.actions.forEach((a) => {
        newActions[a.key] = newModuleState;
      });

      return {
        ...prev,
        [permKey]: {
          module: newModuleState,
          actions: newActions,
        },
      };
    });
  }

  function toggleAction(permKey, actionKey) {
    setPerms((prev) => {
      const current = prev[permKey] || { module: false, actions: {} };
      const newActions = {
        ...current.actions,
        [actionKey]: !current.actions[actionKey],
      };
      const anyEnabled = Object.values(newActions).some(Boolean);

      return {
        ...prev,
        [permKey]: {
          module: anyEnabled,
          actions: newActions,
        },
      };
    });
  }

  async function handleCreate(e) {
    e?.preventDefault();
    if (!canEdit) return;
    if (!label.trim() || !key.trim()) return;

    if (existingRoleKeys?.includes(key.trim())) {
      alert("Role key already exists. Please choose another.");
      return;
    }

    const trimmedKey = key.trim();

    const defaultModules = Object.entries(perms)
      .filter(([, v]) => v.module)
      .map(([k]) => k);

    const roleConfig = {
      key: trimmedKey,
      label: label.trim(),
      description: description.trim(),
      defaultModules,
    };

    setCreating(true);
    try {
      // Pass full permission structure so parent can save/update matrix
      await onCreateRole?.(roleConfig, perms);

      // reset form
      setLabel("");
      setKey("");
      setDescription("");
      const empty = {};
      permissionsModel.forEach((perm) => {
        const actionsState = {};
        perm.actions.forEach((a) => {
          actionsState[a.key] = false;
        });
        empty[perm.key] = { module: false, actions: actionsState };
      });
      setPerms(empty);
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Plus size={16} />
          Create New Role
        </h2>
        <span className="text-[11px] text-slate-500">
          Define a new role and choose exactly which permissions it should have.
        </span>
      </div>

      {!canEdit ? (
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
          <Lock size={14} className="text-slate-400" />
          Only Super Admin can create or edit roles.
        </div>
      ) : (
        <>
          {/* Form */}
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-[1.3fr,1fr] gap-4 items-start"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Kitchen Only, Auditor, Franchise Owner"
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Role Key (system identifier) *
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g. kitchen_only, auditor, franchise_owner"
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-slate-900/10"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Used internally in RBAC and APIs. Must be unique.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of what this role is meant for."
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="flex justify-end mt-1">
                <button
                  type="submit"
                  disabled={creating || !label.trim() || !key.trim()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-60"
                >
                  {creating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Creating Role...
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      Create Role
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Permissions for this new role */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 max-h-[360px] overflow-y-auto">
            <div className="px-3 py-2 border-b border-slate-200 bg-slate-100 flex items-center justify-between">
              <div className="text-[11px] font-semibold text-slate-700">
                Permissions for this new role
              </div>
              <div className="text-[11px] text-slate-500">
                Toggle modules and actions below.
              </div>
            </div>

            <table className="min-w-full text-xs">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                    Module
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] font-semibold text-slate-600 uppercase tracking-wide w-24">
                    Module On/Off
                  </th>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionsModel.map((perm) => {
                  const state = perms[perm.key] || { module: false, actions: {} };
                  const moduleEnabled = state.module;
                  const actionsState = state.actions || {};

                  return (
                    <tr key={perm.key} className="align-top">
                      <td className="px-3 py-2">
                        <div className="font-medium text-[12px] text-slate-900">
                          {perm.label}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {perm.desc}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleModule(perm.key)}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-full border transition-colors"
                        >
                          {moduleEnabled ? (
                            <span className="flex items-center justify-center h-full w-full rounded-full bg-emerald-50 border border-emerald-200">
                              <Check size={13} className="text-emerald-600" />
                            </span>
                          ) : (
                            <span className="flex items-center justify-center h-full w-full rounded-full bg-slate-50 border border-slate-200">
                              <X size={13} className="text-slate-400" />
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {perm.actions.map((a) => {
                            const enabled = !!actionsState[a.key];
                            return (
                              <button
                                key={a.key}
                                type="button"
                                onClick={() => toggleAction(perm.key, a.key)}
                                className={
                                  "px-1.5 py-0.5 rounded-full text-[10px] border leading-snug " +
                                  (enabled
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "bg-white text-slate-600 border-slate-200")
                                }
                              >
                                {a.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

NewRoleSection.propTypes = {
  permissionsModel: PropTypes.array.isRequired,
  canEdit: PropTypes.bool,
  existingRoleKeys: PropTypes.array,
  onCreateRole: PropTypes.func, // (roleConfig, perms) => Promise | void
};
