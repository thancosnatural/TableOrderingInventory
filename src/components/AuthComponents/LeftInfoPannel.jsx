// src/components/auth/LeftInfoPanel.jsx
import React from "react";

export function LeftInfoPanel({ accent }) {
  return (
    <>
      {/* Subtle background glow */}
      <div
        className={
          "pointer-events-none absolute -top-28 -right-20 h-60 w-60 rounded-full bg-gradient-to-br " +
          accent +
          " opacity-30 blur-3xl"
        }
      />

      <div className="relative z-10">
        {/* Badge */}
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 mb-6 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Role-Based Access Control
        </p>

        {/* Heading */}
        <h1 className="text-4xl font-semibold text-slate-900 leading-tight mb-4">
          Thanco’s{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            Table Ordering System
          </span>
        </h1>

        {/* Description */}
        <p className="text-slate-600 text-sm max-w-md leading-relaxed">
          Thanco’s TOS (Table Ordering System) is designed for multi-outlet
          operations, enabling secure and role-based access for owners,
          managers, staff, and administrators across companies and branches.
        </p>

        {/* Feature list */}
        <div className="mt-10 space-y-6">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-300 text-[11px] font-semibold">
              RBAC
            </div>
            <div>
              <p className="font-medium text-slate-900">
                Centralized Role & Permission Control
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Access is automatically determined based on assigned roles,
                company, and branch membership.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-300 text-[11px] font-semibold">
              SEC
            </div>
            <div>
              <p className="font-medium text-slate-900">
                Enterprise-Grade Authentication
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Secure token-based login with scoped permissions and session
                control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
