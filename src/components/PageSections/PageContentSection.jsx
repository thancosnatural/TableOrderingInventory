// src/components/Common/PageSections/PageContentSection.jsx
import React from "react";
import { Loader } from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

export default function PageContentSection({
  apiStatus,
  API_STATUS_CONSTANTS,
  loading = false,
  error = null,

  // how to render data
  isEmpty = false,
  renderSuccess,

  // optional customizations
  emptyFallback = <EmptyState />,
  loadingFallback = <Loader />,

  // retry
  onRetry,
  errorTitle = "Failed to load",
  errorDescription = "Something went wrong while fetching data.",
  retryLabel = "Retry",
}) {
  const render = () => {
    if (loading && apiStatus === API_STATUS_CONSTANTS.LOADING) return loadingFallback;

    switch (apiStatus) {
      case API_STATUS_CONSTANTS.LOADING:
        return loadingFallback;

      case API_STATUS_CONSTANTS.FAILURE:
        return (
          <ErrorState
            error={error}
            title={errorTitle}
            description={errorDescription}
            onRetry={onRetry}
            retryLabel={retryLabel}
          />
        );

      case API_STATUS_CONSTANTS.SUCCESS:
        if (isEmpty) return emptyFallback;
        return typeof renderSuccess === "function" ? renderSuccess() : null;

      case API_STATUS_CONSTANTS.INITIAL:
      default:
        return loadingFallback;
    }
  };

  return <div className="py-2">{render()}</div>;
}
