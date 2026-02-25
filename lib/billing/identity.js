// Client-side helpers to resolve the backend user identifier (deforge_id).
// Auth is session-cookie based (BetterAuth). There is no client-readable JWT,
// so the ID must come from the server via /api/deforge-id which forwards the
// session cookie to the backend and returns the resolved ID.

"use client";

// Returns a cached deforge_id if one was stored during this page session.
// Will be null on first call — use resolveDeforgeIdAsync() for the authoritative value.
export function resolveDeforgeId() {
  if (typeof window === "undefined") return null;

  try {
    // Check localStorage first (populated by some login flows)
    const ls = localStorage.getItem("deforge_id");
    if (ls && ls.trim()) return ls.trim();

    // Session-scoped cache populated by resolveDeforgeIdAsync
    const ss = sessionStorage.getItem("deforge_id");
    if (ss && ss.trim()) return ss.trim();
  } catch {
    // storage not available (e.g. SSR guard missed, sandboxed iframe)
  }

  return null;
}

// Resolves the user's deforge_id by asking the Next.js server route to verify
// the session cookie and return the ID. Falls through to the cache first to
// avoid a round-trip on repeat calls within the same page session.
export async function resolveDeforgeIdAsync({ forceRefresh = false } = {}) {
  // Fast path: return cached value if not forcing a refresh
  if (!forceRefresh) {
    const cached = resolveDeforgeId();
    if (cached) return cached;
  }

  try {
    const res = await fetch("/api/deforge-id", {
      method: "GET",
      credentials: "include",
      headers: { "Cache-Control": "no-cache" },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const id = data?.deforge_id;
    if (typeof id !== "string" || !id.trim()) return null;

    // Cache in sessionStorage so subsequent sync calls can return it
    try {
      sessionStorage.setItem("deforge_id", id.trim());
    } catch {
      // ignore storage failures
    }

    return id.trim();
  } catch {
    return null;
  }
}