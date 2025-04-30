import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import {
  CalendarRange,
  FileLineChartIcon,
  Edit,
  Copy,
  Trash2,
} from "lucide-react";
import { Button } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import DeleteButton from "./DeleteButton";

export default function GridCard({ flow }) {
  const timeAgo = formatDistanceToNow(flow.createdAt, { addSuffix: true });
  return (
    <Card className="overflow-hidden text-black/80 transition-all hover:shadow-md bg-transparent shadow-none border border-black/80">
      <CardHeader className="p-4 pb-2 flex flex-col items-start">
        <div className="flex items-center justify-between">
          <span className="truncate font-bold">{flow.name}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <CalendarRange className="mr-1 h-3 w-3" />
          <span>Created {timeAgo}</span>
        </div>
      </CardHeader>
      <CardBody className="p-4 pt-2">
        <div className="h-32 bg-black/5 rounded-md flex items-center justify-center">
          <div className="flex flex-col items-center text-muted-foreground">
            <FileLineChartIcon className="h-8 w-8 mb-2" />
            <div className="text-sm">
              {flow.workflowNodeCount} nodes, {flow.connectionCount} connections
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="border-black/80 border">
          <Edit className="h-3 w-3" />
          Edit
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="border-black/80 border p-2 rounded-lg"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <DeleteButton workflowId={flow.id} />
        </div>
      </CardFooter>
    </Card>
  );
}
