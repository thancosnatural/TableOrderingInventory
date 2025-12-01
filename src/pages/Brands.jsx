// src/pages/BrandsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Building2,
  Store,
  Users,
  Search,
  Globe2,
  LayoutDashboard,
  Loader2,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BrandsPage() {
  const { role, user } = useAuth();

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);

    let data = [];

    if (role === "super_admin") {
      // platform view – multiple brands
      data = [
        {
          id: 1,
          name: "Thanco's Natural Ice Cream",
          code: "THANCOS",
          country: "India",
          outletsCount: 90,
          activeUsers: 120,
          website: "thancosnatural.com",
        },
        {
          id: 2,
          name: "Wow Belgian",
          code: "WOWBEL",
          country: "India",
          outletsCount: 12,
          activeUsers: 28,
          website: "wowbelgian.com",
        },
      ];
    } else if (role === "brand_admin") {
      // brand admin – only their brand
      data = [
        {
          id: 101,
          name: user?.brand_name || "My Brand",
          code: user?.brand_code || "MYBRAND",
          country: user?.brand_country || "India",
          outletsCount: user?.brand_outlets_count || 8,
          activeUsers: user?.brand_users_count || 20,
          website: user?.brand_website || "",
        },
      ];
    } else {
      // outlet_admin / staff – brand of current outlet
      data = [
        {
          id: 201,
          name: user?.brand_name || "Brand",
          code: user?.brand_code || "BRAND",
          country: user?.brand_country || "India",
          outletsCount: user?.brand_outlets_count || 1,
          activeUsers: user?.brand_users_count || 5,
          website: user?.brand_website || "",
        },
      ];
    }

    setTimeout(() => {
      setBrands(data);
      setLoading(false);
    }, 500);
  }, [role, user]);

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const canAddBrand = role === "super_admin";
  const canManageBrand = role === "super_admin" || role === "brand_admin";

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Building2 size={22} />
            Brands
          </h1>
          <p className="text-sm text-slate-500">
            {role === "super_admin"
              ? "Manage all brands on the platform."
              : role === "brand_admin"
              ? "View and configure your brand."
              : "Brand information for your outlet."}
          </p>
        </div>

        {canAddBrand && (
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-md hover:bg-slate-800">
            <Plus size={16} />
            Add Brand
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No brands found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              canManage={canManageBrand}
              isReadOnly={role === "staff"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BrandCard({ brand, canManage, isReadOnly }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900 text-base line-clamp-1">
            {brand.name}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Code: <span className="font-mono">{brand.code}</span>
          </p>
        </div>
        <LayoutDashboard className="text-slate-300" size={18} />
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Globe2 size={12} className="text-slate-400" />
        <span>{brand.country}</span>
      </div>

      {brand.website && (
        <div className="text-xs text-slate-600">
          <span className="text-slate-400">Website:</span>{" "}
          <span className="break-all">{brand.website}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-700 pt-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Store size={12} className="text-slate-400" />
            {brand.outletsCount} outlets
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} className="text-slate-400" />
            {brand.activeUsers} users
          </div>
        </div>
      </div>

      <div className="pt-3 flex items-center justify-between text-xs">
        <p className="text-[11px] text-slate-500">
          {isReadOnly
            ? "Read-only access to brand info."
            : canManage
            ? "You can manage this brand."
            : "Limited brand visibility."}
        </p>

        {canManage && !isReadOnly && (
          <button className="inline-flex items-center gap-1 text-xs text-slate-900 hover:text-slate-600">
            Brand Settings
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
