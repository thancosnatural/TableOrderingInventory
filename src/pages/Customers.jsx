// src/pages/CustomersPage.jsx
import React, { useEffect, useState } from "react";
import {
  UserCircle,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Loader2,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CustomersPage() {
  const { role, user } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);

    let data = [];

    // DUMMY DATA PER ROLE
    if (role === "super_admin") {
      data = [
        {
          id: 1,
          name: "Rahul Verma",
          phone: "+91 9988776655",
          email: "rahul@example.com",
          visits: 12,
          lastVisit: "2025-11-20",
          favOutlet: "Indiranagar",
        },
        {
          id: 2,
          name: "Shreya Kapoor",
          phone: "+91 8877665544",
          email: "shreya@example.com",
          visits: 8,
          lastVisit: "2025-11-18",
          favOutlet: "HSR Layout",
        },
      ];
    } else if (role === "brand_admin") {
      data = [
        {
          id: 8,
          name: "Vikram Singh",
          phone: "+91 8899881122",
          email: "vikram@example.com",
          visits: 5,
          lastVisit: "2025-11-19",
          favOutlet: "Jayanagar",
        },
        {
          id: 9,
          name: "Ritu Sharma",
          phone: "+91 7700112233",
          email: "ritu@example.com",
          visits: 7,
          lastVisit: "2025-11-17",
          favOutlet: "Malleshwaram",
        },
      ];
    } else if (role === "outlet_admin") {
      data = [
        {
          id: 21,
          name: user.customer_demo_name || "Local Outlet Customer",
          phone: "+91 8800223344",
          email: "outlet.customer@example.com",
          visits: 4,
          lastVisit: "2025-11-16",
          favOutlet: user.outlet_name || "My Outlet",
        },
      ];
    } else {
      // STAFF – read-only minimal list
      data = [
        {
          id: 77,
          name: "Walk-in Customer",
          phone: "N/A",
          email: "N/A",
          visits: 1,
          lastVisit: "Today",
          favOutlet: user?.outlet_name || "Assigned Outlet",
        },
      ];
    }

    setTimeout(() => {
      setCustomers(data);
      setLoading(false);
    }, 500);
  }, [role, user]);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <UserCircle size={22} />
          Customers
        </h1>
        <p className="text-sm text-slate-500">
          View and manage your customer base.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search customers by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900/10"
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          No matching customers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
}

function CustomerCard({ customer }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <UserCircle size={26} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{customer.name}</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Star size={12} className="text-yellow-500" />
            {customer.visits} visits total
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-xs text-slate-700 space-y-1">
        <p className="flex items-center gap-1">
          <Phone size={12} className="text-slate-400" />
          {customer.phone}
        </p>
        <p className="flex items-center gap-1">
          <Mail size={12} className="text-slate-400" />
          {customer.email}
        </p>
      </div>

      {/* Last Visit */}
      <div className="text-xs text-slate-500 flex items-center gap-1">
        <Calendar size={12} className="text-slate-400" />
        Last visited: {customer.lastVisit}
      </div>

      {/* Favourite Outlet */}
      <div className="text-xs text-slate-700 flex items-center gap-1 pt-2">
        <MapPin size={12} className="text-slate-400" />
        Favourite Outlet: {customer.favOutlet}
      </div>
    </div>
  );
}
