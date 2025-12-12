// src/components/ErrorState.jsx
import React from "react";

export default function ErrorState({
  error = null,
  title = "Something went wrong",
  description = "We were unable to process your request. Please try again.",
  onRetry,
  retryLabel = "Retry",
}) {
  // Extract backend message safely
  let backendMessage = "";

  if (typeof error === "string") backendMessage = error;
  else if (error?.message) backendMessage = error.message;
  else if (error?.error) backendMessage = error.error;
  else if (error?.data?.message) backendMessage = error.data.message;
  else if (Array.isArray(error)) backendMessage = error.join(", ");

  const finalDescription = backendMessage || description;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">

      {/* Custom SVG Warning Icon */}
      <svg
        className="h-12 w-12 text-red-600 mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h17.78A1.5 1.5 0 0022.18 18L13.71 3.86a1.5 1.5 0 00-2.42 0z"
        />
      </svg>

      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <p className="text-sm text-gray-500 mt-2 max-w-md whitespace-pre-line">
        {finalDescription}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
