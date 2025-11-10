"use client";

import { Input } from "@/components/ui/input";
import useSaveEnv from "@/hooks/useSaveEnv";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function EnvField({ field }) {
  const { handleSaveEnv, isOpen, setIsOpen, isSavingEnv } = useSaveEnv();
  const [value, setValue] = useState("");
  const { workflowEnv, workflow } = useWorkspaceStore();
  const [defaultValue, setDefaultValue] = useState(field.defaultValue);

  useEffect(() => {
    if (workflowEnv) {
      setDefaultValue(
        workflowEnv[field.name] ? workflowEnv[field.name] : field?.defaultValue
      );
    }
  }, [workflowEnv]);

  const handleIsOpenChange = (open) => {
    if (!isSavingEnv) {
      setIsOpen(open);
    }
  };

  return (
    <>
      <div key={field.name} className="space-y-1">
        <div className="text-xs text-foreground/80 font-medium capitalize">
          {field.name}
        </div>
        <div className="flex gap-2 items-center">
          <Input
            id={field.name}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            className="rounded-sm border border-foreground/50 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
            style={{ fontSize: "12px" }}
            variant="outline"
            placeholder={defaultValue}
          />

          <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
            <DialogTrigger
              render={
                <Button
                  size="icon"
                  variant="icon"
                  className="p-3 rounded-md text-xs bg-foreground text-background h-8 "
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  disabled={!value || workflow?.status === "LIVE"}
                >
                  <Save className="h-4 w-4" />
                </Button>
              }
            ></DialogTrigger>

            <DialogPopup className="sm:max-w-sm">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEnv(field.name, value, setValue);
                }}
              >
                <DialogHeader>
                  <DialogTitle className={"text-lg font-medium opacity-80"}>
                    Save Environment Variable
                  </DialogTitle>
                  <DialogDescription className={"text-xs"}>
                    Are you sure you want to save this environment variable
                    <span className="text-foreground mx-1 font-semibold font-mono">
                      {field.name}
                    </span>
                    ?
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
                    disabled={isSavingEnv}
                  >
                    {isSavingEnv ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            </DialogPopup>
          </Dialog>
        </div>
        <div className="text-[10px] text-foreground/60">{field.desc}</div>
      </div>

      {/* <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 rounded-lg dark:border-background dark:text-background dark:bg-dark"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isSavingEnv}
        isKeyboardDismissDisabled={isSavingEnv}
        hideCloseButton={isSavingEnv}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium">Save Environment Variable</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to save this environment variable
              <span className="text-black mx-1 font-semibold font-mono dark:text-background">
                {field.name}
              </span>
              ?
            </p>
          </ModalBody>
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onClick={() => setIsOpen(false)}
              isDisabled={isSavingEnv}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => handleSaveEnv(field.name, value, setValue)}
              isDisabled={isSavingEnv || !value}
            >
              {isSavingEnv ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Save"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
  );
}
