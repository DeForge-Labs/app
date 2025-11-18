import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { File, Terminal, Workflow } from "lucide-react";

export default function ModeSwitcher() {
  const { mode, setMode } = useWorkspaceStore();
  return (
    <div>
      <Tabs value={mode}>
        <TabsList
          className={
            "bg-background border border-foreground/20 [&>span]:bg-foreground/90 [&>span]:mb-[1px] dark:[&>span]:bg-foreground/90 [&>span]:rounded-sm rounded-sm p-[1px]"
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
          <TabsTab
            value="logs"
            onClick={() => {
              setMode("logs");
            }}
            className="text-xs data-selected:text-background p-1"
          >
            <Terminal />
          </TabsTab>
        </TabsList>
      </Tabs>
    </div>
  );
}
