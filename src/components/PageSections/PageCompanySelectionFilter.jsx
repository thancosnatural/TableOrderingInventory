import React from "react";

/**
 * CompanySelectFilter
 * - Used for Super Admin screens where user must pick a company before viewing data
 *
 * props:
 * - value: selectedCompanyId (string|number|"")
 * - companies: array
 * - loading: boolean
 * - onChange: (companyIdStr) => void
 * - label?: string
 * - placeholder?: string
 * - helperText?: string
 */
export default function CompanySelectFilter({
  value = "",
  companies = [],
  loading = false,
  onChange,
  label = "Company",
  placeholder = "Select company",
  helperText = "Select a company to view/manage data.",
}) {
  const hasSelection = Boolean(value);

  return (
    <div className="w-full flex flex-col items-end justify-end mb-4">
      <div className="flex flex-col gap-3">
        <select
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full sm:w-[360px] py-2 px-3 rounded-md border bg-white shadow-sm focus:outline-none"
        >
          <option value="">{placeholder}</option>
          {companies?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.company_code ? `(${c.company_code})` : ""}
            </option>
          ))}
        </select>

        {loading ? (
          <div className="text-xs text-gray-500">Loading companies...</div>
        ) : null}
      </div>

      {!hasSelection ? (
        <div className="mt-2 text-xs text-amber-600">{helperText}</div>
      ) : null}
    </div>
  );
}
