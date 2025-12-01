import React from "react";

const presets = {
  orders: {
    title: "No orders yet",
    subtitle: "When you get new orders, they’ll show up here.",
    emoji: "📦",
  },
  products: {
    title: "No products found",
    subtitle: "Try adjusting filters or add your first product.",
    emoji: "🧁",
  },
  categories: {
    title: "No categories",
    subtitle: "Create categories to organize your catalog.",
    emoji: "🗂️",
  },
  search: {
    title: "No results",
    subtitle: "We couldn’t find anything that matches your query.",
    emoji: "🔎",
  },
  generic: {
    title: "Nothing here… yet",
    subtitle: "There’s currently no data to show.",
    emoji: "📭",
  },
};

const cls = (...s) => s.filter(Boolean).join(" ");

export default function EmptyState({
  variant = "generic",
  title,
  subtitle,
  emoji,
  illustrationSrc,          // optional image instead of emoji
  onRefresh,                // optional callback for refresh
  busy = false,             // show small spinner overlay on buttons
  actionPrimary,            // { label, onClick, disabled }
  actionSecondary,          // { label, onClick, disabled }
  className = "",
  children,                 // any extra content (tips, links, etc.)
  size = "md",              // "sm" | "md" | "lg"
  "data-testid": testId,
}) {
  const preset = presets[variant] || presets.generic;

  const finalTitle = title ?? preset.title;
  const finalSubtitle = subtitle ?? preset.subtitle;
  const finalEmoji = emoji ?? preset.emoji;

  const sizeMap = {
    sm: { icon: "h-14 w-14", title: "text-base", sub: "text-xs", pad: "py-10" },
    md: { icon: "h-20 w-20", title: "text-lg",   sub: "text-sm", pad: "py-16" },
    lg: { icon: "h-24 w-24", title: "text-xl",   sub: "text-base", pad: "py-20" },
  };
  const s = sizeMap[size] || sizeMap.md;

  return (
    <div
      data-testid={testId}
      className={cls(
        "flex flex-col items-center justify-center text-center",
        "rounded border border-dashed border-gray-200 bg-white",
        s.pad,
        className
      )}
      aria-busy={!!busy}
    >
      {/* Icon / Illustration */}
      <div className="mb-3 opacity-80">
        {illustrationSrc ? (
          <img
            src={illustrationSrc}
            alt=""
            className={cls(s.icon, "mx-auto object-contain")}
            loading="lazy"
          />
        ) : (
          <div className={cls(s.icon, "flex items-center justify-center text-4xl select-none")}>
            <span role="img" aria-label="empty">{finalEmoji}</span>
          </div>
        )}
      </div>

      {/* Copy */}
      <h3 className={cls("font-semibold text-gray-800", s.title)}>{finalTitle}</h3>
      {finalSubtitle ? (
        <p className={cls("mt-1 text-gray-500", s.sub)}>{finalSubtitle}</p>
      ) : null}

      {/* Custom content */}
      {children ? <div className="mt-3 text-sm text-gray-600">{children}</div> : null}

      {/* Actions */}
      {(actionPrimary || actionSecondary || onRefresh) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {actionPrimary ? (
            <button
              type="button"
              className={cls(
                "px-4 py-2 rounded text-white bg-gray-900 hover:bg-black",
                "disabled:opacity-50 disabled:cursor-not-allowed relative"
              )}
              disabled={busy || actionPrimary.disabled}
              onClick={actionPrimary.onClick}
            >
              {busy ? <SpinnerInline /> : null}
              <span className={busy ? "opacity-0" : ""}>{actionPrimary.label}</span>
            </button>
          ) : null}

          {actionSecondary ? (
            <button
              type="button"
              className={cls(
                "px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={busy || actionSecondary.disabled}
              onClick={actionSecondary.onClick}
            >
              {actionSecondary.label}
            </button>
          ) : null}

          {onRefresh ? (
            <button
              type="button"
              className={cls(
                "px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50",
                "disabled:opacity-50 disabled:cursor-not-allowed relative"
              )}
              disabled={busy}
              onClick={onRefresh}
            >
              {busy ? <SpinnerInline /> : null}
              <span className={busy ? "opacity-0" : ""}>Refresh</span>
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SpinnerInline() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center"
    >
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
    </span>
  );
}
