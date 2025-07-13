import Navbar from "@/components/layout/dashboard/Navbar";
import Workflows from "@/components/layout/dashboard/Workflows";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-dark">
      <Navbar />
      <Workflows />
    </div>
  );
}
