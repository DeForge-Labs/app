import BillingView from "@/components/layout/dashboard/billing/BillingView";

export default async function BillingPage({ params }) {
  const { id } = await params;
  return <BillingView teamId={id} />;
}
