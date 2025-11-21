import { Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function WorkflowEndpoint({ workflow }) {
  return (
    <div className="space-y-2 p-4 pb-0">
      <p className="text-[10px] text-foreground/50 flex items-center gap-1">
        <Link2 className="size-3" /> Workflow Id
      </p>

      <Input
        variant="outline"
        value={`${workflow?.id}`}
        readOnly
        className="py-1 rounded-sm border-foreground/15 bg-card dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
        style={{ fontSize: "12px" }}
      />

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="flex-1 text-xs bg-background border gap-1.5 border-foreground/15 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
          onClick={() => {
            toast("Workflow Id copied to clipboard");
            navigator.clipboard.writeText(workflow?.id);
          }}
        >
          <Copy /> Copy
        </Button>
      </div>
    </div>
  );
}
