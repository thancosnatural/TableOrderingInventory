// src/pages/OutletsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Store,
  Search,
  MapPin,
  Users,
  LayoutDashboard,
  Plus,
  Loader2,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function OutletsPage() {
  const { role, user } = useAuth();

  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);

    // DUMMY OUTLETS BASED ON ROLE
    let data = [];

    if (role === "super_admin") {
      data = [
        {
          id: 1,
          brand: "Thanco's",
          name: "Indiranagar",
          address: "100ft Road, Bangalore",
          tables: 18,
          staffCount: 12,
        },
        {
          id: 2,
          brand: "Thanco's",
          name: "HSR Layout",
          address: "27th Main, Bangalore",
          tables: 14,
          staffCount: 9,
        },
      ];
    } else if (role === "brand_admin") {
      data = [
        {
          id: 7,
          brand: user?.brand_name || "Thanco's",
          name: "Malleshwaram",
          address: "Made up address",
          tables: 12,
          staffCount: 7,
        },
        {
          id: 8,
          brand: user?.brand_name || "Thanco's",
          name: "Jayanagar",
          address: "Another location",
          tables: 10,
          staffCount: 6,
        },
      ];
    } else if (role === "outlet_admin") {
      data = [
        {
          id: 99,
          brand: user?.brand_name || "Thanco's",
          name: user?.outlet_name || "My Outlet",
          address: user?.outlet_address || "Outlet Location",
          tables: 10,
          staffCount: 5,
        },
      ];
    } else {
      // STAFF → read-only outlet detail
      data = [
        {
          id: 707,
          brand: user?.brand_name || "Thanco's",
          name: user?.outlet_name || "Assigned Outlet",
          address: user?.outlet_address || "Outlet Location",
          tables: 10,
          staffCount: 5,
        },
      ];
    }

    setTimeout(() => {
      setOutlets(data);
      setLoading(false);
    }, 600);
  }, [role, user]);

  const filtered = outlets.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  const canAddOutlet = role === "super_admin" || role === "brand_admin";

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Store size={22} />
            Outlets
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and monitor all outlets under your access level.
          </p>
        </div>

        {canAddOutlet && (
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-md hover:bg-slate-800">
            <Plus size={16} />
            Add Outlet
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
          placeholder="Search outlets..."
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
          No outlets found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((outlet) => (
            <OutletCard key={outlet?.id} outlet={outlet} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}

function OutletCard({ outlet, role }) {
  const canViewDetails = role !== "staff"; // staff has limited access

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-lg">
            {outlet?.name}
          </h3>
          <LayoutDashboard className="text-slate-400" size={18} />
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-1">
          <Building2 size={12} className="text-slate-400" />
          {outlet?.brand}
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-1">
          <MapPin size={12} className="text-slate-400" />
          {outlet?.address}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <div className="flex items-center gap-1">
              <Store size={12} className="text-slate-400" />
              {outlet?.tables} tables
            </div>
            <div className="flex items-center gap-1 ml-3">
              <Users size={12} className="text-slate-400" />
              {outlet?.staffCount} staff
            </div>
          </div>

          {canViewDetails && (
            <button className="flex items-center gap-1 text-xs text-slate-900 hover:text-slate-600">
              View <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
