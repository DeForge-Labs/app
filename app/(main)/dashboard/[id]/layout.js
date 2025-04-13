import TeamProvider from "@/providers/TeamProvider";

export default function DashboardLayout({ children, params }) {
  return <TeamProvider params={params}>{children}</TeamProvider>;
}
