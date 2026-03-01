// Central configuration for Dodo Payments checkout wiring.
// Update these IDs without touching logic code.

export const DODO_CREDIT_PACKS = [
  // One-time credit packs
  // Map your product_id from Dodo and the total_credits granted by the pack
  { key: "500", product_id: "pdt_0NZWyOI9QwHZAlYQIPBBD", total_credits: 500, quantity: 1 },
  { key: "1000", product_id: "pdt_0NZWyNo4AhZ3WvjKhPjd9", total_credits: 1000, quantity: 1 },
  { key: "2000", product_id: "pdt_0NZWyNEh38zuQ0KkDOGE5", total_credits: 2000, quantity: 1 }
];

export const DODO_SUBSCRIPTION_PLANS = [
  // Subscription plans
  // Map your plan_id from Dodo
  { key: "pro", plan_id: "pdt_0NZWyOf5xY6J2V5TzFwkP" }
];

// Derived config helpers
export function getPackByKey(key) {
  return DODO_CREDIT_PACKS.find((p) => p.key === key) || null;
}
export function getPlanByKey(key) {
  return DODO_SUBSCRIPTION_PLANS.find((p) => p.key === key) || null;
}