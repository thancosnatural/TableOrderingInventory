// src/rbac/permissionModel.js

export const PERMISSIONS = [
  {
    key: "manage_auth",
    label: "Auth Settings",
    desc: "Global authentication and security configuration.",
    actions: [
      { key: "view", label: "View" },
      { key: "update", label: "Update Settings" },
    ],
  },
  {
    key: "manage_rbac",
    label: "RBAC & Permissions",
    desc: "Control which role can access which modules and actions.",
    actions: [
      { key: "view", label: "View Matrix" },
      { key: "edit", label: "Edit Permissions" },
    ],
  },
  {
    key: "manage_brands",
    label: "Brands",
    desc: "Create and configure brands in the platform.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "deactivate", label: "Activate/Deactivate" },
    ],
  },
  {
    key: "manage_outlets",
    label: "Outlets",
    desc: "Per-brand outlet creation and configuration.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "deactivate", label: "Activate/Deactivate" },
    ],
  },
  {
    key: "manage_tables",
    label: "Tables",
    desc: "Handle dine-in table configuration and QR codes.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "manage_categories",
    label: "Categories",
    desc: "Organise the menu into logical sections.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "manage_products",
    label: "Products",
    desc: "Core menu item management.",
    actions: [
      { key: "view", label: "View/List" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "manage_product_options",
    label: "Product Options",
    desc: "Variant and option group configuration.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "manage_addons",
    label: "Add-ons",
    desc: "Toppings, extras, sauces and sides.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ],
  },
  {
    key: "manage_qr_menu",
    label: "QR Menu",
    desc: "Customer-facing QR ordering configuration.",
    actions: [
      { key: "view", label: "View" },
      { key: "configure", label: "Configure" },
    ],
  },
  {
    key: "manage_orders",
    label: "Orders",
    desc: "Operational access to outlet orders.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create (POS/manual)" },
      { key: "update_status", label: "Update Status" },
      { key: "cancel", label: "Cancel" },
    ],
  },
  {
    key: "manage_kot",
    label: "Kitchen (KOT)",
    desc: "Kitchen display and preparation flow.",
    actions: [
      { key: "view", label: "View KOT" },
      { key: "update_status", label: "Update Status" },
    ],
  },
  {
    key: "manage_billing",
    label: "Billing",
    desc: "Table billing, discounts and settlement.",
    actions: [
      { key: "view", label: "View Bills" },
      { key: "create", label: "Generate Bill" },
      { key: "apply_discount", label: "Apply Discount" },
      { key: "close", label: "Close / Capture Payment" },
    ],
  },
  {
    key: "manage_customers",
    label: "Customers",
    desc: "Customer directory and basic CRM.",
    actions: [
      { key: "view", label: "View" },
      { key: "edit_notes", label: "Edit Notes" },
      { key: "export", label: "Export (if enabled)" },
    ],
  },
  {
    key: "manage_users",
    label: "Users & Roles",
    desc: "Onboard and control system users.",
    actions: [
      { key: "view", label: "View" },
      { key: "create", label: "Create" },
      { key: "edit", label: "Edit" },
      { key: "deactivate", label: "Activate/Deactivate" },
    ],
  },
  {
    key: "view_reports",
    label: "Reports & Analytics",
    desc: "Read-only insights and performance dashboards.",
    actions: [
      { key: "view_sales", label: "View Sales" },
      { key: "view_products", label: "Product Performance" },
      { key: "view_outlets", label: "Outlet Performance" },
      { key: "export", label: "Export Reports" },
    ],
  },
  {
    key: "manage_integrations",
    label: "Integrations",
    desc: "Third-party connections (POS, aggregators, etc.).",
    actions: [
      { key: "view", label: "View" },
      { key: "configure", label: "Configure" },
      { key: "toggle", label: "Enable/Disable" },
    ],
  },
  {
    key: "manage_platform_settings",
    label: "Platform Settings",
    desc: "System-wide technical and business configuration.",
    actions: [
      { key: "view", label: "View" },
      { key: "edit", label: "Edit Settings" },
    ],
  },
];
