"use client";
import useUseTemplate from "@/hooks/useUseTemplate";
import { Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Select, SelectItem } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function UseTemplateButton() {
  const teams = useSelector((state) => state.template.teams);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const {
    isOpen,
    setIsOpen,
    handleUseTemplate,
    isUsingTemplate,
    team,
    setTeam,
  } = useUseTemplate();

  return (
    <>
      <Button
        className="w-full gap-2 bg-black/80 dark:bg-background dark:text-black text-background"
        size="lg"
        onPress={() => {
          if (!user) {
            router.push("/");
          } else {
            setIsOpen(true);
          }
        }}
      >
        Use Template
      </Button>
      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:border-background dark:bg-dark dark:text-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isUsingTemplate}
        isKeyboardDismissDisabled={isUsingTemplate}
        hideCloseButton={isUsingTemplate}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-medium">Use Template</h3>
          </ModalHeader>
          <ModalBody className="-mt-3">
            <p>Select a team in which you want to use this template</p>
            <Select
              classNames={{
                base: "-mt-3",
                trigger:
                  "h-16 bg-background dark:bg-dark hover:text-black/80 group-data-[focus=true]:bg-black/80 text-black/80 border border-black/50 dark:border-background dark:text-black",
                label:
                  "group-data-[filled=true]:text-black/80 dark:group-data-[filled=true]:text-background -mt-3 ",
                selectorIcon:
                  "group-hover:text-black dark:group-hover:text-background text-black/80 dark:text-background dark:border-background",
                innerWrapper: "group",
                value: "text-black/80 group-hover:text-black",
                listbox: "dark:text-background",
              }}
              items={teams}
              label="Select a team"
              placeholder="Team not selected"
              labelPlacement="outside"
              selectedKeys={team ? new Set([team]) : new Set()}
              isDisabled={isUsingTemplate}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setTeam(selectedKey);
              }}
              renderValue={(items) => {
                return items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-black/80 group-hover:text-black dark:text-background dark:group-hover:text-background"
                  >
                    <div className="flex flex-col">
                      <span>{item.data.team.name}</span>
                      <span className="text-default-500 text-tiny">
                        ({item.data.team.id})
                      </span>
                    </div>
                  </div>
                ));
              }}
            >
              {(team) => (
                <SelectItem key={team.team.id} textValue={team.team.name}>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col">
                      <span className="text-small">{team.team.name}</span>
                      <span className="text-tiny text-default-400">
                        {team.team.id}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
          </ModalBody>
          <ModalFooter className="-mt-2 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-full rounded-full border border-black/80 p-7 dark:text-background dark:border-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isUsingTemplate}
            >
              Cancel
            </Button>
            <Button
              className="w-full rounded-full p-7 bg-black/80 text-background dark:text-black dark:bg-background"
              onPress={handleUseTemplate}
              isDisabled={isUsingTemplate || !team}
            >
              {isUsingTemplate ? (
                <Loader2 className="animate-spin text-background dark:text-black" />
              ) : (
                "Use"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
