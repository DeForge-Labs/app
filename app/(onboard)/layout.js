import { Suspense } from "react";

export default function OnboardLayout({ children }) {
  return <Suspense>{children}</Suspense>;
}
