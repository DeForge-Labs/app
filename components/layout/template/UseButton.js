"use client";

import useCloneTemplate from "@/hooks/useCloneTemplate";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function UseButton() {
  const { isOpen, setIsOpen, handleCloneTemplate, isCloningTemplate } =
    useCloneTemplate();
  const teams = useSelector((state) => state.template.teams);
  const [team, setTeam] = useState((teams && teams[0]?.team.id) || null);
  return (
    <>
      <Button
        className="bg-black/80 h-12 rounded-full text-xs text-background dark:bg-white/80 dark:text-black p-5 px-10 w-36 z-10"
        onPress={() => setIsOpen(true)}
      >
        Use Agent
      </Button>

      <Modal
        isOpen={isOpen}
        className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isCloningTemplate}
        isKeyboardDismissDisabled={isCloningTemplate}
        hideCloseButton={isCloningTemplate}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium dark:text-background">
              Use Template
            </h3>
          </ModalHeader>
          <ModalBody className="-mt-3 dark:text-background">
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
              isDisabled={isCloningTemplate}
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
          <ModalFooter className="-mt-1 flex w-full gap-2">
            <Button
              variant="outline"
              className="w-fit rounded-lg border border-black/80 p-4 dark:border-background dark:text-background"
              onPress={() => setIsOpen(false)}
              isDisabled={isCloningTemplate}
            >
              Cancel
            </Button>
            <Button
              className="w-fit rounded-lg p-4 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => handleCloneTemplate(team)}
              isDisabled={isCloningTemplate}
            >
              {isCloningTemplate ? (
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
