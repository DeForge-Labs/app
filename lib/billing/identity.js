// Client-side helpers to resolve the backend user identifier (deforge_id)
// Note: We only decode the JWT locally to read non-sensitive claims.
// If deforge_id cannot be derived reliably, callers must stop checkout and prompt the user.

"use client";

function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload || null;
  } catch {
    return null;
  }
}

// Attempt to find deforge_id from multiple sources/claims
export function resolveDeforgeId() {
  try {
    // 1) Explicit storage if your app already placed it there
    const stored = typeof window !== "undefined" ? localStorage.getItem("deforge_id") : null;
    if (stored && typeof stored === "string" && stored.trim().length > 0) return stored.trim();

    // 2) Decode access token payload (no secrets are used)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    // Common claim fallbacks (adjust if your backend sets a specific claim)
    // Priority order: deforge_id > user_id > userId > id > sub (last resort)
    const candidates = [
      payload.deforge_id,
      payload.user_id,
      payload.userId,
      payload.id,
      payload.sub, // may be auth provider id; only use if your backend accepts it
    ].filter(Boolean);

    const id = candidates.find((v) => typeof v === "string" && v.trim().length > 0);
    return id || null;
  } catch {
    return null;
  }
}