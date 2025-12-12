import { useMemo } from "react";

export const Pagination = ({ page, totalPages, onChange }) => {
  const pages = useMemo(() => {
    const arr = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages]);

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="px-2 py-1 rounded border disabled:opacity-50">Prev</button>
      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`px-3 py-1 rounded ${p === page ? "bg-slate-900 text-white" : "bg-white border"}`}>{p}</button>
      ))}
      <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-2 py-1 rounded border disabled:opacity-50">Next</button>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`bg-white rounded shadow p-4 sm:p-6 ${className}`.trim()}>{children}</div>;
}


export function IconButton({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title} className="p-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2">
      {children}
    </button>
  );
}

export function Badge({ children, color = "green" }) {
  const map = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };
  return <span className={`px-2 py-1 rounded-md text-xs font-medium ${map[color] || map.green}`}>{children}</span>;
}


export function ErrorState({
  type = "glitch",           // "network" | "glitch"
  message = "Something went wrong.",
  onRetry = null,            // callback function
  className = "",
}) {
  const isNetwork = type === "network";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-lg border px-4 py-8 text-center shadow-sm 
        ${isNetwork ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"} 
        ${className}`}
    >
      {/* Icon */}
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full 
        ${isNetwork ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`}
      >
        {isNetwork ? (
          <span className="text-xl font-bold">📡</span>
        ) : (
          <span className="text-xl font-bold">⚠️</span>
        )}
      </div>

      {/* Title */}
      <h2
        className={`text-sm font-semibold 
        ${isNetwork ? "text-red-700" : "text-yellow-700"}`}
      >
        {isNetwork ? "Network Issue" : "Something Went Wrong"}
      </h2>

      {/* Message */}
      <p
        className={`max-w-md text-xs 
        ${isNetwork ? "text-red-600" : "text-yellow-700"}`}
      >
        {message}
      </p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className={`mt-2 inline-flex items-center rounded-md px-4 py-1.5 text-xs font-medium shadow-sm transition 
            ${isNetwork
              ? "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500"
              : "bg-yellow-600 text-white hover:bg-yellow-500 focus-visible:ring-yellow-500"
            }
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
        >
          Retry
        </button>
      )}
    </div>
  );
}
