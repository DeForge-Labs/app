import { Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function WorkflowCard() {
  const { workspace, workflow, nodes, connections } = useWorkspaceStore();

  if (!workflow) return null;

  return (
    <div className="group relative w-full">
      <Button
        variant="outline"
        className={cn(
          "flex gap-2 bg-transparent text-foreground font-normal w-full !shadow-none [&:is(:hover,[data-pressed])]:bg-foreground/5 dark:bg-transparent rounded-sm border-0 not-disabled:not-active:not-data-pressed:before:shadow-none dark:not-disabled:not-active:not-data-pressed:before:shadow-none text-xs justify-start",
          workspace?.name?.length > 20 && "cursor-help"
        )}
      >
        {workspace?.name?.length > 20
          ? workspace?.name?.slice(0, 20) + "..."
          : workspace?.name}
        <Badge
          variant="outline"
          className="text-[10px] p-1 px-2 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
        >
          {workflow?.status === "TEST" ? "Draft" : "Published"}
        </Badge>
      </Button>

      <div className="pointer-events-none absolute left-0 top-full mt-2 min-w-[160px] scale-0 origin-top-left rounded-lg bg-background p-3 px-4 text-xs text-foreground/90 border border-foreground/30 shadow-lg transition-all group-hover:scale-100 z-50">
        <div className="flex flex-col gap-1">
          {workspace?.name?.length > 20 && (
            <p className="font-semibold border-bottom border-foreground/10 pb-1 mb-1 max-w-[350px]">
              {workspace?.name}
            </p>
          )}

          <p className="text-xs flex items-center">
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
    </div>
  );
}
