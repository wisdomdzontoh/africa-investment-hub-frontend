// Lightweight localStorage draft persistence for the onboarding wizards, so a
// refresh or accidental navigation does not lose in-progress answers. Keyed by
// role + a caller-supplied user id. File uploads (File objects) are never
// persisted — they cannot be serialized — so document steps re-stage on reload.

const PREFIX = "aih:onboarding-draft";

function key(role: string, userId: string | null | undefined): string {
  return `${PREFIX}:${role}:${userId ?? "anon"}`;
}

export function loadDraft<T>(role: string, userId: string | null | undefined): Partial<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(role, userId));
    return raw ? (JSON.parse(raw) as Partial<T>) : null;
  } catch {
    return null;
  }
}

export function saveDraft<T>(role: string, userId: string | null | undefined, values: T): void {
  if (typeof window === "undefined") return;
  try {
    // Drop non-serializable values (File objects from document steps).
    const json = JSON.stringify(values, (_k, v) =>
      typeof File !== "undefined" && v instanceof File ? undefined : v,
    );
    window.localStorage.setItem(key(role, userId), json);
  } catch {
    /* quota or serialization failure — non-fatal, drafts are best-effort */
  }
}

export function clearDraft(role: string, userId: string | null | undefined): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key(role, userId));
  } catch {
    /* ignore */
  }
}

const RESUMABLE_ROLES = ["investor", "project_owner"] as const;
export type ResumableRole = (typeof RESUMABLE_ROLES)[number];

/** Returns the role with a saved in-progress draft, so the role picker can
 *  offer "continue where you left off". Returns null if there is none. */
export function findDraftRole(userId: string | null | undefined): ResumableRole | null {
  if (typeof window === "undefined") return null;
  for (const role of RESUMABLE_ROLES) {
    try {
      if (window.localStorage.getItem(key(role, userId))) return role;
    } catch {
      return null;
    }
  }
  return null;
}
