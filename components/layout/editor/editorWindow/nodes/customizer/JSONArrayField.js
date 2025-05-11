"use client";

import { Button } from "@heroui/react";
import { Link2Off } from "lucide-react";

export default function JSONArrayField({
  field,
  totalValidConnections,
  totalConnectedInputs,
  handleDisconnectAll,
  handleDisconnectExact,
}) {
  return (
    <div key={field.name} className="space-y-2">
      <div className="flex flex-col">
        <div className="text-sm font-medium capitalize">
          {field.name}
          <span className="ml-2 text-xs text-black/50">(Array Input)</span>
        </div>
        {totalValidConnections.length > 0 && (
          <div className="flex items-center justify-between mt-2 mb-1">
            <div className="text-sm">
              {totalValidConnections.length} connection
              {totalValidConnections.length !== 1 ? "s" : ""}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs bg-black/80 text-background"
              onPress={() => handleDisconnectAll(field.name)}
            >
              <Link2Off className="h-3 w-3 mr-1" />
              Disconnect All
            </Button>
          </div>
        )}
      </div>
      <div className="border rounded-md p-3 bg-black/5 border-black/50 text-xs">
        <p className="">
          This is an array input that accepts multiple connections.
        </p>
        {totalValidConnections.length > 0 ? (
          <div className="mt-2 space-y-1">
            {totalConnectedInputs.map((edgeId, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center text-xs"
                >
                  <span>Connection {index + 1}</span>
                  <Button
                    variant="icon"
                    size="icon"
                    className="h-5 w-5 p-0 bg-black/80 text-background rounded-md"
                    onPress={() => handleDisconnectExact(edgeId.edgeId)}
                  >
                    <Link2Off className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-xs">No connections yet.</p>
        )}
      </div>

      <div className="text-[10px]">{field.desc}</div>
    </div>
  );
}
