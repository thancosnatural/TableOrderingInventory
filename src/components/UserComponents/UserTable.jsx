// src/components/UserComponents/UsersTable.jsx
import React from "react";
import { Edit3, Trash2, RotateCcw } from "lucide-react";

function Th({ children, field, sort, onSortChange }) {
  const dir = sort.startsWith("-") ? "desc" : "asc";
  const current = sort.replace(/^-/, "");
  const next = current === field && dir === "asc" ? `-${field}` : field;

  return (
    <th
      className="px-3 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer select-none"
      onClick={() => onSortChange?.(next)}
      title="Sort"
    >
      <div className="inline-flex items-center gap-1">
        {children}
        {current === field && <span className="text-gray-400">{dir === "asc" ? "▲" : "▼"}</span>}
      </div>
    </th>
  );
}

export default function UsersTable({
  rows = [],
  sort,
  onSortChange,
  selectedIds = [],
  toggleSelect,
  onEdit,
  onSoftDelete,
  onRestore,
  onHardDelete,
  onToggleActive,
  onToggleVerified,
}) {
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const toggleAll = () => {
    if (allSelected) {
      rows.forEach((r) => selectedIds.includes(r.id) && toggleSelect(r.id));
    } else {
      rows.forEach((r) => !selectedIds.includes(r.id) && toggleSelect(r.id));
    }
  };

  return (
    <div className="overflow-x-auto bg-white border rounded">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all"
              />
            </th>
            <Th field="full_name" sort={sort} onSortChange={onSortChange}>Name</Th>
            <Th field="email" sort={sort} onSortChange={onSortChange}>Email</Th>
            <Th field="phone" sort={sort} onSortChange={onSortChange}>Phone</Th>
            <Th field="user_type" sort={sort} onSortChange={onSortChange}>Role</Th>
            <Th field="is_active" sort={sort} onSortChange={onSortChange}>Active</Th>
            <Th field="is_verified" sort={sort} onSortChange={onSortChange}>Verified</Th>
            <Th field="created_at" sort={sort} onSortChange={onSortChange}>Created</Th>
            <th className="px-3 py-2 text-right text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const deleted = !!r.deleted_at;
            return (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(r.id)}
                    onChange={() => toggleSelect(r.id)}
                    aria-label="Select row"
                  />
                </td>
                <td className="px-3 py-2 text-sm">
                  {r.full_name || `${r.first_name || ""} ${r.last_name || ""}`.trim() || "(no name)"}
                </td>
                <td className="px-3 py-2 text-sm">{r.email || "-"}</td>
                <td className="px-3 py-2 text-sm">{r.phone || "-"}</td>
                <td className="px-3 py-2 text-sm">{r.user_type}</td>

                <td className="px-3 py-2 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!r.is_active}
                      onChange={(e) => onToggleActive?.(r, e.target.checked)}
                      disabled={deleted}
                    />
                    <span className="text-xs text-gray-500">{r.is_active ? "Yes" : "No"}</span>
                  </label>
                </td>

                <td className="px-3 py-2 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!r.is_verified}
                      onChange={(e) => onToggleVerified?.(r, e.target.checked)}
                      disabled={deleted}
                    />
                    <span className="text-xs text-gray-500">{r.is_verified ? "Yes" : "No"}</span>
                  </label>
                </td>

                <td className="px-3 py-2 text-sm">
                  {new Date(r.created_at || r.createdAt || Date.now()).toLocaleString()}
                  {deleted && <span className="ml-2 text-rose-600 text-xs">(deleted)</span>}
                </td>

                <td className="px-3 py-2 text-sm">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit?.(r)}
                      className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-gray-50"
                      disabled={deleted}
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>

                    {!deleted ? (
                      <>
                        <button
                          onClick={() => onSoftDelete?.(r.id)}
                          className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-gray-50"
                          title="Soft delete"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                        <button
                          onClick={() => onHardDelete?.(r.id)}
                          className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-rose-50 text-rose-700"
                          title="Hard delete"
                        >
                          <Trash2 className="h-4 w-4" />
                          Hard
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onRestore?.(r.id)}
                        className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-gray-50"
                        title="Restore"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={9} className="px-3 py-6 text-center text-sm text-gray-500">
                No users
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
