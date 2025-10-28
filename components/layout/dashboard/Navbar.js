import { CircleDot } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import TeamMenu from "./navbar/TeamMenu";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CreditMenu from "./navbar/CreditMenu";
import SettingsMenu from "./navbar/SettingsMenu";

export default function Navbar({ params }) {
  return (
    <header className="sticky top-0 z-50 bg-foreground/5">
      <div className="flex items-center justify-between px-2 h-[50px]">
        <div className="flex items-center gap-4 h-full">
          <Link
            href="/"
            className="flex items-center ml-1 justify-center space-x-2"
          >
            <div className="p-1.5 bg-black/80 w-fit rounded-sm shadow-md shadow-[#8754ff]">
              <Image
                src="/logo/logo-white.svg"
                alt="Deforge"
                width={16}
                height={16}
              />
            </div>
          </Link>

          <Separator
            orientation="vertical"
            className={"bg-foreground/10 h-[20px]"}
          />

          <span className="flex items-center gap-1 dark:text-background">
            <Suspense fallback={<Skeleton className="w-[100px] h-[30px]" />}>
              <TeamMenu params={params} />
            </Suspense>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-xs bg-background font-normal border border-foreground/20 rounded-sm"
          >
            Feedback
          </Button>

          <Suspense
            fallback={
              <Button
                variant="outline"
                className="text-xs bg-background border gap-1.5 border-foreground/20 rounded-sm [&_svg:not([class*='size-'])]:size-3"
              >
                <CircleDot />
                <Skeleton className="w-[30px] h-[20px]" />
              </Button>
            }
          >
            <CreditMenu params={params} />
          </Suspense>

          <SettingsMenu params={params} />
        </div>
      </div>
    </header>
  );
}
