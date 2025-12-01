// src/pages/CategoriesPage.jsx
import React, { useEffect, useState } from "react";
import {
  Tag,
  Store,
  Plus,
  Shield,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CATEGORY_TYPES = [
  { key: "food", label: "Food" },
  { key: "beverage", label: "Beverage" },
  { key: "addon", label: "Add-on" },
  { key: "combo", label: "Combo" },
  { key: "other", label: "Other" },
];

export default function CategoriesPage() {
  const { role, user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // add form state
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "food",
    is_active: true,
    description: "",
  });

  const canManage =
    role === "super_admin" || role === "brand_admin"; // can add categories
  const isReadOnly = !canManage;

  useEffect(() => {
    setLoading(true);

    let data = [];

    if (role === "super_admin") {
      data = [
        {
          id: 1,
          name: "Starter",
          code: "STARTER",
          type: "food",
          brand: "Global (All Brands)",
          is_active: true,
          description: "Soups, snacks and appetisers.",
        },
        {
          id: 2,
          name: "Main Course",
          code: "MAIN",
          type: "food",
          brand: "Global (All Brands)",
          is_active: true,
          description: "Primary dishes and mains.",
        },
        {
          id: 3,
          name: "Milkshakes",
          code: "SHAKES",
          type: "beverage",
          brand: "Thanco's",
          is_active: true,
          description: "Premium shakes and thick shakes.",
        },
      ];
    } else if (role === "brand_admin") {
      data = [
        {
          id: 10,
          name: "Ice Cream",
          code: "ICECREAM",
          type: "food",
          brand: user?.brand_name || "My Brand",
          is_active: true,
          description: "Scoops, tubs and sundaes.",
        },
        {
          id: 11,
          name: "Beverages",
          code: "BEV",
          type: "beverage",
          brand: user?.brand_name || "My Brand",
          is_active: true,
          description: "Cold coffees, shakes, juices.",
        },
      ];
    } else {
      // outlet_admin / staff – read-only view
      data = [
        {
          id: 21,
          name: "Ice Cream",
          code: "ICECREAM",
          type: "food",
          brand: user?.brand_name || "Brand",
          is_active: true,
          description: "Scoops and specials.",
        },
        {
          id: 22,
          name: "Desserts",
          code: "DESERT",
          type: "food",
          brand: user?.brand_name || "Brand",
          is_active: true,
          description: "Brownies, waffles etc.",
        },
      ];
    }

    setTimeout(() => {
      setCategories(data);
      setLoading(false);
    }, 400);
  }, [role, user]);

  function updateFormField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAddCategory(e) {
    e?.preventDefault();
    if (!canManage) return;

    if (!form.name.trim()) return;
    if (!form.code.trim()) return;

    setSaving(true);

    try {
      // simulate API
      await new Promise((res) => setTimeout(res, 500));

      const newCat = {
        id: Date.now(),
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        type: form.type,
        brand:
          role === "super_admin"
            ? "Global / Configured"
            : user?.brand_name || "My Brand",
        is_active: form.is_active,
        description: form.description.trim(),
      };

      setCategories((prev) => [newCat, ...prev]);

      // reset form (keep type)
      setForm((prev) => ({
        name: "",
        code: "",
        type: prev.type,
        is_active: true,
        description: "",
      }));
    } finally {
      setSaving(false);
    }
  }

  const filtered = categories.filter((c) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const inText =
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.brand && c.brand.toLowerCase().includes(q));
      if (!inText) return false;
    }
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Tag size={22} />
            Categories
          </h1>
          <p className="text-sm text-slate-500">
            Configure menu categories for food, beverages, combos and add-ons.
          </p>
        </div>
      </div>

      {/* Add Category Form (only for super_admin & brand_admin) */}
      {canManage ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Plus size={16} />
              Add Category
            </h2>
            <span className="text-[11px] text-slate-500">
              Categories appear in the product & menu configuration flows.
            </span>
          </div>

          <form
            onSubmit={handleAddCategory}
            className="grid grid-cols-1 md:grid-cols-[2fr,1.3fr,1.2fr] gap-4 items-end"
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                placeholder="e.g. Starters, Desserts, Shakes"
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
                required
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Code / Short Name *
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => updateFormField("code", e.target.value)}
                placeholder="e.g. STARTER, ICE, SHAKE"
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
                required
              />
            </div>

            {/* Type + Active + Button */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <select
                  value={form.type}
                  onChange={(e) => updateFormField("type", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md border border-slate-200 text-xs bg-white"
                >
                  {CATEGORY_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <label className="inline-flex items-center gap-1 text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      updateFormField("is_active", e.target.checked)
                    }
                    className="h-3.5 w-3.5 rounded border-slate-300"
                  />
                  Active
                </label>
              </div>

              <button
                type="submit"
                disabled={saving || !form.name.trim() || !form.code.trim()}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Add Category
                  </>
                )}
              </button>
            </div>

            {/* Description (full width on next row) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Description (optional)
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) =>
                  updateFormField("description", e.target.value)
                }
                placeholder="Short internal note – where is this used? (e.g. dine-in only, shakes section etc.)"
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10 resize-none"
              />
            </div>
          </form>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 text-xs text-slate-600 flex gap-3 items-start">
          <Shield size={16} className="text-slate-400 mt-0.5" />
          <div>
            <p className="font-medium text-slate-800 mb-0.5">
              Read-only access
            </p>
            <p>
              Only Super Admin and Brand Admin can add or modify categories.
              You can still view existing categories for your outlet/brand.
            </p>
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative max-w-md w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search categories by name, code or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs items-center">
          <Filter size={14} className="text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-slate-200 bg-white"
          >
            <option value="all">All Types</option>
            {CATEGORY_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-slate-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-500 text-sm">
          No categories found.
        </div>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1.6fr,1.1fr,1.1fr,auto] gap-3 px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            <div>Name</div>
            <div>Code / Type</div>
            <div>Brand</div>
            <div className="text-right">Status</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {filtered.map((cat) => (
              <CategoryRow key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CategoryRow({ category }) {
  const typeLabel =
    CATEGORY_TYPES.find((t) => t.key === category.type)?.label || "Other";

  return (
    <div className="px-4 py-3 text-sm flex flex-col md:grid md:grid-cols-[1.6fr,1.1fr,1.1fr,auto] md:gap-3">
      {/* Name + description */}
      <div className="mb-2 md:mb-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-100 text-slate-500">
            <Tag size={14} />
          </span>
          <div>
            <div className="font-medium text-slate-900">{category.name}</div>
            {category.description && (
              <div className="text-xs text-slate-500 line-clamp-1">
                {category.description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code / Type */}
      <div className="mb-2 md:mb-0 text-xs text-slate-600">
        <div className="font-mono text-[11px] text-slate-500">
          {category.code}
        </div>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] mt-1">
          {typeLabel}
        </div>
      </div>

      {/* Brand */}
      <div className="mb-2 md:mb-0 text-xs text-slate-600 flex items-start gap-1">
        <Store size={11} className="text-slate-400 mt-0.5" />
        <span>{category.brand}</span>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between md:justify-end">
        <span
          className={
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border " +
            (category.is_active
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-slate-50 text-slate-500 border-slate-200")
          }
        >
          <span
            className={
              "h-1.5 w-1.5 rounded-full " +
              (category.is_active ? "bg-emerald-500" : "bg-slate-400")
            }
          />
          {category.is_active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}
