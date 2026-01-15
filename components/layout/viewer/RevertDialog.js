import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useFallbackWorkflow from "@/hooks/useFallbackWorkflow";
import { Loader2 } from "lucide-react";

export default function RevertDialog({ open, setIsOpen }) {
  const { handleFallbackWorkflow, isFallbacking } = useFallbackWorkflow();
  const handleIsOpenChange = (open) => {
    if (isFallbacking) return;
    setIsOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleIsOpenChange}>
      <DialogPopup className={"sm:max-w-sm"}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleFallbackWorkflow(setIsOpen);
          }}
        >
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Revert Deployment
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Revert this workflow to Draft version. This will deactivate the
              deployed APIs.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" className="text-xs" />}
            >
              Cancel
            </DialogClose>
            <Button
              className="text-background rounded-md border-none text-xs"
              type="submit"
              disabled={isFallbacking}
            >
              {isFallbacking ? <Loader2 className="animate-spin" /> : "Revert"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
