// src/components/RoleComponents/SearchBar.jsx
import React from "react";

const IconSearch = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.75 3.75a7.5 7.5 0 0012.9 12.9z"
    />
  </svg>
);

function SearchBar({
  value,
  onChange,
  placeholder = "Search roles by name, code, or scope...",
}) {
  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
          <IconSearch />
        </span>

        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder={placeholder}
          aria-label="Search roles"
        />
      </div>
    </div>
  );
}

export default SearchBar;
