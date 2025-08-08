"use client";
import { useSelector } from "react-redux";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import useInitialize from "@/hooks/useInitialize";

export default function Stats() {
  const router = useRouter();
  const logs = useSelector((state) => state.workflow.logs);
  const workspace = useSelector((state) => state.workflow.workspace);
  const credits = useSelector((state) => state.workflow.credits);
  const plan = useSelector((state) => state.workflow.plan);
  const isStatsInitializing = useSelector(
    (state) => state.workflow.isStatsInitializing
  );

  const { loadStats } = useInitialize();

  return (
    <div className="w-full border border-black/50 dark:border-background bg-black/5 p-4 rounded-lg mt-4 flex flex-col gap-2">
      <div className="flex flex-col">
        <h3 className="font-semibold">Stats</h3>
        <p className="text-xs text-black/60 dark:text-background">
          Check your workflow stats and credit balance
        </p>
      </div>

      <div className="flex items-start gap-6 mt-2 dark:text-background">
        <div className="flex flex-col gap-2">
          <h3 className="text-xs">Executions</h3>
          <p className="text-2xl font-bold text-dark dark:text-background">
            {logs ? logs.length : 0}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-xs">Credits</h3>
          <p className="text-2xl font-bold text-dark dark:text-background">
            {isStatsInitializing ? "..." : credits}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-xs">Plan</h3>
          <p className="text-2xl font-bold text-dark dark:text-background capitalize">
            {isStatsInitializing ? "..." : plan?.plan}
          </p>
        </div>
      </div>

      <div className="flex flex-row-reverse items-center gap-2 mt-4 border-t border-black/50 dark:border-white/50 pt-4">
        <Button
          variant="outline"
          size="md"
          className="bg-black/80 rounded-lg text-background text-xs h-9 dark:bg-background dark:text-black"
          onPress={() => {
            router.push(`/usage/${workspace?.teamId}`);
          }}
        >
          Check Usage
        </Button>
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          isLoading={isStatsInitializing}
          isDisabled={isStatsInitializing}
          className="border border-black/50 dark:border-white/50"
          onPress={() => {
            loadStats(workspace?.teamId);
          }}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
