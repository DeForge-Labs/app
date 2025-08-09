"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
  vault: true,
  components: "buttons,hosted-fields"
};

export default function PayPalProvider({ children }) {
  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
