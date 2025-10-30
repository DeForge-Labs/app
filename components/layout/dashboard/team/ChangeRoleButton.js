"use client";

import { ArrowLeftRight } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useChangeRole from "@/hooks/useChangeRole";
import { Loader2 } from "lucide-react";

const items = [
  { label: "Viewer", value: "VIEWER" },
  { label: "Developer", value: "DEVELOPER" },
  { label: "Admin", value: "ADMIN" },
];

export default function ChangeRoleButton({ member }) {
  const { isOpen, setIsOpen, isChanging, role, setRole, handleChangeRole } =
    useChangeRole();

  const handleIsOpenChange = (open) => {
    if (!isChanging) {
      setIsOpen(open);
      setRole(member?.role);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent !shadow-none bg-transparent hover:bg-transparent w-full justify-start border-none"
          >
            <ArrowLeftRight size={16} />
            Change Role
          </Button>
        }
      ></DialogTrigger>
      <DialogPopup className="sm:max-w-sm">
        <Form>
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Change Role
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Choose the new role for this member in this team.
            </DialogDescription>
          </DialogHeader>

          <Select
            items={items}
            defaultValue="VIEWER"
            onValueChange={(e) => {
              setRole(e);
            }}
            value={role}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectPopup alignItemWithTrigger={false}>
              {items.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>

          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" className="text-xs" />}
            >
              Cancel
            </DialogClose>
            <Button
              className="text-background rounded-md border-none text-xs"
              disabled={isChanging || role === member?.role}
              onClick={() =>
                handleChangeRole(member?.teamId, member?.userEmail)
              }
            >
              {isChanging ? <Loader2 className="animate-spin" /> : "Change"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
