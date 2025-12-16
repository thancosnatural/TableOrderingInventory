// src/components/RoleComponents/RolesTable.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ---------- Small MenuPortal (desktop) ---------- */
function MenuPortal({ anchorRect, open, children, menuWidth = 200, gap = 8 }) {
  const elRef = useRef(null);
  if (!elRef.current && typeof document !== "undefined") {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;
    document.body.appendChild(node);
    return () => {
      if (document.body.contains(node)) document.body.removeChild(node);
    };
  }, []);

  useEffect(() => {
    const onWindowChange = () => {};
    window.addEventListener("resize", onWindowChange);
    window.addEventListener("scroll", onWindowChange, true);
    return () => {
      window.removeEventListener("resize", onWindowChange);
      window.removeEventListener("scroll", onWindowChange, true);
    };
  }, []);

  if (!open || !anchorRect || !elRef.current) return null;

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const rect = anchorRect;

  let left = rect.right - menuWidth;
  let top = rect.bottom + gap;

  if (left < 8) left = 8;
  if (left + menuWidth + 8 > vw) left = Math.max(8, vw - menuWidth - 8);

  const estimatedMenuHeight = 200;
  if (top + estimatedMenuHeight + 8 > vh) {
    top = Math.max(8, rect.top - estimatedMenuHeight - gap);
  }

  const style = {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 9999,
    minWidth: `${menuWidth}px`,
  };

  return createPortal(
    <div style={style} onClick={(e) => e.stopPropagation()}>
      <div className="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        {children}
      </div>
    </div>,
    elRef.current
  );
}

/* ---------- Full-screen action sheet (mobile) ---------- */
function ActionSheet({ open, role, onClose, children }) {
  const elRef = useRef(null);
  if (!elRef.current && typeof document !== "undefined") {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;
    document.body.appendChild(node);
    return () => {
      if (document.body.contains(node)) document.body.removeChild(node);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open || !elRef.current) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-xl shadow-lg p-4 max-h-[60vh] overflow-auto">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-3" />

        {role && (
          <div className="mb-2">
            <div className="text-sm text-gray-500">Actions for</div>
            <div className="text-base font-semibold text-gray-900">
              {role.name || role.code || "Role"}
            </div>
          </div>
        )}

        <div>{children}</div>

        <div className="mt-3">
          <button
            onClick={onClose}
            className="w-full text-sm py-2 rounded-md border bg-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    elRef.current
  );
}

/* ---------- Confirm modal (used for delete / deactivate) ---------- */
function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const elRef = useRef(null);
  if (!elRef.current && typeof document !== "undefined") {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;
    document.body.appendChild(node);
    return () => {
      if (document.body.contains(node)) document.body.removeChild(node);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  if (!open || !elRef.current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative max-w-md w-full bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-white border text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    elRef.current
  );
}

/* ---------- Main RolesTable component ---------- */
export default function RolesTable({
  roles = [],
  onEdit,
  onView,
  loading = false,
  onDelete,
  onToggleActive, // optional: (role) => Promise
}) {
  const [rows, setRows] = useState(roles || []);
  const [actionLoading, setActionLoading] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuAnchorRect, setMenuAnchorRect] = useState(null);

  // mobile action sheet state
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSheet, setMobileSheet] = useState({ open: false, role: null });

  // confirm modal state
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null, // "delete" | "active"
    role: null,
    loading: false,
  });

  useEffect(() => {
    setRows(roles || []);
  }, [roles]);

  // detect mobile on mount and on resize
  useEffect(() => {
    const check = () =>
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const setRowLoading = (id, kind, val) =>
    setActionLoading((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [kind]: val },
    }));

  // open menu: desktop -> portal menu; mobile -> action sheet
  const onOpenMenu = (e, id, role) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    setMenuAnchorRect(rect);

    if (isMobile) {
      setMobileSheet({ open: true, role });
      setOpenMenuId(null);
    } else {
      setOpenMenuId((prev) => (prev === id ? null : id));
    }
  };

  // open confirm modal
  const openConfirm = (type, role) => {
    setConfirmModal({ open: true, type, role, loading: false });
    setOpenMenuId(null);
    setMobileSheet({ open: false, role: null });
  };

  const closeConfirm = () =>
    setConfirmModal({ open: false, type: null, role: null, loading: false });

  const performDelete = async () => {
    const r = confirmModal.role;
    if (!r?.id) return;

    setConfirmModal((s) => ({ ...s, loading: true }));
    setRowLoading(r.id, "delete", true);

    await onDelete?.(r.id);

    setRowLoading(r.id, "delete", false);
    closeConfirm();
  };

  const performToggleActive = async () => {
    const r = confirmModal.role;
    if (!r?.id || !onToggleActive) return;

    setConfirmModal((s) => ({ ...s, loading: true }));
    setRowLoading(r.id, "active", true);

    await onToggleActive(r);

    setRowLoading(r.id, "active", false);
    closeConfirm();
  };

  const KebabIcon = ({ size = 18 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );

  // close menus on outside click and ESC
  useEffect(() => {
    const onDocClick = () => {
      setOpenMenuId(null);
      setMobileSheet({ open: false, role: null });
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setOpenMenuId(null);
        setMobileSheet({ open: false, role: null });
      }
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const getScope = (r) => r?.scope_type || r?.scopeType || "—";
  const isActive = (r) => (r?.is_active === undefined ? true : !!r?.is_active);

  /* ---------- Desktop table ---------- */
  const DesktopTable = () => (
    <div className="hidden md:block overflow-x-auto overflow-visible rounded-xl border bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
              Code
            </th>
            {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
              Scope
            </th> */}
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                Loading roles...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                No roles found.
              </td>
            </tr>
          ) : (
            rows.map((r) => {
              const id = r.id;
              const loadingDelete = actionLoading[id]?.delete;
              const loadingActive = actionLoading[id]?.active;
              const menuOpen = openMenuId === id;

              return (
                <tr key={id ?? r.code} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                        {(r?.display_name || r?.key || "R").slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {r?.display_name ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {r?.description ?? ""}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {r?.key ?? "—"}
                  </td>

                  {/* <td className="px-4 py-3 text-sm text-gray-700">
                    {getScope(r)}
                  </td> */}

                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex w-fit px-2 py-1 text-xs rounded-full ${
                        isActive(r)
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {isActive(r) ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => onOpenMenu(e, id, r)}
                      className="p-2 rounded-md hover:bg-gray-100 inline-flex items-center justify-center"
                      aria-haspopup="true"
                      aria-expanded={menuOpen}
                      title="Actions"
                    >
                      <span className="sr-only">Open actions</span>
                      <KebabIcon />
                    </button>

                    <MenuPortal anchorRect={menuAnchorRect} open={menuOpen}>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            onView?.(r);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </button>

                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            onEdit?.(r);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        {onToggleActive ? (
                          <>
                            <div className="border-t my-1" />
                            <button
                              onClick={() => openConfirm("active", r)}
                              disabled={loadingActive}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                loadingActive
                                  ? "opacity-60 cursor-wait text-gray-400"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {loadingActive
                                ? "..."
                                : isActive(r)
                                ? "Disable"
                                : "Enable"}
                            </button>
                          </>
                        ) : null}

                        <div className="border-t my-1" />

                        <button
                          onClick={() => openConfirm("delete", r)}
                          disabled={loadingDelete}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            loadingDelete
                              ? "opacity-60 cursor-wait text-red-400"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {loadingDelete ? "..." : "Delete"}
                        </button>
                      </div>
                    </MenuPortal>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  /* ---------- Mobile list (cards) ---------- */
  const MobileList = () => (
    <div className="md:hidden space-y-3">
      {loading ? (
        <div className="p-4 text-center text-sm text-gray-500">
          Loading roles...
        </div>
      ) : rows.length === 0 ? (
        <div className="p-4 text-center text-sm text-gray-500">
          No roles found.
        </div>
      ) : (
        rows.map((r) => {
          const id = r.id;

          return (
            <article
              key={id ?? r.code}
              className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                    {(r?.display_name || "R").slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {r?.display_name ?? "—"}
                    </div>
                    <div className="text-xs text-gray-500">{r?.key ?? "—"}</div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {/* <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">
                        {getScope(r)}
                      </span> */}

                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          isActive(r)
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {isActive(r) ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-1">
                  <button
                    onClick={(e) => onOpenMenu(e, id, r)}
                    className="p-2 rounded-md hover:bg-gray-100 inline-flex items-center justify-center"
                    aria-haspopup="true"
                    title="Actions"
                  >
                    <span className="sr-only">Open actions</span>
                    <KebabIcon />
                  </button>
                </div>
              </div>
            </article>
          );
        })
      )}
    </div>
  );

  /* ---------- Action sheet content for mobile ---------- */
  const MobileActionContent = ({ role }) => {
    if (!role) return null;
    const id = role.id;
    const loadingDelete = actionLoading[id]?.delete;
    const loadingActive = actionLoading[id]?.active;

    return (
      <div className="space-y-2">
        <button
          onClick={() => {
            setMobileSheet({ open: false, role: null });
            onView?.(role);
          }}
          className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50"
        >
          View
        </button>

        <button
          onClick={() => {
            setMobileSheet({ open: false, role: null });
            onEdit?.(role);
          }}
          className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50"
        >
          Edit
        </button>

        {onToggleActive ? (
          <>
            <div className="border-t my-1" />
            <button
              onClick={() => openConfirm("active", role)}
              disabled={loadingActive}
              className={`w-full text-left px-4 py-3 rounded-md ${
                loadingActive ? "opacity-60 cursor-wait" : "hover:bg-gray-50"
              }`}
            >
              {loadingActive ? "..." : isActive(role) ? "Disable" : "Enable"}
            </button>
          </>
        ) : null}

        <div className="border-t my-1" />

        <button
          onClick={() => openConfirm("delete", role)}
          disabled={loadingDelete}
          className={`w-full text-left px-4 py-3 rounded-md text-red-600 ${
            loadingDelete ? "opacity-60 cursor-wait" : "hover:bg-red-50"
          }`}
        >
          {loadingDelete ? "..." : "Delete"}
        </button>
      </div>
    );
  };

  const confirmTitle =
    confirmModal.type === "delete"
      ? `Delete role "${confirmModal.role?.name || confirmModal.role?.code || ""}"?`
      : `${isActive(confirmModal.role) ? "Disable" : "Enable"} role "${
          confirmModal.role?.name || confirmModal.role?.code || ""
        }"?`;

  const confirmDesc =
    confirmModal.type === "delete"
      ? "This action will permanently remove the role. This cannot be undone."
      : `This will ${isActive(confirmModal.role) ? "disable" : "enable"} this role immediately.`;

  const confirmLabel =
    confirmModal.type === "delete"
      ? "Delete"
      : isActive(confirmModal.role)
      ? "Disable"
      : "Enable";

  const confirmAction =
    confirmModal.type === "delete" ? performDelete : performToggleActive;

  return (
    <>
      <DesktopTable />
      <MobileList />

      <ActionSheet
        open={mobileSheet.open}
        role={mobileSheet.role}
        onClose={() => setMobileSheet({ open: false, role: null })}
      >
        <MobileActionContent role={mobileSheet.role} />
      </ActionSheet>

      <ConfirmModal
        open={confirmModal.open}
        title={confirmTitle}
        description={confirmDesc}
        confirmLabel={confirmLabel}
        cancelLabel="Cancel"
        loading={confirmModal.loading}
        onConfirm={confirmAction}
        onCancel={closeConfirm}
      />
    </>
  );
}
