// src/components/RequirePermission.jsx
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Navigate } from 'react-router-dom';

export default function RequirePermission({ perm, children }) {
  const { has } = usePermissions();
  if (!has(perm)) return <Navigate to="/unauthorized" replace />;
  return children;
}
