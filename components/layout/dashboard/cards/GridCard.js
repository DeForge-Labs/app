import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { ArrowUpRight, CalendarRange, Edit, Share } from "lucide-react";
import { Button } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import DeleteButton from "./DeleteButton";
import { useRouter } from "next/navigation";
import DuplicateButton from "./DuplicateButton";
import { DynamicIcon } from "lucide-react/dynamic";
import MiniShareButton from "./MiniShareButton";
import RevertButton from "./RevertButton";

export default function GridCard({ flow, type = "workspace" }) {
  const timeAgo = formatDistanceToNow(flow.createdAt, { addSuffix: true });
  const router = useRouter();

  return (
    <Card className="overflow-hidden text-black/80 transition-all hover:shadow-md bg-transparent shadow-none border border-black/80 dark:border-background dark:text-background">
      <CardHeader className="p-4 pb-2 flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <span className="truncate font-bold">{flow.name}</span>
          {type === "workspace" && flow?.type !== "WORKFLOW" && (
            <div className="flex p-1 px-2 rounded-md text-xs text-background bg-black dark:bg-background dark:text-dark">
              Published
            </div>
          )}
        </div>
        {flow?.description && (
          <p className="text-xs text-muted-foreground mt-1 mb-1 line-clamp-2">
            {flow.description}
          </p>
        )}
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <CalendarRange className="mr-1 h-3 w-3" />
          <span>Created {timeAgo}</span>
        </div>
      </CardHeader>
      <CardBody className="p-4 pt-2">
        <div className="h-32 bg-black/5 dark:bg-white/5 rounded-md flex items-center justify-center">
          <div className="flex flex-col items-center text-muted-foreground">
            <DynamicIcon name={flow.iconId} className="h-12 w-12" />
          </div>
        </div>
      </CardBody>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="border-black/80 border dark:border-background dark:text-background"
          onPress={() => {
            if (type === "template") {
              window.open(`/template/${flow.id}`, "_blank");
              return;
            }
            if (flow?.type === "WORKFLOW") {
              router.push(`/editor/${flow.id}`);
            } else {
              router.push(`/form/${flow.id}`);
            }
          }}
        >
          {type === "workspace" ? (
            <>
              {" "}
              <Edit className="h-3 w-3" />
              Edit
            </>
          ) : (
            <>
              <ArrowUpRight className="h-3 w-3" />
              Open
            </>
          )}
        </Button>
        <div className="flex space-x-2">
          {type === "template" ? (
            <MiniShareButton template={flow} />
          ) : (
            <DuplicateButton workflow={flow} />
          )}
          {type === "template" ? (
            <RevertButton templateId={flow.id} />
          ) : (
            <DeleteButton workflowId={flow.id} />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
