import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { ArrowUpRight, CalendarRange, Edit, Share } from "lucide-react";
import { Button } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import DeleteButton from "./DeleteButton";
import { useRouter } from "next/navigation";
import DuplicateButton from "./DuplicateButton";
import { DynamicIcon } from "lucide-react/dynamic";

export default function GridCard({ flow, type = "workspace" }) {
  const timeAgo = formatDistanceToNow(flow.createdAt, { addSuffix: true });
  const router = useRouter();
  return (
    <Card className="overflow-hidden text-black/80 transition-all hover:shadow-md bg-transparent shadow-none border border-black/80 dark:border-background dark:text-background">
      <CardHeader className="p-4 pb-2 flex flex-col items-start">
        <div className="flex items-center justify-between">
          <span className="truncate font-bold">{flow.name}</span>
        </div>
        {flow?.description && (
          <p className="text-xs text-muted-foreground mt-1 mb-1">
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
          onPress={() => router.push(`/editor/${flow.id}`)}
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
            <Button
              variant="outline"
              size="icon"
              className="border-black/80 border p-2 rounded-lg dark:bg-dark dark:border-background"
              onPress={() => {}}
            >
              <Share className="h-3 w-3" />
            </Button>
          ) : (
            <DuplicateButton workflow={flow} />
          )}
          <DeleteButton workflowId={flow.id} />
        </div>
      </CardFooter>
    </Card>
  );
}
