// src/components/UserComponents/UserFormModal.jsx
import React, { useEffect, useState } from "react";

export default function UserFormModal({ open, onClose, initial = null, onSave, roleOptions = [] }) {
  const [form, setForm] = useState({
    first_name: "", last_name: "", full_name: "",
    email: "", phone: "", password: "",
    user_type: "customer", is_active: false, is_verified: false,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        first_name: initial.first_name ?? "",
        last_name: initial.last_name ?? "",
        full_name: initial.full_name ?? "",
        email: initial.email ?? "",
        phone: initial.phone ?? "",
        password: "",
        user_type: initial.user_type ?? "customer",
        is_active: !!initial.is_active,
        is_verified: !!initial.is_verified,
      });
    } else {
      setForm({
        first_name: "", last_name: "", full_name: "",
        email: "", phone: "", password: "",
        user_type: "customer", is_active: false, is_verified: false,
      });
    }
  }, [initial]);

  if (!open) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    // If full_name is empty, derive from first/last
    if (!payload.full_name) {
      payload.full_name = `${payload.first_name || ""} ${payload.last_name || ""}`.trim() || null;
    }
    if (!payload.password) delete payload.password; // don't send empty password on edit
    onSave?.(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-3">
      <div className="w-full max-w-2xl rounded bg-white shadow">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">{initial ? "Edit user" : "Add user"}</h3>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
        </div>

        <form onSubmit={onSubmit} className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500">First name</label>
            <input
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Last name</label>
            <input
              value={form.last_name}
              onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500">Full name (optional)</label>
            <input
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="If empty, will be derived from first/last"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="+91…"
            />
          </div>

          {/* Only show password for create, or allow change explicitly */}
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500">Password {initial ? "(leave blank to keep unchanged)" : ""}</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500">Role</label>
            <select
              value={form.user_type}
              onChange={(e) => setForm((f) => ({ ...f, user_type: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <label className="inline-flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            <span className="text-sm">Active</span>
          </label>

          <label className="inline-flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={form.is_verified}
              onChange={(e) => setForm((f) => ({ ...f, is_verified: e.target.checked }))}
            />
            <span className="text-sm">Verified</span>
          </label>

          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="rounded bg-amber-500 hover:bg-amber-600 text-black px-3 py-2 text-sm">
              {initial ? "Save changes" : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
