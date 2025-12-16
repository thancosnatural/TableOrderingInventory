// src/components/Common/ResponsiveDataTable.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import KebabIcon from "./KebabIcon";

/* ---------- Portal Menu (desktop) ---------- */
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

  if (!open || !anchorRect || !elRef.current) return null;

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const rect = anchorRect;

  let left = rect.right - menuWidth;
  let top = rect.bottom + gap;

  if (left < 8) left = 8;
  if (left + menuWidth + 8 > vw) left = Math.max(8, vw - menuWidth - 8);

  const estimatedMenuHeight = 220;
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

/* ---------- Action Sheet (mobile) ---------- */
function ActionSheet({ open, title, subtitle, onClose, children }) {
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
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open || !elRef.current) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-xl shadow-lg p-4 max-h-[60vh] overflow-auto">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-3" />

        {(title || subtitle) && (
          <div className="mb-3">
            {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
            {title && <div className="text-base font-semibold text-gray-900">{title}</div>}
          </div>
        )}

        <div>{children}</div>

        <div className="mt-3">
          <button onClick={onClose} className="w-full text-sm py-2 rounded-md border bg-white">
            Close
          </button>
        </div>
      </div>
    </div>,
    elRef.current
  );
}

/* ---------- Confirm Modal (generic) ---------- */
function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
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
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  if (!open || !elRef.current) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative max-w-md w-full bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description ? <p className="mt-2 text-sm text-gray-600">{description}</p> : null}
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

/* ---------- Icons ---------- */
// function KebabIcon({ size = 18 }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
//       <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
//     </svg>
//   );
// }

/**
 * ResponsiveDataTable (Reusable)
 *
 * columns: [{ key, header, className, thClassName, render: (item) => ReactNode }]
 * actions: (item) => [{ key, label, variant, onClick, disabled, requireConfirm, confirmTitle, confirmDescription, confirmLabel }]
 *
 * renderMobileCard: (item, openActions) => ReactNode
 */
export default function ResponsiveDataTable({
  items = [],
  loading = false,

  // Desktop table config
  columns = [],
  rowKey = (item) => item?.id ?? item?._id ?? item?.uuid,

  // Empty/loading texts
  loadingText = "Loading...",
  emptyText = "No records found.",

  // Actions
  actions = null, // function(item) -> action list
  menuWidth = 220,

  // Mobile rendering
  renderMobileCard = null,

  // Confirm modal defaults
  confirmDangerLabel = "Delete",
  confirmDangerDescription = "This action cannot be undone.",
  getItemLabel = (item) => item?.name ?? item?.title ?? String(rowKey(item) ?? ""),

  // Optional: called when user confirms a dangerous action (you can still handle inside action.onClick)
  // Here we keep everything action-driven, but modal uses this to show loading per-row
}) {
  const [rows, setRows] = useState(items || []);
  const [actionLoading, setActionLoading] = useState({});
  const [openMenuKey, setOpenMenuKey] = useState(null);
  const [menuAnchorRect, setMenuAnchorRect] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  const [mobileSheet, setMobileSheet] = useState({ open: false, item: null });

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    item: null,
    action: null,
    loading: false,
  });

  useEffect(() => setRows(items || []), [items]);

  // detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // close on outside click / ESC
  useEffect(() => {
    const onDocClick = () => {
      setOpenMenuKey(null);
      setMobileSheet({ open: false, item: null });
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setOpenMenuKey(null);
        setMobileSheet({ open: false, item: null });
      }
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const setRowLoading = useCallback((key, kind, val) => {
    setActionLoading((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [kind]: val },
    }));
  }, []);

  const openActions = useCallback(
    (e, item) => {
      e?.stopPropagation?.();
      const rect = e?.currentTarget?.getBoundingClientRect?.();
      if (rect) setMenuAnchorRect(rect);

      const key = rowKey(item);

      if (isMobile) {
        setMobileSheet({ open: true, item });
        setOpenMenuKey(null);
      } else {
        setOpenMenuKey((prev) => (prev === key ? null : key));
      }
    },
    [isMobile, rowKey]
  );

  const closeConfirm = () =>
    setConfirmModal({ open: false, item: null, action: null, loading: false });

  const openConfirm = (item, actionObj) => {
    setConfirmModal({ open: true, item, action: actionObj, loading: false });
    setOpenMenuKey(null);
    setMobileSheet({ open: false, item: null });
  };

  const performConfirmAction = async () => {
    const { item, action } = confirmModal;
    if (!item || !action?.onClick) return;

    const key = rowKey(item);
    const kind = action.key || "danger";

    setConfirmModal((s) => ({ ...s, loading: true }));
    setRowLoading(key, kind, true);

    try {
      await action.onClick(item);
    } finally {
      setRowLoading(key, kind, false);
      closeConfirm();
    }
  };

  const actionListForItem = useCallback(
    (item) => (typeof actions === "function" ? actions(item) || [] : []),
    [actions]
  );

  const hasActions = useMemo(() => typeof actions === "function", [actions]);

  /* ---------- Desktop table ---------- */
  const DesktopTable = () => (
    <div className="hidden md:block overflow-x-auto overflow-visible rounded-xl border bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  "px-4 py-3 text-left text-xs font-semibold text-gray-600",
                  col.thClassName || "",
                ].join(" ")}
              >
                {col.header}
              </th>
            ))}

            {hasActions && (
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                {loadingText}
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((item) => {
              const key = rowKey(item);
              const isMenuOpen = openMenuKey === key;

              const itemActions = actionListForItem(item);

              return (
                <tr key={String(key)} className="hover:bg-gray-50 transition">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={["px-4 py-3", col.className || ""].join(" ")}
                    >
                      {col.render ? col.render(item) : item?.[col.key] ?? "—"}
                    </td>
                  ))}

                  {hasActions && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => openActions(e, item)}
                        className="p-2 rounded-md hover:bg-gray-100 inline-flex items-center justify-center"
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                        title="Actions"
                      >
                        <span className="sr-only">Open actions</span>
                        <KebabIcon />
                      </button>

                      <MenuPortal
                        anchorRect={menuAnchorRect}
                        open={isMenuOpen}
                        menuWidth={menuWidth}
                      >
                        <div className="py-1">
                          {itemActions.map((a) => {
                            const kind = a.key || a.label || "action";
                            const disabled =
                              !!a.disabled || !!actionLoading[key]?.[kind];

                            const base =
                              "w-full text-left px-4 py-2 text-sm";
                            const danger =
                              "text-red-600 hover:bg-red-50";
                            const normal =
                              "text-gray-700 hover:bg-gray-50";
                            const cls = [
                              base,
                              a.variant === "danger" ? danger : normal,
                              disabled ? "opacity-60 cursor-wait" : "",
                            ].join(" ");

                            return (
                              <button
                                key={a.key || a.label}
                                disabled={disabled}
                                onClick={() => {
                                  setOpenMenuKey(null);

                                  if (a.requireConfirm) {
                                    openConfirm(item, a);
                                    return;
                                  }

                                  a.onClick?.(item);
                                }}
                                className={cls}
                              >
                                {disabled ? "..." : a.label}
                              </button>
                            );
                          })}
                        </div>
                      </MenuPortal>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  /* ---------- Mobile list ---------- */
  const MobileList = () => (
    <div className="md:hidden space-y-3">
      {loading ? (
        <div className="p-4 text-center text-sm text-gray-500">{loadingText}</div>
      ) : rows.length === 0 ? (
        <div className="p-4 text-center text-sm text-gray-500">{emptyText}</div>
      ) : (
        rows.map((item) => {
          const key = rowKey(item);
          return (
            <div key={String(key)}>
              {renderMobileCard ? (
                renderMobileCard(item, (e) => openActions(e, item))
              ) : (
                <article className="bg-white border rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-gray-900 font-medium">
                      {getItemLabel(item)}
                    </div>
                    {hasActions && (
                      <button
                        onClick={(e) => openActions(e, item)}
                        className="p-2 rounded-md hover:bg-gray-100 inline-flex items-center justify-center"
                        aria-haspopup="true"
                        title="Actions"
                      >
                        <span className="sr-only">Open actions</span>
                        <KebabIcon />
                      </button>
                    )}
                  </div>
                </article>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const MobileSheetContent = () => {
    const item = mobileSheet.item;
    if (!item) return null;

    const key = rowKey(item);
    const itemActions = actionListForItem(item);

    return (
      <div className="space-y-2">
        {itemActions.map((a) => {
          const kind = a.key || a.label || "action";
          const disabled = !!a.disabled || !!actionLoading[key]?.[kind];

          const cls = [
            "w-full text-left px-4 py-3 rounded-md",
            a.variant === "danger"
              ? disabled
                ? "text-red-400"
                : "text-red-600 hover:bg-red-50"
              : disabled
              ? "text-gray-400"
              : "hover:bg-gray-50",
            disabled ? "opacity-60 cursor-wait" : "",
          ].join(" ");

          return (
            <button
              key={a.key || a.label}
              disabled={disabled}
              onClick={() => {
                setMobileSheet({ open: false, item: null });

                if (a.requireConfirm) {
                  openConfirm(item, a);
                  return;
                }
                a.onClick?.(item);
              }}
              className={cls}
            >
              {disabled ? "..." : a.label}
            </button>
          );
        })}
      </div>
    );
  };

  const confirmTitle = confirmModal.action?.confirmTitle
    ? confirmModal.action.confirmTitle(confirmModal.item)
    : `${confirmDangerLabel} "${getItemLabel(confirmModal.item)}"?`;

  const confirmDescription =
    (typeof confirmModal.action?.confirmDescription === "function"
      ? confirmModal.action.confirmDescription(confirmModal.item)
      : confirmModal.action?.confirmDescription) || confirmDangerDescription;

  const confirmLabel = confirmModal.action?.confirmLabel || confirmDangerLabel;

  return (
    <>
      <DesktopTable />
      <MobileList />

      {/* Mobile action sheet */}
      <ActionSheet
        open={mobileSheet.open}
        title={getItemLabel(mobileSheet.item)}
        subtitle="Actions for"
        onClose={() => setMobileSheet({ open: false, item: null })}
      >
        <MobileSheetContent />
      </ActionSheet>

      {/* Confirm modal (for dangerous actions) */}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        loading={confirmModal.loading}
        onConfirm={performConfirmAction}
        onCancel={closeConfirm}
      />
    </>
  );
}
