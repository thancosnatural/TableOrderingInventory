import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Building2, Store, Users } from "lucide-react";

import { LoginForm } from "@/components/AuthComponents/LoginForm";
import { ActiveRoleBadge, RoleSelector } from "@/components/AuthComponents/RoleSelector";
import { LeftInfoPanel } from "@/components/AuthComponents/LeftInfoPannel";
import { AuthShell } from "@/components/AuthComponents/AuthShell";
import { useAuth } from "@/context/AuthContext";

const ROLES = [
  { key: "super_admin", label: "Super Admin", description: "Full access.", icon: ShieldCheck, accent: "from-sky-500 to-blue-600" },
  { key: "brand_admin", label: "Brand Admin", description: "Manage a brand.", icon: Building2, accent: "from-green-400 to-emerald-500" },
  { key: "outlet_admin", label: "Outlet Admin", description: "Outlet operations.", icon: Store, accent: "from-amber-400 to-orange-500" },
  { key: "staff", label: "Staff", description: "Limited access.", icon: Users, accent: "from-purple-400 to-violet-500" }
];

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(ROLES[0].key);
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login, accessToken } = useAuth();

  const activeRole = ROLES.find(r => r.key === selectedRole);

  // console.log("Access Token in Login Page:", accessToken);
  // useEffect(() => {
  //   document.title = "Login - Thancos Table Ordering Admin";
  //   if(accessToken) {
  //     navigate("/");
  //   }else{
  //     navigate("/login");
  //   }
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const payload = {
        email: form.email,
        password: form.password,
        selectedRole, // consistent naming for your login() function
        device_info: navigator.userAgent,
      };

      // 🔥 Use AuthContext login() — not direct API call
      const result = await login(payload);

      if (!result.success) {
        setErrorMsg(result.message || "Login failed");
        setLoading(false);
        return;
      }

      // 🚀 On success: go to dashboard/home
      navigate("/");
    } catch (err) {
      setErrorMsg("Unexpected error. Try again.");
    }

    setLoading(false);
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
            form={form}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
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
