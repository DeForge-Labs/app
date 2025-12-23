import { Suspense } from "react";

export default function ConnectionLayout({ children }) {
  return <Suspense>{children}</Suspense>;
}
