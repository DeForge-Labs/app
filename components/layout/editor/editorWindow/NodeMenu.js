"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  TriangleAlert,
  X,
  ChevronLeft,
  ChevronRight,
  SquareMousePointer,
  Search,
  Plus,
} from "lucide-react";
import useNodeLibraryStore from "@/store/useNodeLibraryStore";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import NodeLoader from "./NodeLoader";

export default function NodeMenu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true);

  const { nodeRegistry, isLoading: isNodeRegistryInitializing } =
    useNodeLibraryStore();

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

  const openCategory = (category) => {
    setSelectedCategory(category);
  };

  const closeCategory = () => {
    setSelectedCategory(null);
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType.type);
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

  // When searching, show all categories expanded with filtered nodes
  const isSearching = searchTerm.length > 0;

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--foreground) / 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--foreground) / 0.3);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--foreground) / 0.2) transparent;
        }
      `}</style>
      <AnimatePresence mode="wait">
        {isMinimized ? (
          // Minimized Plus Button
          <motion.button
            key="minimized"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsMinimized(false)}
            className="w-12 h-12 rounded-lg relative z-20 bg-background hover:bg-foreground/5 border border-foreground/15 flex items-center justify-center cursor-pointer transition-colors shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="size-5" />
          </motion.button>
        ) : (
          // Full Node Library
          <motion.div
            key="expanded"
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              scale: { duration: 0.2 },
              opacity: { duration: 0.2 },
              layout: { duration: 0.3, ease: "easeInOut" },
            }}
            className="flex flex-col w-80 relative z-20 bg-card border border-foreground/15 rounded-lg overflow-hidden max-h-full"
          >
            {/* Header */}
            <motion.div
              layout="position"
              className="flex gap-2 text-sm border-b border-foreground/15 p-4 relative z-20 shrink-0"
            >
              <div
                className="absolute right-2 top-2 z-20 p-1 hover:bg-foreground/5 rounded-sm cursor-pointer"
                onClick={() => setIsMinimized(true)}
              >
                <X className="size-3" />
              </div>
              <SquareMousePointer className="size-4 mt-1" />
              <div className="flex flex-col">
                <p>Node Library</p>
                <p className="text-xs text-muted-foreground">
                  Drag and drop nodes to create your workflow
                </p>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              layout="position"
              className="flex items-center justify-between px-4 py-2 border-b border-foreground/15 gap-2 z-20 shrink-0"
            >
              <Search className="w-4 h-4 opacity-50" />
              <Input
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-0 border-0 shadow-none has-focus-visible:border-ring has-focus-visible:ring-[0px] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none ring-0 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
              />
              {searchTerm && (
                <X
                  className="w-4 h-4 opacity-50 cursor-pointer hover:opacity-100"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </motion.div>

            {/* Content Area */}
            <motion.div
              layout="position"
              className="flex flex-col overflow-hidden relative z-20 flex-1 min-h-0"
            >
              {isNodeRegistryInitializing ? (
                <NodeLoader />
              ) : filteredNodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="rounded-full bg-foreground/10 p-4 mb-4">
                    <TriangleAlert className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium">No nodes found</h3>
                  <p className="text-xs text-muted-foreground mt-2 max-w-md">
                    No nodes match your search criteria.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 px-4 py-2 text-xs bg-foreground/10 hover:bg-foreground/20 rounded-md transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {isSearching ? (
                    // Search Results View - Show all matching nodes grouped by category
                    <motion.div
                      key="search-view"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-y-auto p-4 space-y-4 custom-scrollbar flex-1 min-h-0"
                    >
                      {sortedCategories.map((category) => (
                        <motion.div key={category} layout>
                          {/* Category Header */}
                          <div className="flex items-center gap-2 mb-2 relative">
                            <div className="w-3 border-foreground/15 border-t-2 border-l-2 rounded-tl-sm h-3 absolute top-1.5 left-0.5"></div>
                            <h3 className="text-xs font-normal ml-5">
                              {getCategoryDisplayName(category)}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1 py-0 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
                            >
                              {categorizedNodes[category].length}
                            </Badge>
                          </div>

                          {/* Category Nodes */}
                          <div className="grid grid-cols-1 gap-2">
                            {categorizedNodes[category].map((node, index) => (
                              <motion.div
                                key={node.type}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  duration: 0.12,
                                  delay: index * 0.02,
                                }}
                              >
                                <Card
                                  className="cursor-grab hover:shadow-md bg-background transition-shadow rounded-md border-foreground/10 p-0 py-3 gap-0"
                                  draggable
                                  onDragStart={(e) => onDragStart(e, node)}
                                >
                                  <CardHeader className="p-0 px-3">
                                    <CardTitle className="text-xs font-medium">
                                      {node.title}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="px-3">
                                    <p className="text-[10px] text-muted-foreground mb-2">
                                      {node.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {node.tags.map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="outline"
                                          className="text-[10px] px-1 py-0 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                      {node.diff && (
                                        <Badge
                                          className="text-[10px] px-1 py-0 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
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
                                                : "#C62828",
                                          }}
                                        >
                                          {node.diff}
                                        </Badge>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : selectedCategory ? (
                    // Category Detail View with Back Button
                    <motion.div
                      key="category-detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col flex-1 min-h-0"
                    >
                      {/* Back Button Header */}
                      <motion.div
                        layout="position"
                        className="flex items-center gap-2 p-4 border-b border-foreground/15 shrink-0"
                      >
                        <button
                          onClick={closeCategory}
                          className="p-1 hover:bg-foreground/10 rounded-sm transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="size-3" />
                        </button>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-medium">
                            {getCategoryDisplayName(selectedCategory)}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
                          >
                            {categorizedNodes[selectedCategory]?.length || 0}
                          </Badge>
                        </div>
                      </motion.div>

                      {/* Category Nodes */}
                      <div className="overflow-y-auto p-4 custom-scrollbar flex-1 min-h-0">
                        <div className="grid grid-cols-1 gap-2">
                          {categorizedNodes[selectedCategory]?.map(
                            (node, index) => (
                              <motion.div key={node.type}>
                                <Card
                                  className="cursor-grab hover:shadow-md bg-background transition-shadow rounded-md border-foreground/10 p-0 py-3 gap-0"
                                  draggable
                                  onDragStart={(e) => onDragStart(e, node)}
                                >
                                  <CardHeader className="p-0 px-3">
                                    <CardTitle className="text-xs font-medium">
                                      {node.title}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="px-3">
                                    <p className="text-[10px] text-muted-foreground mb-2">
                                      {node.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {node.tags.map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="outline"
                                          className="text-[10px] px-1 py-0 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                      {node.diff && (
                                        <Badge
                                          className="text-[10px] px-1 py-0 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
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
                                                : "#C62828",
                                          }}
                                        >
                                          {node.diff}
                                        </Badge>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    // Category Grid View
                    <motion.div
                      key="grid-view"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-y-auto p-4 custom-scrollbar flex-1 min-h-0"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {sortedCategories.map((category, index) => (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.12, delay: index * 0.02 }}
                          >
                            <motion.div
                              className="w-full p-3 bg-foreground/5 border border-foreground/10 rounded-md flex justify-between cursor-pointer hover:bg-foreground/10 transition-colors"
                              onClick={() => openCategory(category)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex flex-col">
                                <p className="text-xs flex items-center gap-1">
                                  {getCategoryDisplayName(category)}
                                </p>

                                <div className="text-[10px] text-muted-foreground">
                                  Contains {categorizedNodes[category].length}{" "}
                                  nodes
                                </div>
                              </div>
                              <ChevronRight className="size-3 mt-1" />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
