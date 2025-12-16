import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

const DashboardLayout = async ({ children, params }) => {
  const headersList = await headers();
  const userStatus = headersList.get("x-user-status");

  const isLoggedIn = userStatus === "active";

  return (
    <div className="flex flex-col w-screen max-h-screen h-screen overflow-hidden dark:bg-dark">
      {isLoggedIn && <Navbar />}

      <div className="flex-1 flex">
        {isLoggedIn && <Sidebar params={params} />}

        <div
          className={cn(
            "flex-1 flex bg-foreground/5",
            isLoggedIn ? "pb-2 pr-2" : ""
          )}
        >
          <div
            className={cn(
              "flex-1 relative flex flex-col bg-background",
              isLoggedIn ? "rounded-lg border border-foreground/15" : ""
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
