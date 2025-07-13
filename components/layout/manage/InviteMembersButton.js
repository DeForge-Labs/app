"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";
import { GitBranch, Loader2, Plus } from "lucide-react";
import useInviteMember from "@/hooks/useInviteMember";
import { Tabs, Tab } from "@heroui/react";
import { toast } from "sonner";

export default function InviteMembersButton() {
  const {
    isOpen,
    setIsOpen,
    isInviting,
    role,
    setRole,
    invitation,
    handleInviteMember,
  } = useInviteMember();
  return (
    <>
      <Button
        variant="outline"
        size="md"
        className="bg-black/80 rounded-lg text-background text-xs dark:bg-background dark:text-black"
        onPress={() => {
          setIsOpen(true);
        }}
      >
        <Plus size={16} />
        Invite Members
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:bg-dark dark:border-background dark:text-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isInviting}
        isKeyboardDismissDisabled={isInviting}
        hideCloseButton={isInviting}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium ">Invite Members</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            {!invitation && (
              <>
                <p className="text-sm text-black/80 dark:text-background">
                  Invite members to your team by sending them an invitation
                  code.
                </p>

                <Tabs
                  aria-label="Tabs radius"
                  radius={"md"}
                  className=" w-fit"
                  variant="bordered"
                  classNames={{
                    tabList: "relative border-1 h-12",
                    tabList:
                      "relative border-1 border-black/50 dark:border-background",
                    tabContent:
                      "w-[96px] text-black/80 cursor-pointer dark:text-background dark:border-background dark:group-data-[selected=true]:text-black/80 group-data-[selected=true]:text-background",
                    cursor: " h-11 top-0.5 dark:bg-background bg-black/80",
                  }}
                  selectedKey={role}
                  onSelectionChange={setRole}
                  isDisabled={isInviting}
                >
                  <Tab key="VIEWER" title="Viewer" className="py-6" />
                  <Tab key="DEVELOPER" title="Developer" className="py-6" />
                  <Tab key="ADMIN" title="Admin" className="py-6" />
                </Tabs>
              </>
            )}

            {invitation && (
              <>
                <p className="text-sm text-black/80 dark:text-background">
                  Copy the invitation code and send it to the member.
                </p>
                <Input
                  variant="outline"
                  placeholder="Enter invitation code"
                  className="w-full shadow-none border-black/50 font-mono border rounded-lg dark:border-background dark:text-background"
                  value={invitation.inviteCode}
                  readOnly
                />
              </>
            )}
          </ModalBody>
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-full rounded-full border border-black/80 p-7 dark:border-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isInviting}
            >
              {invitation ? "Close" : "Cancel"}
            </Button>
            {!invitation && (
              <Button
                className="w-full rounded-full p-7 dark:bg-background dark:text-black bg-black/80 text-background"
                onPress={handleInviteMember}
                isDisabled={isInviting || !role}
              >
                {isInviting ? (
                  <Loader2 className="animate-spin text-background dark:text-black" />
                ) : (
                  "Invite"
                )}
              </Button>
            )}

            {invitation && (
              <Button
                className="w-full rounded-full p-7 dark:bg-background dark:text-black bg-black/80 text-background"
                onPress={() => {
                  navigator.clipboard.writeText(invitation.inviteCode);
                  toast.success("Invitation code copied to clipboard");
                }}
                isDisabled={isInviting}
              >
                Copy
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
