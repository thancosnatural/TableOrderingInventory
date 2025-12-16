// src/components/Common/FilterBar.jsx
import React from "react";

/**
 * Reusable FilterBar
 *
 * @param {Array} filters - dropdown configs
 *  [
 *    {
 *      key: "industry",
 *      label: "Industry",
 *      ariaLabel: "Filter by industry",
 *      value: selectedIndustry,
 *      options: ["All", "SaaS", "Fintech"],
 *      onChange: (v) => setIndustry(v),
 *      hidden: false,
 *      className: "", // optional
 *    }
 *  ]
 *
 * @param {number} perPage
 * @param {function} onPerPageChange
 * @param {number[]} perPageOptions
 * @param {boolean} showPerPage
 */
export default function PageFilterBarSection({
  filters = [],
  perPage,
  onPerPageChange,
  perPageOptions = [6, 12, 24, 48],
  showPerPage = true,
  className = "",
}) {
  const visibleFilters = (filters || []).filter((f) => !f?.hidden);

  return (
    <div
      className={[
        "flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4",
        className,
      ].join(" ")}
    >
      {/* Left: filters */}
      <div className="flex flex-wrap items-center gap-3">
        {visibleFilters.map((f) => (
          <div key={f.key} className={["flex items-center gap-2", f.className || ""].join(" ")}>
            {/* visually hidden label for a11y */}
            <label className="sr-only">{f.label}</label>

            <select
              value={f.value ?? ""}
              onChange={(e) => f.onChange?.(e.target.value)}
              className="py-2 px-3 rounded-md border bg-white shadow-sm focus:outline-none"
              aria-label={f.ariaLabel || f.label}
              disabled={!!f.disabled}
            >
              {(f.options || []).map((opt) => {
                // allow string OR {label,value}
                const value = typeof opt === "string" ? opt : opt.value;
                const label = typeof opt === "string" ? opt : opt.label;
                return (
                  <option value={value} key={String(value)}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        ))}
      </div>

      {/* Right: per page */}
      {showPerPage && (
        <div className="flex items-center gap-2 sm:ml-auto">
          <label className="text-sm text-gray-600">Per page</label>
          <select
            value={Number(perPage || perPageOptions?.[0] || 12)}
            onChange={(e) => onPerPageChange?.(Number(e.target.value))}
            className="py-1 px-2 rounded-md border bg-white shadow-sm"
            aria-label="Items per page"
          >
            {perPageOptions.map((n) => (
              <option value={n} key={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
