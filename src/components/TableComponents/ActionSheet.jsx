function ActionSheet({ open, title, subtitle, onClose, children }) {
  const elRef = useRef(null);
  if (!elRef.current && typeof document !== "undefined") {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;
    document.body.appendChild(node);
    return () => {
      if (document.body.contains(node)) document.body.removeChild(node);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open || !elRef.current) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-xl shadow-lg p-4 max-h-[60vh] overflow-auto">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-3" />

        {(title || subtitle) && (
          <div className="mb-3">
            {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
            {title && <div className="text-base font-semibold text-gray-900">{title}</div>}
          </div>
        )}

        <div>{children}</div>

        <div className="mt-3">
          <button onClick={onClose} className="w-full text-sm py-2 rounded-md border bg-white">
            Close
          </button>
        </div>
      </div>
    </div>,
    elRef.current
  );
}