"use client";

import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

export default function SwitchTemplateType() {
  const pathName = usePathname();
  const router = useRouter();

  const isYourTemplates = pathName.startsWith(`/templates/published`);

  return (
    <Tabs value={isYourTemplates ? "tab-2" : "tab-1"}>
      <TabsList className="bg-background [&>span]:bg-foreground/5 [&>span]:rounded-md">
        <TabsTab
          value="tab-1"
          onClick={() => {
            router.push(`/templates`);
          }}
          className="text-xs"
        >
          From the Community
        </TabsTab>
        <TabsTab
          value="tab-2"
          onClick={() => {
            router.push(`/templates/published`);
          }}
          className="text-xs"
        >
          Your Templates
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}
