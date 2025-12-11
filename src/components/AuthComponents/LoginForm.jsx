import React, { useState, useEffect, useContext } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/services/userService";
import { getRoles } from "@/services/roleService";

// Optional: if your tos app uses an AuthContext, this will gracefully use it.
const AuthContext = React.createContext(null);

export function LoginForm({
  selectedRole,
  form,
  onChange,
  rememberMeChanged,
  onSubmit,
  loading: parentLoading,
  errorMsg: parentError,
  roleLabel = "Employee",
  onAuthSuccess,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate?.() ?? (() => { });
  const authFromContext = useContext(AuthContext);

  // Helper: determine whether selectedRole is super_admin
  const isSuperAdmin = String(selectedRole || "").toLowerCase() === "super_admin";
  const showCompanyInput = !isSuperAdmin;

  const isCompanyAdmin = selectedRole === "company_admin";

  // Controlled fallback if parent didn't provide a submit handler
  async function internalSubmit(e) {
    e?.preventDefault();
    setErrorMsg("");

    // basic client validation
    if (!form?.email) return setErrorMsg("Please enter your email.");
    if (!form?.password) return setErrorMsg("Please enter your password.");
    if (showCompanyInput && (!form?.company_code || String(form.company_code).trim() === "")) {
      return setErrorMsg("Please enter Company ID.");
    }

    const payload = {
      email: form.email,
      password: form.password,
      ...(selectedRole ? { role: selectedRole } : {}),
      ...(form.company_code !== undefined && String(form.company_code).trim() !== "" ? { company_code: form.company_code } : {}),
      remember: !!form.remember,
    };

    try {
      setLoading(true);

      const res = await getMe()

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Login failed");

      // support common response shapes
      const tokens = data?.data?.tokens || data?.tokens || { access: data?.accessToken, refresh: data?.refreshToken };
      const user = data?.data?.user || data?.user || data?.data || null;
      const accessToken = tokens?.access || tokens?.accessToken || data?.accessToken;
      const refreshToken = tokens?.refresh || tokens?.refreshToken || data?.refreshToken;
      const returnedRole = (user && user.role) || selectedRole || roleLabel;

      // Persist tokens
      if (payload.remember) {
        if (accessToken) localStorage.setItem("tos_access_token", accessToken);
        if (refreshToken) localStorage.setItem("tos_refresh_token", refreshToken);
      } else {
        if (accessToken) sessionStorage.setItem("tos_access_token", accessToken);
        if (refreshToken) sessionStorage.setItem("tos_refresh_token", refreshToken);
      }

      // Optionally update AuthContext
      if (authFromContext?.setAuth) {
        try {
          authFromContext.setAuth({ user, role: returnedRole, accessToken });
        } catch (err) {
          // ignore
        }
      }

      if (onAuthSuccess) onAuthSuccess({ user, role: returnedRole, accessToken, refreshToken });

      navigate("/");
    } catch (err) {
      setErrorMsg(err?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = onSubmit ?? internalSubmit;

  useEffect(() => {
    // normalize parent error
    if (parentError) setErrorMsg(parentError);
  }, [parentError]);

  useEffect(() => {
    // Fetch roles (optional) and accept different shapes
    let cancelled = false;
    (async () => {
      try {
        const r = await getRoles();
        if (!r.ok) return;
        const d = await r.json();
        const list = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
        if (!cancelled && list.length) setRoles(list);
      } catch (e) {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isLoading = parentLoading ?? loading;

  return (
    <>
      {errorMsg && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="tos login form">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Email</label>
          <input
            name="email"
            type="email"
            value={form.email || ""}
            onChange={onChange}
            required
            className="w-full border border-slate-300 bg-white rounded-xl px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            placeholder="you@company.com"
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-700">Password</label>
            <button type="button" className="text-[11px] text-emerald-600" onClick={() => navigate('/auth/forgot-password')}>Forgot password?</button>
          </div>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password || ""}
              onChange={onChange}
              required
              className="w-full border border-slate-300 bg-white rounded-xl px-3 py-2 pr-10 text-sm shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              placeholder="•••••••"
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Company Id (only when selectedRole is not super_admin) */}
        {showCompanyInput && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              {isCompanyAdmin ? "Company ID" : "Branch ID"}
            </label>

            <input
              name="company_code"
              type="text"
              value={form.company_code ?? ""}
              onChange={onChange}
              required
              className="w-full border border-slate-300 bg-white rounded-xl px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              placeholder={isCompanyAdmin ? "CMP001" : "BR001"}
            />
          </div>
        )}

        {/* Optional Role display (read-only) */}
        {roles.length > 0 ? (
          <div className="text-xs text-slate-600">Signing in role: <span className="font-medium">{selectedRole || roleLabel}</span></div>
        ) : null}

        {/* Remember */}
        <label className="inline-flex items-center gap-2 text-[11px] text-slate-500">
          <input
            type="checkbox"
            name="remember"
            checked={!!form.remember}
            onChange={rememberMeChanged}
            className="h-3.5 w-3.5 border-slate-300"
            aria-label="Keep me signed in"
          />
          Keep me signed in
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-xl text-sm shadow-md hover:opacity-95 transition disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : `Sign in`}
          {!isLoading && <ArrowRight className="h-4 w-4 inline ml-2" />}
        </button>
      </form>
    </>
  );
}

export default LoginForm;