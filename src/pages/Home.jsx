import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Store,
  Building2,
  UtensilsCrossed,
  Receipt,
  Clock,
  Users,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Role-aware Dashboard:
 * - super_admin  -> platform view (all brands / outlets)
 * - brand_admin  -> brand / restaurant group view
 * - outlet_admin -> single outlet view
 * - staff        -> orders / KOT view
 */

const ROLE_TITLES = {
  super_admin: "Platform Overview",
  brand_admin: "Brand Overview",
  outlet_admin: "Outlet Overview",
  staff: "My Workspace",
};

const ROLE_SUBTITLES = {
  super_admin: "Monitor brands, outlets and overall sales performance.",
  brand_admin: "Track how your brand and outlets are performing.",
  outlet_admin: "See what’s happening in your outlet right now.",
  staff: "Stay on top of today’s orders and KOTs.",
};

// Helper to pick the right API endpoint
function getDashboardEndpoint(role) {
  switch (role) {
    case "super_admin":
      return "/api/dashboard/super-admin";
    case "brand_admin":
      return "/api/dashboard/brand-admin";
    case "outlet_admin":
      return "/api/dashboard/outlet-admin";
    case "staff":
    default:
      return "/api/dashboard/staff";
  }
}

export default function Dashboard() {
  const { role = "staff" } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: null,
    recentOrders: [],
    topItems: [],
  });

  const title = ROLE_TITLES[role] || "Dashboard";
  const subtitle = ROLE_SUBTITLES[role] || "";

useEffect(() => {
  setLoading(true);
  setError(null);

  // SIMULATE API DELAY
  setTimeout(() => {
    // DUMMY DATA FOR ALL ROLES
    let dummyStats = {};
    let dummyRecent = [];
    let dummyTop = [];

    switch (role) {
      case "super_admin":
        dummyStats = {
          totalBrands: 3,
          totalOutlets: 58,
          todayRevenue: 125430,
          activeOrders: 18,
          revenueChangePct: 12.5,
        };
        dummyRecent = [
          {
            id: 1,
            orderNumber: "ORD-00231",
            tableName: "T8",
            timeAgo: "5 min ago",
            itemSummary: "3 items • Belgian Chocolate, TC, Mango",
            totalAmount: 540,
            statusLabel: "Preparing",
          },
        ];
        dummyTop = [
          { id: 10, name: "Belgian Chocolate", categoryName: "Signature", totalQty: 80, revenue: 24000 },
          { id: 11, name: "Tender Coconut", categoryName: "Natural", totalQty: 65, revenue: 19500 },
        ];
        break;

      case "brand_admin":
        dummyStats = {
          totalOutlets: 12,
          todayRevenue: 54230,
          todayOrders: 190,
          activeCustomers: 280,
          revenueChangePct: 8.2,
        };
        dummyRecent = [
          {
            id: 2,
            orderNumber: "ORD-00921",
            tableName: "T3",
            timeAgo: "12 min ago",
            itemSummary: "2 items • Sitaphal, Dry Fruit Overload",
            totalAmount: 320,
            statusLabel: "Served",
          },
        ];
        dummyTop = [
          { id: 20, name: "Dry Fruit Overload", categoryName: "Premium", totalQty: 40, revenue: 16000 },
          { id: 21, name: "Sitaphal", categoryName: "Natural", totalQty: 35, revenue: 10500 },
        ];
        break;

      case "outlet_admin":
        dummyStats = {
          todayRevenue: 12500,
          todayOrders: 62,
          tablesOccupied: 6,
          avgPrepTimeMins: 9,
          revenueChangePct: 5.5,
        };
        dummyRecent = [
          {
            id: 3,
            orderNumber: "ORD-00412",
            tableName: "T2",
            timeAgo: "3 min ago",
            itemSummary: "Choco Chips, Vanilla",
            totalAmount: 180,
            statusLabel: "Ready",
          },
        ];
        dummyTop = [
          { id: 30, name: "Choco Chips", categoryName: "Kids", totalQty: 22, revenue: 4400 },
          { id: 31, name: "Vanilla Classic", categoryName: "Classics", totalQty: 18, revenue: 3600 },
        ];
        break;

      case "staff":
      default:
        dummyStats = {
          assignedOrders: 14,
          readyOrders: 4,
          pendingKOTItems: 3,
          tipsAmount: 320,
          revenueChangePct: 0,
        };
        dummyRecent = [
          {
            id: 4,
            orderNumber: "ORD-00789",
            tableName: "T4",
            timeAgo: "1 min ago",
            itemSummary: "Chocolate Cone",
            totalAmount: 120,
            statusLabel: "Serve Now",
          },
        ];
        dummyTop = [
          { id: 40, name: "Chocolate Cone", categoryName: "Cones", totalQty: 15, revenue: 1800 },
        ];
        break;
    }

    setData({
      stats: dummyStats,
      recentOrders: dummyRecent,
      topItems: dummyTop,
    });

    setLoading(false);
  }, 900); // simulate API call
}, [role]);

  const stats = data.stats || {};

  // Normalise cards per role
  const cards = useMemo(() => {
    if (role === "super_admin") {
      return [
        {
          label: "Total Brands",
          value: stats.totalBrands ?? 0,
          icon: Building2,
        },
        {
          label: "Total Outlets",
          value: stats.totalOutlets ?? 0,
          icon: Store,
        },
        {
          label: "Today’s Revenue",
          value: stats.todayRevenue ?? 0,
          icon: Receipt,
          prefix: "₹",
        },
        {
          label: "Active Orders",
          value: stats.activeOrders ?? 0,
          icon: ClipboardList,
        },
      ];
    }

    if (role === "brand_admin") {
      return [
        {
          label: "Outlets in Brand",
          value: stats.totalOutlets ?? 0,
          icon: Store,
        },
        {
          label: "Today’s Revenue",
          value: stats.todayRevenue ?? 0,
          icon: Receipt,
          prefix: "₹",
        },
        {
          label: "Today’s Orders",
          value: stats.todayOrders ?? 0,
          icon: ClipboardList,
        },
        {
          label: "Active Customers (30d)",
          value: stats.activeCustomers ?? 0,
          icon: Users,
        },
      ];
    }

    if (role === "outlet_admin") {
      return [
        {
          label: "Today’s Revenue",
          value: stats.todayRevenue ?? 0,
          icon: Receipt,
          prefix: "₹",
        },
        {
          label: "Today’s Orders",
          value: stats.todayOrders ?? 0,
          icon: ClipboardList,
        },
        {
          label: "Tables Occupied",
          value: stats.tablesOccupied ?? 0,
          icon: Store,
        },
        {
          label: "Avg. Prep Time",
          value: stats.avgPrepTimeMins
            ? `${stats.avgPrepTimeMins} min`
            : "--",
          icon: Clock,
        },
      ];
    }

    // staff
    return [
      {
        label: "Orders Assigned",
        value: stats.assignedOrders ?? 0,
        icon: ClipboardList,
      },
      {
        label: "Orders Ready to Serve",
        value: stats.readyOrders ?? 0,
        icon: UtensilsCrossed,
      },
      {
        label: "Pending KOT Items",
        value: stats.pendingKOTItems ?? 0,
        icon: Clock,
      },
      {
        label: "Today’s Tips (Optional)",
        value: stats.tipsAmount ?? 0,
        icon: Receipt,
        prefix: "₹",
      },
    ];
  }, [role, stats]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Quick action based on role */}
        <div className="flex flex-wrap gap-2">
          {(role === "super_admin" || role === "brand_admin" || role === "outlet_admin") && (
            <Link
              to="/menu/products/new"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700"
            >
              <UtensilsCrossed size={16} />
              Add Product
            </Link>
          )}
          {(role === "brand_admin" ||
            role === "outlet_admin" ||
            role === "staff") && (
            <Link
              to="/orders/new"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <ClipboardList size={16} />
              New Order
            </Link>
          )}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-slate-500" size={24} />
          <span className="ml-2 text-slate-500 text-sm">
            Loading dashboard…
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 mb-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Top stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">
                    {card.prefix || ""}
                    {typeof card.value === "number"
                      ? card.value.toLocaleString()
                      : card.value}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <card.icon size={18} className="text-indigo-600" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Recent orders */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Recent Orders
                </h2>
                <Link
                  to="/orders"
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                >
                  View all
                  <ArrowUpRight size={12} />
                </Link>
              </div>
              {data.recentOrders?.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No orders found for the selected period.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {data.recentOrders.map((o) => (
                    <div
                      key={o.id}
                      className="py-2 flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          #{o.orderNumber} • {o.tableName || "Takeaway"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {o.timeAgo} • {o.itemSummary}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          ₹{(o.totalAmount || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">{o.statusLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top items / performance */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Top Selling Items
                </h2>
              </div>
              {data.topItems?.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Not enough data to display top items.
                </p>
              ) : (
                <div className="space-y-2">
                  {data.topItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {idx + 1}. {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.categoryName} • {item.totalQty} sold
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Revenue</p>
                        <p className="text-sm font-semibold text-slate-900">
                          ₹{(item.revenue || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* simple trend indicator (optional) */}
              {typeof stats.revenueChangePct === "number" && (
                <div className="mt-4 text-xs flex items-center gap-1">
                  {stats.revenueChangePct >= 0 ? (
                    <ArrowUpRight className="text-emerald-600" size={14} />
                  ) : (
                    <ArrowDownRight className="text-red-600" size={14} />
                  )}
                  <span
                    className={
                      stats.revenueChangePct >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }
                  >
                    {stats.revenueChangePct > 0 ? "+" : ""}
                    {stats.revenueChangePct.toFixed(1)}%
                  </span>
                  <span className="text-slate-500 ml-1">
                    vs previous period
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
