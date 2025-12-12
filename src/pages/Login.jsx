import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/AuthComponents/LoginForm";
import { AuthShell } from "@/components/AuthComponents/AuthShell";
import { useAuth } from "@/context/AuthContext";

import { useCompanies } from "@/context/CompaniesContext";
import { LeftInfoPanel } from "@/components/AuthComponents/LeftInfoPannel";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login, accessToken } = useAuth();
  const { setSelectedCompany } = useCompanies()

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
        remember: form.remember,
        device_info: navigator.userAgent,
      };

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
      left={<LeftInfoPanel />}
      right={
        <>

          <LoginForm
            form={form}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            rememberMeChanged={rememberMeChanged}
            onSubmit={handleSubmit}
            loading={loading}
            errorMsg={errorMsg}
          />
        </>
      }
    />
  );
}
