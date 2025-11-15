import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useSaveWorkflow from "@/hooks/useSaveWorkflow";
import { Info, Loader2 } from "lucide-react";
import { Play } from "lucide-react";

export default function SaveDialog({ children }) {
  const { isOpen, setIsOpen, isSavingWorkflow, handleSaveWorkflow } =
    useSaveWorkflow();
  const handleIsOpenChange = (open) => {
    if (isSavingWorkflow) {
      return;
    }
    setIsOpen(open);
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
      <DialogTrigger render={children}></DialogTrigger>
      <DialogPopup className={"sm:max-w-sm"}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveWorkflow();
          }}
        >
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Save Changes
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Are you sure you want to save the changes? This will overwrite
              your previous changes.
            </DialogDescription>
          </DialogHeader>

          <div className="flex bg-foreground/5 rounded-md p-2 gap-2 text-xs text-foreground/50 relative overflow-hidden">
            <Info className="size-20 mt-0.5 absolute -bottom-5 -right-5 opacity-15" />
            <div className="flex flex-col">
              You can execute the changes by clicking on the
              <div className="flex items-center">
                <Button className="text-[10px] rounded-md gap-1.5 px-2 -ml-1 [&_svg:not([class*='size-'])]:size-3 scale-70">
                  <Play />
                </Button>{" "}
                play button before saving.
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" className="text-xs" />}
            >
              Cancel
            </DialogClose>
            <Button
              className="text-background rounded-md border-none text-xs"
              type="submit"
              disabled={isSavingWorkflow}
            >
              {isSavingWorkflow ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
