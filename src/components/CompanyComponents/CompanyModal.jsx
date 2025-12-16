// src/components/CompanyComponents/CompanyModal.jsx
import React, { useMemo, useState, useCallback } from "react";
import EntityModal from "../PageSections/PageEntityModal";

const EMPTY_FORM = {
  name: "",
  legal_name: "",
  gst_or_tax_id: "",
  logo_url: "",
  industry: "",
  website: "",
  headquarters: "",
  verified: false,
  is_active: true,
};

const INDUSTRY_OPTIONS = [
  "Agriculture",
  "SaaS",
  "Ecommerce",
  "Healthcare",
  "Fintech",
  "Education",
  "Manufacturing",
  "Real Estate",
  "Hospitality",
  "Other",
];

export default function CompanyModal({ open, onClose, company, onSave }) {
  const [logoPreview, setLogoPreview] = useState(null);

  const fields = useMemo(
    () => [
      { key: "name", label: "Company Name", placeholder: "Company name", required: true, colSpan: 2 },
      { key: "legal_name", label: "Legal Name", placeholder: "Registered business name" },
      { key: "gst_or_tax_id", label: "GST / Tax ID", placeholder: "GST or Tax ID" },
      { key: "industry", label: "Industry", type: "select", options: INDUSTRY_OPTIONS, placeholder: "Select Industry" },
      { key: "website", label: "Website", placeholder: "https://example.com" },
      { key: "headquarters", label: "Headquarters", placeholder: "City, Country (e.g., Bengaluru, IN)", colSpan: 2 },
    ],
    []
  );

  const toggles = useMemo(
    () => [
      { key: "verified", title: "Verified", description: "Mark company as verified", color: "indigo" },
      { key: "is_active", title: "Active", description: "Enable company to appear in listings", color: "green" },
    ],
    []
  );

  const validate = useCallback((payload) => {
    const e = {};
    if (!payload.name?.trim()) e.name = "Company name is required.";
    if (
      payload.website &&
      payload.website.trim() &&
      !/^https?:\/\//i.test(payload.website)
    ) {
      e.website = "Website must start with http:// or https://";
    }
    return e;
  }, []);

  const handleLogoUpload = (file, setForm) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
      setForm((prev) => ({ ...prev, logo_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <EntityModal
      open={open}
      onClose={onClose}
      initialData={company ? {
        ...company,
        verified: !!company.verified,
        is_active: company.is_active === undefined ? true : !!company.is_active,
      } : null}
      emptyForm={EMPTY_FORM}
      titleCreate="Add Company"
      titleEdit="Edit Company"
      ariaLabelCreate="Add Company"
      ariaLabelEdit="Edit Company"
      fields={fields}
      toggles={toggles}
      validate={validate}
      onSave={onSave}
      renderExtra={({ form, setForm }) => (
        <>
          <label className="block text-sm mb-2">Logo</label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 border rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoPreview || form.logo_url ? (
                <img
                  src={logoPreview || form.logo_url}
                  alt="logo preview"
                  className="object-contain w-full h-full"
                />
              ) : (
                <span className="text-xs text-gray-500 p-2 text-center">No Logo</span>
              )}
            </div>

            <div className="flex-1 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoUpload(e.target.files?.[0], setForm)}
                className="block w-full text-sm text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-2">
                PNG / JPG recommended. Files are converted to Base64 for now.
              </p>
            </div>
          </div>
        </>
      )}
      footerLeftRender={({ form }) => (
        <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600">
          <div>
            Verified: <span className="font-medium ml-1">{form.verified ? "Yes" : "No"}</span>
          </div>
          <div>
            Active: <span className="font-medium ml-1">{form.is_active ? "Yes" : "No"}</span>
          </div>
        </div>
      )}
    />
  );
}
