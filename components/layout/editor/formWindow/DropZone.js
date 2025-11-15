"use client";
import React, { useState, useRef } from "react";

export default function DropZone({ index, isDragging, onDrop }) {
  const [isHovered, setIsHovered] = useState(false);
  const dropZoneRef = useRef(null);
  const dragCounterRef = useRef(0);
  const leaveTimeoutRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    // Increment counter to track nested enter/leave events
    dragCounterRef.current++;
    setIsHovered(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Decrement counter
    dragCounterRef.current--;

    // Only set hover to false if we've left all nested elements
    if (dragCounterRef.current === 0) {
      // Use a small delay to prevent flickering
      leaveTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 50);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any pending timeouts
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    // Check for component reordering (from ComponentRenderer drag)
    const dragIndex = e.dataTransfer.getData("text/plain");
    if (dragIndex) {
      const fromIndex = Number.parseInt(dragIndex);
      if (!isNaN(fromIndex)) {
        // Calculate correct target index for reordering
        let targetIndex = index;
        if (fromIndex < index) {
          targetIndex = index - 1;
        }
        onDrop(fromIndex, null);
        setIsHovered(false);
        dragCounterRef.current = 0;
        return;
      }
    }

    // Check for new component from sidebar (JSON data)
    const jsonData = e.dataTransfer.getData("application/json");
    if (jsonData) {
      try {
        const componentData = JSON.parse(jsonData);
        onDrop(null, componentData);
      } catch (error) {
        console.error("Error parsing component data:", error);
      }
    }

    // Reset state
    setIsHovered(false);
    dragCounterRef.current = 0;
  };

  // Reset hover state when dragging stops
  React.useEffect(() => {
    if (!isDragging) {
      setIsHovered(false);
      dragCounterRef.current = 0;
      // Clear any pending timeouts
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }
    }
  }, [isDragging]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // Always render drop zones when dragging, but with minimal height when not hovered
  if (!isDragging) {
    return <div className="h-2" />; // Minimal spacing when not dragging
  }

  return (
    <div
      ref={dropZoneRef}
      className={`transition-all duration-200 ${
        isHovered ? "h-20 py-3" : "h-8 py-1"
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`w-full h-full rounded-sm transition-all duration-200 flex items-center justify-center ${
          isHovered
            ? "border-2 border-dashed border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
            : "border-2 border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800/20 dark:border-gray-600 opacity-60"
        }`}
      >
        {isHovered ? (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-sm animate-pulse" />
            <span className="text-xs font-medium">
              {index === 0 ? "Drop component at top" : "Drop component here"}
            </span>
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-sm animate-pulse" />
          </div>
        ) : (
          <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Drop zone
          </div>
        )}
      </div>
    </div>
  );
}
