import { Loader2 } from "lucide-react";

export default function WorkflowLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center dark:text-background">
      <div className="rounded-full bg-black/10 p-4 mb-4 dark:bg-background">
        <Loader2 className="h-10 w-10 text-black animate-spin" />
      </div>
      <h3 className="text-lg font-medium">Loading...</h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        Please wait while we load your workflows.
      </p>
    </div>
  );
}
