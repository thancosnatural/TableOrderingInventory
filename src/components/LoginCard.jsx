import { useAuth } from "@/context/AuthProvider";
import { Button, Input, RoleSelector } from "./ReusableComponents";
import { useState } from "react";

export function LoginCard({ onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [availableRoles, setAvailableRoles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res?.chooseRole) {
      setAvailableRoles(res.availableRoles || []);
      return;
    }
    if (res.success) {
      onLoginSuccess && onLoginSuccess();
      return;
    }
    setError(res.message || 'Login failed');
  }

  async function handleRoleSelect(roleObj) {
    setAvailableRoles(null);
    setLoading(true);
    // pass normalized role string (server expects role string)
    const roleToSend = roleObj.role || roleObj;
    const res = await login({ email, password, selectedRole: roleToSend });
    setLoading(false);
    if (res.success) onLoginSuccess && onLoginSuccess();
    else setError(res.message || 'Role selection failed');
  }

  return (
    <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-red-600 to-yellow-400 p-8">
          <div className="text-center px-4">
            <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
            <p className="mt-2 text-white/90">Sign in to manage HR workflows</p>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Sign in</h3>
          <div className="space-y-4">
            <Input label="Email" value={email} onChange={setEmail} placeholder="you@company.com" />
            <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="Your password" />

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex items-center justify-between gap-4">
              <Button onClick={handleLogin} className="bg-red-600 text-white hover:opacity-95 flex-1"
                disabled={loading || !email || !password}>
                {loading ? 'Please wait...' : 'Sign In'}
              </Button>
            </div>

            <div className="pt-3 text-sm text-gray-500">Don't have an account? <a className="text-red-600 font-semibold">Contact HR</a></div>
          </div>
        </div>
      </div>

      {availableRoles && availableRoles.length > 0 && (
        <RoleSelector roles={availableRoles} onChoose={handleRoleSelect} onCancel={() => setAvailableRoles(null)} />
      )}
    </div>
  );
}