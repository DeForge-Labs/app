import Sidebar from "@/components/layout/dashboard/Sidebar";
import Navbar from "@/components/layout/dashboard/Navbar";

export default function DashboardLayout({ children, params }) {
  return (
    <div className="flex flex-col w-screen max-h-screen h-screen overflow-hidden dark:bg-dark">
      <Navbar params={params} />
      <div className="flex-1 flex">
        <Sidebar params={params} />
        <div className="flex-1 flex bg-foreground/5 pb-2 pr-2">
          <div className="flex-1 relative flex flex-col bg-background rounded-lg border border-foreground/15">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
