"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { nodeRegistry } from "@/lib/node-registry";
import { Input } from "@heroui/react";
import { Badge } from "@/components/ui/badge";

export default function NodeMenu() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNodes = nodeRegistry.filter((node) => {
    const matchesSearch =
      node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesSearch;
  });

  const onDragStart = (event, nodeType) => {
    // Store the full node type data as JSON
    event.dataTransfer.setData("application/reactflow", nodeType.type);

    // Also store the full node definition for use when creating the node
    event.dataTransfer.setData(
      "application/node-definition",
      JSON.stringify(nodeType)
    );

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="space-y-4 absolute p-4 w-full">
      <h2 className="font-semibold text-xl">Node Library</h2>
      <Input
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 border border-black/50 rounded-lg w-full"
        variant="outline"
      />

      <div className="space-y-2">
        {filteredNodes.map((node) => (
          <Card
            key={node.type}
            className="cursor-grab hover:bg-background border border-black/50"
            draggable
            onDragStart={(e) => onDragStart(e, node)}
          >
            <CardHeader className="p-3">
              <CardTitle className="flex items-center text-sm">
                {node.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-xs text-muted-foreground mb-2">{node.desc}</p>
              <div className="flex flex-wrap gap-1">
                {node.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="text-xs border-black/50 border bg-transparent text-black hover:bg-black/5"
                  >
                    {tag}
                  </Badge>
                ))}
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor:
                      node.diff === "easy"
                        ? "#C8E6C9"
                        : node.diff === "medium"
                        ? "#FDD8AE"
                        : "#FBC2C4",
                    color:
                      node.diff === "easy"
                        ? "#1B5E20"
                        : node.diff === "medium"
                        ? "#855C00"
                        : "#855C00",
                  }}
                >
                  {node.diff}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
