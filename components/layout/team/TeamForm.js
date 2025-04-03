"use client";

import { Tab, Tabs, Input, Button } from "@heroui/react";
import { Asterisk, Plus, UsersRound } from "lucide-react";
import { useState } from "react";

export default function TeamForm() {
  const [tab, setTab] = useState("create");
  return (
    <>
      <Tabs
        aria-label="Tabs radius"
        radius={"lg"}
        className="mt-5"
        variant="bordered"
        fullWidth
        classNames={{
          tabList: "relative border-1",
          tabContent: "text-black/80 cursor-pointer",
        }}
        selectedKey={tab}
        onSelectionChange={setTab}
      >
        <Tab key="create" title="Create a Team" className="py-6" />
        <Tab key="join" title="Join a Team" className="py-6" />
      </Tabs>

      {tab === "create" && (
        <>
          <p className="mt-5 text-sm">Team Name</p>

          <Input
            type="text"
            placeholder="Enter your team name"
            className="border border-black/40 rounded-xl mt-3 shadow-none"
            size="lg"
            variant="outline"
            startContent={<UsersRound className="text-black/40" />}
            isClearable
          />

          <div className="mt-3 rounded-2xl p-4 border border-black/40">
            <h4 className="font-medium text-black/80 flex items-center">
              Benefits of creating a team
            </h4>
            <ul className="mt-2 text-xs text-black/60 space-y-1">
              <li>• Collaborate with team members on AI agents</li>
              <li>• Share resources and templates</li>
              <li>• Manage permissions and access controls</li>
              <li>• Track team activity and progress</li>
            </ul>
          </div>

          <div className="mt-3 flex w-full gap-2">
            <Button className="w-full rounded-full p-7">Create</Button>
            <Button
              className="w-full rounded-full p-7 border border-black/40 "
              variant="outline"
            >
              Skip
            </Button>
          </div>
        </>
      )}

      {tab === "join" && (
        <>
          <p className="mt-5 text-sm">Invitation Code</p>

          <Input
            type="text"
            placeholder="Enter your invitation code"
            className="border border-black/40 rounded-xl mt-3 shadow-none"
            size="lg"
            variant="outline"
            startContent={<Asterisk className="text-black/40" />}
            isClearable
          />

          <div className="mt-3 rounded-2xl p-4 border border-black/40">
            <p className="text-xs text-black/60">
              Ask your team admin for an invitation code to join their team.
            </p>
          </div>

          <div className="mt-3 flex w-full gap-2">
            <Button className="w-full rounded-full p-7">Join</Button>
            <Button
              className="w-full rounded-full p-7 border border-black/40 "
              variant="outline"
            >
              Skip
            </Button>
          </div>
        </>
      )}
    </>
  );
}
