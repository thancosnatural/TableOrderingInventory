import { PlusCircle, ShoppingCart } from "lucide-react";
import { CardHeader } from "./CardHeader";

export const QuickActionsCard = ({ onAddProduct, onGoOrders }) => {
  return (
    <div>
      <CardHeader title="Quick Actions" subtitle="Do more" />
      <div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onAddProduct}
            className="inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50"
          >
            <PlusCircle className="h-5 w-5" /> Add product
          </button>
          <button
            onClick={onGoOrders}
            className="inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50"
          >
            <ShoppingCart className="h-5 w-5" /> View orders
          </button>
        </div>
      </div>
    </div>
  );
}