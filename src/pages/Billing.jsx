// src/pages/BillingPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Receipt,
  Search,
  Filter,
  Calendar,
  CreditCard,
  WalletCards,
  Banknote,
  ArrowUpRight,
  Printer,
  Download,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function BillStatusPill({ status }) {
  const map = {
    paid: {
      label: "Paid",
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    pending: {
      label: "Pending",
      className: "bg-amber-50 text-amber-700 border-amber-100",
    },
    refunded: {
      label: "Refunded",
      className: "bg-slate-50 text-slate-700 border-slate-200",
    },
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

function PaymentModePill({ mode }) {
  const mapIcon = {
    cash: Banknote,
    card: CreditCard,
    upi: WalletCards,
    wallet: WalletCards,
  };
  const Icon = mapIcon[mode] || WalletCards;

  const labelMap = {
    cash: "Cash",
    card: "Card",
    upi: "UPI",
    wallet: "Wallet",
  };
  const label = labelMap[mode] || "Other";

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-200 text-xs text-slate-700 bg-slate-50">
      <Icon size={11} />
      {label}
    </span>
  );
}

// Mobile card
function BillCard({ bill, onMarkPaid }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Receipt size={12} className="text-slate-400" />
            Bill #{bill.billNumber}
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {bill.tableName || "Takeaway"}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{bill.timeLabel}</p>
        </div>
        <div className="text-right">
          <BillStatusPill status={bill.status} />
          <p className="mt-2 text-sm font-semibold text-slate-900">
            ₹{bill.totalAmount.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">
            Tax: ₹{bill.taxAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs mt-1">
        <PaymentModePill mode={bill.paymentMode} />
        <p className="text-[11px] text-slate-500">
          {bill.itemsSummary}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <Link
          to={`/orders/${bill.orderId}`}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50"
        >
          View Order
          <ArrowUpRight size={11} />
        </Link>

        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50"
        >
          <Printer size={11} />
          Print
        </button>

        {bill.status === "pending" && (
          <button
            type="button"
            onClick={() => onMarkPaid(bill.id)}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2.5 py-1.5 text-[11px] hover:bg-emerald-700 ml-auto"
          >
            <CheckCircle2 size={11} />
            Mark Paid
          </button>
        )}

        {bill.status !== "pending" && (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md bg-slate-50 text-slate-600 px-2.5 py-1.5 text-[11px] border border-slate-200 ml-auto"
          >
            <Download size={11} />
            Download
          </button>
        )}
      </div>
    </div>
  );
}

// Desktop table row
function BillRow({ bill, onMarkPaid }) {
  return (
    <tr className="hover:bg-slate-50 text-sm">
      <td className="px-3 py-2 whitespace-nowrap text-slate-700">
        <div className="flex items-center gap-2">
          <Receipt size={14} className="text-slate-400" />
          <span>#{bill.billNumber}</span>
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-slate-700">
        {bill.tableName || "Takeaway"}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-500">
        {bill.timeLabel}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <BillStatusPill status={bill.status} />
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <PaymentModePill mode={bill.paymentMode} />
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-500 max-w-xs truncate">
        {bill.itemsSummary}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-semibold text-slate-900">
        ₹{bill.totalAmount.toLocaleString()}
        <div className="text-[11px] text-slate-500">
          Tax: ₹{bill.taxAmount.toLocaleString()}
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/orders/${bill.orderId}`}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50"
          >
            Order
            <ArrowUpRight size={11} />
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50"
          >
            <Printer size={11} />
            Print
          </button>
          {bill.status === "pending" ? (
            <button
              type="button"
              onClick={() => onMarkPaid(bill.id)}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2.5 py-1.5 text-[11px] hover:bg-emerald-700"
            >
              <CheckCircle2 size={11} />
              Mark Paid
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md bg-slate-50 text-slate-600 px-2.5 py-1.5 text-[11px] border border-slate-200"
            >
              <Download size={11} />
              PDF
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("today");
  const [search, setSearch] = useState("");

  // Dummy load
  useEffect(() => {
    const dummy = [
      {
        id: 1,
        billNumber: "BILL-0001",
        orderId: 101,
        tableName: "T3",
        status: "pending",
        paymentMode: "cash",
        totalAmount: 540,
        taxAmount: 40,
        timeLabel: "5 min ago",
        itemsSummary: "3 items • Belgian Chocolate, TC, Mango",
      },
      {
        id: 2,
        billNumber: "BILL-0002",
        orderId: 102,
        tableName: "Takeaway",
        status: "paid",
        paymentMode: "upi",
        totalAmount: 320,
        taxAmount: 28,
        timeLabel: "15 min ago",
        itemsSummary: "2 items • Sitaphal, Dry Fruit Overload",
      },
      {
        id: 3,
        billNumber: "BILL-0003",
        orderId: 103,
        tableName: "T5",
        status: "paid",
        paymentMode: "card",
        totalAmount: 780,
        taxAmount: 65,
        timeLabel: "30 min ago",
        itemsSummary: "4 items • Choco Chips, Vanilla, Mango, Strawberry",
      },
      {
        id: 4,
        billNumber: "BILL-0004",
        orderId: 104,
        tableName: "T1",
        status: "refunded",
        paymentMode: "card",
        totalAmount: 0,
        taxAmount: 0,
        timeLabel: "1 hr ago",
        itemsSummary: "Refund processed",
      },
    ];
    setBills(dummy);
  }, []);

  function handleMarkPaid(billId) {
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? { ...b, status: "paid" }
          : b
      )
    );
    // In real app: call API PATCH /bills/:id { status: 'paid' }
  }

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (modeFilter !== "all" && b.paymentMode !== modeFilter) return false;
      // rangeFilter is just a placeholder; later tie to createdAt / bill date

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !(
            b.billNumber.toLowerCase().includes(q) ||
            (b.tableName || "").toLowerCase().includes(q) ||
            b.itemsSummary.toLowerCase().includes(q)
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [bills, statusFilter, modeFilter, rangeFilter, search]);

  // Summary stats
  const summary = useMemo(() => {
    let total = 0;
    let pending = 0;
    let count = bills.length;

    bills.forEach((b) => {
      if (b.status === "paid") total += b.totalAmount;
      if (b.status === "pending") pending += b.totalAmount;
    });

    return { total, pending, count };
  }, [bills]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Receipt size={20} className="text-slate-900" />
            Billing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review bills, payments, and pending collections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50">
            <Download size={14} />
            Export (CSV)
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Today&apos;s Collected
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            ₹{summary.total.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Pending Amount
          </p>
          <p className="mt-1 text-xl font-semibold text-amber-700">
            ₹{summary.pending.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Bills Generated
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {summary.count}
          </p>
        </div>
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
            placeholder="Search bill, table or items..."
            className="pl-7 pr-3 py-1.5 rounded-md border border-slate-200 text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:text-sm bg-white">
            <Filter size={13} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:text-sm bg-white">
            <WalletCards size={13} className="text-slate-400" />
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs sm:text-sm"
            >
              <option value="all">All Modes</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="wallet">Wallet</option>
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
          {filteredBills.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No bills found for the selected filters.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 text-left">Bill</th>
                  <th className="px-3 py-2 text-left">Table</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Mode</th>
                  <th className="px-3 py-2 text-left">Items</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBills.map((bill) => (
                  <BillRow
                    key={bill.id}
                    bill={bill}
                    onMarkPaid={handleMarkPaid}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden p-3 space-y-3">
          {filteredBills.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No bills found for the selected filters.
            </div>
          ) : (
            filteredBills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                onMarkPaid={handleMarkPaid}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
