import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * useQueryModalParam("branch")
 * URL patterns:
 * - ?branch=new  => create modal
 * - ?branch=123  => edit modal
 * - (no param)   => closed
 */
export default function useQueryModalParam(paramName) {
  const location = useLocation();
  const navigate = useNavigate();

  const sp = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const raw = sp.get(paramName); // "new" | "123" | null
  const isOpen = Boolean(raw);
  const isNew = raw === "new";
  const editingId = !isNew && raw ? Number(raw) : null;

  const setParam = useCallback(
    (value, { replace = false } = {}) => {
      const next = new URLSearchParams(location.search);
      if (value === null || value === undefined || value === "") next.delete(paramName);
      else next.set(paramName, String(value));
      navigate(`${location.pathname}?${next.toString()}`, { replace });
    },
    [location.search, location.pathname, navigate, paramName]
  );

  const openNew = useCallback(() => setParam("new"), [setParam]);
  const openEdit = useCallback((id) => (id ? setParam(String(id)) : null), [setParam]);
  const close = useCallback(() => setParam(null), [setParam]);

  return { isOpen, isNew, editingId, openNew, openEdit, close };
}
