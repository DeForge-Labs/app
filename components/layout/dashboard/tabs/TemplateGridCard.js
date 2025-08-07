import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { CalendarRange, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DynamicIcon } from "lucide-react/dynamic";
import UseTemplateButton from "./UseTemplateButton";

export default function TemplateGridCard({ flow }) {
  const timeAgo = formatDistanceToNow(flow.createdAt, { addSuffix: true });

  return (
    <Card className="overflow-hidden text-black/80 transition-all hover:shadow-md bg-transparent shadow-none border border-black/80 dark:border-background dark:text-background">
      <CardHeader className="p-4 pb-2 flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <span className="truncate font-bold">{flow.name}</span>
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
      <CardBody className="p-4 pt-2 justify-end">
        <div className="h-32 bg-black/5 dark:bg-white/5 rounded-md flex items-center justify-center">
          <div className="flex flex-col items-center text-muted-foreground">
            <DynamicIcon name={flow.iconId} className="h-12 w-12" />
          </div>
        </div>
      </CardBody>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <UseTemplateButton template={flow} />
        <div className="flex space-x-2 items-center rounded-lg bg-black/5 dark:bg-white/5 p-2">
          <User
            name="user"
            className="text-black dark:text-background w-3 h-3"
          />
          <p className="text-xs text-black dark:text-background">
            {flow.totalClones}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
