"use client";

import { formatDistanceToNow } from "date-fns";
import { CalendarRange, FileLineChartIcon, Edit } from "lucide-react";
import { Button } from "@heroui/react";
import DeleteButton from "./DeleteButton";
import { useRouter } from "next/navigation";
import DuplicateButton from "./DuplicateButton";

export default function ListCard({ flow }) {
  const timeAgo = formatDistanceToNow(flow.createdAt, { addSuffix: true });
  const router = useRouter();

  return (
    <div className="flex items-center justify-between p-3 border border-black/80 rounded-lg hover:shadow-md transition-colors dark:border-background dark:text-background">
      <div className="flex items-center">
        <div className="h-10 w-10  rounded-md flex text-black bg-black/5  items-center justify-center mr-4 dark:bg-white/5 dark:text-background">
          <FileLineChartIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold">{flow.name}</h3>
          <div className="flex items-center text-xs text-black/80 mt-1 dark:text-background">
            <CalendarRange className="mr-1 h-3 w-3" />
            <span>Created {timeAgo}</span>
            <span className="mx-2">•</span>
            <span>
              {flow.workflowNodeCount} nodes, {flow.connectionCount} connections
            </span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="border-black/80 border dark:border-background dark:text-background"
          onPress={() => router.push(`/editor/${flow.id}`)}
        >
          <Edit className="h-3 w-3" />
          Edit
        </Button>
        <DuplicateButton workflow={flow} />
        <DeleteButton workflowId={flow.id} />
      </div>
    </div>
  );
}
