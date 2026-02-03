import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Checkout Success",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-xl font-medium">Thanks! You're all set.</h1>
        <p className="text-sm text-foreground/60 mt-2">
          Your payment or subscription activation will reflect shortly after we process
          the webhook from our payments provider. This page does not grant access.
        </p>
        <p className="text-xs text-foreground/50 mt-3">
          If you don't see updates after 1-2 minutes, try refreshing your dashboard.
        </p>

        <div className="flex items-center justify-center gap-2 mt-5">
          <Link href="/dashboard">
            <Button className="text-xs">Go to Dashboard</Button>
          </Link>
          <Link href="/billing">
            <Button variant="outline" className="text-xs">View Billing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}