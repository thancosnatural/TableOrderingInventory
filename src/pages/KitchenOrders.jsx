// src/pages/KitchenOrders.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Clock,
  ChefHat,
  Flame,
  CheckCircle2,
  Printer,
  Search,
  RefreshCcw,
} from "lucide-react";

/**
 * Small reusable components
 */

function StatusPill({ status }) {
  const map = {
    new: { label: "New", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    preparing: { label: "Preparing", className: "bg-amber-50 text-amber-700 border-amber-100" },
    ready: { label: "Ready", className: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  };
  const cfg = map[status] || map.new;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function PriorityDot({ minutes }) {
  // simple colour logic based on wait time
  let color = "bg-emerald-500";
  if (minutes >= 10) color = "bg-amber-500";
  if (minutes >= 20) color = "bg-red-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

/**
 * KitchenOrderCard: reusable order card
 */
function KitchenOrderCard({ order, onStatusChange, onReprint }) {
  const { id, orderNumber, tableName, section, status, items, elapsedMinutes } = order;

  const nextAction = useMemo(() => {
    if (status === "new") return { label: "Start Preparing", to: "preparing" };
    if (status === "preparing") return { label: "Mark Ready", to: "ready" };
    if (status === "ready") return { label: "Served", to: "served" }; // handled externally if needed
    return null;
  }, [status]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {tableName || "Takeaway"}
            </span>
            <PriorityDot minutes={elapsedMinutes} />
          </div>
          <div className="text-sm font-semibold text-slate-900">
            #{orderNumber}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusPill status={status} />
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <Clock size={11} />
            {elapsedMinutes} min
          </span>
        </div>
      </div>

      {/* Section */}
      {section && (
        <div className="mb-2 flex items-center gap-1 text-[11px] text-slate-500">
          <ChefHat size={11} />
          <span>{section}</span>
        </div>
      )}

      {/* Items */}
      <div className="flex-1 mb-2 space-y-1">
        {items.map((it, idx) => (
          <div
            key={`${id}-item-${idx}`}
            className="flex justify-between gap-2 text-xs"
          >
            <div className="flex-1">
              <span className="font-medium text-slate-800">
                {it.qty}× {it.name}
              </span>
              {it.notes && (
                <p className="text-[11px] text-slate-500">• {it.notes}</p>
              )}
            </div>
            {it.section && (
              <span className="text-[11px] text-slate-400 whitespace-nowrap">
                {it.section}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onReprint(order)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
        >
          <Printer size={12} />
          Reprint KOT
        </button>

        {nextAction && nextAction.to !== "served" && (
          <button
            type="button"
            onClick={() => onStatusChange(order, nextAction.to)}
            className="inline-flex items-center gap-1 rounded-md bg-slate-900 text-white px-2.5 py-1.5 text-[11px] hover:bg-slate-800"
          >
            {nextAction.to === "preparing" && <Flame size={12} />}
            {nextAction.to === "ready" && <CheckCircle2 size={12} />}
            {nextAction.label}
          </button>
        )}

        {nextAction && nextAction.to === "served" && (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 px-2.5 py-1.5 text-[11px]"
          >
            <CheckCircle2 size={12} />
            Served
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Column component (New / Preparing / Ready)
 */
function KitchenColumn({ title, icon: Icon, orders, emptyLabel, onStatusChange, onReprint }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center">
            <Icon size={14} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <p className="text-[11px] text-slate-500">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto min-h-[120px]">
        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-xs text-slate-500 text-center">
            {emptyLabel}
          </div>
        ) : (
          orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              onReprint={onReprint}
            />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Main page
 */
export default function KitchenOrdersPage() {
  // In real app, fetch from /api/kitchen-orders
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Dummy load
  useEffect(() => {
    const dummy = [
      {
        id: 1,
        orderNumber: "ORD-00123",
        tableName: "T3",
        status: "new",
        section: "Ice Cream",
        elapsedMinutes: 4,
        items: [
          { name: "Belgian Chocolate", qty: 2, notes: "Extra fudge", section: "Ice Cream" },
          { name: "Tender Coconut", qty: 1, notes: "", section: "Ice Cream" },
        ],
      },
      {
        id: 2,
        orderNumber: "ORD-00124",
        tableName: "T7",
        status: "preparing",
        section: "Waffles",
        elapsedMinutes: 9,
        items: [
          { name: "Choco Chip Waffle", qty: 1, notes: "Crispy", section: "Waffle" },
        ],
      },
      {
        id: 3,
        orderNumber: "ORD-00125",
        tableName: "T1",
        status: "ready",
        section: "Ice Cream",
        elapsedMinutes: 14,
        items: [
          { name: "Dry Fruit Overload", qty: 1, notes: "No cashew", section: "Ice Cream" },
        ],
      },
      {
        id: 4,
        orderNumber: "ORD-00126",
        tableName: "Parcel",
        status: "new",
        section: "Beverages",
        elapsedMinutes: 2,
        items: [
          { name: "Cold Coffee", qty: 2, notes: "Less sugar", section: "Beverage" },
        ],
      },
    ];
    setOrders(dummy);
  }, []);

  // (Optional) auto refresh stub
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      // here you would re-fetch kitchen orders from API
      console.log("auto refresh KOT tick");
    }, 15000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  // Filter & search logic
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (sectionFilter !== "all" && o.section !== sectionFilter) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        (o.tableName && o.tableName.toLowerCase().includes(q))
      );
    });
  }, [orders, search, sectionFilter]);

  const grouped = useMemo(
    () => ({
      new: filteredOrders.filter((o) => o.status === "new"),
      preparing: filteredOrders.filter((o) => o.status === "preparing"),
      ready: filteredOrders.filter((o) => o.status === "ready"),
    }),
    [filteredOrders]
  );

  function handleStatusChange(order, nextStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
    );
    // In real app: call API to update status
  }

  function handleReprint(order) {
    // Hook into KOT printer API
    console.log("Reprint KOT for order", order.orderNumber);
  }

  const sections = ["all", "Ice Cream", "Waffles", "Beverages"];

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 h-full">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <ChefHat size={20} className="text-slate-900" />
            Kitchen Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live orders grouped by status. Tap a card to update quickly.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order or table..."
              className="pl-7 pr-3 py-1.5 rounded-md border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* Section filter */}
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {sections.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Sections" : s}
              </option>
            ))}
          </select>

          {/* Auto refresh toggle */}
          <button
            type="button"
            onClick={() => setAutoRefresh((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs sm:text-sm ${
              autoRefresh
                ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <RefreshCcw
              size={14}
              className={autoRefresh ? "animate-spin-slow" : ""}
            />
            Auto refresh
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)] md:h-[calc(100vh-180px)]">
        <KitchenColumn
          title="New"
          icon={Clock}
          orders={grouped.new}
          emptyLabel="No new orders at the moment."
          onStatusChange={handleStatusChange}
          onReprint={handleReprint}
        />
        <KitchenColumn
          title="Preparing"
          icon={Flame}
          orders={grouped.preparing}
          emptyLabel="No orders currently being prepared."
          onStatusChange={handleStatusChange}
          onReprint={handleReprint}
        />
        <KitchenColumn
          title="Ready"
          icon={CheckCircle2}
          orders={grouped.ready}
          emptyLabel="No orders ready for pickup."
          onStatusChange={handleStatusChange}
          onReprint={handleReprint}
        />
      </div>
    </div>
  );
}
