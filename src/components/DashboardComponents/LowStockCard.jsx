import { useMemo } from "react";
import { CardHeader } from "./CardHeader";
import { AlertTriangle } from "lucide-react";

export const LowStockCard = ({ items = [] }) => {
  const sorted = useMemo(
    () => (items || []).slice().sort((a, b) => (a.stock_quantity ?? 0) - (b.stock_quantity ?? 0)),
    [items]
  );
  return (
    <div>
      <CardHeader title="Low Stock" subtitle="Critical" right={<AlertTriangle className="h-5 w-5 text-amber-600" />} />
      <div>
        <ul className="space-y-2">
          {sorted.slice(0, 6).map((it) => (
            <li key={it.id} className="flex items-center justify-between text-sm">
              <span className="truncate pr-2">{it.variant_name || it.name || "Unnamed"}</span>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">
                {it.stock_quantity ?? 0}
              </span>
            </li>
          ))}
          {sorted.length === 0 && (
            <li className="text-sm text-gray-500">All good — no low stock items.</li>
          )}
        </ul>
      </div>
    </div>
  );
}