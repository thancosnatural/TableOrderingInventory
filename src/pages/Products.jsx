// src/pages/ProductsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Package,
  Search,
  Tag,
  Store,
  Building2,
  IndianRupee,
  Utensils,
  Shield,
  Loader2,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const VEG_LABELS = {
  veg: { label: "Veg", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  non_veg: { label: "Non-Veg", className: "bg-red-50 text-red-700 border-red-100" },
  egg: { label: "Egg", className: "bg-yellow-50 text-yellow-700 border-yellow-100" },
};

export default function ProductsPage() {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [vegFilter, setVegFilter] = useState("all");

  useEffect(() => {
    setLoading(true);

    let data = [];

    if (role === "super_admin") {
      data = [
        {
          id: 1,
          name: "Belgian Chocolate Scoop",
          sku: "ICE-BEL-01",
          brand: "Thanco's",
          outlet: "All Outlets",
          category: "Ice Cream",
          veg_type: "veg",
          price: 120,
          active: true,
        },
        {
          id: 2,
          name: "Death By Chocolate Sundae",
          sku: "SUN-DBC-01",
          brand: "Thanco's",
          outlet: "Indiranagar",
          category: "Sundaes",
          veg_type: "veg",
          price: 220,
          active: true,
        },
        {
          id: 3,
          name: "Ferrero Rocher Shake",
          sku: "SHA-FER-01",
          brand: "Wow Belgian",
          outlet: "HSR Layout",
          category: "Milkshakes",
          veg_type: "egg",
          price: 260,
          active: false,
        },
      ];
    } else if (role === "brand_admin") {
      data = [
        {
          id: 11,
          name: "Sitaphal Scoop",
          sku: "ICE-SITA-01",
          brand: user?.brand_name || "My Brand",
          outlet: "All Outlets",
          category: "Ice Cream",
          veg_type: "veg",
          price: 140,
          active: true,
        },
        {
          id: 12,
          name: "Dry Fruit Sundae",
          sku: "SUN-DRY-01",
          brand: user?.brand_name || "My Brand",
          outlet: "Jayanagar",
          category: "Sundaes",
          veg_type: "veg",
          price: 230,
          active: true,
        },
      ];
    } else if (role === "outlet_admin") {
      data = [
        {
          id: 21,
          name: "Vanilla Single Scoop",
          sku: "ICE-VAN-01",
          brand: user?.brand_name || "My Brand",
          outlet: user?.outlet_name || "My Outlet",
          category: "Ice Cream",
          veg_type: "veg",
          price: 90,
          active: true,
        },
        {
          id: 22,
          name: "Chocolate Single Scoop",
          sku: "ICE-CHOC-01",
          brand: user?.brand_name || "My Brand",
          outlet: user?.outlet_name || "My Outlet",
          category: "Ice Cream",
          veg_type: "veg",
          price: 100,
          active: true,
        },
        {
          id: 23,
          name: "Cold Coffee Shake",
          sku: "SHA-CC-01",
          brand: user?.brand_name || "My Brand",
          outlet: user?.outlet_name || "My Outlet",
          category: "Milkshakes",
          veg_type: "egg",
          price: 180,
          active: false,
        },
      ];
    } else {
      // staff – read-only view of outlet menu
      data = [
        {
          id: 31,
          name: "Vanilla Single Scoop",
          sku: "ICE-VAN-01",
          brand: user?.brand_name || "Brand",
          outlet: user?.outlet_name || "Outlet",
          category: "Ice Cream",
          veg_type: "veg",
          price: 90,
          active: true,
        },
        {
          id: 32,
          name: "Belgian Chocolate Scoop",
          sku: "ICE-BEL-01",
          brand: user?.brand_name || "Brand",
          outlet: user?.outlet_name || "Outlet",
          category: "Ice Cream",
          veg_type: "veg",
          price: 120,
          active: true,
        },
      ];
    }

    setTimeout(() => {
      setProducts(data);
      setLoading(false);
    }, 500);
  }, [role, user]);

  const canAddProduct = role === "super_admin"; // as you requested

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();

    if (q) {
      const inText =
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.outlet && p.outlet.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q));
      if (!inText) return false;
    }

    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (vegFilter !== "all" && p.veg_type !== vegFilter) return false;

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Package size={22} />
            Products
          </h1>
          <p className="text-sm text-slate-500">
            View products available in the table-ordering menu.
          </p>
        </div>

        {canAddProduct && (
          <button
            type="button"
            onClick={() => navigate("/products/new")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-md hover:bg-slate-800"
          >
            <Plus size={16} />
            Add Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name, SKU, brand or outlet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        {/* Category + Veg filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-slate-200 text-xs bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={vegFilter}
            onChange={(e) => setVegFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-slate-200 text-xs bg-white"
          >
            <option value="all">Veg Type: All</option>
            <option value="veg">Veg</option>
            <option value="non_veg">Non-Veg</option>
            <option value="egg">Egg</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, role }) {
  const vegMeta = VEG_LABELS[product.veg_type] || VEG_LABELS.veg;
  const isStaff = role === "staff";
  const canManage = role === "super_admin" || role === "brand_admin";

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
      {/* Title + Veg badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            SKU: <span className="font-mono">{product.sku}</span>
          </p>
        </div>
        <span
          className={
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium " +
            vegMeta.className
          }
        >
          <Utensils size={10} />
          {vegMeta.label}
        </span>
      </div>

      {/* Brand / Outlet */}
      <div className="text-[11px] text-slate-600 space-y-1">
        <p className="flex items-center gap-1">
          <Building2 size={11} className="text-slate-400" />
          {product.brand}
        </p>
        <p className="flex items-center gap-1">
          <Store size={11} className="text-slate-400" />
          {product.outlet}
        </p>
      </div>

      {/* Category + Price + Status */}
      <div className="flex items-center justify-between text-xs mt-1">
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 text-slate-600">
            <Tag size={11} className="text-slate-400" />
            {product.category}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-slate-900">
            <IndianRupee size={12} className="text-slate-500" />
            {product.price}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border " +
              (product.active
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-slate-50 text-slate-500 border-slate-200")
            }
          >
            <Shield size={10} />
            {product.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="pt-2 flex items-center justify-between text-[11px]">
        <p className="text-slate-500">
          {isStaff
            ? "Read-only menu view."
            : canManage
            ? "Manage in Products / Menu Settings."
            : "Limited access."}
        </p>

        {!isStaff && (
          <button className="inline-flex items-center gap-1 text-slate-900 hover:text-slate-600">
            View
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
