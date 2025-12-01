// src/pages/TablesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table as TableIcon,
  UtensilsCrossed,
  Receipt,
  CheckCircle2,
  Search,
  Loader2,
  Trash2,
  RefreshCcw,
} from "lucide-react";
import { Link } from "react-router-dom";

/** Status Styles */
function statusConfig(status) {
  const map = {
    free: {
      label: "Free",
      class: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    occupied: {
      label: "Occupied",
      class: "bg-amber-50 text-amber-700 border-amber-200",
    },
    bill_requested: {
      label: "Bill Requested",
      class: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    cleaning: {
      label: "Cleaning",
      class: "bg-red-50 text-red-700 border-red-200",
    },
  };
  return map[status] || map.free;
}

/** Status Pill Component */
function StatusPill({ status }) {
  const cfg = statusConfig(status);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium ${cfg.class}`}
    >
      {cfg.label}
    </span>
  );
}

/** Table Card (mobile + desktop) */
function TableCard({ table, onAction }) {
  const { id, name, capacity, status, currentOrder } = table;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
            <TableIcon size={15} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{name}</p>
            <p className="text-[11px] text-slate-500">
              Capacity: {capacity} • ID: {id}
            </p>
          </div>
        </div>

        <StatusPill status={status} />
      </div>

      {/* Current Order Info */}
      {currentOrder ? (
        <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-200">
          <div className="flex justify-between">
            <span>Order: #{currentOrder.orderNumber}</span>
            <span className="font-medium">₹{currentOrder.totalAmount}</span>
          </div>
          <p className="text-[11px] mt-1 text-slate-500">
            {currentOrder.itemsSummary}
          </p>
        </div>
      ) : (
        <div className="text-xs text-slate-500 italic">No active order.</div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {status === "free" && (
          <Link
            to={`/orders/new?table=${id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-slate-900 text-white hover:bg-slate-800"
          >
            <UtensilsCrossed size={12} /> Take Order
          </Link>
        )}

        {status === "occupied" && (
          <Link
            to={`/orders/${currentOrder?.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            View Order
          </Link>
        )}

        {status === "bill_requested" && (
          <button
            onClick={() => onAction(id, "mark_paid")}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Receipt size={12} /> Collect Bill
          </button>
        )}

        {status === "cleaning" && (
          <button
            onClick={() => onAction(id, "mark_clean")}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
          >
            <CheckCircle2 size={12} /> Mark Cleaned
          </button>
        )}

        {/* Reset table (only in dummy mode) */}
        <button
          onClick={() => onAction(id, "reset")}
          className="inline-flex items-center gap-1 px-2 py-1.5 text-[11px] rounded-md border border-red-200 text-red-600 hover:bg-red-50 ml-auto"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

/** Main Page */
export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Dummy data
  useEffect(() => {
    setTimeout(() => {
      setTables([
        {
          id: 1,
          name: "T1",
          capacity: 4,
          status: "free",
          currentOrder: null,
        },
        {
          id: 2,
          name: "T2",
          capacity: 4,
          status: "occupied",
          currentOrder: {
            id: 11,
            orderNumber: "ORD-20012",
            totalAmount: 540,
            itemsSummary: "Belgian Choco, TC, Mango",
          },
        },
        {
          id: 3,
          name: "T3",
          capacity: 2,
          status: "cleaning",
          currentOrder: null,
        },
        {
          id: 4,
          name: "T4",
          capacity: 6,
          status: "bill_requested",
          currentOrder: {
            id: 13,
            orderNumber: "ORD-20061",
            totalAmount: 780,
            itemsSummary: "Dry Fruit OL, Vanilla",
          },
        },
        {
          id: 5,
          name: "T5",
          capacity: 2,
          status: "occupied",
          currentOrder: {
            id: 14,
            orderNumber: "ORD-20085",
            totalAmount: 340,
            itemsSummary: "Strawberry, Vanilla",
          },
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  /** Table actions in dummy mode */
  function handleAction(tableId, action) {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;

        if (action === "reset") {
          return { ...t, status: "free", currentOrder: null };
        }
        if (action === "mark_clean") {
          return { ...t, status: "free" };
        }
        if (action === "mark_paid") {
          return { ...t, status: "cleaning" };
        }

        return t;
      })
    );
  }

  /** Filtering & searching */
  const filtered = useMemo(() => {
    return tables.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          (t.currentOrder?.orderNumber || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tables, search, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <TableIcon size={20} /> Tables
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage table status and active orders.
          </p>
        </div>

        <button
          onClick={() => setLoading(true) || setTimeout(() => setLoading(false), 500)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50"
        >
          <RefreshCcw size={14} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            size={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search table or order..."
            className="pl-7 pr-3 py-1.5 rounded-md border border-slate-200 text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          <option value="all">All Status</option>
          <option value="free">Free</option>
          <option value="occupied">Occupied</option>
          <option value="bill_requested">Bill Requested</option>
          <option value="cleaning">Cleaning</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 size={22} className="animate-spin text-slate-500" />
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center text-sm text-slate-500 py-10">
              No tables found.
            </p>
          ) : (
            filtered.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onAction={handleAction}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
