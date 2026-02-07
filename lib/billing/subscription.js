// Subscription management helpers for frontend → backend initiation only.
// Never call Dodo APIs directly from the client.

"use client";

function getApiBase() {
  return (
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  );
}

export async function cancelSubscription({
  subscription_id,
  deforge_id,
  immediate = false,
  cancel_at_period_end = true,
}) {
  const apiBase = getApiBase();
  if (!apiBase) {
    throw new Error("Billing is not configured (NEXT_PUBLIC_API_BASE missing). Please try again later.");
  }

  // Must provide at least one identifier
  if (!subscription_id && !deforge_id) {
    const e = new Error("Missing required information");
    e.status = 400;
    throw e;
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const payload = {
    ...(subscription_id ? { subscription_id } : {}),
    ...(deforge_id ? { deforge_id } : {}),
    immediate: !!immediate,
    cancel_at_period_end: !!cancel_at_period_end,
  };

  const res = await fetch(`${apiBase}/billing/subscription/cancel`, {
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
    // keep raw
  }

  if (!res.ok) {
    const err = new Error(
      data?.message ||
        (res.status === 404
          ? "No active subscription found"
          : res.status === 400
          ? "Missing required information"
          : "Couldn't cancel subscription. Please try again.")
    );
    err.status = res.status;
    err.detail = data || text || null;
    throw err;
  }

  return data;
}