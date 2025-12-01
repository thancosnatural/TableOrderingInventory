import toast from "react-hot-toast";

/**
 * Extracts and displays a success message from an Axios response
 * @param {any} response - Axios response object
 * @param {Function} [setSuccessMessage] - Optional state setter
 * @param {boolean} [showToast=true] - Whether to show toast
 * @param {string} [defaultMessage="Success"] - Fallback message
 * @returns {string} - Resolved message
 */
export const successHandler = (
  response,
  setSuccessMessage = () => {},
  showToast = true,
  defaultMessage = "Success"
) => {
  if (!response || typeof response !== "object") {
    setSuccessMessage(defaultMessage);
    if (showToast) toast.success(defaultMessage);
    return defaultMessage;
  }

  const message =
    response?.data?.message ||
    response?.data?.success ||
    response?.message ||
    defaultMessage;

  setSuccessMessage(message);
  if (showToast) toast.success(message);

  return message;
};
