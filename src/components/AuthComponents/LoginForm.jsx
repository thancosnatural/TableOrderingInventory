// src/components/auth/LoginForm.jsx
import React from "react";
import { ArrowRight } from "lucide-react";

export function LoginForm({ form, onChange, onSubmit, loading, errorMsg, roleLabel }) {
  return (
    <>
      {errorMsg && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full border border-slate-300 bg-white rounded-xl px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            placeholder="you@company.com"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-700">Password</label>
            <button type="button" className="text-[11px] text-emerald-600">
              Forgot password?
            </button>
          </div>

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full border border-slate-300 bg-white rounded-xl px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            placeholder="•••••••"
          />
        </div>

        {/* Remember */}
        <label className="inline-flex items-center gap-2 text-[11px] text-slate-500">
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={onChange}
            className="h-3.5 w-3.5 border-slate-300"
          />
          Keep me signed in
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-xl text-sm shadow-md hover:opacity-95 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : `Sign in as ${roleLabel}`}
          {!loading && <ArrowRight className="h-4 w-4 inline ml-2" />}
        </button>

        {/* Divider */}
        {/* <div className="relative mt-5">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 border-t border-slate-200 w-full"></span>
          <span className="relative bg-white text-xs text-slate-400 px-2">or continue with</span>
        </div>

        <button
          type="button"
          className="w-full py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 bg-white shadow-sm hover:bg-slate-50"
        >
          Google (SSO)
        </button> */}
      </form>
    </>
  );
}
