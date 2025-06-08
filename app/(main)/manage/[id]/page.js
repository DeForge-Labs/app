import Members from "@/components/layout/manage/Members";
import Navbar from "@/components/layout/manage/Navbar";

export default function Manage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Members />
    </div>
  );
}
