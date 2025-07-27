"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateComponent,
  deleteComponent,
  selectComponent,
} from "@/redux/slice/formSlice";
import { Button, Input } from "@heroui/react";
import { Trash2, Edit3, GripVertical, Save, AlertCircle } from "lucide-react";
import { getNodeTypeByType } from "@/lib/node-registry";
import TextField from "./componentRenderer/TextField";
import { updateNodeData } from "@/redux/slice/WorkflowSlice";
import NumberField from "./componentRenderer/NumberField";
import TextAreaField from "./componentRenderer/TextAreaField";
import SelectField from "./componentRenderer/SelectField";
import MapField from "./componentRenderer/MapFields";
import CheckBoxField from "./componentRenderer/CheckBoxField";
import DateTimeField from "./componentRenderer/DateTimeField";
import SliderField from "./componentRenderer/SliderField";

export default function ComponentRenderer({
  component,
  index,
  isSelected,
  onReorder,
  draggedIndex,
  setDraggedIndex,
}) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(component.content);
  const [editUrl, setEditUrl] = useState(component.url || "");
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const inputRef = useRef(null);
  const editingContainerRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(selectComponent(component.id));
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (component.type !== "divider" && component.component !== "component") {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const updates = { id: component.id, content: editContent };
    if (component.type === "link") {
      updates.url = editUrl;
    }
    dispatch(updateComponent(updates));
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
    dispatch(deleteComponent(component.id));
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
              className="font-medium border rounded-lg border-black/50 dark:border-background dark:text-background"
            />
            <Input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="text-sm border rounded-lg border-black/50 dark:border-background dark:text-background"
            />
            <div className="flex gap-2 mt-1">
              <Button
                size="sm"
                className="bg-dark text-background dark:bg-background dark:text-dark"
                onPress={handleSave}
              >
                <Save className="w-3 h-3" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onPress={handleCancel}
                className="border border-black/50 dark:border-background dark:text-background"
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
          className="w-full bg-transparent border-none outline-none resize-none dark:text-background"
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
          <h1 className="text-4xl font-bold text-dark dark:text-background">
            {component.content}
          </h1>
        );
      case "heading2":
        return (
          <h2 className="text-2xl font-bold text-dark dark:text-background">
            {component.content}
          </h2>
        );
      case "heading3":
        return (
          <h3 className="text-xl font-bold text-dark dark:text-background">
            {component.content}
          </h3>
        );
      case "paragraph":
        return (
          <p className="text-dark dark:text-background leading-relaxed whitespace-pre-wrap">
            {component.content}
          </p>
        );
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
            className={"border-dark dark:border-background"}
            style={{
              marginTop: isSelected ? "0.5rem" : "0",
              marginBottom: isSelected ? "0.5rem" : "0",
              marginRight: isSelected ? "2.75rem" : "0",
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderNodeComponent = () => {
    const nodes = useSelector((state) => state.workflow.nodes);
    const edges = useSelector((state) => state.workflow.connections || []);
    const nodeRegistry = useSelector(
      (state) => state.library?.nodeRegistry || []
    );
    const node =
      nodes && nodes.find((node) => node.id === component?.id?.split("|")[0]);
    const nodeTypes = node && getNodeTypeByType(node?.type, nodeRegistry);
    const selectedField =
      nodeTypes &&
      nodeTypes?.fields.find((field) => field.name === component.name);

    const matchingInput =
      nodeTypes &&
      nodeTypes?.inputs.find((input) => input.name === selectedField?.name);

    const isInput = !!matchingInput;

    const [connectedInputs, setConnectedInputs] = useState(new Map());
    const workflow = useSelector((state) => state.workflow?.workflow);
    const dispatch = useDispatch();

    if (!node) {
      return (
        <div className="pr-7">
          <div
            className={`h-full flex gap-2 text-xs items-center justify-center border w-fit border-red-500 rounded-lg p-2 ${
              isSelected ? "-mt-2" : ""
            }`}
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <div className="text-red-500">
              Node is either deleted or not found, Please remove the Component
            </div>
          </div>
        </div>
      );
    }

    const handleChange = (key, value) => {
      if (workflow?.status === "LIVE") {
        return;
      }
      dispatch(
        updateNodeData({
          nodeId: node.id,
          newData: { ...node.data, [key]: value },
        })
      );
    };

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
          />
        );
      default:
        return null;
    }
  };

  const isDragging = draggedIndex === index;
  const isDropTarget =
    dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;

  return (
    <div
      className={`relative group rounded-lg transition-all duration-200 ${
        isSelected
          ? "ring-1 ring-black/50 dark:ring-white bg-black/5 dark:bg-white/5 min-h-12"
          : "hover:bg-black/5 dark:hover:bg-white/5"
      } ${isDragging ? "opacity-50 scale-95 shadow-lg" : ""} ${
        isDropTarget
          ? "ring-1 ring-black/50 dark:ring-white bg-black/5 dark:bg-white/5"
          : ""
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

        {component.component !== "component" && (
          <div className={isSelected ? "ml-8 mb-[10px]" : ""}>
            {renderComponent()}
          </div>
        )}

        {component.component === "component" && (
          <div className={isSelected ? "ml-8 mt-2" : ""}>
            {renderNodeComponent()}
          </div>
        )}

        {/* Action buttons */}
        {isSelected && !isEditing && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-100 transition-opacity">
            {component.type !== "divider" &&
              component.component !== "component" && (
                <Button
                  variant="outline"
                  size="icon"
                  className="border-black/80 border p-2 rounded-lg dark:border-background dark:text-background"
                  onPress={(e) => {
                    setIsEditing(true);
                  }}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              )}
            <Button
              variant="outline"
              size="icon"
              className="border-black/80 border p-2 rounded-lg dark:border-background dark:text-background"
              onPress={handleDelete}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Edit hint */}
        {isSelected &&
          !isEditing &&
          component.type !== "divider" &&
          component.component !== "component" && (
            <div className="absolute bottom-2 left-12 text-xs text-black/50 dark:text-white/50 opacity-100 transition-opacity">
              Double-click to edit
            </div>
          )}

        {isSelected &&
          isEditing &&
          component.type !== "divider" &&
          component.type !== "link" &&
          component.type !== "paragraph" &&
          component.component !== "component" && (
            <div className="absolute bottom-2 left-12 text-xs text-black/50 dark:text-white/50 opacity-100 transition-opacity">
              Click Enter to save
            </div>
          )}

        {isSelected &&
          isEditing &&
          component.type === "paragraph" &&
          component.component !== "component" && (
            <div className="absolute bottom-2 left-12 text-xs text-black/50 dark:text-white/50 opacity-100 transition-opacity">
              Click Outside to save
            </div>
          )}
      </div>
    </div>
  );
}
