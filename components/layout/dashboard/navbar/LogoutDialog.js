"use client";

import { Button } from "@/components/ui/button";
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
import { Form } from "@/components/ui/form";
import { LogOut } from "lucide-react";
import { logout } from "@/actions/logout";

export default function LogoutDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="text-destructive data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none  dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent !shadow-none bg-transparent hover:bg-transparent w-full justify-start border-none"
          >
            <LogOut size={16} />
            Logout
          </Button>
        }
      ></DialogTrigger>
      <DialogPopup className="sm:max-w-sm">
        <Form>
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Logout
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Are you sure you want to logout? This will log you out of your
              account on this device.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" className="text-xs" />}
            >
              Cancel
            </DialogClose>
            <Button
              className="bg-destructive text-background rounded-sm border-none text-xs"
              onClick={async () => {
                await logout();
              }}
            >
              Logout
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
