import React, { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function LoginForm({
  form,
  onChange,
  rememberMeChanged,
  onSubmit,
  loading: parentLoading,
  errorMsg: parentError,
  onAuthSuccess,
}) {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use the real auth context

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Use parent submit handler if provided, else use internal logic
  const handleSubmit = onSubmit ?? (async (e) => {
    e?.preventDefault();
    if (submitting) return;

    setErrorMsg("");

    // Client-side validation
    if (!form?.email) return setErrorMsg("Email is required.");
    if (!form?.password) return setErrorMsg("Password is required.");

    try {
      setSubmitting(true);

      // ✅ Backend resolves role/company/branch automatically
      const result = await login({
        email: form.email,
        password: form.password,
        remember: Boolean(form.remember),
        // device_info optional if you use it:
        device_info: form.device_info || undefined,
      });

      // Optional callback for parent usage (analytics / redirect decisions)
      if (onAuthSuccess) {
        onAuthSuccess(result);
      }

      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to sign in. Please try again.";

      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  });

  // Normalize parent-provided error
  useEffect(() => {
    if (parentError) setErrorMsg(parentError);
  }, [parentError]);

  const isLoading = Boolean(parentLoading ?? submitting);

  return (
<>
  {/* Header */}
  <div className="mb-6">
    <h2 className="text-2xl font-semibold text-slate-900">
      Sign in to Thanco’s TOS
    </h2>
    <p className="mt-1 text-sm text-slate-600">
      Table Ordering System – Secure access for authorized users
    </p>
  </div>

  {/* Error */}
  {errorMsg && (
    <div
      role="alert"
      className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg"
    >
      {errorMsg}
    </div>
  )}

  <form
    onSubmit={handleSubmit}
    className="space-y-4"
    aria-label="Thanco’s TOS login form"
  >
    {/* Email */}
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-700">
        Email address
      </label>
      <input
        name="email"
        type="email"
        value={form.email || ""}
        onChange={onChange}
        required
        disabled={isLoading}
        className="w-full border border-slate-300 bg-white rounded-xl px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none disabled:opacity-60"
        placeholder="name@company.com"
        autoComplete="email"
      />
    </div>

    {/* Password */}
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-slate-700">
          Password
        </label>
        <button
          type="button"
          className="text-[11px] text-emerald-600 hover:underline"
          onClick={() => navigate("/auth/forgot-password")}
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password || ""}
          onChange={onChange}
          required
          disabled={isLoading}
          className="w-full border border-slate-300 bg-white rounded-xl px-3 py-2 pr-10 text-sm shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none disabled:opacity-60"
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
          disabled={isLoading}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>

    {/* Remember */}
    <label className="inline-flex items-center gap-2 text-[11px] text-slate-500">
      <input
        type="checkbox"
        name="remember"
        checked={!!form.remember}
        onChange={rememberMeChanged}
        className="h-3.5 w-3.5 border-slate-300"
        disabled={isLoading}
      />
      Keep me signed in on this device
    </label>

    {/* Submit */}
    <button
      type="submit"
      disabled={isLoading}
      className="w-full mt-2 py-2.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-xl text-sm shadow-md hover:opacity-95 transition disabled:opacity-60"
    >
      {isLoading ? "Signing in..." : "Sign in"}
      {!isLoading && <ArrowRight className="h-4 w-4 inline ml-2" />}
    </button>
  </form>

  {/* Footer trust text */}
  <p className="mt-6 text-center text-[11px] text-slate-500">
    Protected by role-based access control and secure token authentication.
  </p>
</>

  );
}

export default LoginForm;
