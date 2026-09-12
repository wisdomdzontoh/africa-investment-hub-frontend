"use client";

import { useEffect } from "react";

/**
 * Clerk's `appearance` prop can restyle every social button as a group
 * (`socialButtonsBlockButton`) but has no per-provider selector, so it can't
 * hide "just Microsoft" on its own — see the delivery note for why this isn't
 * a Clerk Elements rewrite instead. This is a belt-and-suspenders client-side
 * guard: it hides any rendered social button whose visible text isn't Google,
 * matched on text rather than a class/attribute name because Clerk doesn't
 * document a stable per-provider selector for the prebuilt components. The
 * real fix is still disabling every non-Google connection in the Clerk
 * dashboard; this only guards against one slipping through in the UI.
 */
export function HideExcludedProviders() {
  useEffect(() => {
    const sweep = () => {
      document.querySelectorAll<HTMLElement>(".cl-socialButtonsBlockButton").forEach((el) => {
        el.style.display = el.textContent?.includes("Google") ? "" : "none";
      });
    };
    sweep();
    const observer = new MutationObserver(sweep);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
