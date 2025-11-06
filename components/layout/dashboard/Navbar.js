import { Suspense } from "react";
import { CircleDot } from "lucide-react";

import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import TeamMenu from "./navbar/TeamMenu";
import CreditMenu from "./navbar/CreditMenu";
import SettingsMenu from "./navbar/SettingsMenu";
import FeedbackDialog from "./navbar/FeedbackDialog";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-foreground/5 flex items-center justify-between px-2 h-12">
      <div className="flex items-center gap-4 h-full">
        <Logo
          size={16}
          padding="p-1.5"
          shadow="shadow-md"
          rounded="rounded-sm"
        />

        <Separator orientation="vertical" className="bg-foreground/10 h-5" />

        <span className="flex items-center gap-1 dark:text-background">
          <Suspense fallback={<Skeleton className="w- h-7" />}>
            <TeamMenu />
          </Suspense>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <FeedbackDialog />

        <Suspense
          fallback={
            <Button
              disabled
              variant="outline"
              className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm [&_svg:not([class*='size-'])]:size-3"
            >
              <CircleDot />
              <Skeleton className="w-8 h-5" />
            </Button>
          }
        >
          <CreditMenu />
        </Suspense>

        <SettingsMenu />
      </div>
    </header>
  );
};

export default Navbar;
