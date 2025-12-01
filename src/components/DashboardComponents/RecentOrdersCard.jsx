import { CardHeader } from "./CardHeader";

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const RecentOrdersCard = ({ rows = [], onViewAll }) => {

  return (
    <div>
      <CardHeader
        title="Recent Orders"
        subtitle="Latest 5"
        right={
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            View all
          </button>
        }
      />
      <div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500">
              <tr className="border-b">
                <th className="py-2 pr-3 text-left">Order</th>
                <th className="py-2 px-3 text-left">Customer</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2 pr-3">#{String(r.order_code).slice(0, 8)}</td>
                  <td className="py-2 px-3">{r.customer || "—"}</td>
                  <td className="py-2 px-3 capitalize">{(r.status || "pending").replaceAll("_", " ")}</td>
                  <td className="py-2 px-3 text-right">{INR.format(r.total || 0)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}