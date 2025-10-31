"use client";

import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import useRenameWorkspace from "@/hooks/useRenameWorkspace";

export default function RenameDialog({ appId, appName, setIsOpen, isOpen }) {
  const { isRenaming, handleChangeWorkspaceName, name, setName } =
    useRenameWorkspace(setIsOpen);

  const handleIsOpenChange = (open) => {
    if (!isRenaming) {
      setIsOpen(open);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
        <DialogPopup className="sm:max-w-sm">
          <Form>
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Rename App
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Enter the new name for this app.
              </DialogDescription>
            </DialogHeader>

            <Input
              placeholder={appName}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              disabled={isRenaming}
              autoFocus
            />

            <DialogFooter>
              <DialogClose
                render={<Button variant="ghost" className="text-xs" />}
              >
                Cancel
              </DialogClose>
              <Button
                className="text-background rounded-md border-none text-xs"
                disabled={isRenaming || !name || name === appName}
                type="submit"
                onClick={() => {
                  handleChangeWorkspaceName(appId);
                }}
              >
                {isRenaming ? <Loader2 className="animate-spin" /> : "Rename"}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
