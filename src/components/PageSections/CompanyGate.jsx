import React from "react";
import CompanySelectFilter from "./PageCompanySelectionFilter";
// import CompanySelectFilter from "@/components/PageSections/CompanySelectFilter";

/**
 * CompanyGate
 * - Shows company selector when enabled
 * - Blocks children when no company selected
 *
 * props:
 * - enabled: boolean (isSuperAdmin)
 * - companies, loading
 * - selectedCompanyId
 * - onChange(companyIdStr)
 * - blockerText
 * - children
 */
export default function CompanyGate({
  enabled,
  companies,
  loading,
  selectedCompanyId,
  onChange,
  blockerText = "Select a company to view/manage data.",
  children,
}) {
  if (!enabled) return <>{children}</>;

  const hasCompany = Boolean(selectedCompanyId);

  return (
    <>
      <CompanySelectFilter
        value={selectedCompanyId ?? ""}
        companies={companies}
        loading={loading}
        onChange={onChange}
        helperText={blockerText}
      />

      {!hasCompany ? (
        <div className="bg-white border rounded-lg p-8 text-center text-sm text-gray-500">
          {blockerText}
        </div>
      ) : (
        children
      )}
    </>
  );
}
