"use client";

import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function SwitchTemplateType() {
  const pathName = usePathname();
  const router = useRouter();
  const params = useParams();

  const isYourTemplates = pathName.startsWith(
    `/dashboard/${params.id}/templates/published`
  );

  return (
    <Tabs value={isYourTemplates ? "tab-2" : "tab-1"}>
      <TabsList
        className={"bg-background [&>span]:bg-foreground/5 [&>span]:rounded-sm"}
      >
        <TabsTab
          value="tab-1"
          onClick={() => {
            if (isYourTemplates) {
              router.push(`/dashboard/${params.id}/templates`);
            }
          }}
          className="text-xs"
        >
          From the Community
        </TabsTab>
        <TabsTab
          value="tab-2"
          onClick={() => {
            if (!isYourTemplates) {
              router.push(`/dashboard/${params.id}/templates/published`);
            }
          }}
          className="text-xs"
        >
          Your Templates
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}
