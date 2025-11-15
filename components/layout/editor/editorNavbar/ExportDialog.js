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
import useWorkflowStore from "@/store/useWorkspaceStore";
import useFormStore from "@/store/useFormStore";

export default function ExportDialog({ open, setIsOpen }) {
  const handleIsOpenChange = (open) => {
    setIsOpen(open);
  };

  const { nodes, connections } = useWorkflowStore();
  const { components } = useFormStore();

  const handleExport = () => {
    const data = {
      nodes,
      connections,
      components,
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workspace.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleIsOpenChange}>
      <DialogPopup className={"sm:max-w-sm"}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleExport();
          }}
        >
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Export Workspace
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Export your workflow and form in a single JSON file. <br />
              No Environment Variables or Social Connections are exported.
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
            >
              Export
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
