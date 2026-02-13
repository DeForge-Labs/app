import { Button } from "@/components/ui/button";
import {
  Download,
  MessageCircle,
  Monitor,
  Moon,
  Play,
  Rocket,
  Sparkles,
  Sun,
  Undo,
  Upload,
} from "lucide-react";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import useWorkflowStore from "@/store/useWorkspaceStore";
import useChatStore from "@/store/useChatStore";
import PublishDialog from "./editorNavbar/PublishDialog";
import ExportDialog from "./editorNavbar/ExportDialog";
import ImportDialog from "./editorNavbar/ImportDialog";
import { useEffect, useState } from "react";
import DeployDialog from "./editorNavbar/DeployDialog";
import { Skeleton } from "@/components/ui/skeleton";
import RevertDialog from "../viewer/RevertDialog";
import { cn } from "@/lib/utils";

export default function EditorSidePanel() {
  const { theme, setTheme } = useTheme();
  const { sidePanel, setSidePanel, workflow } = useWorkflowStore();
  const { chatModalOpen, setChatModalOpen } = useChatStore();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isRevertOpen, setIsRevertOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isLive = workflow?.status === "LIVE";

  useEffect(() => {
    setMounted(true);
  }, []);

  const buttonMap = [
    {
      id: "Chat",
      render: (
        <Button
          variant={
            sidePanel === "chat" && chatModalOpen ? "default" : "outline"
          }
          className={
            "w-8 rounded-sm peer dark:not-disabled:not-active:not-data-pressed:before:shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none border border-foreground/15"
          }
          onClick={() => {
            if (chatModalOpen && sidePanel === "chat") {
              setChatModalOpen(false);
              return;
            }

            setChatModalOpen(true);
            setSidePanel("chat");
          }}
        >
          <MessageCircle className="size-[13px]" />
        </Button>
      ),
    },
    {
      id: "Execute",
      render: (
        <Button
          variant={
            sidePanel === "execute" && chatModalOpen ? "default" : "outline"
          }
          className={
            "w-8 rounded-sm peer dark:not-disabled:not-active:not-data-pressed:before:shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none border border-foreground/15"
          }
          onClick={() => {
            if (chatModalOpen && sidePanel === "execute") {
              setChatModalOpen(false);
              return;
            }

            setChatModalOpen(true);
            setSidePanel("execute");
          }}
        >
          <Play className="size-[13px]" />
        </Button>
      ),
    },
    {
      id: "Import Workspace",
      render: (
        <Button
          variant="outline"
          className={
            "w-8 rounded-sm peer dark:not-disabled:not-active:not-data-pressed:before:shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none border border-foreground/15"
          }
          onClick={() => setIsImportOpen(true)}
        >
          <Upload className="size-[13px]" />
        </Button>
      ),
      disabled: true,
    },
    {
      id: "Export Workspace",
      render: (
        <Button
          variant="outline"
          className={
            "w-8 rounded-sm peer dark:not-disabled:not-active:not-data-pressed:before:shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none border border-foreground/15"
          }
          onClick={() => setIsExportOpen(true)}
        >
          <Download className="size-[13px]" />
        </Button>
      ),
      disabled: true,
    },
    {
      id: "Publish Workspace",
      render: (
        <Button
          variant="outline"
          className={
            "w-8 rounded-sm  peer dark:not-disabled:not-active:not-data-pressed:before:shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none border border-foreground/15"
          }
          onClick={() => setIsPublishOpen(true)}
        >
          <Sparkles className="size-[13px]" />
        </Button>
      ),
      disabled: true,
    },
    {
      id: "Deploy Workflow",
      render: (
        <DeployDialog>
          <Button
            className={
              "w-8 rounded-sm  peer dark:not-disabled:not-active:not-data-pressed:before:shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none border border-foreground/15"
            }
          >
            <Rocket className="size-[13px]" />
          </Button>
        </DeployDialog>
      ),
      disabled: true,
    },
    {
      id: "Revert Workflow",
      render: (
        <Button
          variant="outline"
          className={
            "w-8 rounded-sm peer dark:not-disabled:not-active:not-data-pressed:before:shadow-none not-disabled:not-active:not-data-pressed:before:shadow-none border border-foreground/15"
          }
          onClick={() => setIsRevertOpen(true)}
        >
          <Undo className="size-[13px] text-red-400" />
        </Button>
      ),
      disabled: true,
      onlyLive: true,
    },
  ];

  return (
    <>
      {!isLive && (
        <PublishDialog isOpen={isPublishOpen} setIsOpen={setIsPublishOpen} />
      )}
      {!isLive && (
        <ExportDialog open={isExportOpen} setIsOpen={setIsExportOpen} />
      )}
      {!isLive && (
        <ImportDialog open={isImportOpen} setIsOpen={setIsImportOpen} />
      )}
      {isLive && (
        <RevertDialog open={isRevertOpen} setIsOpen={setIsRevertOpen} />
      )}
      <div className="w-[44px] flex flex-col justify-between pl-[3px]">
        <div className="flex flex-col gap-2">
          {buttonMap.map((button, index) => (
            <div
              key={index}
              className={cn(
                `relative`,
                button?.onlyLive && workflow?.status === "LIVE" ? "-mt-8" : "",
              )}
            >
              {!button?.disabled && <>{button.render}</>}

              {button?.disabled && !workflow && (
                <Skeleton className="w-8 h-8 rounded-sm" />
              )}

              {button?.disabled && workflow && workflow?.status !== "LIVE" && (
                <>{button.render}</>
              )}

              {button?.onlyLive && workflow && workflow?.status === "LIVE" && (
                <>{button.render}</>
              )}

              <div className="absolute top-1/2 -translate-y-1/2 left-10 peer-hover:block hidden z-50 p-1 px-2 text-xs w-fit rounded-sm border border-foreground/40 bg-background text-foreground">
                <p className="w-max font-medium">{button.id}</p>
              </div>
            </div>
          ))}
        </div>

        {mounted && (
          <Tabs orientation="vertical" value={theme}>
            <TabsList
              className={
                "bg-background border border-foreground/20 w-[32px] [&>span]:bg-foreground/90 [&>span]:mb-[1px] [&>span]:ml-[1px] dark:[&>span]:bg-foreground/90 [&>span]:rounded-sm rounded-sm p-[1px]"
              }
            >
              <TabsTab
                value="light"
                onClick={() => setTheme("light")}
                className="text-xs data-selected:text-background p-1 pl-[5px]"
              >
                <Sun className="size-4" />
              </TabsTab>
              <TabsTab
                value="dark"
                onClick={() => setTheme("dark")}
                className="text-xs data-selected:text-background p-1 pl-[5px]"
              >
                <Moon className="size-4" />
              </TabsTab>
              <TabsTab
                value="system"
                onClick={() => setTheme("system")}
                className="text-xs data-selected:text-background p-1 relative pl-[5px]"
              >
                <Monitor className="size-4" />
              </TabsTab>
            </TabsList>
          </Tabs>
        )}
      </div>
    </>
  );
}
