"use client";

import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";

import DeployButton from "../toolPanel/DeployButton";
import FallbackButton from "../toolPanel/FallbackButton";
import { Input, Button } from "@heroui/react";
import { Copy, Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
import MapFieldEditor from "../MapFieldEditor";
import { useState } from "react";

export default function ApiTriggerDeployment() {
  const workflow = useSelector((state) => state.workflow.workflow);
  const nodes = useSelector((state) => state.workflow.nodes);

  const apiTriggerNode = nodes?.find((node) => node?.type === "api_trigger");
  const requestType = apiTriggerNode?.data?.method;

  const rawUrl = process.env.NEXT_PUBLIC_API_URL.slice(0, -4);

  const [headers, setHeaders] = useState({});
  const [body, setBody] = useState({});
  const [query, setQuery] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async () => {
    setIsLoading(true);
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
        {
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
      setIsLoading(false);
    }
  };

  return (
    <>
      {" "}
      <div className="w-full border border-black/50 dark:border-background bg-black/5 p-4 rounded-lg mt-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">Test Environment</h3>
            <p className="text-xs text-black/60 dark:text-background">
              Test your workflow on the test environment for Validation
            </p>
          </div>

          {workflow?.status === "TEST" ? (
            <Badge
              className="text-xs h-fit"
              style={{
                backgroundColor: "#C8E6C9",
                color: "#1B5E20",
              }}
            >
              Active
            </Badge>
          ) : (
            <Badge
              className="text-xs h-fit"
              style={{
                backgroundColor: "#FBC2C4",
                color: "#855C00",
              }}
            >
              Inactive
            </Badge>
          )}
        </div>

        {workflow?.status === "LIVE" && (
          <FallbackButton
            className="h-full p-2 border-2 flex-1 bg-red-500 text-background border-black/50 rounded-lg gap-2 text-sm dark:border-background dark:text-background mt-1"
            showTooltip={false}
          />
        )}
      </div>
      <div className="w-full border border-black/50 bg-black/5 p-4 rounded-lg mt-4 flex flex-col gap-2 dark:border-background dark:text-background">
        <div className="flex justify-between dark:text-background">
          <div className="">
            <h3 className="font-semibold">Production Environment</h3>
            <p className="text-xs text-black/60 dark:text-background">
              Deploy your workflow on the production environment for live use
            </p>
          </div>

          {workflow?.status === "LIVE" ? (
            <Badge
              className="text-xs h-fit"
              style={{
                backgroundColor: "#C8E6C9",
                color: "#1B5E20",
              }}
            >
              Active
            </Badge>
          ) : (
            <Badge
              className="text-xs h-fit"
              style={{
                backgroundColor: "#FBC2C4",
                color: "#855C00",
              }}
            >
              Inactive
            </Badge>
          )}
        </div>

        {workflow?.status !== "LIVE" && (
          <div className="flex items-center w-full gap-2 mt-2">
            <DeployButton
              className="h-full p-2 border-2 flex-1  bg-red-500 text-background border-black/50 rounded-lg gap-2 text-sm dark:border-background dark:text-background"
              showTooltip={false}
            />
          </div>
        )}
      </div>
      <h1 className="font-semibold text-xl mt-4">Test Endpoint URL</h1>
      <div className="w-full border border-black/50 bg-black/5 p-4 rounded-lg mt-4 flex flex-col gap-2 dark:border-background dark:text-background">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">Send Request</h3>
            <p className="text-xs text-black/60 dark:text-background">
              Test or run your API trigger through the endpoint URL
            </p>
          </div>

          <Badge
            className="text-xs h-fit"
            style={{
              backgroundColor: "#C8E6C9",
              color: "#1B5E20",
            }}
          >
            {requestType}
          </Badge>
        </div>

        <div className="text-sm font-medium">Endpoint URL</div>
        <div className="flex items-center gap-2 justify-between h-[40px]">
          <Input
            placeholder="Endpoint URL"
            className="w-full border border-black/50 rounded-md dark:border-background"
            variant="outline"
            value={
              workflow?.status === "TEST"
                ? `${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${workflow?.id}`
                : `${rawUrl}/live/${workflow?.id}`
            }
            onChange={(e) => {}}
          />
          <Button
            className="h-full p-2 bg-black/80 text-background rounded-md w-[40px] dark:bg-background dark:text-black"
            variant="icon"
            size="icon"
            onPress={() => {
              navigator.clipboard.writeText(
                `${
                  workflow?.status === "TEST"
                    ? `${process.env.NEXT_PUBLIC_API_URL}/workflow/test/${workflow?.id}`
                    : `${rawUrl}/live/${workflow?.id}`
                }`
              );
              toast("Endpoint URL copied to clipboard");
            }}
          >
            <Copy size={16} />
          </Button>
          <Button
            className="h-full p-2 w-28 text-sm gap-1 bg-black/80 text-background rounded-md dark:bg-background dark:text-black"
            variant="icon"
            size="icon"
            onPress={() => {
              handleApiCall();
            }}
            isDisabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Play size={16} /> Send
              </>
            )}
          </Button>
        </div>

        <div className="text-sm font-medium">Headers</div>
        <MapFieldEditor value={headers} onChange={setHeaders} />

        <div className="text-sm font-medium">Body</div>
        <MapFieldEditor value={body} onChange={setBody} />

        <div className="text-sm font-medium">Query</div>
        <MapFieldEditor value={query} onChange={setQuery} />
      </div>
    </>
  );
}
