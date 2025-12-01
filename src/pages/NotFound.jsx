// pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <p className="text-sm font-medium text-emerald-700/80">Error</p>
        <h1 className="mt-1 text-7xl font-extrabold tracking-tight text-slate-900">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-slate-800">Page not found</h2>
        <p className="mt-2 text-slate-600">
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
