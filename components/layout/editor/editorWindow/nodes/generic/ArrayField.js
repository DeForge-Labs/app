"use client";

import { Handle, Position } from "reactflow";
import getColorByType from "@/lib/color-profile";
import { useTheme } from "next-themes";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Badge } from "@/components/ui/badge";

export default function ArrayField({
  field,
  matchingInput,
  totalValidConnections,
  isArrayInput,
  isSameNode,
}) {
  const { selectedHandle } = useWorkspaceStore();
  const { resolvedTheme } = useTheme();

  return (
    <div key={field.name} className="mb-2">
      <div className="text-[10px] text-foreground/80 font-medium mb-1 flex justify-between items-center capitalize">
        <span>{field.name}</span>
        <div className="text-[10px]">
          {totalValidConnections} connection
          {totalValidConnections !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="flex items-center">
        <div className="relative">
          <Handle
            type="target"
            position={Position.Left}
            id={`input-${field.name}-${field.type}`}
            style={{
              zIndex: 10,
              border: "none",
              left: "-15.3px",
              backgroundColor: "transparent",
            }}
          />

          <div
            className={`w-2 h-2 -left-[16.5px] -top-[4.2px] rounded-full rotate-45 absolute border-opacity-50 ${
              selectedHandle?.split("-")[0] === "output" &&
              selectedHandle?.split("-")[2]?.toLowerCase() ===
                (isArrayInput
                  ? matchingInput?.type.split("[]")[0].toLowerCase()
                  : matchingInput?.type.toLowerCase() || "any") &&
              !isSameNode
                ? "animate-ping"
                : ""
            }`}
            style={{
              backgroundColor: getColorByType(
                isArrayInput
                  ? matchingInput?.type.split("[]")[0].toLowerCase()
                  : matchingInput?.type.toLowerCase()
              ),
              borderColor: resolvedTheme === "dark" ? "white" : "black",
              borderWidth: "1px",
            }}
          ></div>

          {selectedHandle?.split("-")[0] === "output" &&
            selectedHandle?.split("-")[2]?.toLowerCase() ===
              (isArrayInput
                ? matchingInput?.type.split("[]")[0].toLowerCase()
                : matchingInput?.type.toLowerCase() || "any") &&
            !isSameNode && (
              <div
                className={`w-2 h-2 -left-[16.2px] -top-[4.2px] rounded-full rotate-45 absolute border-opacity-50 `}
                style={{
                  backgroundColor: getColorByType(
                    isArrayInput
                      ? matchingInput?.type.split("[]")[0].toLowerCase()
                      : matchingInput?.type.toLowerCase()
                  ),
                  borderColor: resolvedTheme === "dark" ? "white" : "black",
                  borderWidth: "1px",
                }}
              ></div>
            )}
        </div>
        <Badge
          variant="outline"
          className="text-[10px] p-1 px-2 bg-foreground/5 border border-foreground/5 w-full text-foreground/70 capitalize"
        >
          <div className="flex justify-between items-center text-wrap">
            <span className="font-medium text-[10px]">
              Array input - accepts multiple connections
            </span>
          </div>
          {totalValidConnections > 0 && (
            <div className="mt-1 pt-1 border-t border-black/50 text-[10px] text-muted-foreground dark:border-background dark:text-background">
              {totalValidConnections} connection
              {totalValidConnections !== 1 ? "s" : ""} active
            </div>
          )}
        </Badge>
      </div>
    </div>
  );
}
