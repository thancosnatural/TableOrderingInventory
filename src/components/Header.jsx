// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  Bell,
  Search as SearchIcon,
  Grid,
  Settings as SettingsIcon,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Data-driven Header: shows label for the current role (super_admin, brand_admin, outlet_admin, staff)
 */

export default function Header({ setMobileOpen = () => { console.log("OPEN"); } }) {
  const { user, scopes, setUser } = useAuth();

  const navigate = useNavigate();

  const initials =
    user?.initials ||
    (user?.full_name ? user.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("") : "U");
  const name = user?.full_name || "User";

  // find label for current role from scopes list
  const roleLabel =
    (scopes || []).find((s) => s.key === user?.role)?.label || (user?.role || "User");

  // search state
  const [search, setSearch] = useState("");
  function submitSearch(e) {
    e?.preventDefault();
    if (!search?.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
  }

  // notifications mock (later: hook to new orders / KOT alerts)
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // dropdowns
  const [showNotif, setShowNotif] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const notifRef = useRef(null),
    quickRef = useRef(null),
    userRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (
        !notifRef.current?.contains(e.target) &&
        !quickRef.current?.contains(e.target) &&
        !userRef.current?.contains(e.target)
      ) {
        setShowNotif(false);
        setShowQuick(false);
        setShowUser(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setShowNotif(false);
        setShowQuick(false);
        setShowUser(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function logout() {
    // clear user & redirect - server logout recommended
    setUser(null);
    navigate("/login");
  }

  // Quick actions based on role (table-ordering context)
  const quickActions = (() => {
    switch (user?.role) {
      case "super_admin":
      case "brand_admin":
        return [
          { label: "New Order", to: "/orders/new" },
          { label: "Add Product", to: "/menu/products/new" },
        ];
      case "outlet_admin":
        return [
          { label: "New Order", to: "/orders/new" },
          { label: "Add Product", to: "/menu/products/new" },
          { label: "Add Table", to: "/tables/new" },
        ];
      case "staff":
      default:
        return [{ label: "New Order", to: "/orders/new" }];
    }
  })();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="text-lg font-semibold text-slate-900">
              Dashboard
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <form
              onSubmit={submitSearch}
              className="hidden sm:flex items-center gap-2"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders, tables, customers..."
                className="border rounded px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button
                type="submit"
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                aria-label="Search"
              >
                <SearchIcon size={18} />
              </button>
            </form>

            {/* Quick actions */}
            <div className="relative" ref={quickRef}>
              <button
                onClick={() => setShowQuick((s) => !s)}
                className="hidden sm:inline-flex p-2 rounded-md hover:bg-gray-100 text-gray-600"
              >
                <Grid size={18} />
              </button>
              {showQuick && (
                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2 text-sm">
                    {quickActions.map((qa) => (
                      <Link
                        key={qa.to}
                        to={qa.to}
                        onClick={() => setShowQuick(false)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 block"
                      >
                        {qa.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif((s) => !s)}
                className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotif && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="px-4 py-2 text-sm font-medium border-b">
                    Notifications
                  </div>
                  <div className="p-4 text-sm text-gray-500">
                    No notifications
                  </div>
                </div>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setShowUser((s) => !s)}
                className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100"
              >
                <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-medium">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-sm font-medium text-slate-900">
                    {name}
                  </span>
                  <span className="text-xs text-gray-500">{roleLabel}</span>
                </div>
              </button>

              {showUser && (
                <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowUser(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <UserIcon size={14} /> Profile
                    </Link>
                    <div className="border-t" />
                    <button
                      onClick={() => {
                        setShowUser(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings shortcut */}
            <button
              onClick={() => navigate("/settings")}
              className="hidden md:inline-flex p-2 rounded hover:bg-gray-100 text-gray-600"
              aria-label="Settings"
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  setMobileOpen: PropTypes.func,
};
