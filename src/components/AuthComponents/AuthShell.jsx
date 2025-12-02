// src/components/auth/AuthShell.jsx
import React from "react";

export function AuthShell({ left, right }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white border border-slate-200 md:rounded-3xl md:shadow-xl overflow-hidden">
        {/* On md+ → 2 columns; on mobile → only right side is visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:h-[80vh]">

          {/* LEFT PANEL (HIDDEN ON MOBILE) */}
          <div
            className="
              hidden
              md:block
              relative
              p-12
              bg-gradient-to-br from-white via-slate-50 to-slate-100
              border-r border-slate-200
              overflow-hidden
            "
          >
            {left}
          </div>

          {/* RIGHT PANEL (FORM) – SCROLLABLE ON DESKTOP, FULL WIDTH ON MOBILE */}
          <div
            className="
              bg-white
              p-4 sm:p-8 md:p-10
              overflow-y-auto
            "
          >
            {right}
          </div>
        </div>
      </div>
    </div>
  );
}
