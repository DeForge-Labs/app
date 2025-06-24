"use client";

import { Handle, Position } from "reactflow";
import getColorByType from "@/lib/color-profile";
import { useSelector } from "react-redux";

export default function ArrayField({
  field,
  matchingInput,
  totalValidConnections,
  isArrayInput,
  isSameNode,
}) {
  const selectedHandle = useSelector((state) => state.workflow?.selectedHandle);

  return (
    <div key={field.name} className="mb-2">
      <div className="text-xs font-medium mb-1 flex justify-between items-center capitalize">
        <span>{field.name}</span>
        <div className="text-xs">
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
              borderColor: "black",
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
                className={`w-2 h-2 -left-[16.5px] -top-[4.2px] rounded-full rotate-45 absolute border-opacity-50 `}
                style={{
                  backgroundColor: getColorByType(
                    isArrayInput
                      ? matchingInput?.type.split("[]")[0].toLowerCase()
                      : matchingInput?.type.toLowerCase()
                  ),
                  borderColor: "black",
                  borderWidth: "1px",
                }}
              ></div>
            )}
        </div>
        <div className="w-full border border-black/50 rounded-md p-2 bg-black/5 text-xs mt-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">
              Array input - accepts multiple connections
            </span>
          </div>
          {totalValidConnections > 0 && (
            <div className="mt-1 pt-1 border-t border-black/50 text-xs text-muted-foreground">
              {totalValidConnections} connection
              {totalValidConnections !== 1 ? "s" : ""} active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
