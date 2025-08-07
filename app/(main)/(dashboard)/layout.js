import TeamProvider from "@/providers/TeamProvider";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import Navbar from "@/components/layout/dashboard/Navbar";
import TabViewer from "@/components/layout/dashboard/TabViewer";

export default function DashboardLayout({ children, params }) {
  return (
    <TeamProvider params={params}>
      <div className="flex w-screen max-h-screen h-screen overflow-hidden dark:bg-dark">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 relative flex flex-col">{children}</div>
        </div>
      </div>
    </TeamProvider>
  );
}
