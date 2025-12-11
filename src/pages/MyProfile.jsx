// // src/pages/ProfilePage.jsx
// import React, { useEffect, useState } from "react";
// import {
//   User as UserIcon,
//   Mail,
//   Phone,
//   Shield,
//   Lock,
//   Upload,
//   Save,
//   Loader2,
//   Store,
//   Building2,
//   KeyRound,
//   CheckCircle2,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// const ROLE_META = {
//   super_admin: {
//     label: "Super Admin",
//     level: "Platform Level",
//     description:
//       "Full access across all brands, outlets, users and billing for this table-ordering platform.",
//     badgeClass: "bg-red-50 text-red-700 border-red-200",
//   },
//   brand_admin: {
//     label: "Brand Admin",
//     level: "Brand Level",
//     description:
//       "Manages a specific brand, its outlets, menu, offers and brand-level reports.",
//     badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
//   },
//   branch_admin: {
//     label: "Branch Admin",
//     level: "Branch Level",
//     description:
//       "Responsible for one or more branchers/outlets, including tables, orders, KOT and billing.",
//     badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
//   },
//   staff: {
//     label: "Staff",
//     level: "Frontline",
//     description:
//       "Handles daily operations like taking orders, updating KOT and serving guests.",
//     badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
//   },
// };

// export default function ProfilePage() {
//   const { user, scopes, setUser } = useAuth();

//   const role = user?.role || "user";

//   const meta = ROLE_META[role] || {
//     label: role || "User",
//     level: "User",
//     description: "Standard access in the system.",
//     badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
//   };

//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const [savingProfile, setSavingProfile] = useState(false);
//   const [savingPassword, setSavingPassword] = useState(false);
//   const [profileSaved, setProfileSaved] = useState(false);
//   const [passwordSaved, setPasswordSaved] = useState(false);

//   const [form, setForm] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//   });

//   const [passwordForm, setPasswordForm] = useState({
//     current_password: "",
//     new_password: "",
//     confirm_password: "",
//   });

//   useEffect(() => {
//     setForm({
//       full_name: user?.full_name || user?.name || "",
//       email: user?.email || "",
//       phone: user?.phone || "",
//     });
//     setAvatarPreview(user?.avatar_url || null);
//   }, [user]);

//   function onChangeField(key, value) {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     setProfileSaved(false);
//   }

//   function onChangePasswordField(key, value) {
//     setPasswordForm((prev) => ({ ...prev, [key]: value }));
//     setPasswordSaved(false);
//   }

//   function handleAvatarChange(e) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const url = URL.createObjectURL(file);
//     setAvatarPreview(url);
//     // later: upload to server, then setUser({ ...user, avatar_url: uploadedUrl })
//   }

//   async function handleSaveProfile(e) {
//     e?.preventDefault();
//     setSavingProfile(true);
//     setProfileSaved(false);

//     try {
//       // TODO: replace with real API call
//       await new Promise((resolve) => setTimeout(resolve, 700));

//       setUser({
//         ...user,
//         full_name: form.full_name,
//         name: form.full_name,
//         email: form.email,
//         phone: form.phone,
//         avatar_url: avatarPreview || user?.avatar_url || null,
//       });

//       setProfileSaved(true);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSavingProfile(false);
//     }
//   }

//   async function handleSavePassword(e) {
//     e?.preventDefault();
//     setSavingPassword(true);
//     setPasswordSaved(false);

//     if (
//       !passwordForm.new_password ||
//       passwordForm.new_password !== passwordForm.confirm_password
//     ) {
//       setSavingPassword(false);
//       alert("New password and confirm password must match.");
//       return;
//     }

//     try{
//       // TODO: replace with API call
//       await new Promise((resolve) => setTimeout(resolve, 700));

//       setPasswordForm({
//         current_password: "",
//         new_password: "",
//         confirm_password: "",
//       });
//       setPasswordSaved(true);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSavingPassword(false);
//     }
//   }

//   // Try to read dynamic contexts from user object (optional/flexible)
//   const brandName =
//     user?.brand_name || user?.brand?.name || user?.brandName || null;
//   const outletList =
//     user?.outlets || user?.outletAssignments || user?.outlet_list || [];
//   const scopesList = scopes || user?.scopes || [];

//   return (
//     <div className="max-w-7xl mx-auto flex flex-col gap-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
//           <UserIcon size={20} />
//           My Profile
//         </h1>
//         <p className="text-sm text-slate-500 mt-1">
//           Manage your personal information, role access and account security.
//         </p>
//       </div>

//       {/* Top: Avatar + Basic Info + Role */}
//       <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col gap-4">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
//                 {avatarPreview ? (
//                   <img
//                     src={avatarPreview}
//                     alt="Avatar"
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <UserIcon className="text-slate-400" size={24} />
//                 )}
//               </div>
//               <label className="absolute -bottom-1 -right-1 rounded-full bg-slate-900 text-white p-1.5 cursor-pointer shadow-md">
//                 <Upload size={12} />
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleAvatarChange}
//                 />
//               </label>
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-slate-900">
//                 {form.full_name || "Your Name"}
//               </p>
//               <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
//                 <Shield size={12} className="text-slate-400" />
//                 {meta.label} • {meta.level}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Role & access context */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
//           <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
//             <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
//               Role Description
//             </p>
//             <p className="text-xs text-slate-700">{meta.description}</p>
//           </div>
//           <div className="rounded-lg border text-xs p-3 flex flex-col gap-1 bg-white">
//             <p className="text-[11px] uppercase tracking-wide text-slate-500">
//               Current Role
//             </p>
//             <span
//               className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${meta.badgeClass}`}
//             >
//               <Shield size={11} />
//               {meta.label}
//             </span>
//           </div>
//         </div>

//         {/* Profile form */}
//         <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <UserIcon
//                   size={14}
//                   className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//                 <input
//                   type="text"
//                   value={form.full_name}
//                   onChange={(e) => onChangeField("full_name", e.target.value)}
//                   className="w-full pl-7 pr-3 py-1.5 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                   placeholder="Your full name"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Phone
//               </label>
//               <div className="relative">
//                 <Phone
//                   size={14}
//                   className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//                 <input
//                   type="tel"
//                   value={form.phone}
//                   onChange={(e) => onChangeField("phone", e.target.value)}
//                   className="w-full pl-7 pr-3 py-1.5 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                   placeholder="Phone number"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail
//                   size={14}
//                   className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//                 <input
//                   type="email"
//                   value={form.email}
//                   onChange={(e) => onChangeField("email", e.target.value)}
//                   className="w-full pl-7 pr-3 py-1.5 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                   placeholder="Email address"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Role
//               </label>
//               <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-100 bg-slate-50 text-xs text-slate-600">
//                 <Shield size={14} className="text-slate-400" />
//                 <span>{meta.label}</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between gap-2 pt-2">
//             <div className="text-xs text-slate-500">
//               {profileSaved && (
//                 <span className="inline-flex items-center gap-1 text-emerald-600">
//                   <CheckCircle2 size={12} />
//                   Changes saved successfully.
//                 </span>
//               )}
//             </div>
//             <button
//               type="submit"
//               disabled={savingProfile}
//               className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-60"
//             >
//               {savingProfile ? (
//                 <>
//                   <Loader2 size={14} className="animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save size={14} />
//                   Save Changes
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Role context: Brand / Outlet / Permissions */}
//       <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col gap-4">
//         <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//           <KeyRound size={16} />
//           Role & Access
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
//           {/* Brand card (for brand/outlet roles) */}
//           <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 flex flex-col gap-1">
//             <p className="text-[11px] uppercase tracking-wide text-slate-500">
//               Brand
//             </p>
//             {role === "super_admin" ? (
//               <p className="text-slate-700 flex items-center gap-1">
//                 <Building2 size={13} className="text-slate-400" />
//                 Access to all brands
//               </p>
//             ) : brandName ? (
//               <p className="text-slate-700 flex items-center gap-1">
//                 <Building2 size={13} className="text-slate-400" />
//                 {brandName}
//               </p>
//             ) : (
//               <p className="text-slate-500 italic">No brand linked.</p>
//             )}
//           </div>

//           {/* Outlets card */}
//           <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 flex flex-col gap-1">
//             <p className="text-[11px] uppercase tracking-wide text-slate-500">
//               Outlets
//             </p>
//             {role === "super_admin" ? (
//               <p className="text-slate-700 flex items-center gap-1">
//                 <Store size={13} className="text-slate-400" />
//                 Access to all outlets
//               </p>
//             ) : outletList && outletList.length ? (
//               <div className="space-y-1">
//                 {outletList.slice(0, 3).map((o, idx) => (
//                   <p
//                     key={o.id || o.code || idx}
//                     className="text-slate-700 flex items-center gap-1"
//                   >
//                     <Store size={13} className="text-slate-400" />
//                     {o.name || o.outlet_name || `Outlet ${idx + 1}`}
//                   </p>
//                 ))}
//                 {outletList.length > 3 && (
//                   <p className="text-[11px] text-slate-500">
//                     +{outletList.length - 3} more outlet(s)
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-slate-500 italic">No outlets linked.</p>
//             )}
//           </div>

//           {/* Permissions / Scopes */}
//           <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 flex flex-col gap-1">
//             <p className="text-[11px] uppercase tracking-wide text-slate-500">
//               Permissions
//             </p>
//             {scopesList && scopesList.length ? (
//               <div className="flex flex-wrap gap-1 mt-1">
//                 {scopesList.slice(0, 6).map((s) => (
//                   <span
//                     key={s.key || s}
//                     className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] text-slate-700"
//                   >
//                     {s.label || s.key || String(s)}
//                   </span>
//                 ))}
//                 {scopesList.length > 6 && (
//                   <span className="text-[11px] text-slate-500 mt-1">
//                     +{scopesList.length - 6} more
//                   </span>
//                 )}
//               </div>
//             ) : (
//               <p className="text-slate-500 italic">
//                 No specific permissions listed.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Security / Password */}
//       <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col gap-4">
//         <div className="flex items-center justify-between gap-2">
//           <div>
//             <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//               <Lock size={16} />
//               Security
//             </h2>
//             <p className="text-xs text-slate-500 mt-1">
//               Update your password regularly to keep your account secure.
//             </p>
//           </div>
//         </div>

//         <form onSubmit={handleSavePassword} className="space-y-3 mt-2">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Current Password
//               </label>
//               <input
//                 type="password"
//                 value={passwordForm.current_password}
//                 onChange={(e) =>
//                   onChangePasswordField("current_password", e.target.value)
//                 }
//                 className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                 placeholder="Enter current password"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 value={passwordForm.new_password}
//                 onChange={(e) =>
//                   onChangePasswordField("new_password", e.target.value)
//                 }
//                 className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                 placeholder="Enter new password"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1">
//                 Confirm New Password
//               </label>
//               <input
//                 type="password"
//                 value={passwordForm.confirm_password}
//                 onChange={(e) =>
//                   onChangePasswordField("confirm_password", e.target.value)
//                 }
//                 className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                 placeholder="Re-enter new password"
//               />
//             </div>
//           </div>

//           <div className="flex items-center justify-between gap-2 pt-2">
//             <div className="text-xs text-slate-500">
//               {passwordSaved && (
//                 <span className="inline-flex items-center gap-1 text-emerald-600">
//                   <CheckCircle2 size={12} />
//                   Password updated successfully.
//                 </span>
//               )}
//             </div>
//             <button
//               type="submit"
//               disabled={savingPassword}
//               className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-60"
//             >
//               {savingPassword ? (
//                 <>
//                   <Loader2 size={14} className="animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <Lock size={14} />
//                   Update Password
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }











// src/pages/ProfilePage.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Lock,
  Upload,
  Save,
  Loader2,
  Store,
  Building2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// --- Role metadata (now includes company_admin / branch_admin cleanly) ---
const ROLE_META = {
  super_admin: {
    label: "Super Admin",
    level: "Platform Level",
    description:
      "Full access across all brands, outlets, users and billing for this table-ordering platform.",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  company_admin: {
    label: "Company Admin",
    level: "Company Level",
    description:
      "Manages a specific company/brand, its branches, menu, offers and company-level reports.",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  branch_admin: {
    label: "Branch Admin",
    level: "Branch Level",
    description:
      "Responsible for one or more branches/outlets, including tables, orders, KOT and billing.",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  staff: {
    label: "Staff",
    level: "Frontline",
    description:
      "Handles daily operations like taking orders, updating KOT and serving guests.",
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
  },
};

// --- Small reusable components ---
function TextField({ label, icon: Icon, type = "text", value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? "pl-7" : "pl-3"} pr-3 py-1.5 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10`}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}

function CardSection({ titleIcon: Icon, title, children, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            {Icon && <Icon size={16} />}
            {title}
          </h2>
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// API helpers (you can move to src/api/profile.js)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function apiGetProfile(token) {
  const res = await fetch(`${API_BASE}/profile/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

async function apiUpdateProfile(token, payload) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

async function apiRequestPasswordReset(email) {
  const res = await fetch(`${API_BASE}/auth/password-reset/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({})))?.message || "Failed to request reset link";
    throw new Error(msg);
  }
  return res.json();
}

// --- Main page ---
export default function ProfilePage() {
  const { user, token, setUser } = useAuth(); // assume token is available
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState("");

  const role = user?.role || "user";
  const meta = ROLE_META[role] || {
    label: role || "User",
    level: "User",
    description: "Standard access in the system.",
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [resetSending, setResetSending] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  // derived
  const brandName = useMemo(
    () => user?.brand_name || user?.brand?.name || user?.brandName || null,
    [user]
  );
  const outletList = useMemo(
    () => user?.outlets || user?.outletAssignments || user?.outlet_list || [],
    [user]
  );
  const scopesList = useMemo(
    () => user?.scopes || [],
    [user]
  );

  // Load initial profile from context + optionally refresh from API
  useEffect(() => {
    if (!user) return;

    setForm({
      full_name: user.full_name || user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setAvatarPreview(user.avatar_url || null);
  }, [user]);

  useEffect(() => {
    if (!token) return;
    // optional: refresh profile from server on mount
    (async () => {
      try {
        setInitialLoading(true);
        const data = await apiGetProfile(token);
        setUser(data.user || data); // depending on response shape
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [token, setUser]);

  function onChangeField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setProfileSaved(false);
    setError("");
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    // You can also upload the file here with FormData to /profile/avatar
  }

  async function handleSaveProfile(e) {
    e?.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);
    setError("");

    try {
      const payload = {
        full_name: form.full_name,
        phone: form.phone,
        // email usually immutable, but if you want to allow:
        email: form.email,
        avatar_url: avatarPreview, // or omit if you handle upload separately
      };

      const updated = await apiUpdateProfile(token, payload);

      setUser((prev) => ({
        ...(prev || {}),
        ...updated.user, // depending on backend response
      }));

      setProfileSaved(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleRequestPasswordReset() {
    setResetSending(true);
    setResetSent(false);
    setResetError("");

    try {
      await apiRequestPasswordReset(form.email);
      setResetSent(true);
    } catch (err) {
      console.error(err);
      setResetError(err.message || "Failed to send reset email");
    } finally {
      setResetSending(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <UserIcon size={20} />
            My Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal information, role access and account security.
          </p>
        </div>
        {initialLoading && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Loader2 size={14} className="animate-spin" />
            Refreshing profile…
          </span>
        )}
      </div>

      {/* Profile + Role */}
      <CardSection titleIcon={UserIcon} title="Profile" description="">
        {/* Top: Avatar + basic role */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="text-slate-400" size={24} />
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 rounded-full bg-slate-900 text-white p-1.5 cursor-pointer shadow-md">
                <Upload size={12} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {form.full_name || "Your Name"}
              </p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Shield size={12} className="text-slate-400" />
                {meta.label} • {meta.level}
              </p>
            </div>
          </div>
        </div>

        {/* Role description */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
              Role Description
            </p>
            <p className="text-xs text-slate-700">{meta.description}</p>
          </div>
          <div className="rounded-lg border text-xs p-3 flex flex-col gap-1 bg-white">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Current Role
            </p>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${meta.badgeClass}`}
            >
              <Shield size={11} />
              {meta.label}
            </span>
          </div>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Full Name"
              icon={UserIcon}
              value={form.full_name}
              onChange={(e) => onChangeField("full_name", e.target.value)}
              placeholder="Your full name"
              required
            />
            <TextField
              label="Phone"
              icon={Phone}
              type="tel"
              value={form.phone}
              onChange={(e) => onChangeField("phone", e.target.value)}
              placeholder="Phone number"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Email"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={(e) => onChangeField("email", e.target.value)}
              placeholder="Email address"
              required
            />
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Role
              </label>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-100 bg-slate-50 text-xs text-slate-600">
                <Shield size={14} className="text-slate-400" />
                <span>{meta.label}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <div className="text-xs text-slate-500">
              {error && (
                <span className="inline-flex items-center gap-1 text-red-600">
                  <AlertCircle size={12} />
                  {error}
                </span>
              )}
              {profileSaved && !error && (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={12} />
                  Changes saved successfully.
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {savingProfile ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </CardSection>

      {/* Role & Access */}
      <CardSection titleIcon={KeyRound} title="Role & Access">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card configs and loop */}
          {[
            {
              key: "brand",
              title: "Brand",
              render: () =>
                role === "super_admin" ? (
                  <p className="text-slate-700 flex items-center gap-1">
                    <Building2 size={13} className="text-slate-400" />
                    Access to all brands
                  </p>
                ) : brandName ? (
                  <p className="text-slate-700 flex items-center gap-1">
                    <Building2 size={13} className="text-slate-400" />
                    {brandName}
                  </p>
                ) : (
                  <p className="text-slate-500 italic">No brand linked.</p>
                ),
            },
            {
              key: "outlets",
              title: "Outlets",
              render: () =>
                role === "super_admin" ? (
                  <p className="text-slate-700 flex items-center gap-1">
                    <Store size={13} className="text-slate-400" />
                    Access to all outlets
                  </p>
                ) : outletList && outletList.length ? (
                  <div className="space-y-1">
                    {outletList.slice(0, 3).map((o, idx) => (
                      <p
                        key={o.id || o.code || idx}
                        className="text-slate-700 flex items-center gap-1"
                      >
                        <Store size={13} className="text-slate-400" />
                        {o.name || o.outlet_name || `Outlet ${idx + 1}`}
                      </p>
                    ))}
                    {outletList.length > 3 && (
                      <p className="text-[11px] text-slate-500">
                        +{outletList.length - 3} more outlet(s)
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No outlets linked.</p>
                ),
            },
            {
              key: "permissions",
              title: "Permissions",
              render: () =>
                scopesList && scopesList.length ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scopesList.slice(0, 6).map((s) => (
                      <span
                        key={s.key || s}
                        className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] text-slate-700"
                      >
                        {s.label || s.key || String(s)}
                      </span>
                    ))}
                    {scopesList.length > 6 && (
                      <span className="text-[11px] text-slate-500 mt-1">
                        +{scopesList.length - 6} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">
                    No specific permissions listed.
                  </p>
                ),
            },
          ].map((card) => (
            <div
              key={card.key}
              className="rounded-lg border border-slate-100 bg-slate-50 p-3 flex flex-col gap-1"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                {card.title}
              </p>
              {card.render()}
            </div>
          ))}
        </div>
      </CardSection>

      {/* Security / Password reset */}
      <CardSection
        titleIcon={Lock}
        title="Security"
        description="Send a reset link to your email to change your password securely."
      >
        <div className="space-y-3 mt-1 text-xs">
          <p className="text-slate-600">
            When you click{" "}
            <span className="font-semibold">“Send reset link”</span>, we’ll
            email a secure link to <span className="font-mono">{form.email}</span>.  
            You can set a new password from that page.
          </p>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="text-xs text-slate-500 space-y-1">
              {resetError && (
                <span className="inline-flex items-center gap-1 text-red-600">
                  <AlertCircle size={12} />
                  {resetError}
                </span>
              )}
              {resetSent && !resetError && (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={12} />
                  Reset link sent to your email.
                </span>
              )}
            </div>
            <button
              type="button"
              disabled={resetSending || !form.email}
              onClick={handleRequestPasswordReset}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {resetSending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  Send reset link
                </>
              )}
            </button>
          </div>
        </div>
      </CardSection>
    </div>
  );
}
