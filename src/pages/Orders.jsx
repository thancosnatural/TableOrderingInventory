// src/pages/OrdersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Calendar,
  Clock,
  Receipt,
  User,
  Table as TableIcon,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function OrderStatusPill({ status }) {
  const map = {
    placed: { label: "Placed", className: "bg-slate-50 text-slate-700 border-slate-200" },
    accepted: { label: "Accepted", className: "bg-blue-50 text-blue-700 border-blue-100" },
    preparing: { label: "Preparing", className: "bg-amber-50 text-amber-700 border-amber-100" },
    ready: { label: "Ready", className: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    served: { label: "Served", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-100" },
  };
  const cfg = map[status] || map.placed;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function PaymentStatusPill({ status }) {
  const map = {
    pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-100" },
    paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    failed: { label: "Failed", className: "bg-red-50 text-red-700 border-red-100" },
  };
  const cfg = map[status] || map.pending;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// Card for mobile view
function OrderCard({ order }) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div>
          <p className="text-xs text-slate-500">#{order.orderNumber}</p>
          <p className="text-sm font-semibold text-slate-900">
            {order.tableName || "Takeaway"}
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div className="flex items-center gap-1 justify-end">
            <Clock size={11} />
            <span>{order.timeAgo}</span>
          </div>
          <div className="mt-1">
            <OrderStatusPill status={order.status} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs">
        <div className="text-slate-600 truncate mr-2">
          {order.itemSummary}
        </div>
        <div className="text-right">
          <p className="font-semibold text-slate-900">
            ₹{order.totalAmount.toLocaleString()}
          </p>
          <PaymentStatusPill status={order.paymentStatus} />
        </div>
      </div>
    </Link>
  );
}

// Row for desktop table
function OrderRow({ order }) {
  return (
    <tr className="hover:bg-slate-50 text-sm">
      <td className="px-3 py-2 whitespace-nowrap text-slate-700">
        <Link
          to={`/orders/${order.id}`}
          className="text-indigo-600 hover:underline flex items-center gap-1"
        >
          #{order.orderNumber}
          <ArrowUpRight size={12} />
        </Link>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-slate-700">
        <div className="flex items-center gap-1">
          <TableIcon size={13} className="text-slate-400" />
          <span>{order.tableName || "Takeaway"}</span>
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-slate-700">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock size={12} />
          <span>{order.timeAgo}</span>
        </div>
      </td>
      <td className="px-3 py-2 text-xs text-slate-600 max-w-[220px] truncate">
        {order.itemSummary}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <OrderStatusPill status={order.status} />
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <PaymentStatusPill status={order.paymentStatus} />
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-semibold text-slate-900">
        ₹{order.totalAmount.toLocaleString()}
      </td>
    </tr>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("today");
  const [search, setSearch] = useState("");

  // Dummy load
  useEffect(() => {
    const dummy = [
      {
        id: 1,
        orderNumber: "ORD-00123",
        tableName: "T3",
        status: "preparing",
        paymentStatus: "pending",
        totalAmount: 540,
        timeAgo: "5 min ago",
        itemSummary: "3 items • Belgian Chocolate, Tender Coconut, Mango",
      },
      {
        id: 2,
        orderNumber: "ORD-00124",
        tableName: "Takeaway",
        status: "ready",
        paymentStatus: "paid",
        totalAmount: 320,
        timeAgo: "12 min ago",
        itemSummary: "2 items • Sitaphal, Dry Fruit Overload",
      },
      {
        id: 3,
        orderNumber: "ORD-00125",
        tableName: "T7",
        status: "served",
        paymentStatus: "paid",
        totalAmount: 210,
        timeAgo: "25 min ago",
        itemSummary: "1 item • Chocolate Cone",
      },
      {
        id: 4,
        orderNumber: "ORD-00126",
        tableName: "T1",
        status: "cancelled",
        paymentStatus: "failed",
        totalAmount: 0,
        timeAgo: "40 min ago",
        itemSummary: "2 items • Vanilla, Strawberry",
      },
      {
        id: 5,
        orderNumber: "ORD-00127",
        tableName: "T2",
        status: "placed",
        paymentStatus: "pending",
        totalAmount: 180,
        timeAgo: "1 min ago",
        itemSummary: "1 item • Cold Coffee",
      },
    ];
    setOrders(dummy);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) return false;
      // rangeFilter is dummy for now; you can map to createdAt later

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !(
            o.orderNumber.toLowerCase().includes(q) ||
            (o.tableName && o.tableName.toLowerCase().includes(q)) ||
            o.itemSummary.toLowerCase().includes(q)
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, paymentFilter, rangeFilter, search]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <ClipboardList size={20} className="text-slate-900" />
            Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View and manage orders from all tables and takeaways.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/orders/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-2 text-xs sm:text-sm hover:bg-slate-800"
          >
            <Receipt size={14} />
            New Order
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:min-w-[260px]">
            <Search
              size={14}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, table or item..."
              className="pl-7 pr-3 py-1.5 rounded-md border border-slate-200 text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:text-sm bg-white">
            <Filter size={13} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="placed">Placed</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="served">Served</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:text-sm bg-white">
            <Receipt size={13} className="text-slate-400" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs sm:text-sm"
            >
              <option value="all">Payment: All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:text-sm bg-white">
            <Calendar size={13} className="text-slate-400" />
            <select
              value={rangeFilter}
              onChange={(e) => setRangeFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs sm:text-sm"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          {filteredOrders.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No orders found for the selected filters.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 text-left">Order</th>
                  <th className="px-3 py-2 text-left">Table</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Items</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Payment</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden p-3 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No orders found for the selected filters.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
