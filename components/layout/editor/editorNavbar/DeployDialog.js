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

import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, Rocket } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/ui/Logo";
import useDeployWorkflow from "@/hooks/useDeployWorkflow";

export default function DeployDialog({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("FORM");
  const { handleDeployWorkflow, isDeploying } = useDeployWorkflow();

  const handleIsOpenChange = (open) => {
    if (isDeploying) return;
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
      <DialogTrigger render={children} />
      <DialogPopup className={"sm:max-w-sm"}>
        <Form>
          <DialogHeader>
            <DialogTitle className={"text-lg text-center font-medium"}>
              <Logo size={50} className="mb-4" />
              Deploy Workflow
            </DialogTitle>
            <DialogDescription className={"text-xs text-center"}>
              Deployed Workflow are optimized for production use. Only Node
              values can be changed after deployment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5 p-2 border rounded-md border-dashed border-foreground/15">
            <p className="text-[10px] opacity-70 ml-1">
              Choose your default view
            </p>

            <Tabs value={view}>
              <TabsList className="bg-background w-full [&>span]:bg-foreground/5 [&>span]:rounded-md">
                <TabsTab
                  value="FORM"
                  onClick={() => setView("FORM")}
                  className="text-xs"
                >
                  Form
                </TabsTab>
                <TabsTab
                  value="WORKFLOW"
                  onClick={() => setView("WORKFLOW")}
                  className="text-xs"
                >
                  Workflow
                </TabsTab>
              </TabsList>
            </Tabs>
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
              onClick={() => handleDeployWorkflow(view, setIsOpen)}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Deploy"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
