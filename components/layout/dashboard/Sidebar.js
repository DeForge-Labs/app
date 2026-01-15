import Link from "next/link";
import { Suspense } from "react";
import { Plus, Users, Globe, File, LayoutGrid } from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import RecentApps from "./sidebar/RecentApps";
import SearchButton from "./sidebar/SeachButton";
import FavoriteApps from "./sidebar/FavoriteApps";

const NAV_ITEMS = [
  { href: "/apps", icon: LayoutGrid, label: "Apps" },
  { href: "/templates", icon: Globe, label: "Templates" },
  { href: "/team", icon: Users, label: "Team" },
  { href: "/files", icon: File, label: "Files" },
];

const SIDEBAR_BUTTON_CLASSES =
  "flex gap-2 bg-transparent font-normal w-full shadow-none [:hover,[data-pressed]]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-sm justify-start text-foreground/60";

function NavLink({ href, icon: Icon, label }) {
  return (
    <Link href={href} className="w-full">
      <Button variant="outline" className={SIDEBAR_BUTTON_CLASSES}>
        <Icon />
        {label}
      </Button>
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="w-full h-9" />
      ))}
    </div>
  );
}

function AccordionSection({ title, children }) {
  return (
    <Accordion className="w-full">
      <AccordionItem>
        <AccordionTrigger
          className="font-normal text-foreground/60 text-xs py-0"
          size="xs"
        >
          {title}
        </AccordionTrigger>

        <AccordionPanel className="mt-2">
          <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

const Sidebar = ({ params }) => {
  return (
    <div className="w-60 bg-foreground/5 relative overflow-y-auto hide-scroll p-2 px-0 flex flex-col">
      <div className="flex flex-col justify-between p-2 py-0 h-full flex-1 gap-0.5 relative">
        <Link href="/dashboard" className="w-full">
          <Button
            variant="outline"
            className="flex gap-2 font-normal text-xs border border-foreground/20 rounded-sm w-full"
          >
            <Plus />
            New App
          </Button>
        </Link>

        <SearchButton />

        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        <div className="px-2 my-2">
          <Separator
            orientation="horizontal"
            className="bg-foreground/10 w-[80%]"
          />
        </div>

        <div className="relative flex-1">
          <div className="px-2 absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll flex flex-col gap-2">
            <AccordionSection title="Favourites">
              <FavoriteApps params={params} />
            </AccordionSection>

            <AccordionSection title="Recent Apps">
              <RecentApps params={params} />
            </AccordionSection>
          </div>
        </div>
      </div>

      <div className="flex flex-col mx-2 px-2 p-2 bg-foreground/5 rounded-sm border border-foreground/20 space-y-1">
        <div className="font-semibold text-foreground/50 text-[10px]">
          New Update
        </div>

        <div className="text-xs text-foreground/70">
          Full UI Overhaul and Chat to Create AI Agents
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
