import { Suspense } from "react";

import Logo from "@/components/ui/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import FeedbackDialog from "../dashboard/navbar/FeedbackDialog";
import SettingsMenu from "../dashboard/navbar/SettingsMenu";
import TemplateTeamMenu from "./TemplateTeamMenu";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-foreground/5 flex items-center justify-between px-2 h-12">
      <div className="flex items-center gap-4 h-full w-full">
        <Logo
          size={16}
          padding="p-1.5"
          shadow="shadow-md"
          rounded="rounded-sm"
        />

        <Separator orientation="vertical" className="bg-foreground/10 h-5" />

        <div className="flex items-center gap-1 w-full">
          <Suspense fallback={<Skeleton className="w-32 h-7" />}>
            <TemplateTeamMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
