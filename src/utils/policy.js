// src/rbac/policy.js
const ROLE_ORDER = {
  super_admin: 100,
  company_admin: 80,
  branch_admin: 60,
  staff: 40,
};

function roleRank(roleCode) {
  return ROLE_ORDER[String(roleCode || "").toLowerCase()] ?? 0;
}

function canAssignRole(creatorRoleCode, targetRoleCode) {
  // creator must be strictly higher rank than target
  return roleRank(creatorRoleCode) > roleRank(targetRoleCode);
}

// scope constraints (what creator can set)
function scopeConstraintForCreator(creatorRoleCode) {
  const r = String(creatorRoleCode || "").toLowerCase();
  if (r === "super_admin") return { companyRequired: false, branchRequired: false };
  if (r === "company_admin") return { companyRequired: true, branchRequired: false };
  if (r === "branch_admin") return { companyRequired: true, branchRequired: true };
  if (r === "staff") return { companyRequired: true, branchRequired: true }; // usually staff can't create users, but if you allow, keep strict
  return { companyRequired: true, branchRequired: true };
}

module.exports = { roleRank, canAssignRole, scopeConstraintForCreator };
