import { postErrorHandler } from "@/components/ErrorHandler";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | submitting | success | error
    const [errorMessage, setErrorMessage] = useState("");

    const { userForgotPassword } = useAuth()

    const validate = () => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setErrorMessage("Please enter your email address.");
            return false;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(trimmedEmail)) {
            setErrorMessage("Please enter a valid email address.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!validate()) return;

        try {
            setStatus("submitting");
            await userForgotPassword({ email: email.trim() });
            setStatus("success");
        } catch (err) {
            postErrorHandler(err)
            setStatus("success");
        } finally {
            setStatus("success");
        }
    };

    const isSubmitting = status === "submitting";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md">
                {/* Header / Brand */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Forgot Password
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your registered email address and we’ll send you a reset link.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
                    {/* Success message */}
                    {status === "success" && (
                        <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                            A password reset link has been sent to your email.
                            Please check your inbox and spam folder.
                        </div>
                    )}

                    {/* Error message (includes "no account with this email") */}
                    {status === "error" && errorMessage && (
                        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status !== "idle") {
                                        // Reset status when user edits input again
                                        setStatus("idle");
                                        setErrorMessage("");
                                    }
                                }}
                                disabled={isSubmitting}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
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
                                    Sending link...
                                </>
                            ) : (
                                "Send Reset Link"
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

export default ForgotPasswordPage;
