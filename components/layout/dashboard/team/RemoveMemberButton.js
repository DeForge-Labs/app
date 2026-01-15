"use client";

import { Trash, Loader2 } from "lucide-react";
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
import useRemoveMember from "@/hooks/useRemoveMember";

export default function RemoveMemberButton({ member }) {
  const { isOpen, setIsOpen, isRemoving, handleRemoveMember } =
    useRemoveMember();

  const handleIsOpenChange = (open) => {
    if (!isRemoving) {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="text-destructive data-highlighted:bg-foreground/5 not-disabled:not-active:not-data-pressed:before:shadow-none px-2 min-h-5 font-normal rounded-sm text-xs [&_svg:not([class*='size-'])]:size-3 dark:not-disabled:not-active:not-data-pressed:before:shadow-none data-highlighted:text-destructive cursor-pointer dark:bg-transparent !shadow-none bg-transparent hover:bg-transparent w-full justify-start border-none"
          >
            <Trash size={16} />
            Remove Member
          </Button>
        }
      ></DialogTrigger>

      <DialogPopup className="sm:max-w-sm">
        <Form>
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Remove Member
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Are you sure you want to remove this member from this team?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" className="text-xs" />}
            >
              Cancel
            </DialogClose>
            <Button
              className="bg-destructive text-background rounded-md border-none text-xs"
              onClick={() =>
                handleRemoveMember(member?.teamId, member?.userEmail)
              }
              type="submit"
              disabled={isRemoving}
            >
              {isRemoving ? <Loader2 className="animate-spin" /> : "Remove"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
