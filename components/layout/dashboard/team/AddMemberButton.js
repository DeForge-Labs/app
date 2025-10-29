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
import { Loader2, Plus } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useInviteMember from "@/hooks/useInviteMember";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const items = [
  { label: "Viewer", value: "VIEWER" },
  { label: "Developer", value: "DEVELOPER" },
  { label: "Admin", value: "ADMIN" },
];

export default function AddMemberButton({ teamId }) {
  const {
    isOpen,
    setIsOpen,
    isInviting,
    role,
    setRole,
    isInviteOpen,
    setIsInviteOpen,
    invitation,
    handleInviteMember,
  } = useInviteMember();

  const handleIsOpenChange = (open) => {
    if (!isInviting) {
      setIsOpen(open);
      setRole("VIEWER");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpenChange}>
      <DialogTrigger
        render={
          <Button className="flex gap-2 font-normal text-xs bg-foreground/90 text-background rounded-sm w-fit">
            <Plus />
            Add Member
          </Button>
        }
      ></DialogTrigger>
      <DialogPopup className="sm:max-w-sm">
        <Form>
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Add Member
            </DialogTitle>
            <DialogDescription className={"text-xs"}>
              Choose what role you want to give to the member and invite them to
              your team.
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
              className="bg-foreground/90 text-background rounded-md border-none text-xs"
              onClick={() => {
                handleInviteMember(teamId);
              }}
              disabled={isInviting}
            >
              {isInviting ? <Loader2 className="animate-spin" /> : "Invite"}
            </Button>

            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogPopup className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle className={"text-lg font-medium opacity-80"}>
                    Invite Member
                  </DialogTitle>
                  <DialogDescription className={"text-xs"}>
                    Copy the invitation code and send it to the member.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  variant="outline"
                  placeholder="Enter invitation code"
                  className="w-full shadow-none border-black/50 font-mono border rounded-lg"
                  value={invitation?.inviteCode}
                  readOnly
                />
                <DialogFooter>
                  <DialogClose
                    render={<Button variant="ghost" className="text-xs" />}
                  >
                    Cancel
                  </DialogClose>
                  <Button
                    className="bg-foreground/90 text-background rounded-md border-none text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(invitation?.inviteCode);
                      toast.success("Copied to clipboard");
                    }}
                    disabled={isInviting}
                  >
                    Copy
                  </Button>
                </DialogFooter>
              </DialogPopup>
            </Dialog>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
