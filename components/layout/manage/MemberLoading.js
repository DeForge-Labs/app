import { Loader2 } from "lucide-react";

export default function MemberLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center dark:text-background">
      <div className="rounded-full bg-black/10 p-4 mb-4 dark:bg-white/5">
        <Loader2 className="h-10 w-10 text-black animate-spin dark:text-background" />
      </div>
      <h3 className="text-lg font-medium dark:text-background">Loading...</h3>
      <p className="text-muted-foreground mt-2 max-w-md dark:text-background">
        Please wait while we load your members.
      </p>
    </div>
  );
}
