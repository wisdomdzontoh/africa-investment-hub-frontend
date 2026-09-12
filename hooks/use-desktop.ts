import * as React from "react"

const DESKTOP_BREAKPOINT = 1024
const QUERY = `(min-width: ${DESKTOP_BREAKPOINT}px)`

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

/** Mirrors useIsMobile — SSR/initial-hydration snapshot is false, so
 *  desktop-only content (e.g. the hero node graph) never renders on the
 *  server or on first paint below the breakpoint, and mounts only once
 *  matchMedia confirms a wide viewport. */
export function useIsDesktop() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
