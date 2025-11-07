import { Dot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/components/ui/preview-card";
import { Badge } from "@/components/ui/badge";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { formatDistanceToNow } from "date-fns";

export default function WorkflowCard() {
  const { workspace, workflow, nodes, connections } = useWorkspaceStore();
  return (
    <PreviewCard>
      <PreviewCardTrigger
        render={
          <Button
            variant="outline"
            className={
              "flex gap-2 bg-transparent text-foreground font-normal w-full !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start"
            }
          >
            {workspace?.name}
            <Badge
              variant="outline"
              className="text-[10px] p-1 px-2 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
            >
              {workflow?.status === "TEST" ? "Draft" : "Published"}
            </Badge>
          </Button>
        }
      ></PreviewCardTrigger>
      <PreviewCardPopup
        align="start"
        sideOffset={9}
        className={"border border-foreground/30 rounded-lg w-fit p-3 px-4"}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs flex items-center pr-2">
              {nodes?.length} nodes <Dot className="size-4" />{" "}
              {connections?.length} Connections
            </p>
            <p className="text-[10px] text-muted-foreground">
              Created{" "}
              {formatDistanceToNow(new Date(workflow?.createdAt), {
                addSuffix: true,
              })}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Updated{" "}
              {formatDistanceToNow(new Date(workflow?.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </PreviewCardPopup>
    </PreviewCard>
  );
}
