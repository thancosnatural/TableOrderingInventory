// src/components/Common/SearchBar.jsx
import { Search } from "lucide-react";
import React from "react";

/**
 * Common SearchBar
 *
 * @param {string} value
 * @param {(value: string) => void} onChange
 * @param {string} placeholder
 * @param {string} ariaLabel
 * @param {boolean} disabled
 * @param {string} className
 */
export default function PageSearchBar({
  value = "",
  onChange,
  placeholder = "Search...",
  ariaLabel = "Search",
  disabled = false,
  className = "",
}) {
  return (
    <div className={["flex items-center gap-2 w-full", className].join(" ")}>
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
          <Search />
        </span>

        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="
            w-full
            pl-10 pr-4 py-2
            rounded-md
            border
            bg-white
            shadow-sm
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-200
            disabled:bg-gray-100
            disabled:cursor-not-allowed
          "
        />
      </div>
    </div>
  );
}
