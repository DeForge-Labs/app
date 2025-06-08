"use client";

import useTeams from "@/hooks/useTeams";
import { Tab, Tabs, Input, Button } from "@heroui/react";
import { Asterisk, Loader2, UsersRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TeamForm() {
  const [tab, setTab] = useState("create");
  const router = useRouter();
  const { createTeam, skipTeam, joinTeam } = useTeams();
  const [name, setName] = useState("");
  const [invitationCode, setInvitationCode] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateTeam = async (name) => {
    try {
      setIsCreating(true);

      if (!name) {
        toast("Please enter a team name");
        setIsCreating(false);
        return;
      }

      const response = await createTeam(name);
      if (response.success) {
        toast.success("Team created successfully");
        router.push("/team");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSkipTeam = async () => {
    try {
      setIsSkipping(true);

      const response = await skipTeam();

      if (response) {
        router.push("/team");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to skip team");
    } finally {
      setIsSkipping(false);
    }
  };

  const handleJoinTeam = async (invitationCode) => {
    try {
      setIsJoining(true);

      const response = await joinTeam(invitationCode);

      if (response) {
        router.push("/team");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to join team");
    } finally {
      setIsJoining(false);
    }
  };

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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            <Button
              className="w-full rounded-full p-7"
              onPress={() => handleCreateTeam(name)}
              isDisabled={isCreating || isSkipping}
            >
              {isCreating ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
            <Button
              className="w-full rounded-full p-7 border border-black/40 "
              variant="outline"
              isDisabled={isCreating || isSkipping}
              onPress={handleSkipTeam}
            >
              {isSkipping ? <Loader2 className="animate-spin" /> : "Skip"}
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
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
          />

          <div className="mt-3 rounded-2xl p-4 border border-black/40">
            <p className="text-xs text-black/60">
              Ask your team admin for an invitation code to join their team.
            </p>
          </div>

          <div className="mt-3 flex w-full gap-2">
            <Button
              className="w-full rounded-full p-7"
              onPress={() => handleJoinTeam(invitationCode)}
              isDisabled={isJoining || isSkipping}
            >
              {isJoining ? <Loader2 className="animate-spin" /> : "Join"}
            </Button>
            <Button
              className="w-full rounded-full p-7 border border-black/40 "
              variant="outline"
              onPress={handleSkipTeam}
              isDisabled={isJoining || isSkipping}
            >
              {isSkipping ? <Loader2 className="animate-spin" /> : "Skip"}
            </Button>
          </div>
        </>
      )}
    </>
  );
}
