// Purchase history helpers for frontend → backend.
// Fetches paginated payment records from /billing/purchases.

"use client";

function getApiBase() {
  return (
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  );
}

/**
 * Fetch a page of purchase history.
 *
 * @param {object} opts
 * @param {number} [opts.page=1]
 * @param {number} [opts.limit=20]
 * @param {string} [opts.deforge_id]   Optional — omit when route is behind auth.
 * @returns {Promise<{
 *   success: boolean,
 *   page: number,
 *   limit: number,
 *   total: number,
 *   items: Array<{
 *     id: string,
 *     type: string,
 *     amount: number,
 *     currency: string,
 *     status: string,
 *     created_at: string | null,
 *     description?: string | null,
 *     product_id?: string | null,
 *     subscription_id?: string | null,
 *     invoice_id: null,
 *     invoice_number: null,
 *     invoice_url: string,
 *   }>
 * }>}
 */
export async function fetchPurchases({ page = 1, limit = 20, deforge_id } = {}) {
  const apiBase = getApiBase();
  if (!apiBase) {
    throw new Error(
      "Billing is not configured (NEXT_PUBLIC_API_BASE missing). Please try again later."
    );
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (deforge_id) params.set("deforge_id", deforge_id);

  const res = await fetch(
    `${apiBase}/billing/purchases?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    }
  );

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // keep raw
  }

  if (!res.ok) {
    const err = new Error(
      data?.message || "Couldn't load purchase history. Please try again."
    );
    err.status = res.status;
    err.detail = data || text || null;
    throw err;
  }

  return data;
}

/**
 * Convert a smallest-unit amount to a human-readable string.
 * Most currencies use 2 decimal places (cents); zero-decimal currencies use none.
 *
 * @param {number} amount   Smallest currency unit (e.g. 2999 for $29.99)
 * @param {string} currency ISO 4217 currency code (e.g. "USD")
 * @returns {string}        Formatted string (e.g. "$29.99")
 */
const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF", "CLP", "DJF", "GNF", "ISK", "JPY", "KMF", "KRW",
  "MGA", "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
]);

export function formatAmount(amount, currency) {
  const code = (currency || "USD").toUpperCase();
  const isZeroDec = ZERO_DECIMAL_CURRENCIES.has(code);
  const value = isZeroDec ? amount : amount / 100;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: isZeroDec ? 0 : 2,
      maximumFractionDigits: isZeroDec ? 0 : 2,
    }).format(value);
  } catch {
    // Fallback for unknown currency codes
    return `${(isZeroDec ? amount : amount / 100).toFixed(isZeroDec ? 0 : 2)} ${code}`;
  }
}
