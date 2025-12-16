import React from "react";

export default function Toggle({ checked, onChange, color = "indigo" }) {
  const bgOn = color === "green" ? "bg-green-600" : "bg-indigo-600";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center h-7 w-12 rounded-full p-1 transition-colors focus:outline-none ${
        checked ? bgOn : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
