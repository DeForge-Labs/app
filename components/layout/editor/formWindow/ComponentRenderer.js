"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Edit3,
  GripVertical,
  Save,
  AlertCircle,
  Workflow,
} from "lucide-react";
import { getNodeTypeByType } from "@/lib/node-registry";
import TextField from "../editorWindow/nodes/customizer/TextField";
import NumberField from "../editorWindow/nodes/customizer/NumberField";
import TextAreaField from "../editorWindow/nodes/customizer/TextAreaField";
import SelectField from "../editorWindow/nodes/customizer/SelectField";
import CheckBoxField from "../editorWindow/nodes/customizer/CheckBoxField";
import DateTimeField from "../editorWindow/nodes/customizer/DateTimeField";
import SliderField from "../editorWindow/nodes/customizer/SliderField";
import SocialField from "../editorWindow/nodes/customizer/SocialField";
import EnvField from "../editorWindow/nodes/customizer/EnvField";
import MapField from "../editorWindow/nodes/customizer/MapField";
import useNodeLibraryStore from "@/store/useNodeLibraryStore";
import useFormStore from "@/store/useFormStore";
import useWorkflowStore from "@/store/useWorkspaceStore";
import MarkdownRenderer from "../../template/MarkdownRenderer";
import SelectComponentButton from "./SelectComponentButton";
import RunButton from "./RunButton";

export default function ComponentRenderer({
  component,
  index,
  isSelected,
  onReorder,
  draggedIndex,
  setDraggedIndex,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(component.content);
  const [editUrl, setEditUrl] = useState(component.url || "");
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const inputRef = useRef(null);
  const editingContainerRef = useRef(null);
  const { updateNodeData } = useWorkflowStore();
  const { updateComponent, deleteComponent, selectComponent } = useFormStore();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e) => {
    e.stopPropagation();
    selectComponent(component.id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (component.type !== "divider" && component.type !== "component") {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const updates = { id: component.id, content: editContent };
    if (component.type === "link") {
      updates.url = editUrl;
    }
    updateComponent(updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(component.content);
    setEditUrl(component.url || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && component.type !== "paragraph") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Modified blur handler for link editing
  const handleBlur = (e) => {
    // For links, only save if the blur is outside the editing container
    if (component.type === "link") {
      // Use setTimeout to allow the new focus event to register
      setTimeout(() => {
        if (
          editingContainerRef.current &&
          !editingContainerRef.current.contains(document.activeElement)
        ) {
          handleSave();
        }
      }, 0);
    } else {
      handleSave();
    }
  };

  const handleDelete = (e) => {
    deleteComponent(component.id);
  };

  // Drag and drop handlers
  const handleDragStart = (e) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fromIndex = Number.parseInt(e.dataTransfer.getData("text/plain"));

    if (!isNaN(fromIndex) && fromIndex !== index) {
      onReorder(fromIndex, index);
    }

    setDragOverIndex(null);
  };

  const renderComponent = () => {
    if (isEditing && component.type !== "divider") {
      if (component.type === "link") {
        return (
          <div
            className="flex flex-col gap-2"
            ref={editingContainerRef}
            style={{
              marginBottom: isEditing ? "-0.75rem" : "0",
            }}
          >
            <Input
              ref={inputRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Link text"
              className="rounded-sm border border-foreground/50 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
              style={{ fontSize: "12px" }}
            />
            <Input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="rounded-sm border border-foreground/50 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-none"
              style={{ fontSize: "12px" }}
            />
            <div className="flex gap-2 mt-1">
              <Button
                size="sm"
                className="rounded-sm text-[10px] [&_svg:not([class*='size-'])]:size-3"
                onClick={handleSave}
              >
                <Save />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="rounded-sm text-[10px] [&_svg:not([class*='size-'])]:size-3 border border-foreground/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        );
      }

      const InputComponent =
        component.type === "paragraph" ? "textarea" : "input";
      return (
        <InputComponent
          ref={inputRef}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none resize-none text-foreground"
          style={{
            fontSize:
              component.type === "heading1"
                ? "2rem"
                : component.type === "heading2"
                ? "1.5rem"
                : component.type === "heading3"
                ? "1.25rem"
                : "1rem",
            fontWeight: component.type.startsWith("heading")
              ? "bold"
              : "normal",
            lineHeight: component.type === "paragraph" ? "1.6" : "1.2",
          }}
          rows={component.type === "paragraph" ? 4 : 1}
        />
      );
    }

    switch (component.type) {
      case "heading1":
        return (
          <h1 className="text-4xl font-bold text-foreground">
            {component.content}
          </h1>
        );
      case "heading2":
        return (
          <h2 className="text-2xl font-bold text-foreground">
            {component.content}
          </h2>
        );
      case "heading3":
        return (
          <h3 className="text-xl font-bold text-foreground">
            {component.content}
          </h3>
        );
      case "paragraph":
        return <MarkdownRenderer content={component.content} />;
      case "link":
        return (
          <a
            href={component.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {component.content}
          </a>
        );
      case "divider":
        return (
          <hr
            className={"border-foreground"}
            style={{
              marginTop: isSelected ? "0.6rem" : "0.4rem",
              marginBottom: isSelected ? "0.6rem" : "0.4rem",
            }}
          />
        );
      case "run":
        return <RunButton />;
      default:
        return null;
    }
  };

  const renderNodeComponent = () => {
    const { nodes, connections: edges, workflow } = useWorkflowStore();

    const { nodeRegistry } = useNodeLibraryStore();
    const node =
      nodes && nodes.find((node) => node.id === component?.content?.nodeId);

    const nodeTypes = node && getNodeTypeByType(node?.type, nodeRegistry);
    const selectedField =
      nodeTypes &&
      nodeTypes?.fields.find((field) => field.name === component.content?.name);

    const matchingInput =
      nodeTypes &&
      nodeTypes?.inputs.find((input) => input.name === selectedField?.name);

    const isInput = !!matchingInput;

    const [connectedInputs, setConnectedInputs] = useState(new Map());

    useEffect(() => {
      if (!node) return;

      const connected = new Map();
      edges.forEach((edge) => {
        if (edge.target === node.id) {
          // Extract the input name from the handle ID
          const inputName = edge.targetHandle?.split("-")[1];

          if (inputName) {
            connected.set(inputName, edge.id);
          }
        }
      });
      setConnectedInputs(connected);
    }, [edges, node]);

    if (!node) {
      return (
        <div className="pr-7">
          <SelectComponentButton component={component} />
        </div>
      );
    }

    const handleChange = (key, value) => {
      if (workflow?.status === "LIVE") {
        return;
      }

      updateNodeData({
        nodeId: node.id,
        newData: { ...node.data, [key]: value },
      });
    };

    const isConnected = connectedInputs.has(selectedField?.name);

    if (isConnected) {
      return (
        <div className="pr-7">
          <div
            className={`h-full flex gap-2 text-xs items-center justify-center border w-fit border-red-500 rounded-lg p-2 ${
              isSelected ? "-mt-2" : ""
            }`}
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <div className="text-red-500">
              Field is already connected, disconnect or remove the connection
            </div>
          </div>
        </div>
      );
    }

    switch (selectedField?.type) {
      case "Text":
      case "text":
        return (
          <TextField
            key={index}
            field={selectedField}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
          />
        );
      case "Number":
      case "number":
        return (
          <NumberField
            key={index}
            field={selectedField}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
          />
        );
      case "TextArea":
      case "textarea":
        return (
          <TextAreaField
            key={index}
            field={selectedField}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
          />
        );
      case "select":
        return (
          <SelectField
            key={index}
            field={selectedField}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
          />
        );
      case "Map":
      case "map":
        return (
          <MapField
            field={selectedField}
            key={index}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
            nodeType={nodeTypes}
          />
        );
      case "CheckBox":
      case "checkbox":
        return (
          <CheckBoxField
            field={selectedField}
            key={index}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
            nodeType={nodeTypes}
          />
        );
      case "Date":
      case "date":
        return (
          <DateTimeField
            field={selectedField}
            key={index}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
            nodeType={nodeTypes}
          />
        );
      case "Slider":
      case "slider":
        return (
          <SliderField
            field={selectedField}
            key={index}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
            nodeType={nodeTypes}
          />
        );
      case "social":
        return <SocialField field={selectedField} key={index} />;
      case "env":
        return <EnvField field={selectedField} key={index} />;
      default:
        return null;
    }
  };

  const isDragging = draggedIndex === index;
  const isDropTarget =
    dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;

  return (
    <div
      className={`relative group rounded-sm transition-all duration-200 group border border-transparent ${
        isSelected
          ? "bg-foreground/4 border-foreground/10 min-h-12"
          : "hover:bg-foreground/5 hover:border-foreground/10"
      } ${isDragging ? "opacity-50 scale-95 shadow-lg" : ""} ${
        isDropTarget ? "ring-1 ring-foreground/10" : ""
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4">
        {/* Drag handle */}
        {isSelected && (
          <div
            className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-100 transition-opacity hover:bg-blue-100 rounded p-1 z-10"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <GripVertical className="w-4 h-4 text-gray-400 hover:text-blue-600" />
          </div>
        )}

        {component.type === "run" && (
          <div className={isSelected ? "ml-8" : ""}>{renderComponent()}</div>
        )}

        {component.type !== "component" && component.type !== "run" && (
          <div className={isSelected ? "ml-8 mb-[10px]" : ""}>
            {renderComponent()}
          </div>
        )}

        {component.type === "component" && (
          <div className={isSelected ? "ml-8" : ""}>
            {renderNodeComponent()}
          </div>
        )}

        {/* Action buttons */}
        {!isEditing && (
          <div className="absolute -top-4 right-2 gap-1 opacity-90 transition-opacity hidden group-hover:flex">
            {component.type !== "divider" &&
              component.type !== "component" &&
              component.type !== "run" && (
                <Button
                  className="py-0 rounded-sm text-[10px] [&_svg:not([class*='size-'])]:size-3"
                  onClick={(e) => {
                    setIsEditing(true);
                  }}
                >
                  <Edit3 /> Edit
                </Button>
              )}

            {component.type === "component" && component.content?.nodeId && (
              <SelectComponentButton
                component={component}
                text="Edit Component"
              />
            )}
            <Button
              className="border-black/80 py-0 border rounded-sm text-[10px] [&_svg:not([class*='size-'])]:size-3"
              onClick={handleDelete}
            >
              <Trash2 /> Delete
            </Button>
          </div>
        )}

        {/* Edit hint */}
        {isSelected &&
          !isEditing &&
          component.type !== "divider" &&
          component.type !== "component" &&
          component.type !== "run" && (
            <div className="absolute bottom-2 left-12 text-xs text-black/50 dark:text-white/50 opacity-100 transition-opacity">
              Double-click to edit
            </div>
          )}

        {isSelected &&
          isEditing &&
          component.type !== "divider" &&
          component.type !== "link" &&
          component.type !== "paragraph" &&
          component.type !== "component" &&
          component.type !== "run" && (
            <div className="absolute bottom-2 left-12 text-xs text-black/50 dark:text-white/50 opacity-100 transition-opacity">
              Click Enter to save
            </div>
          )}

        {isSelected &&
          isEditing &&
          component.type === "paragraph" &&
          component.component !== "component" &&
          component.type !== "run" && (
            <div className="absolute bottom-2 left-12 text-xs text-black/50 dark:text-white/50 opacity-100 transition-opacity">
              Click Outside to save
            </div>
          )}
      </div>
    </div>
  );
}
