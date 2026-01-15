"use client";

import { Link2Off } from "lucide-react";
import DisconnectButton from "./common/DisconnectButton";
import TypeBadge from "./common/TypeBadge";
import { Button } from "@/components/ui/button";

export default function ArrayField({
  field,
  totalValidConnections,
  handleDisconnectAll,
  handleDisconnectExact,
}) {
  return (
    <div key={field.name} className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium text-foreground/80 capitalize flex items-center gap-1">
          {field.name}
          <TypeBadge type={field.type.split("[]")[0]} />
        </div>
        {totalValidConnections.length > 0 && (
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs mb-0.5 text-foreground/60">
              {totalValidConnections.length} connection
              {totalValidConnections.length !== 1 ? "s" : ""}
            </div>

            <DisconnectButton
              handleDisconnect={handleDisconnectAll}
              input={field}
            />
          </div>
        )}
      </div>
      <div className="border rounded-md p-3 bg-black/5 border-foreground/15 text-xs">
        <p className="">
          This is an array input that accepts multiple connections.
        </p>
        {totalValidConnections.length > 0 ? (
          <div className="mt-2 flex flex-col gap-2">
            {totalValidConnections.map((connection, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center text-[10px] line-clamp-2"
                >
                  <span>
                    Connection from: <br />{" "}
                    {connection.source.length > 30
                      ? connection.source.slice(0, 30) + "..."
                      : connection.source}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-xs [&_svg:not([class*='size-'])]:size-3 p-0 size-6 rounded-sm bg-foreground/5 border border-foreground/15 h-5 w-6"
                    onClick={() => handleDisconnectExact(connection.id)}
                  >
                    <Link2Off className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-[10ox] text-foreground/80">
            No connections yet.
          </p>
        )}
      </div>

      <div className="text-[10px] text-foreground/60">{field.desc}</div>
    </div>
  );
}
