import { Users, LayoutGrid, Globe, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SearchDialog from "./sidebar/SearchDialog";
import RecentApps from "./sidebar/RecentApps";
import FavoriteApps from "./sidebar/FavoriteApps";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default async function Sidebar({ params }) {
  return (
    <div className="w-[240px] bg-foreground/5 relative overflow-y-auto hide-scroll p-2 px-0 flex flex-col">
      <div className="flex flex-col justify-between p-2 py-0 h-full">
        <div className="flex flex-col gap-[2px] relative flex-1">
          <Link href={`/dashboard`} className="w-full">
            <Button
              className="flex gap-2 font-normal text-xs border border-foreground/20 rounded-sm w-full"
              variant="outline"
            >
              <Plus />
              New App
            </Button>
          </Link>

          <SearchDialog />

          <Link href={`/apps`} className="w-full">
            <Button
              className="flex gap-2 bg-transparent font-normal w-full !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
              variant="outline"
            >
              <LayoutGrid />
              Apps
            </Button>
          </Link>

          <Link href={`/templates`} className="w-full">
            <Button
              className="flex gap-2 bg-transparent font-normal w-full !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
              variant="outline"
            >
              <Globe />
              Templates
            </Button>
          </Link>

          <Link href={`/team`} className="w-full">
            <Button
              className="flex gap-2 bg-transparent font-normal w-full !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
              variant="outline"
            >
              <Users />
              Team
            </Button>
          </Link>

          <div className="px-2 my-2">
            <Separator
              className="bg-foreground/10 w-[80%]"
              orientation="horizontal"
            />
          </div>

          <div className="relative flex-1">
            <div className="px-2 absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll flex flex-col gap-2">
              <Accordion className="w-full">
                <AccordionItem>
                  <AccordionTrigger
                    className="font-normal text-foreground/60 text-xs py-0"
                    size="xs"
                  >
                    Favourites
                  </AccordionTrigger>
                  <AccordionPanel className="mt-2">
                    <Suspense
                      fallback={
                        <div className="flex flex-col gap-2">
                          <Skeleton className="w-full h-9" />
                          <Skeleton className="w-full h-9" />
                          <Skeleton className="w-full h-9" />
                        </div>
                      }
                    >
                      <FavoriteApps params={params} />
                    </Suspense>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Accordion>
                <AccordionItem>
                  <AccordionTrigger
                    className="font-normal text-foreground/60 text-xs py-0"
                    size="xs"
                  >
                    Recent Apps
                  </AccordionTrigger>
                  <AccordionPanel className="mt-2">
                    <Suspense
                      fallback={
                        <div className="flex flex-col gap-2">
                          <Skeleton className="w-full h-9" />
                          <Skeleton className="w-full h-9" />
                          <Skeleton className="w-full h-9" />
                        </div>
                      }
                    >
                      <RecentApps params={params} />
                    </Suspense>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-2">
        <div className="p-2 bg-foreground/5 rounded-sm border border-foreground/20 space-y-1">
          <div className="font-semibold text-foreground/50 text-[10px]">
            New Update
          </div>
          <div className="text-xs text-foreground/70">
            Full UI Overhaul and Chat to Create AI Agents
          </div>
        </div>
      </div>
    </div>
  );
}
