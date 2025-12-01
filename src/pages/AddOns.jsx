// src/pages/AddOnsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Plus,
  Utensils,
  Tag,
  IndianRupee,
  Store,
  Building2,
  Search,
  Filter,
  Loader2,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ADDON_TYPES = [
  { key: "topping", label: "Topping" },
  { key: "extra", label: "Extra Portion" },
  { key: "sauce", label: "Sauce / Dressing" },
  { key: "side", label: "Side" },
  { key: "other", label: "Other" },
];

const VEG_LABELS = {
  veg: {
    label: "Veg",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  non_veg: {
    label: "Non-Veg",
    className: "bg-red-50 text-red-700 border-red-100",
  },
  egg: {
    label: "Egg",
    className: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
};

export default function AddOnsPage() {
  const { role, user } = useAuth();

  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [vegFilter, setVegFilter] = useState("all");

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "topping",
    veg_type: "veg",
    price: "",
    is_active: true,
    description: "",
  });

  const canManage =
    role === "super_admin" ||
    role === "brand_admin" ||
    role === "outlet_admin";
  const isReadOnly = role === "staff";

  useEffect(() => {
    setLoading(true);

    let data = [];

    if (role === "super_admin") {
      data = [
        {
          id: 1,
          name: "Extra Cheese",
          code: "EXCHEESE",
          type: "extra",
          veg_type: "veg",
          price: 30,
          brand: "Global (All Brands)",
          outlet: "All Outlets",
          is_active: true,
          description: "Extra cheese topping for pizzas, burgers etc.",
        },
        {
          id: 2,
          name: "Chocolate Sauce",
          code: "CHOCSAUCE",
          type: "sauce",
          veg_type: "veg",
          price: 20,
          brand: "Thanco's",
          outlet: "All Outlets",
          is_active: true,
          description: "Rich chocolate syrup for desserts and ice creams.",
        },
        {
          id: 3,
          name: "Whipped Cream",
          code: "WHIPCRM",
          type: "topping",
          veg_type: "veg",
          price: 25,
          brand: "Thanco's",
          outlet: "All Outlets",
          is_active: false,
          description: "Soft whipped cream topping.",
        },
      ];
    } else if (role === "brand_admin") {
      data = [
        {
          id: 10,
          name: "Roasted Almonds",
          code: "ROALMND",
          type: "topping",
          veg_type: "veg",
          price: 35,
          brand: user?.brand_name || "My Brand",
          outlet: "All Outlets",
          is_active: true,
          description: "Crunchy almond topping.",
        },
        {
          id: 11,
          name: "Brownie Chunk",
          code: "BRWNCHNK",
          type: "side",
          veg_type: "egg",
          price: 40,
          brand: user?.brand_name || "My Brand",
          outlet: "All Outlets",
          is_active: true,
          description: "Warm brownie cube add-on.",
        },
      ];
    } else if (role === "outlet_admin") {
      data = [
        {
          id: 20,
          name: "Extra Scoop",
          code: "EXSCOOP",
          type: "extra",
          veg_type: "veg",
          price: 60,
          brand: user?.brand_name || "My Brand",
          outlet: user?.outlet_name || "My Outlet",
          is_active: true,
          description: "Additional single scoop add-on.",
        },
        {
          id: 21,
          name: "Sprinkles",
          code: "SPRINK",
          type: "topping",
          veg_type: "veg",
          price: 15,
          brand: user?.brand_name || "My Brand",
          outlet: user?.outlet_name || "My Outlet",
          is_active: true,
          description: "Colourful sugar sprinkles.",
        },
      ];
    } else {
      // staff – read-only view
      data = [
        {
          id: 30,
          name: "Sprinkles",
          code: "SPRINK",
          type: "topping",
          veg_type: "veg",
          price: 15,
          brand: user?.brand_name || "Brand",
          outlet: user?.outlet_name || "Outlet",
          is_active: true,
          description: "Colourful sugar sprinkles.",
        },
        {
          id: 31,
          name: "Chocolate Sauce",
          code: "CHOCSAUCE",
          type: "sauce",
          veg_type: "veg",
          price: 20,
          brand: user?.brand_name || "Brand",
          outlet: user?.outlet_name || "Outlet",
          is_active: true,
          description: "Rich chocolate syrup.",
        },
      ];
    }

    setTimeout(() => {
      setAddons(data);
      setLoading(false);
    }, 400);
  }, [role, user]);

  function updateFormField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAddAddon(e) {
    e?.preventDefault();
    if (!canManage || isReadOnly) return;
    if (!form.name.trim()) return;
    if (!form.code.trim()) return;
    if (!form.price || isNaN(Number(form.price))) return;

    setSaving(true);
    try {
      await new Promise((res) => setTimeout(res, 500));

      const newAddon = {
        id: Date.now(),
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        type: form.type,
        veg_type: form.veg_type,
        price: Number(form.price),
        brand:
          role === "super_admin"
            ? "Global / Configured"
            : user?.brand_name || "My Brand",
        outlet:
          role === "outlet_admin"
            ? user?.outlet_name || "My Outlet"
            : role === "brand_admin"
            ? "All Outlets"
            : "All Outlets",
        is_active: form.is_active,
        description: form.description.trim(),
      };

      setAddons((prev) => [newAddon, ...prev]);

      // reset form (keep type & veg_type)
      setForm((prev) => ({
        name: "",
        code: "",
        type: prev.type,
        veg_type: prev.veg_type,
        price: "",
        is_active: true,
        description: "",
      }));
    } finally {
      setSaving(false);
    }
  }

  const filtered = addons.filter((a) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const inText =
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.brand && a.brand.toLowerCase().includes(q)) ||
        (a.outlet && a.outlet.toLowerCase().includes(q));
      if (!inText) return false;
    }

    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (vegFilter !== "all" && a.veg_type !== vegFilter) return false;

    return true;
  });

  const addonTypesForFilter = ["all", ...new Set(addons.map((a) => a.type))];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Utensils size={22} />
            Add-ons
          </h1>
          <p className="text-sm text-slate-500">
            Configure extra toppings, sauces, sides and other add-ons for
            orders.
          </p>
        </div>
      </div>

      {/* Add Add-on form */}
      {canManage && !isReadOnly ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Plus size={16} />
              Add Add-on
            </h2>
            <span className="text-[11px] text-slate-500">
              Add-ons can be attached to products (e.g. toppings, extras) in
              your menu logic later.
            </span>
          </div>

          <form
            onSubmit={handleAddAddon}
            className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr,1fr] gap-4 items-end"
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Add-on Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                placeholder="e.g. Extra Cheese, Chocolate Sauce"
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
                required
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Code *
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => updateFormField("code", e.target.value)}
                placeholder="e.g. EXCHEESE, CHOCSAUCE"
                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
                required
              />
            </div>

            {/* Type + Veg + Price + Active + Button */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <select
                  value={form.type}
                  onChange={(e) => updateFormField("type", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md border border-slate-200 text-xs bg-white"
                >
                  {ADDON_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <select
                  value={form.veg_type}
                  onChange={(e) =>
                    updateFormField("veg_type", e.target.value)
                  }
                  className="px-3 py-2 rounded-md border border-slate-200 text-xs bg-white"
                >
                  <option value="veg">Veg</option>
                  <option value="non_veg">Non-Veg</option>
                  <option value="egg">Egg</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <IndianRupee
                    size={12}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      updateFormField("price", e.target.value)
                    }
                    placeholder="Price"
                    className="w-full pl-6 pr-3 py-2 rounded-md border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900/10"
                    required
                  />
                </div>
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
                disabled={
                  saving ||
                  !form.name.trim() ||
                  !form.code.trim() ||
                  !form.price
                }
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
                    Add Add-on
                  </>
                )}
              </button>
            </div>

            {/* Description full width */}
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
                placeholder="Short note about where this add-on is used (ice creams, pizza, shakes, etc.)"
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
              Only Super Admin, Brand Admin and Outlet Admin can add or modify
              add-ons. You can still view the list for order usage.
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
            placeholder="Search add-ons by name, code, brand or outlet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center text-xs">
          <Filter size={14} className="text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-slate-200 bg-white"
          >
            {addonTypesForFilter.map((t) => (
              <option key={t} value={t}>
                {t === "all"
                  ? "All Types"
                  : ADDON_TYPES.find((x) => x.key === t)?.label || t}
              </option>
            ))}
          </select>

          <select
            value={vegFilter}
            onChange={(e) => setVegFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-slate-200 bg-white"
          >
            <option value="all">All Veg Types</option>
            <option value="veg">Veg</option>
            <option value="non_veg">Non-Veg</option>
            <option value="egg">Egg</option>
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
          No add-ons found.
        </div>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[1.6fr,1.2fr,1.2fr,auto] gap-3 px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            <div>Name</div>
            <div>Code / Type / Veg</div>
            <div>Brand / Outlet</div>
            <div className="text-right">Price / Status</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {filtered.map((addon) => (
              <AddOnRow key={addon.id} addon={addon} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AddOnRow({ addon }) {
  const vegMeta = VEG_LABELS[addon.veg_type] || VEG_LABELS.veg;
  const typeLabel =
    ADDON_TYPES.find((t) => t.key === addon.type)?.label || "Add-on";

  return (
    <div className="px-4 py-3 text-sm flex flex-col md:grid md:grid-cols-[1.6fr,1.2fr,1.2fr,auto] md:gap-3">
      {/* Name + description */}
      <div className="mb-2 md:mb-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-100 text-slate-500">
            <Utensils size={14} />
          </span>
          <div>
            <div className="font-medium text-slate-900">{addon.name}</div>
            {addon.description && (
              <div className="text-xs text-slate-500 line-clamp-1">
                {addon.description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code / Type / Veg */}
      <div className="mb-2 md:mb-0 text-xs text-slate-600 space-y-1">
        <div className="font-mono text-[11px] text-slate-500">
          {addon.code}
        </div>
        <div className="inline-flex flex-wrap gap-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[11px]">
            <Tag size={10} />
            {typeLabel}
          </span>
          <span
            className={
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] " +
              vegMeta.className
            }
          >
            <Utensils size={10} />
            {vegMeta.label}
          </span>
        </div>
      </div>

      {/* Brand / Outlet */}
      <div className="mb-2 md:mb-0 text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-1">
          <Building2 size={11} className="text-slate-400" />
          <span>{addon.brand}</span>
        </div>
        <div className="flex items-center gap-1">
          <Store size={11} className="text-slate-400" />
          <span>{addon.outlet}</span>
        </div>
      </div>

      {/* Price / Status */}
      <div className="flex items-center justify-between md:justify-end gap-2">
        <div className="text-xs text-slate-700 flex items-center gap-1">
          <IndianRupee size={12} className="text-slate-500" />
          <span className="font-medium">{addon.price}</span>
        </div>
        <span
          className={
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border " +
            (addon.is_active
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-slate-50 text-slate-500 border-slate-200")
          }
        >
          <span
            className={
              "h-1.5 w-1.5 rounded-full " +
              (addon.is_active ? "bg-emerald-500" : "bg-slate-400")
            }
          />
          {addon.is_active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}
