// src/components/auth/LeftInfoPanel.jsx
import React from "react";

export function LeftInfoPanel({ accent }) {
  return (
    <>
      {/* subtle glow */}
      <div
        className={
          "pointer-events-none absolute -top-28 -right-20 h-60 w-60 rounded-full bg-gradient-to-br " +
          accent +
          " opacity-30 blur-3xl"
        }
      />

      <div className="relative z-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 mb-6 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Role-Based Access
        </p>

        <h1 className="text-4xl font-semibold text-slate-900 leading-tight mb-4">
          Manage Your{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            Operations
          </span>
        </h1>

        <p className="text-slate-600 text-sm max-w-md">
          Choose your role and access the appropriate dashboard. Designed for
          multi-outlet operations with enterprise-grade security.
        </p>

        <div className="mt-10 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-300 text-xs">
              RBAC
            </div>
            <div>
              <p className="font-medium text-slate-900">Central Permissions</p>
              <p className="text-xs text-slate-500">Supports multi-level roles.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-300 text-xs">
              SEC
            </div>
            <div>
              <p className="font-medium text-slate-900">High Security</p>
              <p className="text-xs text-slate-500">Token-based authentication.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
