import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/AuthComponents/LoginForm";
import { ActiveRoleBadge, RoleSelector } from "@/components/AuthComponents/RoleSelector";
import { AuthShell } from "@/components/AuthComponents/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { LeftInfoPanel } from "@/components/AuthComponents/LeftInfoPannel";

import { ShieldCheck, Store, Building2, Users } from "lucide-react";
import { useCompanies } from "@/context/CompaniesContext";

const ROLES = [
  {
    key: "super_admin",
    label: "Super Admin",
    description: "Platform owner. Controls entire SaaS system, billing, and global configurations.",
    icon: ShieldCheck,
    accent: "from-indigo-500 to-blue-600"
  },
  {
    key: "company_admin",
    label: "Company Admin",
    description: "Main vendor/company owner. Manages all branches, products, orders, and staff.",
    icon: Store,
    accent: "from-green-500 to-emerald-600"
  },
  {
    key: "branch_admin",
    label: "Branch Admin",
    description: "Manages one branch/store. Handles orders, stock updates, and local staff.",
    icon: Building2,
    accent: "from-purple-400 to-violet-600"
  },
  {
    key: "staff",
    label: "Staff",
    description: "Works under branch admin. Limited to daily operations like POS & order fulfillment.",
    icon: Users,
    accent: "from-slate-400 to-slate-600"
  }
];


export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(ROLES[0].key);
  const [form, setForm] = useState({
    email: "",
    password: "",
    company_code: "",   // ✅ string, not null
    remember: true,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login, accessToken } = useAuth();
  const { setSelectedCompany } = useCompanies()
  const activeRole = ROLES.find((r) => r.key === selectedRole);

  useEffect(() => {
    if (accessToken) navigate("/");
  }, [accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const payload = {
        email: form.email?.trim(),
        password: form.password,
        role: selectedRole,
        remember: form.remember,
        device_info: navigator.userAgent,
        company_code: form.company_code
      };

      // Only send company_code for non-super-admin
      if (selectedRole !== "super_admin") {
        payload.company_code = form.company_code?.trim();
      }

      const result = await login(payload);

      setSelectedCompany(result?.user?.company)

      if (!result?.success) {
        setErrorMsg(result?.message || "Login failed");
        setLoading(false);
        return;
      }

      navigate("/");
    } catch (err) {
      setErrorMsg(err?.message || "Unexpected error. Try again.");
    }

    setLoading(false);
  };

  const rememberMeChanged = (e) => {
    setForm({ ...form, remember: e.target.checked });
  };

  return (
    <AuthShell
      left={<LeftInfoPanel accent={activeRole.accent} />}
      right={
        <>
          <RoleSelector
            roles={ROLES}
            selectedRole={selectedRole}
            onSelect={setSelectedRole}
          />

          <ActiveRoleBadge role={activeRole} />

          <LoginForm
            selectedRole={selectedRole}
            form={form}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            rememberMeChanged={rememberMeChanged}
            onSubmit={handleSubmit}
            loading={loading}
            errorMsg={errorMsg}
            roleLabel={activeRole.label}
          />
        </>
      }
    />
  );
}
