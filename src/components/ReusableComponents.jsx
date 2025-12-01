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