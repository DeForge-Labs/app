import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { File, Terminal, Workflow } from "lucide-react";
import useChatStore from "@/store/useChatStore";
import { useState } from "react"; // Added useState

export default function ModeSwitcher() {
  const { mode, setMode, newLogs } = useWorkspaceStore();
  const { isLoading, chatMode } = useChatStore();

  const [hoveredTab, setHoveredTab] = useState(null);

  const getLabel = (value) => {
    switch (value) {
      case "workflow":
        return "Workflow Editor";
      case "form":
        return "Form Editor";
      case "logs":
        return "Logs";
      default:
        return "";
    }
  };

  const tooltipText = getLabel(hoveredTab || mode);

  return (
    <div className="relative group" onMouseLeave={() => setHoveredTab(null)}>
      <Tabs value={mode}>
        <TabsList className="bg-background border border-foreground/20 [&>span]:bg-foreground/90 [&>span]:ml-[1px] [&>span]:mb-[1px] dark:[&>span]:bg-foreground/90 [&>span]:rounded-sm rounded-sm p-[1px]">
          <TabsTab
            value="workflow"
            onMouseEnter={() => setHoveredTab("workflow")}
            onClick={() =>
              !(isLoading && chatMode === "build") && setMode("workflow")
            }
            className="text-xs data-selected:text-background p-1"
          >
            <Workflow size={16} />
          </TabsTab>

          <TabsTab
            value="form"
            onMouseEnter={() => setHoveredTab("form")}
            onClick={() =>
              !(isLoading && chatMode === "build") && setMode("form")
            }
            className="text-xs data-selected:text-background p-1"
          >
            <File size={16} />
          </TabsTab>

          <TabsTab
            value="logs"
            onMouseEnter={() => setHoveredTab("logs")}
            onClick={() =>
              !(isLoading && chatMode === "build") && setMode("logs")
            }
            className="text-xs data-selected:text-background p-1 relative"
          >
            <Terminal size={16} />
            {newLogs?.length > 0 && (
              <>
                <div className="absolute w-2 h-2 bg-blue-500 rounded-full -top-1 -right-1"></div>
                <div className="absolute w-2 h-2 bg-blue-500 rounded-full -top-1 -right-1 animate-ping opacity-50"></div>
              </>
            )}
          </TabsTab>
        </TabsList>
      </Tabs>

      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max scale-0 rounded bg-background border border-foreground/15 px-2 py-1 text-[10px] font-medium text-foreground shadow-sm transition-all group-hover:scale-100 z-[60]">
        {tooltipText}
      </div>
    </div>
  );
}
