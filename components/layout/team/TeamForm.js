"use client";

import useTeams from "@/hooks/useTeams";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function TeamForm() {
  const [tab, setTab] = useState("create");
  const router = useRouter();
  const { createTeam, joinTeam } = useTeams();
  const [name, setName] = useState("");
  const [invitationCode, setInvitationCode] = useState("");

  const [isCreating, setIsCreating] = useState(false);
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
        router.push("/teams");
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

  const handleJoinTeam = async (invitationCode) => {
    try {
      setIsJoining(true);

      const response = await joinTeam(invitationCode);

      if (response) {
        router.push("/teams");
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
    <div className="flex flex-col rounded-lg mt-5 border border-black/10 shadow-md bg-background dark:bg-foreground/5 dark:border-white/10">
      <div className="flex w-full">
        <Button
          className={cn(
            "flex-1 h-11 text-xs border-black/10 before:rounded-b-none dark:before:rounded-tl-lg border-t-0 before:rounded-t-none dark:border-white/10 border-l-0 rounded-tr-none rounded-b-none dark:bg-transparent text-foreground/60 shadow-none",
            tab === "create" && "border-b-0 border-r-0"
          )}
          variant="outline"
          onClick={() => {
            setTab("create");
          }}
          disabled={tab === "create"}
        >
          Create
        </Button>

        <Button
          className={cn(
            "flex-1 h-11 text-xs border-black/10 before:rounded-b-none dark:before:rounded-tr-lg before:rounded-t-none dark:border-white/10 border-r-0 rounded-tl-none rounded-b-none dark:bg-transparent dark:border-t-0 text-foreground/60 shadow-none",
            tab === "join" && "border-b-0 border-l-0"
          )}
          variant="outline"
          onClick={() => {
            setTab("join");
          }}
          disabled={tab === "join"}
        >
          Join
        </Button>
      </div>

      {tab === "create" && (
        <>
          <p className="mt-3 text-xs dark:text-foreground px-4 ">Team Name</p>

          <Input
            type="text"
            placeholder="Enter your team name"
            className="border border-black/10 py-1 before:rounded-sm mt-3 shadow-none dark:border-foreground dark:text-foreground px-1 w-[91%]  mx-auto rounded-sm "
            variant="outline"
            value={name}
            onChange={(e) => {
              if (e.target.value.length > 20) {
                return;
              }
              setName(e.target.value);
            }}
          />

          <div className="mt-2 rounded-2xl px-4">
            <h4 className="text-sm text-black/80 flex items-center dark:text-foreground">
              Benefits of creating a team
            </h4>
            <ul className="mt-2 text-xs text-black/60 space-y-1 dark:text-foreground">
              <li>• Collaborate with team members on AI agents</li>
              <li>• Share resources and templates</li>
              <li>• Manage permissions and access controls</li>
            </ul>
          </div>

          <div className="mt-3 flex w-full">
            <Button
              className="flex-1 h-11 text-xs border-black/10 before:rounded-t-none dark:bg-transparent dark:border-white/10 border-l-0 border-b-0 rounded-br-none rounded-t-none text-destructive"
              variant="outline"
              disabled={isCreating}
              onClick={() => router.push("/teams")}
            >
              Back
            </Button>
            <Button
              className="flex-1 h-11 text-xs border-black/10 before:rounded-t-none dark:bg-transparent dark:border-white/10 border-x-0 border-b-0 rounded-bl-none rounded-t-none text-info"
              variant="outline"
              onClick={() => handleCreateTeam(name)}
              disabled={isCreating || !name}
            >
              {isCreating ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </div>
        </>
      )}

      {tab === "join" && (
        <>
          <p className="mt-3 text-xs dark:text-foreground px-4">
            Invitation Code
          </p>

          <Input
            type="text"
            placeholder="Enter your invitation code"
            className="border border-black/10 py-1 before:rounded-sm mt-3 shadow-none dark:border-foreground dark:text-foreground px-1 w-[91%]  mx-auto rounded-sm"
            size="lg"
            variant="outline"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
          />

          <div className="mt-2 rounded-2xl px-4">
            <p className="text-xs text-black/60 dark:text-foreground">
              Ask your team admin for an invitation code to join their team.
            </p>
          </div>

          <div className="mt-3 flex w-full">
            <Button
              className="flex-1 h-11 text-xs border-black/10 before:rounded-t-none dark:bg-transparent dark:border-white/10 border-l-0 border-b-0 rounded-br-none rounded-t-none text-destructive"
              variant="outline"
              onClick={() => {
                router.push("/teams");
              }}
              disabled={isJoining}
            >
              Back
            </Button>
            <Button
              className="flex-1 h-11 text-xs border-black/10 before:rounded-t-none dark:bg-transparent dark:border-white/10 border-x-0 border-b-0 rounded-bl-none rounded-t-none text-info"
              onClick={() => handleJoinTeam(invitationCode)}
              variant={"outline"}
              disabled={isJoining || !invitationCode}
            >
              {isJoining ? <Loader2 className="animate-spin" /> : "Join"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
