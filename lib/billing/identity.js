// Client-side helpers to resolve the backend user identifier (deforge_id)
// Note: We only decode the JWT locally to read non-sensitive claims.
// If deforge_id cannot be derived reliably, callers must stop checkout and prompt the user.

"use client";

function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    // base64url -> base64, with padding
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    const payload = JSON.parse(atob(padded));
    return payload || null;
  } catch {
    return null;
  }
}

function getCookieValue(name) {
  if (typeof document === "undefined") return null;

  // Only works for non-HttpOnly cookies.
  const cookie = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));

  if (!cookie) return null;
  const raw = cookie.substring(name.length + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function getClientToken() {
  if (typeof window === "undefined") return null;

  // Prefer explicit storage if present
  const stored = localStorage.getItem("token");
  if (stored && typeof stored === "string" && stored.trim()) return stored.trim();

  // Fallback to cookie token (only if not HttpOnly)
  const cookieToken = getCookieValue("token");
  if (cookieToken && typeof cookieToken === "string" && cookieToken.trim()) {
    return cookieToken.trim();
  }

  return null;
}

function extractDeforgeIdFromPayload(payload) {
  if (!payload || typeof payload !== "object") return null;

  // Priority order: deforge_id > user_id > userId > id > sub (last resort)
  const candidates = [
    payload.deforge_id,
    payload.deforgeId,
    payload.user_id,
    payload.userId,
    payload.id,
    payload.sub,
  ].filter(Boolean);

  const direct = candidates.find((v) => typeof v === "string" && v.trim().length > 0);
  if (direct) return direct.trim();

  // Namespaced/custom claims (Auth0 often uses URL-like keys)
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value !== "string") continue;
    if (!value.trim()) continue;
    if (/deforge[_-]?id/i.test(key)) return value.trim();
  }

  return null;
}

// Attempt to find deforge_id from multiple sources/claims
export function resolveDeforgeId() {
  try {
    // 1) Explicit storage if your app already placed it there
    const stored = typeof window !== "undefined" ? localStorage.getItem("deforge_id") : null;
    if (stored && typeof stored === "string" && stored.trim().length > 0) return stored.trim();

    // 1b) Session cache (avoid persistent storage if you prefer)
    const sessionStored =
      typeof window !== "undefined" ? sessionStorage.getItem("deforge_id") : null;
    if (sessionStored && typeof sessionStored === "string" && sessionStored.trim().length > 0) {
      return sessionStored.trim();
    }

    // 2) Decode access token payload (no secrets are used)
    const token = getClientToken();
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    return extractDeforgeIdFromPayload(payload);
  } catch {
    return null;
  }
}

// Reliable resolver for HttpOnly-cookie auth: asks Next.js (server) to read + verify the token.
export async function resolveDeforgeIdAsync({ forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const sync = resolveDeforgeId();
    if (sync) return sync;
  }

  try {
    const res = await fetch("/api/deforge-id", {
      method: "GET",
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const id = data?.deforge_id;
    if (typeof id !== "string" || !id.trim()) return null;

    // Cache in sessionStorage (non-persistent); callers may still choose to store elsewhere.
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("deforge_id", id.trim());
      } catch {
        // ignore storage failures
      }
    }

    return id.trim();
  } catch {
    return null;
  }
}