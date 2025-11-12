import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { File, Workflow } from "lucide-react";

export default function ModeSwitcher() {
  const { mode, setMode } = useWorkspaceStore();
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2">
      <Tabs value={mode}>
        <TabsList
          className={
            "bg-background [&>span]:bg-foreground/90 dark:[&>span]:bg-foreground/90 [&>span]:rounded-sm rounded-sm"
          }
        >
          <TabsTab
            value="workflow"
            onClick={() => {
              setMode("workflow");
            }}
            className="text-xs data-selected:text-background p-1"
          >
            <Workflow />
          </TabsTab>
          <TabsTab
            value="form"
            onClick={() => {
              setMode("form");
            }}
            className="text-xs data-selected:text-background p-1"
          >
            <File />
          </TabsTab>
        </TabsList>
      </Tabs>
    </div>
  );
}
