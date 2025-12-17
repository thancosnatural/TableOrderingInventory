// src/components/Sidebar.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BadgeDollarSign,
  Building2,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileBarChart,
  Home,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Store,
  Table,
  Tag,
  User,
  UserCircle,
  Users,
  UtensilsCrossed,
  Receipt,
} from "lucide-react";
import PropTypes from "prop-types";
import { LOGOS } from "@/constants/branding";
import { useAuth } from "@/context/AuthContext";

/* small icon wrapper so icons look consistent */
function IconWrap({ Icon }) {
  if (!Icon) return null;
  return <Icon size={16} className="text-slate-600" />;
}
IconWrap.propTypes = { Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]) };

export default function Sidebar({
  items = null,
  collapsedLocalKey = "tableordering.sidebar.collapsed",
  mobileOpen = false,
  setMobileOpen = () => { },
}) {
  const loc = useLocation();
  const { user, role, menuMap } = useAuth(); // role & menuMap come from dynamic provider

  // Default to 'staff' for table ordering if nothing is set
  const effectiveRole = role || user?.role || "staff";

  // persisted collapsed state
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(collapsedLocalKey) === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(collapsedLocalKey, collapsed ? "true" : "false");
    } catch (e) {
      // ignore
    }
  }, [collapsed, collapsedLocalKey]);

  // isActive helper
  function isActive(to) {
    if (!to) return false;
    return loc.pathname === to || loc.pathname.startsWith(to + "/");
  }

  // Static fallback menus if menuMap not available (safe defaults)
  const FALLBACK_MENU = useMemo(
    () => ({
      super_admin: [
        { key: "dashboard", label: "Dashboard", to: "/", icon: LayoutDashboard },
        { key: "companies", label: "Companies", to: "/companies", icon: Building2 },
        { key: "outlets", label: "Outlets", to: "/branches", icon: Store },
        { key: "users", label: "Users", to: "/users", icon: Users },
        { key: "roles", label: "Roles", to: "/roles", icon: Users },
        { key: "rbac", label: "RBAC", to: "/rbac", icon: ShieldCheck },
        { key: "billing", label: "Billing & Subscription", to: "/billing", icon: BadgeDollarSign },
        { key: "reports", label: "Reports", to: "/reports", icon: FileBarChart },
        { key: "settings", label: "Settings", to: "/settings", icon: Settings },
      ],

      company_admin: [
        { key: "dashboard", label: "Dashboard", to: "/", icon: LayoutDashboard },
        { key: "outlets", label: "Outlets", to: "/branches", icon: Store },
        { key: "users", label: "Users", to: "/users", icon: Users },
        {
          key: "menu",
          label: "Menu",
          icon: UtensilsCrossed,
          children: [
            { key: "products", label: "Products", to: "/menu/products" },
            { key: "add-product", label: "Add Product", to: "/menu/products/new" },
            { key: "categories", label: "Categories", to: "/menu/categories" },
            { key: "addons", label: "Add-ons", to: "/menu/addons" },
          ],
        },
        { key: "orders", label: "Orders", to: "/orders", icon: ClipboardList },
        { key: "customers", label: "Customers", to: "/customers", icon: UserCircle },
        { key: "offers", label: "Offers & Promotions", to: "/offers", icon: Tag },
        { key: "reports", label: "Reports", to: "/reports", icon: FileBarChart },
        { key: "settings", label: "Settings", to: "/settings", icon: Settings },
      ],

      branch_admin: [
        { key: "dashboard", label: "Dashboard", to: "/", icon: LayoutDashboard },
        { key: "tables", label: "Tables", to: "/tables", icon: Table },
        { key: "users", label: "Users", to: "/users", icon: Users },
        { key: "orders", label: "Orders", to: "/orders", icon: ClipboardList },
        { key: "kot", label: "KOT", to: "/kot", icon: ChefHat },
        { key: "billing", label: "Billing", to: "/billing", icon: Receipt },
        { key: "customers", label: "Customers", to: "/customers", icon: UserCircle },
        { key: "reports", label: "Reports", to: "/reports", icon: FileBarChart },
        { key: "staff", label: "Staff", to: "/staff", icon: Users },
        { key: "settings", label: "Settings", to: "/settings", icon: Settings },
      ],

      staff: [
        { key: "dashboard", label: "Dashboard", to: "/", icon: LayoutDashboard },
        { key: "orders", label: "Orders", to: "/orders", icon: ClipboardList },
        { key: "kot", label: "Kitchen Orders", to: "/kot", icon: ChefHat },
        { key: "tables", label: "Tables", to: "/tables", icon: Table },
        { key: "billing", label: "Billing", to: "/billing", icon: Receipt },
        { key: "profile", label: "My Profile", to: "/profile", icon: User },
      ],
    }),
    []
  );


  // Decide which menu items to render:
  // Priority: items prop (override) -> menuMap[effectiveRole] (dynamic) -> FALLBACK_MENU[effectiveRole] -> minimal fallback
  const menuItems = useMemo(() => {
    if (items && items.length) return items;
    if (menuMap && effectiveRole && Array.isArray(menuMap[effectiveRole]) && menuMap[effectiveRole].length) {
      // menuMap items may not include icon components; we accept item.icon as either component or null
      return menuMap[effectiveRole];
    }
    if (FALLBACK_MENU[effectiveRole]) return FALLBACK_MENU[effectiveRole];
    // last resort – table-ordering friendly minimal
    return [
      { key: "dashboard", label: "Dashboard", to: "/", icon: Home },
      { key: "orders", label: "Orders", to: "/orders", icon: ClipboardList },
    ];
  }, [items, menuMap, effectiveRole, FALLBACK_MENU]);

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 z-20 bg-white border-r transition-all ${collapsed ? "w-20" : "w-64"
          }`}
      >
        <div className="flex items-center justify-between px-3 py-3 border-b">
          <div className="flex items-center gap-3">
            {!collapsed && (
              <Link to="/" className="flex items-center gap-3">
                <div className="w-16">
                  <img
                    src={LOGOS.Mark_Care_Logo}
                    alt="App Logo"
                    className="w-16 h-auto rounded-md object-cover"
                  />
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-slate-900">{user?.company?.name ? user?.company?.name : "Table Ordering"}</div>
                </div>
              </Link>
            )}
            {collapsed && (
              <Link to="/" className="flex items-center justify-center w-full">
                <img
                  src={LOGOS.Mark_Care_Logo}
                  alt="App Logo"
                  className="w-8 h-auto rounded-md object-cover"
                />
              </Link>
            )}
          </div>

          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((s) => !s)}
            className="p-1 rounded hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {menuItems.map((it) => (
            <div key={it.key} className="mb-1">
              {!it.children ? (
                <Link
                  to={it.to}
                  className={`group flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-50 transition-colors ${isActive(it.to) ? "bg-indigo-50 text-indigo-600" : "text-slate-700"
                    }`}
                >
                  <div className="flex-shrink-0">
                    {it.icon ? <IconWrap Icon={it.icon} /> : <Home size={16} />}
                  </div>
                  {!collapsed && <div className="text-sm">{it.label}</div>}
                </Link>
              ) : (
                <div>
                  <div
                    className={`flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 ${collapsed ? "justify-center" : ""
                      }`}
                  >
                    <div>{it.icon ? <IconWrap Icon={it.icon} /> : <Home size={16} />}</div>
                    {!collapsed && <div className="text-sm font-medium">{it.label}</div>}
                  </div>
                  {!collapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {it.children.map((c) => (
                        <Link
                          key={c.key}
                          to={c.to}
                          className={`block px-3 py-1 rounded-md text-sm hover:bg-gray-50 ${isActive(c.to) ? "bg-indigo-50 text-indigo-600" : "text-slate-600"
                            }`}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="px-3 py-3 border-t">
          {!collapsed ? (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>v1.0.0</div>
              <Link to="/settings" className="px-2 py-1 rounded hover:bg-gray-100 text-sm">
                Settings
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Link to="/settings" className="p-2 rounded hover:bg-gray-100">
                <Settings size={16} />
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile slide-over */}
      <div className={`md:hidden ${mobileOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`fixed inset-0 z-30 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"
            }`}
          aria-hidden
        >
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={() => setMobileOpen(false)}
          />
        </div>

        <div
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="font-semibold">Menu</div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Close menu"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <div className="p-3">
            {menuItems.map((it) => (
              <div key={it.key} className="mb-2">
                {!it.children ? (
                  <Link
                    to={it.to}
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center gap-3"
                  >
                    {it.icon ? <IconWrap Icon={it.icon} /> : <Home size={16} />}
                    <span>{it.label}</span>
                  </Link>
                ) : (
                  <div>
                    <div className="px-3 py-2 text-slate-700 font-medium">{it.label}</div>
                    {it.children.map((c) => (
                      <Link
                        key={c.key}
                        to={c.to}
                        onClick={() => setMobileOpen(false)}
                        className="block px-6 py-1 rounded-md hover:bg-gray-50 text-slate-600"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

Sidebar.propTypes = {
  items: PropTypes.array,
  collapsedLocalKey: PropTypes.string,
  mobileOpen: PropTypes.bool,
  setMobileOpen: PropTypes.func,
};
