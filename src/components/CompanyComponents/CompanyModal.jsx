// src/components/CompanyComponents/CompanyModal.jsx
import { useEffect, useState, useCallback } from "react";

const EMPTY_FORM = {
  name: "",
  legal_name: "",
  gst_or_tax_id: "",
  logo_url: "", // Base64 string
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

const FIELD_CONFIG = [
  { key: "name", label: "Company Name *", placeholder: "Company name", required: true, colSpan: 2 },
  { key: "legal_name", label: "Legal Name", placeholder: "Registered business name" },
  { key: "gst_or_tax_id", label: "GST / Tax ID", placeholder: "GST or Tax ID" },
  { key: "industry", label: "Industry", type: "select", options: INDUSTRY_OPTIONS },
  { key: "website", label: "Website", placeholder: "https://example.com" },
  { key: "headquarters", label: "Headquarters", placeholder: "City, Country (e.g., Bengaluru, IN)", colSpan: 2 },
];

function Toggle({ checked, onChange, onLabel = "On", offLabel = "Off", color = "indigo" }) {
  const bgOn = color === "green" ? "bg-green-600" : "bg-indigo-600";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center h-7 w-12 rounded-full p-1 transition-colors focus:outline-none ${checked ? bgOn : "bg-gray-200"}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

const CompanyModal = ({ open, onClose, company, onSave }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  // sync incoming company -> form
  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || "",
        legal_name: company.legal_name || "",
        gst_or_tax_id: company.gst_or_tax_id || "",
        logo_url: company.logo_url || "",
        industry: company.industry || "",
        website: company.website || "",
        headquarters: company.headquarters || "",
        verified: !!company.verified,
        is_active: company.is_active === undefined ? true : !!company.is_active,
      });
      setLogoPreview(company.logo_url || null);
    } else {
      setForm(EMPTY_FORM);
      setLogoPreview(null);
    }
    setErrors({});
  }, [company, open]);

  // prevent background scroll when modal open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [open]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const validate = useCallback((payload) => {
    const e = {};
    if (!payload.name?.trim()) e.name = "Company name is required.";
    if (payload.website && payload.website.trim() && !/^https?:\/\//i.test(payload.website))
      e.website = "Website must start with http:// or https://";
    return e;
  }, []);

  const handleLogoUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
      setForm((prev) => ({ ...prev, logo_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const payload = { ...form };
    const v = validate(payload);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      // focus first error field (nice UX)
      const firstKey = Object.keys(v)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el) el.focus();
      return;
    }

    try {
      setSaving(true);
      await onSave(payload);
      setSaving(false);
      onClose();
    } catch (err) {
      setSaving(false);
      setErrors({ _global: err?.message || "Failed to save company" });
      console.error("CompanyModal save error:", err);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label={company ? "Edit Company" : "Add Company"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="relative z-10 w-full max-w-4xl sm:mx-auto">
        <div
          className="bg-white sm:rounded-xl sm:shadow-lg w-full h-[92vh] sm:h-auto max-h-[92vh] flex flex-col overflow-hidden"
          role="document"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-semibold">{company ? "Edit Company" : "Add Company"}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-gray-600 hover:text-gray-900 p-2 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-auto px-4 py-4 sm:py-6" style={{ paddingBottom: 112 }}>
            {errors._global && <div className="mb-3 text-sm text-red-600">{errors._global}</div>}

            {/* Grid: mobile single column, md two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FIELD_CONFIG.map((field) => {
                const spanBoth = field.colSpan && field.colSpan === 2;
                return (
                  <div key={field.key} className={`${spanBoth ? "md:col-span-2" : ""}`}>
                    <label className="block text-sm mb-1">{field.label}</label>

                    {field.type === "select" ? (
                      <select
                        name={field.key}
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors[field.key] ? "border-red-500" : "border-gray-200"}`}
                      >
                        <option value="">Select Industry</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        name={field.key}
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors[field.key] ? "border-red-500" : "border-gray-200"}`}
                      />
                    )}

                    {errors[field.key] && <div className="text-xs text-red-600 mt-1">{errors[field.key]}</div>}
                  </div>
                );
              })}

              {/* Verified & Active - placed inline on mobile for compactness, aligned nicely on md */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 mt-1">
                <div className="flex items-center gap-3">
                  <Toggle
                    checked={!!form.verified}
                    onChange={(v) => setForm((prev) => ({ ...prev, verified: v }))}
                    color="indigo"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Verified</div>
                    <div className="text-xs text-gray-500">Mark company as verified</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Toggle
                    checked={!!form.is_active}
                    onChange={(v) => setForm((prev) => ({ ...prev, is_active: v }))}
                    color="green"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Active</div>
                    <div className="text-xs text-gray-500">Enable company to appear in listings</div>
                  </div>
                </div>
              </div>

              {/* Logo Upload spans both columns */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-2">Logo</label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 border rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="logo preview" className="object-contain w-full h-full" />
                    ) : (
                      <span className="text-xs text-gray-500 p-2 text-center">No Logo</span>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                      className="block w-full text-sm text-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-2">PNG / JPG recommended. Files are converted to Base64 for now.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div
            className="absolute left-0 right-0 bottom-0 bg-white border-t px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
            style={{ boxShadow: "0 -6px 18px rgba(0,0,0,0.06)" }}
          >
            <div className="flex-1 flex items-center gap-2">
              {/* show brief status on left for md+ */}
              <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600">
                <div>Verified: <span className="font-medium ml-1">{form.verified ? "Yes" : "No"}</span></div>
                <div>Active: <span className="font-medium ml-1">{form.is_active ? "Yes" : "No"}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded border bg-white text-gray-700">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-indigo-600"} min-w-[96px]`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;















