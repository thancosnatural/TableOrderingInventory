// utils/scroll.ts (or .js)
export function scrollToBottom(ref, behavior = "smooth") {
  const el = ref?.current;
  if (!el) return;
  el.scrollTo({ top: el.scrollHeight, behavior });
}
