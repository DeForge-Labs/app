"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import {
  Loader2,
  TriangleAlert,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function NodeMenu() {
  const nodeRegistry = useSelector((state) => state.library.nodeRegistry) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());
  const isNodeRegistryInitializing = useSelector(
    (state) => state.library.isNodeRegistryInitializing
  );

  const filteredNodes = nodeRegistry.filter((node) => {
    const matchesSearch =
      node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesSearch;
  });

  // Group nodes by category
  const categorizedNodes = filteredNodes.reduce((acc, node) => {
    const category = node.category || "uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(node);
    return acc;
  }, {});

  // Sort categories for consistent display
  const sortedCategories = Object.keys(categorizedNodes).sort();

  const toggleCategory = (category) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const onDragStart = (event, nodeType) => {
    // Store the full node type data as JSON
    event.dataTransfer.setData("application/reactflow", nodeType.type);

    // Also store the full node definition for use when creating the node
    event.dataTransfer.setData(
      "application/node-definition",
      JSON.stringify(nodeType)
    );

    event.dataTransfer.setData("application/node-category", nodeType.category);

    event.dataTransfer.effectAllowed = "move";
  };

  const getCategoryDisplayName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="flex flex-col gap-4 absolute p-4 w-full">
      <h2 className="font-semibold text-xl">Node Library</h2>
      <Input
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className=" border border-black/50 rounded-lg w-full"
        variant="outline"
        isClearable
        onClear={() => setSearchTerm("")}
      />

      <div className="space-y-2">
        {sortedCategories.map((category) => {
          const isCollapsed = collapsedCategories.has(category);
          const categoryNodes = categorizedNodes[category];

          return (
            <div key={category} className={`rounded-lg -mt-2`}>
              {/* Category Header */}
              <div
                className="flex items-center justify-between p-3 mb-2 px-0 cursor-pointer hover:bg-black/5 rounded-lg"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center space-x-2 px-2">
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <h3 className="font-medium text-sm">
                    {getCategoryDisplayName(category)}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-black/10 text-black border-none hover:bg-black/5"
                  >
                    {categoryNodes.length}
                  </Badge>
                </div>
              </div>

              {/* Category Content */}
              {!isCollapsed && (
                <div className=" space-y-2">
                  {categoryNodes.map((node) => (
                    <Card
                      key={node.type}
                      className="cursor-grab bg-background border border-black/50 hover:shadow-md"
                      draggable
                      onDragStart={(e) => onDragStart(e, node)}
                    >
                      <CardHeader className="p-3">
                        <CardTitle className="flex items-center text-sm">
                          {node.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <p className="text-xs text-muted-foreground mb-2">
                          {node.desc}
                        </p>
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
              )}
            </div>
          );
        })}

        {isNodeRegistryInitializing && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="h-5 w-5 text-black animate-spin" />
          </div>
        )}

        {filteredNodes.length === 0 && !isNodeRegistryInitializing && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-black/10 p-4 mb-4">
              <TriangleAlert className="h-5 w-5 text-black" />
            </div>
            <h3 className="text-sm font-medium">No nodes found</h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-md mb-2">
              No nodes match your search criteria.
            </p>

            <Button
              variant="outline"
              size="md"
              className="bg-black/80 rounded-lg text-background text-xs"
              onPress={() => {
                setSearchTerm("");
              }}
            >
              <X size={16} />
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
