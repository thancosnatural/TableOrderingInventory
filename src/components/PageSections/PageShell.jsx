// src/components/Common/PageSections/PageShell.jsx
import React from "react";

export default function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
