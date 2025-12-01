// components/BackButton.jsx
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function BackButton({ className = "" }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 rounded border px-2 py-1 text-sm hover:bg-gray-50 ${className}`}
      aria-label="Go back"
    >
      <IoArrowBack size={18}/> Back
    </button>
  );
}
