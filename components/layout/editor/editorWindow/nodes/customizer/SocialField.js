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
import { Form } from "@/components/ui/form";
import { Link2, Loader2 } from "lucide-react";
import useConnectSocial from "@/hooks/useConnectSocial";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Button } from "@/components/ui/button";

export default function SocialField({ field }) {
  const {
    handleConnectSocial,
    isOpen,
    setIsOpen,
    isConnecting,
    handleDisconnectSocial,
  } = useConnectSocial();
  const { workflow, workflowSocial } = useWorkspaceStore();

  const handleIsOpenChange = (open) => {
    if (!isConnecting) {
      setIsOpen(open);
    }
  };

  return (
    <>
      <div key={field.name} className="space-y-1">
        <div className="text-xs text-foreground/80 font-medium capitalize flex items-center justify-between">
          {field.name}

          {workflowSocial && workflowSocial[field.name.toLowerCase()] && (
            <div className="flex items-center ">
              <Link2 className="ml-2 w-3 h-3 mt-[1px]" />
              <div className="ml-1 text-[10px] text-foreground/50">
                Connected
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {workflowSocial && !workflowSocial[field.name.toLowerCase()] ? (
            <Button
              size="md"
              className="px-2 text-xs text-background bg-foreground/90 w-full h-9 rounded-sm"
              onClick={() => {
                setIsOpen(true);
              }}
              disabled={workflow?.status === "LIVE"}
            >
              Connect
            </Button>
          ) : (
            <Button
              size="md"
              className="px-2 text-xs text-background bg-foreground/90 w-full h-9 rounded-sm"
              onClick={() => {
                setIsOpen(true);
              }}
              disabled={workflow?.status === "LIVE"}
            >
              Disconnect
            </Button>
          )}
        </div>
        <div className="text-[10px] text-foreground/60">{field.desc}</div>
      </div>

      <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
        <DialogPopup className="sm:max-w-sm">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              if (workflowSocial && workflowSocial[field.name.toLowerCase()]) {
                handleDisconnectSocial(field.name.toLowerCase());
              } else {
                handleConnectSocial(field.name.toLowerCase());
              }
            }}
          >
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                {workflowSocial && workflowSocial[field.name.toLowerCase()]
                  ? "Disconnect Social"
                  : "Connect Social"}
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Are you sure you want to{" "}
                {workflowSocial && workflowSocial[field.name.toLowerCase()]
                  ? "disconnect"
                  : "connect"}{" "}
                this social account
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
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="animate-spin" />
                ) : workflowSocial &&
                  workflowSocial[field.name.toLowerCase()] ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>

      {/* <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:border-background dark:text-background dark:bg-dark"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isConnecting}
        isKeyboardDismissDisabled={isConnecting}
        hideCloseButton={isConnecting}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium">
              {workflowSocial && workflowSocial[field.name.toLowerCase()]
                ? "Disconnect Social"
                : "Connect Social"}
            </h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>
              Are you sure you want to{" "}
              {workflowSocial && workflowSocial[field.name.toLowerCase()]
                ? "disconnect"
                : "connect"}{" "}
              this social account
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
              onPress={() => setIsOpen(false)}
              isDisabled={isConnecting}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => {
                if (
                  workflowSocial &&
                  workflowSocial[field.name.toLowerCase()]
                ) {
                  handleDisconnectSocial(field.name.toLowerCase());
                } else {
                  handleConnectSocial(field.name.toLowerCase());
                }
              }}
              isDisabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : workflowSocial && workflowSocial[field.name.toLowerCase()] ? (
                "Disconnect"
              ) : (
                "Connect"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
  );
}
