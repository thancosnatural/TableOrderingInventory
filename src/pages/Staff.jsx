// src/pages/StaffPage.jsx
import React, { useEffect, useState } from "react";
import {
  Users,
  UserCircle,
  Search,
  Phone,
  Mail,
  Shield,
  Store,
  Loader2,
  BadgeCheck,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ROLE_LABELS = {
  super_admin: "Super Admin",
  brand_admin: "Brand Admin",
  outlet_admin: "Outlet Admin",
  staff: "Staff",
};

export default function StaffPage() {
  const { role, user } = useAuth();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);

    let data = [];

    if (role === "super_admin") {
      data = [
        {
          id: 1,
          name: "Raghavendra Thane",
          email: "raghavendra@thancos.com",
          phone: "+91 99000 00001",
          appRole: "brand_admin",
          outletName: "All Outlets",
          brandName: "Thanco's",
          isActive: true,
        },
        {
          id: 2,
          name: "Outlet Manager – Indiranagar",
          email: "indiranagar.manager@thancos.com",
          phone: "+91 99000 00002",
          appRole: "outlet_admin",
          outletName: "Indiranagar",
          brandName: "Thanco's",
          isActive: true,
        },
        {
          id: 3,
          name: "Waiter – HSR",
          email: "hsr.waiter1@thancos.com",
          phone: "+91 99000 00003",
          appRole: "staff",
          outletName: "HSR Layout",
          brandName: "Thanco's",
          isActive: true,
        },
      ];
    } else if (role === "brand_admin") {
      data = [
        {
          id: 10,
          name: "Jayanagar Manager",
          email: "jayanagar.manager@brand.com",
          phone: "+91 99000 00010",
          appRole: "outlet_admin",
          outletName: "Jayanagar",
          brandName: user?.brand_name || "My Brand",
          isActive: true,
        },
        {
          id: 11,
          name: "Service Staff – Jayanagar",
          email: "jayanagar.staff1@brand.com",
          phone: "+91 99000 00011",
          appRole: "staff",
          outletName: "Jayanagar",
          brandName: user?.brand_name || "My Brand",
          isActive: true,
        },
      ];
    } else if (role === "outlet_admin") {
      data = [
        {
          id: 20,
          name: "Outlet Admin (You)",
          email: user?.email || "outlet.admin@example.com",
          phone: user?.phone || "+91 99000 00020",
          appRole: "outlet_admin",
          outletName: user?.outlet_name || "My Outlet",
          brandName: user?.brand_name || "My Brand",
          isActive: true,
        },
        {
          id: 21,
          name: "Waiter 1",
          email: "waiter1@outlet.com",
          phone: "+91 99000 00021",
          appRole: "staff",
          outletName: user?.outlet_name || "My Outlet",
          brandName: user?.brand_name || "My Brand",
          isActive: true,
        },
        {
          id: 22,
          name: "Cashier",
          email: "cashier@outlet.com",
          phone: "+91 99000 00022",
          appRole: "staff",
          outletName: user?.outlet_name || "My Outlet",
          brandName: user?.brand_name || "My Brand",
          isActive: false,
        },
      ];
    } else {
      // staff → see themselves and maybe a couple of colleagues (read-only feel)
      data = [
        {
          id: 50,
          name: user?.full_name || user?.name || "You",
          email: user?.email || "you@example.com",
          phone: user?.phone || "+91 90000 00000",
          appRole: "staff",
          outletName: user?.outlet_name || "Assigned Outlet",
          brandName: user?.brand_name || "Brand",
          isActive: true,
        },
        {
          id: 51,
          name: "Colleague 1",
          email: "colleague1@outlet.com",
          phone: "+91 90000 00051",
          appRole: "staff",
          outletName: user?.outlet_name || "Assigned Outlet",
          brandName: user?.brand_name || "Brand",
          isActive: true,
        },
      ];
    }

    setTimeout(() => {
      setStaff(data);
      setLoading(false);
    }, 500);
  }, [role, user]);

  const filtered = staff.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.outletName && s.outletName.toLowerCase().includes(q))
    );
  });

  const canAddStaff =
    role === "super_admin" || role === "brand_admin" || role === "outlet_admin";
  const isReadOnly = role === "staff";

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Users size={22} />
            Staff
          </h1>
          <p className="text-sm text-slate-500">
            {isReadOnly
              ? "Team members for your outlet."
              : "Manage staff access and assignments across outlets."}
          </p>
        </div>

        {canAddStaff && (
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-md hover:bg-slate-800">
            <Plus size={16} />
            Add Staff
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
          placeholder="Search staff by name, email or outlet..."
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
          No staff members found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member) => (
            <StaffCard
              key={member.id}
              member={member}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StaffCard({ member, isReadOnly }) {
  const roleLabel = ROLE_LABELS[member.appRole] || "User";

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
      {/* Name & Avatar */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <UserCircle size={26} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">
            {member.name}
          </h3>
          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <Shield size={11} className="text-slate-400" />
            {roleLabel}
          </p>
        </div>
        {member.isActive ? (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <BadgeCheck size={10} />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
            Inactive
          </span>
        )}
      </div>

      {/* Outlet / Brand */}
      <div className="text-xs text-slate-600">
        <p className="flex items-center gap-1">
          <Store size={12} className="text-slate-400" />
          {member.outletName}{" "}
          {member.brandName && (
            <span className="text-[11px] text-slate-400">
              • {member.brandName}
            </span>
          )}
        </p>
      </div>

      {/* Contact Info */}
      <div className="text-xs text-slate-700 space-y-1">
        <p className="flex items-center gap-1">
          <Phone size={12} className="text-slate-400" />
          {member.phone}
        </p>
        <p className="flex items-center gap-1">
          <Mail size={12} className="text-slate-400" />
          {member.email}
        </p>
      </div>

      {/* Actions / Status */}
      <div className="pt-2 flex items-center justify-between text-[11px]">
        <p className="text-slate-500">
          {isReadOnly
            ? "You have read-only access."
            : "Manage access from Users / RBAC if needed."}
        </p>

        {!isReadOnly && (
          <button className="inline-flex items-center gap-1 text-slate-900 hover:text-slate-600">
            View
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
