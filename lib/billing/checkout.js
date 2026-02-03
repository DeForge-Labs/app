// Frontend-only helpers to request a hosted Dodo checkout session from our backend.
// No Dodo secrets or direct Dodo API calls are made here.

"use client";

function getApiBase() {
  // Contract primary var; fallback to existing project var if needed.
  return (
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  );
}

function getFrontendBase() {
  if (process.env.NEXT_PUBLIC_FRONTEND_BASE) return process.env.NEXT_PUBLIC_FRONTEND_BASE;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

function buildReturnUrl() {
  return `${getFrontendBase()}/checkout/success`;
}

async function postCheckoutSession(payload) {
  const apiBase = getApiBase();
  if (!apiBase) {
    throw new Error("Billing is not configured (NEXT_PUBLIC_API_BASE missing). Please try again later.");
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${apiBase}/billing/checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // keep raw text for logging
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Checkout session failed (${res.status})`;
    const detail = data || text || null;
    const error = new Error(message);
    error.detail = detail;
    throw error;
  }

  const url = data && data.checkout_url;
  if (!url || typeof url !== "string") {
    const error = new Error("Invalid response from checkout-session (missing checkout_url).");
    error.detail = data;
    throw error;
  }

  return { checkout_url: url };
}

export async function createOneTimeCheckout({ product_id, total_credits, quantity = 1, deforge_id }) {
  if (!deforge_id) throw new Error("Missing deforge_id");
  if (!product_id) throw new Error("Missing product_id");
  if (!total_credits || typeof total_credits !== "number") throw new Error("Missing or invalid total_credits");

  const payload = {
    mode: "one_time",
    product_id,
    quantity,
    return_url: buildReturnUrl(),
    metadata: {
      deforge_id,
      total_credits,
      quantity,
    },
  };

  return await postCheckoutSession(payload);
}

export async function createSubscriptionCheckout({ plan_id, deforge_id }) {
  if (!deforge_id) throw new Error("Missing deforge_id");
  if (!plan_id) throw new Error("Missing plan_id");

  const payload = {
    mode: "subscription",
    plan_id,
    return_url: buildReturnUrl(),
    metadata: {
      deforge_id,
    },
  };

  return await postCheckoutSession(payload);
}

export function redirectToCheckout(url) {
  if (!url) throw new Error("Missing checkout_url");
  window.location.assign(url);
}

export { getApiBase, getFrontendBase, buildReturnUrl };