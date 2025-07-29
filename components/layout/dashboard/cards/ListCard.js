"use client";

import { formatDistanceToNow } from "date-fns";
import {
  CalendarRange,
  FileLineChartIcon,
  Edit,
  ArrowUpRight,
  Share,
} from "lucide-react";
import { Button } from "@heroui/react";
import DeleteButton from "./DeleteButton";
import { useRouter } from "next/navigation";
import DuplicateButton from "./DuplicateButton";
import { DynamicIcon } from "lucide-react/dynamic";
import MiniShareButton from "./MiniShareButton";
import RevertButton from "./RevertButton";

export default function ListCard({ flow, type = "workspace" }) {
  const timeAgo = formatDistanceToNow(flow.createdAt, { addSuffix: true });
  const router = useRouter();

  return (
    <div className="flex items-center justify-between p-3 border border-black/80 rounded-lg hover:shadow-md transition-colors dark:border-background dark:text-background">
      <div className="flex items-center">
        <div className="h-14 w-14  rounded-md flex text-black bg-black/5  items-center justify-center mr-4 dark:bg-white/5 dark:text-background">
          <DynamicIcon name={flow.iconId} className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold">{flow.name}</h3>
          {flow?.description && (
            <p className="text-xs text-black/80 dark:text-background w-[80%] truncate">
              {flow.description}
            </p>
          )}
          <div className="flex items-center text-xs text-black/80 mt-1 dark:text-background">
            <CalendarRange className="mr-1 h-3 w-3" />
            <span>Created {timeAgo}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
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
            <Edit className="h-3 w-3" />
          ) : (
            <ArrowUpRight className="h-3 w-3" />
          )}
          {type === "workspace" ? "Edit" : "Open"}
        </Button>
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
    </div>
  );
}
