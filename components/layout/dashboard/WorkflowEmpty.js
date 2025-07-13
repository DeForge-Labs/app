import { FilePlus } from "lucide-react";
import CreateWorkflowButton from "./CreateWorkflowButton";

export default function WorkflowEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center dark:text-background">
      <div className="rounded-full bg-black/10 p-4 mb-4 dark:bg-background">
        <FilePlus className="h-10 w-10 text-black" />
      </div>
      <h3 className="text-lg font-medium">No workflows yet</h3>
      <p className="text-muted-foreground mt-2 max-w-md mb-5">
        Create your first AI agent workflow to automate tasks, process data, or
        connect to external APIs.
      </p>
      <CreateWorkflowButton />
    </div>
  );
}
