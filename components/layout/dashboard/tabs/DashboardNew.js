import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, MessageCircle, StickyNote } from "lucide-react";
import Image from "next/image";
import DashboardTemplate from "./DashboardTemplate";
import Chatbox from "./Chatbox";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardNew({ params }) {
  return (
    <div className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-6">
      <div className="flex flex-col items-center justify-center gap-2 relative">
        <div className="z-10 flex flex-col gap-2 items-center pt-48 relative">
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full h-full flex items-center justify-center">
            <Image
              src="/logo/logo-outline.svg"
              alt="logo"
              width={400}
              height={400}
              className="opacity-5 dark:invert"
            />
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t  from-background via-background to-background/5"></div>

          <p className="text-3xl text-foreground/80 font-bold z-10">
            What do you want to Automate?
          </p>
          <p className="text-center max-w-lg text-sm text-foreground/60 z-10">
            Create your own AI Agent and automate anything with a simple prompt.
            No coding required.
          </p>

          <Chatbox />

          <div className="flex gap-2 items-center justify-center mt-2">
            <Button
              className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 [&_svg:not([class*='size-'])]:size-3 border border-foreground/20 !px-3 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start text-foreground/60"
              variant="outline"
            >
              <StickyNote />
              Blank workflow
            </Button>

            <Button
              className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 [&_svg:not([class*='size-'])]:size-3 border border-foreground/20 !px-3 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start text-foreground/60"
              variant="outline"
            >
              <MessageCircle />
              Customer Support
            </Button>

            <Button
              className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 [&_svg:not([class*='size-'])]:size-3 border border-foreground/20 !px-3 dark:bg-transparent rounded-sm not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start text-foreground/60"
              variant="outline"
            >
              <BriefcaseBusiness />
              Automated Job Finder
            </Button>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="w-[90%] lg:w-[80%] flex flex-col gap-4 z-20 mt-20">
              <div className="flex w-full justify-between lg:items-center flex-col gap-2 lg:flex-row">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Popular Templates</p>
                  <p className="text-xs text-foreground/60">
                    Explore what others are automating using Deforge
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <Skeleton className="w-full h-48" />
                <Skeleton className="w-full h-48" />
                <Skeleton className="w-full h-48" />
                <Skeleton className="w-full h-48" />
                <Skeleton className="w-full h-48" />
                <Skeleton className="w-full h-48" />
              </div>
            </div>
          }
        >
          <DashboardTemplate />
        </Suspense>
      </div>
    </div>
  );
}
