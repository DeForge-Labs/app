import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { File, Terminal, Workflow } from "lucide-react";
import useChatStore from "@/store/useChatStore";

export default function ModeSwitcher() {
  const { mode, setMode, newLogs } = useWorkspaceStore();

  const { isLoading, chatMode } = useChatStore();
  return (
    <div>
      <Tabs value={mode}>
        <TabsList
          className={
            "bg-background border border-foreground/20 [&>span]:bg-foreground/90 [&>span]:ml-[1px] [&>span]:mb-[1px] dark:[&>span]:bg-foreground/90 [&>span]:rounded-sm rounded-sm p-[1px]"
          }
        >
          <TabsTab
            value="workflow"
            onClick={() => {
              if (isLoading && chatMode === "build") {
                return;
              }
              setMode("workflow");
            }}
            className="text-xs data-selected:text-background p-1"
          >
            <Workflow />
          </TabsTab>
          <TabsTab
            value="form"
            onClick={() => {
              if (isLoading && chatMode === "build") {
                return;
              }
              setMode("form");
            }}
            className="text-xs data-selected:text-background p-1"
          >
            <File />
          </TabsTab>
          <TabsTab
            value="logs"
            onClick={() => {
              if (isLoading && chatMode === "build") {
                return;
              }
              setMode("logs");
            }}
            className="text-xs data-selected:text-background p-1 relative"
          >
            <Terminal />
            {newLogs?.length > 0 && (
              <>
                <div className="absolute w-2 h-2 bg-blue-500 rounded-full -top-1 -right-1"></div>
                <div className="absolute w-2 h-2 bg-blue-500 rounded-full -top-1 -right-1 animate-ping opacity-50"></div>
              </>
            )}
          </TabsTab>
        </TabsList>
      </Tabs>
    </div>
  );
}
