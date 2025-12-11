// src/pages/Companies.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CompaniesGrid from "@/components/CompanyComponents/CompanyTable";
import CompanyModal from "@/components/CompanyComponents/CompanyModal";
import FilterBar from "@/components/CompanyComponents/FilterBar";
import SearchBar from "@/components/CompanyComponents/SearchBar";
import { Pagination } from "@/components/ReusableComponents";
import { useCompanies } from "@/context/CompaniesContext";

export default function CompaniesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const industryOptions = useMemo(
    () => ["All", "Agriculture", "SaaS", "Ecommerce", "Healthcare", "Fintech"],
    []
  );

  // ---------- URL search params ----------
  const urlSearchParams = new URLSearchParams(location.search);

  // modal controller: ?company=new or ?company=123
  const companyParam = urlSearchParams.get("company"); // "new", "123", or null
  const modalOpen = !!companyParam;
  const isNew = companyParam === "new";
  const editingId = !isNew && companyParam ? Number(companyParam) : null;

  // filter + pagination initial values from URL
  const initialQuery = urlSearchParams.get("q") || "";
  const initialIndustry = urlSearchParams.get("industry") || "All";
  const initialPerPage = Number(urlSearchParams.get("perPage")) || 12;
  const initialPage = Number(urlSearchParams.get("page")) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [industry, setIndustry] = useState(initialIndustry);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [page, setPage] = useState(initialPage);

  const [editing, setEditing] = useState(null);

  const {
    companies,
    companiesLoading,
    companiesTotal,
    fetchCompanies,
    addCompany,
    editCompany,
    removeCompany,
    getCompany,
  } = useCompanies();

  // ---------- Helper: sync q/industry/page/perPage back to URL (keep ?company= if present) ----------
  const syncQueryInUrl = (next = {}) => {
    const sp = new URLSearchParams(location.search);

    const q = next.query ?? query;
    const ind = next.industry ?? industry;
    const p = next.page ?? page;
    const limit = next.perPage ?? perPage;

    if (q) sp.set("q", q);
    else sp.delete("q");

    if (ind && ind !== "All") sp.set("industry", ind);
    else sp.delete("industry");

    if (p && p !== 1) sp.set("page", String(p));
    else sp.delete("page");

    if (limit && limit !== 12) sp.set("perPage", String(limit));
    else sp.delete("perPage");

    // DO NOT TOUCH "company" here — so modal stays open if it was open
    navigate(`/companies?${sp.toString()}`, { replace: true });
  };

  // ---------- Fetch companies when filters change ----------
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        await fetchCompanies({ query, industry, page, perPage });
      } catch (e) {
        if (!cancelled) console.error(e);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [query, industry, page, perPage, fetchCompanies]);

  // ---------- Load company data when ?company=123 (edit mode) ----------
  useEffect(() => {
    if (!modalOpen) {
      setEditing(null);
      return;
    }

    if (isNew) {
      // Add mode: empty form
      setEditing(null);
      return;
    }

    if (editingId) {
      (async () => {
        try {
          const resp = await getCompany(editingId);

          // resp can be { data: { data: {...} } } or { data: {...} }
          const maybeData = resp?.data ?? resp;
          const data = maybeData?.data ?? maybeData;

          if (!data) {
            throw new Error("Unexpected response from getCompany()");
          }

          const normalized = {
            id: data.id ?? editingId,
            name: data.name ?? "",
            legal_name: data.legal_name ?? "",
            gst_or_tax_id: data.gst_or_tax_id ?? "",
            logo_url: data.logo_url ?? "",
            industry: data.industry ?? "",
            website: data.website ?? "",
            headquarters: data.headquarters ?? "",
            verified: !!data.verified,
            is_active: data.is_active === undefined ? true : !!data.is_active,
          };

          setEditing(normalized);
        } catch (err) {
          console.error("Failed to load company:", err);
          // if error, close modal by removing company param
          const sp = new URLSearchParams(location.search);
          sp.delete("company");
          navigate(`/companies?${sp.toString()}`, { replace: true });
        }
      })();
    }
  }, [modalOpen, isNew, editingId, getCompany, location.search, navigate]);

  // ---------- Handlers for filters ----------
  function handleSearchChange(v) {
    setQuery(v);
    setPage(1);
    syncQueryInUrl({ query: v, page: 1 });
  }

  function handleIndustryChange(v) {
    setIndustry(v);
    setPage(1);
    syncQueryInUrl({ industry: v, page: 1 });
  }

  function handlePerPageChange(n) {
    setPerPage(n);
    setPage(1);
    syncQueryInUrl({ perPage: n, page: 1 });
  }

  function handlePageChange(p) {
    setPage(p);
    syncQueryInUrl({ page: p });
  }

  // ---------- Modal open/close via ?company= ----------
  function openCreate() {
    const sp = new URLSearchParams(location.search);
    sp.set("company", "new");
    navigate(`/companies?${sp.toString()}`);
  }

  function handleEditClick(company) {
    if (!company?.id) return;
    const sp = new URLSearchParams(location.search);
    sp.set("company", String(company.id));
    navigate(`/companies?${sp.toString()}`);
  }

  function handleCloseModal() {
    const sp = new URLSearchParams(location.search);
    sp.delete("company");
    navigate(`/companies?${sp.toString()}`);
    setEditing(null);
  }

  function handleView(company) {
    // Later you can navigate to /companies/:id if you want details page
    alert(`Viewing ${company.name}`);
  }

  // ---------- Save (create or update) ----------
  async function handleSave(payload) {
    try {
      if (editing && editing.id && !isNew) {
        await editCompany(editing.id, payload);
      } else {
        await addCompany(payload);
      }

      // After save: reset to page 1 and close modal
      setPage(1);
      syncQueryInUrl({ page: 1 });

      handleCloseModal();
    } catch (err) {
      console.error("save company failed", err);
      // Let CompanyModal show error by rethrowing
      throw err;
    }
  }


  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Companies</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage companies, view details, and edit company information.
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3 w-full sm:w-auto">
            <SearchBar
              value={query}
              onChange={handleSearchChange}
            />
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-md bg-green-600 text-white whitespace-nowrap"
            >
              Add company
            </button>
          </div>
        </header>

        <div className="bg-white border rounded-lg p-4">
          <div className="mb-4">
            <FilterBar
              industryOptions={industryOptions}
              selectedIndustry={industry}
              onSelectIndustry={handleIndustryChange}
              perPage={perPage}
              onPerPageChange={handlePerPageChange}
            />
          </div>

          <div className="py-2">
            {companiesLoading ? (
              <div className="py-12 text-center text-gray-500">
                Loading companies...
              </div>
            ) : companies.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                No companies found.
              </div>
            ) : (
              <CompaniesGrid
                companies={companies}
                onEdit={handleEditClick}  // uses ?company=id
                onView={handleView}
                onDelete={removeCompany}
              />
            )}
          </div>

          <div className="mt-6">
            <Pagination
              page={page}
              total={companiesTotal}
              perPage={perPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Modal controlled by ?company= */}
      <CompanyModal
        open={modalOpen}
        onClose={handleCloseModal}
        company={isNew ? null : editing}
        onSave={handleSave}
      />
    </div>
  );
}
