// src/components/UserComponents/UsersHeader.jsx
import React from "react";
import { RefreshCw, Plus, Download } from "lucide-react";

export default function UsersHeader({
  q, onQChange,
  role, onRoleChange, roleOptions = [],
  active, onActiveChange,
  verified, onVerifiedChange,
  includeDeleted, onIncludeDeletedChange,
  onSearch, onAdd, onRefresh, onExport,
}) {
  return (
    <div className="bg-white border rounded p-3 mb-4">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search spans wider on larger screens */}
        <div className="sm:col-span-2 lg:col-span-2 min-w-0">
          <label className="block text-xs text-gray-600 mb-1">Search</label>
          <input
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
            placeholder="Name, email, phone…"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="min-w-0">
          <label className="block text-xs text-gray-600 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All</option>
            {roleOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label className="block text-xs text-gray-600 mb-1">Active</label>
          <select
            value={active}
            onChange={(e) => onActiveChange(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Any</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="min-w-0">
          <label className="block text-xs text-gray-600 mb-1">Verified</label>
          <select
            value={verified}
            onChange={(e) => onVerifiedChange(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Any</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 border rounded px-3 py-2 w-full">
            <input
              type="checkbox"
              checked={!!includeDeleted}
              onChange={(e) => onIncludeDeletedChange(e.target.checked)}
            />
            <span className="text-sm">Include deleted</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-gray-50"
          title="Export CSV"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-gray-50"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded bg-amber-500 hover:bg-amber-600 text-black px-3 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add user
        </button>
      </div>
    </div>
  );
}
