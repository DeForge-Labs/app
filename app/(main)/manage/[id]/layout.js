import ManageProvider from "@/providers/ManageProvider";

export default function ManageLayout({ children, params }) {
  return <ManageProvider params={params}>{children}</ManageProvider>;
}
