// src/components/Common/EntityModal.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Toggle from "../FormComponents/Toggle";
import Field from "../FormComponents/Field";

const defaultEmpty = {};

/**
 * EntityModal (Reusable)
 *
 * props:
 * - open, onClose
 * - mode: "create" | "edit" (optional)
 * - titleCreate / titleEdit
 * - initialData: object | null
 * - emptyForm: object (defaults)
 * - fields: [{ key, label, placeholder, required, colSpan, type, options, disabled }]
 * - toggles: [{ key, title, description, color }]
 * - validate: (payload) => errorsObj
 * - onSave: async (payload) => any
 * - renderExtra: ({ form, setForm, errors, setErrors }) => ReactNode  // for logo upload etc.
 */
export default function EntityModal({
  open,
  onClose,
  mode, // optional
  titleCreate = "Add",
  titleEdit = "Edit",
  ariaLabelCreate = "Add",
  ariaLabelEdit = "Edit",

  initialData = null,
  emptyForm = defaultEmpty,

  fields = [],
  toggles = [],

  validate,
  onSave,

  renderExtra,

  footerLeftRender, // optional (show summary etc.)
}) {
  const computedMode = useMemo(() => {
    if (mode) return mode;
    return initialData ? "edit" : "create";
  }, [mode, initialData]);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // sync incoming data -> form
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    } else {
      setForm({ ...emptyForm });
    }
    setErrors({});
  }, [open, initialData, emptyForm]);

  // prevent background scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const setValue = useCallback((key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleSave = useCallback(async () => {
    const payload = { ...form };

    const v = typeof validate === "function" ? validate(payload) : {};
    if (v && Object.keys(v).length > 0) {
      setErrors(v);

      const firstKey = Object.keys(v)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el) el.focus();
      return;
    }

    try {
      setSaving(true);
      await onSave?.(payload);
    } catch (err) {
      setErrors({ _global: err?.message || "Failed to save" });
    } finally {
      setSaving(false);
    }
  }, [form, validate, onSave]);

  if (!open) return null;

  const title = computedMode === "edit" ? titleEdit : titleCreate;
  const ariaLabel = computedMode === "edit" ? ariaLabelEdit : ariaLabelCreate;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Container */}
      <div className="relative z-10 w-full max-w-4xl sm:mx-auto">
        <div className="bg-white sm:rounded-xl sm:shadow-lg w-full h-[92vh] sm:h-auto max-h-[92vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-gray-600 hover:text-gray-900 p-2 rounded"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="overflow-auto px-4 py-4 sm:py-6" style={{ paddingBottom: 112 }}>
            {errors._global && <div className="mb-3 text-sm text-red-600">{errors._global}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => {
                const spanBoth = field.colSpan === 2;
                const val = form[field.key];
                const err = errors[field.key];

                return (
                  <div key={field.key} className={spanBoth ? "md:col-span-2" : ""}>
                    <label className="block text-sm mb-1">
                      {field.label}
                      {field.required ? " *" : ""}
                    </label>

                    <Field field={field} value={val} error={err} onChange={setValue} />

                    {err ? <div className="text-xs text-red-600 mt-1">{err}</div> : null}
                  </div>
                );
              })}

              {/* Toggles row */}
              {toggles?.length ? (
                <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 mt-1">
                  {toggles.map((t) => (
                    <div key={t.key} className="flex items-center gap-3">
                      <Toggle
                        checked={!!form[t.key]}
                        onChange={(v) => setValue(t.key, v)}
                        color={t.color || "indigo"}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{t.title}</div>
                        {t.description ? (
                          <div className="text-xs text-gray-500">{t.description}</div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Custom extra section(s) like logo upload */}
              {typeof renderExtra === "function" ? (
                <div className="md:col-span-2">
                  {renderExtra({ form, setForm, errors, setErrors })}
                </div>
              ) : null}
            </div>
          </div>

          {/* Sticky Footer */}
          <div
            className="absolute left-0 right-0 bottom-0 bg-white border-t px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
            style={{ boxShadow: "0 -6px 18px rgba(0,0,0,0.06)" }}
          >
            <div className="flex-1 flex items-center gap-2">
              {typeof footerLeftRender === "function"
                ? footerLeftRender({ form })
                : null}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded border bg-white text-gray-700">
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded text-white ${
                  saving ? "bg-gray-400" : "bg-indigo-600"
                } min-w-[96px]`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




