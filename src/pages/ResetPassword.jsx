import { postErrorHandler } from "@/components/ErrorHandler";
import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";

const ResetPasswordPage = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const { userResetPassword } = useAuth();

  // Get token from URL query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) {
      setToken(t);
    } else {
      setStatus("error");
      setErrorMessage("Invalid or missing reset token.");
    }
  }, []);

  const validate = () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) return;
    if (!token) {
      setErrorMessage("Invalid or missing reset token.");
      setStatus("error");
      return;
    }

    try {
      setStatus("submitting");

      // 🔑 Backend expects: { token, new_password }
      await userResetPassword({
        token,
        new_password: newPassword,
      });

      setStatus("success");
    } catch (err) {
      // Show toast / global handler
      postErrorHandler(err);

      // Local status + message for this page
      setStatus("error");
      const backendMsg = err?.response?.data?.error;
      if (backendMsg) {
        setErrorMessage(backendMsg);
      } else if (!errorMessage) {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Brand / title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Reset Your Password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your new password below to secure your account.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          {/* If token missing / invalid */}
          {!token && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {errorMessage || "Invalid or expired reset link."}
            </div>
          )}

          {/* Success message */}
          {status === "success" && (
            <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              Your password has been reset successfully. You can now{" "}
              <a href="/login" className="font-semibold underline">
                log in
              </a>{" "}
              with your new password.
            </div>
          )}

          {/* Error message */}
          {status === "error" && errorMessage && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  disabled={isSubmitting || !token || status === "success"}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  disabled={isSubmitting || !token || status === "success"}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)}
                  disabled={isSubmitting || !token || status === "success"}
                />
                <span>Show password</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !token || status === "success"}
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Updating password...
                </>
              ) : status === "success" ? (
                "Password Updated"
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs sm:text-sm text-gray-500">
            Remembered your password?{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:underline"
            >
              Go back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
