// src/config/navMap.js
import { Home, Users, Calendar, Briefcase, FileText, Clipboard, Settings, Globe } from 'lucide-react';

export const SCOPES = {
  PLATFORM: 'platform_admin',
  COMPANY: 'company_admin',
  HR: 'hr',
  EMPLOYEE: 'employee'
};

// generic items reusable
const DASH = { key: 'dashboard', label: 'Dashboard', to: '/', icon: Home };

// const MENU_MAP = useMemo(
//     () => ({
//       PLATFORM_ADMIN: [
//         { key: "dashboard", label: "Dashboard", to: "/dashboard", icon: Home },
//         { key: "companies", label: "Companies", to: "/companies", icon: Home },
//         { key: "platform-users", label: "Platform Users", to: "/platform-users", icon: Home },
//         { key: "rbac", label: "RBAC", to: "/rbac", icon: Home },
//         { key: "reports", label: "Reports", to: "/reports", icon: Home },
//         { key: "settings", label: "Settings", to: "/settings", icon: Settings },
//       ],
//       HR_ADMIN: [
//         { key: "dashboard", label: "Dashboard", to: "/dashboard", icon: Home },
//         { key: "employees", label: "Employees", to: "/employees", icon: Home },
//         { key: "attendance", label: "Attendance", to: "/attendance", icon: Home },
//         { key: "leave", label: "Leave", to: "/leave", icon: Home },
//         { key: "payroll", label: "Payroll", to: "/payroll", icon: Home },
//         { key: "helpdesk", label: "Helpdesk", to: "/helpdesk", icon: Home },
//         { key: "reports", label: "Reports", to: "/reports", icon: Home },
//         { key: "settings", label: "Settings", to: "/settings", icon: Settings },
//       ],
//     }),
//     []
//   );

const NAV = {
  [SCOPES.PLATFORM]: [
    DASH,
    { key: 'tenants', label: 'Companies', to: '/companies', icon: Globe },
    { key: 'users', label: 'Users', to: '/platform/users', icon: Users },
    { key: 'roles', label: 'Roles', to: '/platform/roles', icon: Settings },
    { key: 'reports', label: 'Reports', to: '/platform/reports', icon: Clipboard }
  ],
  [SCOPES.COMPANY]: [
    DASH,
    { key: 'employees', label: 'Employees', to: '/employees', icon: Users },
    { key: 'attendance', label: 'Attendance', to: '/attendance', icon: Calendar },
    { key: 'payroll', label: 'Payroll', to: '/payroll', icon: Briefcase, children: [
      { key: 'payroll-list', label: 'Payroll List', to: '/payroll/list' },
      { key: 'payrun', label: 'Run Payroll', to: '/payroll/run' },
    ]},
    { key: 'policies', label: 'Policies', to: '/policies', icon: FileText },
    { key: 'reports', label: 'Reports', to: '/reports', icon: Clipboard },
  ],
  [SCOPES.HR]: [
    DASH,
    { key: 'employees', label: 'Employees', to: '/employees', icon: Users },
    { key: 'recruitment', label: 'Recruitment', to: '/recruitment', icon: Users },
    { key: 'attendance', label: 'Attendance', to: '/attendance', icon: Calendar },
    { key: 'payroll', label: 'Payroll', to: '/payroll', icon: Briefcase },
    { key: 'reports', label: 'Reports', to: '/reports', icon: Clipboard },
  ],
  [SCOPES.EMPLOYEE]: [
    DASH,
    { key: 'my-profile', label: 'My Profile', to: '/profile', icon: Users },
    { key: 'my-attendance', label: 'My Attendance', to: '/my-attendance', icon: Calendar },
    { key: 'pay-stub', label: 'Pay Stub', to: '/paystub', icon: FileText },
  ]
};

export function getNavItemsForScope(scope, user = {}) {
  // optional: filter items by user permissions here
  const items = NAV[scope] || NAV[SCOPES.EMPLOYEE];

  // Example: if user lacks permission to view reports, filter them out
  if (user?.permissions && Array.isArray(user.permissions)) {
    return items.filter(item => {
      if (item.key === 'reports' && !user.permissions.includes('reports.read')) return false;
      // add other rules as needed
      return true;
    });
  }
  return items;
}
