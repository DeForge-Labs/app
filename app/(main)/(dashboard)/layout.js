import TeamProvider from "@/providers/TeamProvider";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import Navbar from "@/components/layout/dashboard/Navbar";

export default function DashboardLayout({ children, params }) {
  return (
    <TeamProvider params={params}>
      <div className="flex flex-col w-screen max-h-screen h-screen overflow-hidden dark:bg-dark">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 relative flex flex-col">{children}</div>
        </div>
      </div>
    </TeamProvider>
  );
}
