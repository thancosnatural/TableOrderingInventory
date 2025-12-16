function MenuPortal({ anchorRect, open, children, menuWidth = 200, gap = 8 }) {
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

  if (!open || !anchorRect || !elRef.current) return null;

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const rect = anchorRect;

  let left = rect.right - menuWidth;
  let top = rect.bottom + gap;

  if (left < 8) left = 8;
  if (left + menuWidth + 8 > vw) left = Math.max(8, vw - menuWidth - 8);

  const estimatedMenuHeight = 220;
  if (top + estimatedMenuHeight + 8 > vh) {
    top = Math.max(8, rect.top - estimatedMenuHeight - gap);
  }

  const style = {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 9999,
    minWidth: `${menuWidth}px`,
  };

  return createPortal(
    <div style={style} onClick={(e) => e.stopPropagation()}>
      <div className="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        {children}
      </div>
    </div>,
    elRef.current
  );
}