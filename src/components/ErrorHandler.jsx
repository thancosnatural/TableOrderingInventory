import axios from "axios";
import toast from "react-hot-toast";

/**
 * Centralized function to extract error message from an Axios error
 * @param {any} error
 * @returns {string}
 */
const handleAxiosError = (error) => {
  if (!axios.isAxiosError(error)) {
    return "An unexpected error occurred. Please try again later.";
  }

  if (error.code === "ERR_NETWORK") {
    return "Network error. Please check your internet connection and try again.";
  }

  if (!error.response) {
    return "The server did not respond. Please try again later.";
  }

  // Handle specific HTTP status codes
  const status = error.response.status;
  const serverMessage =
    error.response.data?.message || error.response.data?.error;

  switch (status) {
    case 400:
      return serverMessage || "Bad request. Please check your input.";
    case 401:
      return serverMessage || "Unauthorized. Please login again.";
    case 403:
      return serverMessage || "Access forbidden. Contact support if needed.";
    case 404:
      return serverMessage || "Requested resource was not found.";
    case 429:
      return serverMessage || "Too many requests. Please try again later.";
    case 500:
      return serverMessage || "Internal server error. Please try again later.";
    default:
      return serverMessage || "An unknown error occurred. Please try again.";
  }
};

/**
 * Unified error handler for POST requests (shows toast by default)
 * @param {any} error
 * @param {Function} [setErrorMessage] Optional state setter for error messages
 * @param {boolean} [showToast=true]
 * @returns {string} error message
 */
export const postErrorHandler = (
  error,
  setErrorMessage = () => {},
  showToast = true
) => {
  const errorMessage = handleAxiosError(error);
  setErrorMessage(errorMessage);
  if (showToast) toast.error(errorMessage);
  return errorMessage;
};

/**
 * Unified error handler for GET requests (shows toast by default)
 * @param {any} error
 * @param {Function} [setErrorMessage] Optional state setter for error messages
 * @param {boolean} [showToast=true]
 * @returns {string} error message
 */
export const getErrorHandler = (
  error,
  setErrorMessage = () => {},
  showToast = true
) => {
  const errorMessage = handleAxiosError(error);
  setErrorMessage(errorMessage);
  if (showToast) toast.error(errorMessage);
  return errorMessage;
};
