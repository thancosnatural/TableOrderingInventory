import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Generic list state synced with URL (q, page, perPage, filters...)
 *
 * useUrlListState(
 *   { q:"", state:"All", page:1, perPage:12, company_id:"" },
 *   { keepParams: ["branch"] } // keep modal param untouched
 * )
 */
export default function useUrlListState(defaults, options = {}) {
  const { keepParams = [] } = options;

  const location = useLocation();
  const navigate = useNavigate();

  const sp = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // init state from URL once
  const initial = useMemo(() => {
    const obj = { ...defaults };

    Object.keys(defaults).forEach((key) => {
      const v = sp.get(key);
      if (v == null) return;

      // keep types: numbers for page/perPage, else string
      if (typeof defaults[key] === "number") obj[key] = Number(v) || defaults[key];
      else obj[key] = v;
    });

    return obj;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [state, setState] = useState(initial);

  const syncToUrl = useCallback(
    (nextState) => {
      const next = new URLSearchParams(location.search);

      // apply nextState keys to URL
      Object.entries(nextState).forEach(([key, value]) => {
        const def = defaults[key];

        const isDefault =
          value === def ||
          value === "" ||
          value == null ||
          (key === "page" && Number(value) === 1) ||
          (key === "perPage" && Number(value) === defaults.perPage);

        if (isDefault) next.delete(key);
        else next.set(key, String(value));
      });

      // ensure keepParams remain exactly as-is (do nothing here; they’re already in `next`)
      keepParams.forEach(() => {});

      navigate(`${location.pathname}?${next.toString()}`, { replace: true });
    },
    [defaults, keepParams, location.pathname, location.search, navigate]
  );

  const setAndSync = useCallback(
    (patch) => {
      setState((prev) => {
        const next = { ...prev, ...patch };
        syncToUrl(next);
        return next;
      });
    },
    [syncToUrl]
  );

  const resetPageAndSync = useCallback(
    (patch) => setAndSync({ ...patch, page: 1 }),
    [setAndSync]
  );

  return { listState: state, setAndSync, resetPageAndSync };
}
