"use client";

import {
  Activity,
  Grid2X2,
  Headset,
  Layers,
  LayoutTemplate,
  StickyNote,
  Users,
  Zap,
  Bug,
  FileCode2,
  Search,
  LayoutGrid,
  Globe,
  Plus,
} from "lucide-react";
import Image from "next/image";
import LogoutButton from "./LogoutButton";
import { setTab } from "@/redux/slice/TeamSlice";
import { cn } from "@/lib/utils";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SearchDialog from "./sidebar/SearchDialog";

export default function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  return (
    <div className="w-[240px] bg-foreground/5 relative overflow-y-auto hide-scroll p-2 px-0 flex flex-col">
      <div className="flex flex-col flex-1 justify-between p-2 py-0">
        <div className="flex flex-col gap-[2px]">
          <Button
            className="flex gap-2 font-normal text-xs border border-foreground/20 rounded-sm"
            variant="outline"
          >
            <Plus />
            New App
          </Button>

          <SearchDialog />

          <Button
            className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
            variant="outline"
          >
            <LayoutGrid />
            Apps
          </Button>

          <Button
            className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
            variant="outline"
          >
            <Globe />
            Templates
          </Button>

          <Button
            className="flex gap-2 bg-transparent font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
            variant="outline"
          >
            <Users />
            Team
          </Button>

          <div className="px-2 my-2">
            <Separator
              className="bg-foreground/10 w-[80%]"
              orientation="horizontal"
            />
          </div>

          <div className="px-2 flex flex-col gap-2">
            <Accordion className="w-full">
              <AccordionItem>
                <AccordionTrigger
                  className="font-normal text-foreground/60 text-xs py-0"
                  size="xs"
                >
                  Favourites
                </AccordionTrigger>
                <AccordionPanel className="mt-2">
                  <div className="bg-foreground/5 p-2 border border-foreground/20 rounded-sm text-xs border-dashed text-center">
                    Your Favourite apps that you have saved
                  </div>
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
                  <Button
                    className="flex gap-2 bg-transparent w-full font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
                    variant="outline"
                  >
                    Workflow 1
                  </Button>
                  <Button
                    className="flex gap-2 bg-transparent w-full font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
                    variant="outline"
                  >
                    Workflow 2
                  </Button>
                  <Button
                    className="flex gap-2 bg-transparent w-full font-normal !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60"
                    variant="outline"
                  >
                    Workflow 3
                  </Button>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
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
