import { LoginCard } from "@/components/LoginCard";
import { Button } from "@/components/ReusableComponents";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const { user, logout, loadingAuth } = useAuth();

  if (loadingAuth) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {!loggedIn && <div className="w-full max-w-4xl"><LoginCard onLoginSuccess={() => setLoggedIn(true)} /></div>}

      {loggedIn && (
        <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome{user ? `, ${user.name}` : ''}</h2>
              <p className="text-sm text-gray-500">Role: {user?.role || '—'}</p>
            </div>
            <div>
              <Button onClick={() => { logout(); setLoggedIn(false); }} className="bg-gray-100 text-gray-800">Logout</Button>
            </div>
          </div>
          <div className="mt-6 text-gray-600">You are now signed in. Build your HRM dashboard here.</div>
        </div>
      )}
    </div>
  );
}