"use client";

import { Button } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

export default function LogoutButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      <Button
        variant="outline"
        size="md"
        className="border h-9 border-red-500 rounded-lg text-red-500 text-xs"
        onPress={() => setIsOpen(true)}
      >
        <LogOut size={16} />
        Logout
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium dark:text-background">Logout</h3>
          </ModalHeader>
          <ModalBody className="-mt-3 dark:text-background">
            <p>Are you sure you want to logout from this account?</p>
          </ModalBody>
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={handleLogout}
            >
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
