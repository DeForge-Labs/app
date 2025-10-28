import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ServerNotFoundPage() {
  return (
    <div className="flex flex-col rounded-lg border mt-6 border-black/10 shadow-md bg-background dark:bg-foreground/5 dark:border-white/10">
      <p className="text-sm font-semibold mt-4 mx-auto">Server Not Found</p>
      <p className="text-xs text-foreground/60 mx-auto">
        Something went wrong. Please try again later.
      </p>

      <div className="mt-4 flex w-full">
        <Link href="https://deforge.io" className="flex-1">
          <Button
            className="h-11 text-xs border-black/10 w-full before:rounded-t-none dark:border-white/10 border-l-0 border-b-0 rounded-br-none rounded-t-none text-destructive"
            variant="outline"
            type="button"
          >
            Home Page
          </Button>
        </Link>

        <Link href="/" className="flex-1">
          <Button
            className="flex-1 h-11 text-xs w-full border-black/10 before:rounded-t-none dark:border-white/10 border-x-0 border-b-0 rounded-bl-none rounded-t-none text-info"
            variant="outline"
            type="submit"
          >
            Try Again
          </Button>
        </Link>
      </div>
    </div>
  );
}
