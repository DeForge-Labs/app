"use client";

import { Loader2, Play, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapFieldEditor from "../editorWindow/MapFieldEditor";
import { useState } from "react";
import useWorkflowStore from "@/store/useWorkspaceStore";
import { toast } from "sonner";

export default function CustomAPIActions() {
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState([]);
  const [query, setQuery] = useState([]);

  const { nodes, workflow, setIsRunning, isRunning } = useWorkflowStore();

  const apiTriggerNode = nodes?.find((node) => node?.type === "api_trigger");
  const requestType = apiTriggerNode?.data?.method;

  const rawUrl = process.env.NEXT_PUBLIC_API_URL.slice(0, -4);

  const handleApiCall = async () => {
    setIsRunning(true);
    try {
      const rawHeaders = {};

      Object.entries(headers).forEach(([key, value]) => {
        rawHeaders[key] = value;
      });

      if (
        requestType === "POST" &&
        rawHeaders["Content-Type"] !== "application/json"
      ) {
        rawHeaders["Content-Type"] = "application/json";
      }

      const response = await fetch(
        workflow?.status === "TEST"
          ? `${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${
              workflow?.id
            }?${new URLSearchParams(query).toString()}`
          : `${rawUrl}/live/${workflow?.id}?${new URLSearchParams(
              query
            ).toString()}`,
        requestType === "GET"
          ? {
              method: requestType,
              headers: rawHeaders,
            }
          : {
              method: requestType,
              headers: rawHeaders,
              body: JSON.stringify(body),
            }
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Request sent successfully");
      } else {
        console.log(data);
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center gap-1 justify-between">
        <p className="text-[10px] text-foreground/50 flex items-center gap-1">
          <Waypoints className="size-3" /> Actions
        </p>
        <p className="font-medium text-foreground/80 text-[10px] bg-yellow-100 dark:bg-yellow-800 border border-foreground/15 p-1 py-0 rounded-sm">
          {requestType}
        </p>
      </div>

      <Button
        className="text-xs w-full border gap-1.5 border-foreground/15 rounded-sm px-2 [&_svg:not([class*='size-'])]:size-3"
        onClick={handleApiCall}
        disabled={isRunning}
      >
        {isRunning ? <Loader2 className="size-3 animate-spin" /> : <Play />} Run
      </Button>

      <div className="flex flex-col gap-2">
        <p className="flex gap-1 items-center text-[10px] text-foreground/50">
          Headers
        </p>

        <MapFieldEditor value={headers} onChange={setHeaders} />
      </div>

      {requestType !== "GET" && (
        <div className="flex flex-col gap-2">
          <p className="flex gap-1 items-center text-[10px] text-foreground/50">
            {requestType === "POST" ? "Body" : "Params"}
          </p>

          <MapFieldEditor value={body} onChange={setBody} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="flex gap-1 items-center text-[10px] text-foreground/50">
          Query
        </p>

        <MapFieldEditor value={query} onChange={setQuery} />
      </div>
    </div>
  );
}
