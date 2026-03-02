// Central configuration for Dodo Payments checkout wiring.
// Update these IDs without touching logic code.

export const DODO_CREDIT_PACKS_PROD = [
  // One-time credit packs
  // Map your product_id from Dodo and the total_credits granted by the pack
  { key: "500", product_id: "pdt_0NZWyOI9QwHZAlYQIPBBD", total_credits: 500, quantity: 1 },
  { key: "1000", product_id: "pdt_0NZWyNo4AhZ3WvjKhPjd9", total_credits: 1000, quantity: 1 },
  { key: "2000", product_id: "pdt_0NZWyNEh38zuQ0KkDOGE5", total_credits: 2000, quantity: 1 }
];

export const DODO_CREDIT_PACKS_DEV = [
  { key: "500", product_id: "pdt_0NXgzlysmVGVC2Pln2ynb", total_credits: 500, quantity: 1 },
  { key: "1000", product_id: "pdt_0NXh00FTfWLM0zoFVqQ9Q", total_credits: 1000, quantity: 1 },
  { key: "2000", product_id: "pdt_0NXh0FbizzqNbVj90piiU", total_credits: 2000, quantity: 1 }
];

export const DODO_SUBSCRIPTION_PLANS_PROD = [
  // Subscription plans
  // Map your plan_id from Dodo
  { key: "pro", plan_id: "pdt_0NZWyOf5xY6J2V5TzFwkP" }
];

export const DODO_SUBSCRIPTION_PLANS_DEV = [
  { key: "pro", plan_id: "pdt_0NXgzAEtfP1elEO8cXEI4" }
];

// Derived config helpers
export function getPackByKey(key, env = "production") {
  const packs = env === "development" ? DODO_CREDIT_PACKS_DEV : DODO_CREDIT_PACKS_PROD;
  return packs.find((p) => p.key === key) || null;
}
export function getPlanByKey(key, env = "production") {
  const plans = env === "development" ? DODO_SUBSCRIPTION_PLANS_DEV : DODO_SUBSCRIPTION_PLANS_PROD;
  return plans.find((p) => p.key === key) || null;
}