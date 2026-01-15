"use client";

import { Handle, Position } from "reactflow";
import getColorByType from "@/lib/color-profile";
import { useTheme } from "next-themes";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Badge } from "@/components/ui/badge";

export default function StandaloneField({
  input,
  categoryColor,
  connectedInputs,
  isSameNode,
}) {
  const isConnected = connectedInputs.has(input.name);
  const { selectedHandle } = useWorkspaceStore();
  const { resolvedTheme } = useTheme();

  return (
    <div key={input.name} className="mb-2 relative">
      <div className="text-[10px] font-medium text-foreground/80 mb-1">
        {input.name}
      </div>
      <div className="flex items-center">
        <div className="relative">
          <Handle
            type="target"
            position={Position.Left}
            id={`input-${input.name}-${input.type}`}
            data-type={input.type}
            style={{
              zIndex: 10,
              border: "none",
              left: "-15.3px",
              top: "-8px",
              backgroundColor: "transparent",
            }}
          />

          <div
            className={`w-2 h-2 -left-[16.2px] -top-[12.2px] rounded-full rotate-45 absolute border-opacity-50 ${
              selectedHandle?.split("-")[0] === "output" &&
              selectedHandle?.split("-")[2]?.toLowerCase() ===
                (input?.type.toLowerCase() || "any") &&
              !isConnected &&
              !isSameNode
                ? "animate-ping"
                : ""
            }`}
            style={{
              backgroundColor: getColorByType(input.type.toLowerCase()),
              borderColor: resolvedTheme === "dark" ? "white" : "black",
              borderWidth: "1px",
            }}
          ></div>

          {selectedHandle?.split("-")[0] === "output" &&
            selectedHandle?.split("-")[2]?.toLowerCase() ===
              (input?.type.toLowerCase() || "any") &&
            !isConnected &&
            !isSameNode && (
              <div
                className={`w-2 h-2 -left-[16.2px] -top-[12.2px] rounded-full rotate-45 absolute border-opacity-50 `}
                style={{
                  backgroundColor: getColorByType(input?.type.toLowerCase()),
                  borderColor: resolvedTheme === "dark" ? "white" : "black",
                  borderWidth: "1px",
                }}
              ></div>
            )}
        </div>
        <Badge
          variant="outline"
          className="text-[10px] px-2 py-1 bg-foreground/5 w-full flex justify-between items-center border border-foreground/5 text-foreground/70 capitalize"
        >
          <span>{isConnected ? "Connected" : "Not connected"}</span>
          <span className="text-[10px]">{input.type}</span>
        </Badge>
      </div>
    </div>
  );
}
