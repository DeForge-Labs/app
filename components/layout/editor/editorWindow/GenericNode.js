"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position, useEdges } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { updateNodeData } from "@/redux/slice/WorkflowSlice";
import { getNodeTypeByType, getCategoryColor } from "@/lib/node-registry";
import { FileWarning } from "lucide-react";
import MapFieldEditor from "./MapFieldEditor";
import { Input, Textarea } from "@heroui/react";
import getColorByType from "@/lib/color-profile";

export function GenericNode({ id, type, data }) {
  const dispatch = useDispatch();
  const edges = useEdges();
  const [connectedInputs, setConnectedInputs] = useState(new Set());

  // Get the node type definition
  const nodeType = getNodeTypeByType(type);
  const categoryColor = nodeType
    ? getCategoryColor(nodeType.category)
    : "gray-500";

  // Track which inputs are connected
  useEffect(() => {
    const connected = new Set();
    edges.forEach((edge) => {
      if (edge.target === id) {
        // Extract the input name from the handle ID
        const inputName = edge.targetHandle?.split("-")[1];
        if (inputName) {
          connected.add(inputName);
        }
      }
    });
    setConnectedInputs(connected);
  }, [edges, id]);

  const handleChange = useCallback(
    (name, value) => {
      dispatch(
        updateNodeData({
          nodeId: id,
          newData: { ...data, [name]: value },
        })
      );
    },
    [dispatch, id, data]
  );

  if (!nodeType) {
    return (
      <Card className={`w-64 border-${categoryColor}/50`}>
        <CardHeader className="p-3">
          <CardTitle className="text-sm">Unknown Node Type: {type}</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Render field based on its type
  const renderField = (field, index) => {
    // Check if this field corresponds to an input that's connected
    const isConnected = connectedInputs.has(field.name);
    const isDisabled =
      isConnected && nodeType.inputs.some((input) => input.name === field.name);

    // Find matching input for this field
    const matchingInput = nodeType.inputs.find(
      (input) => input.name === field.name
    );

    // Get current value or use default from field definition
    const currentValue = data[field.name] !== undefined ? data[field.name] : "";

    switch (field.type) {
      case "Text":
      case "text":
        return (
          <div key={field.name} className="mb-2 relative">
            <div className="text-xs font-medium capitalize">{field.name}</div>
            <div className="flex items-center relative">
              {/* Handle is positioned within the relative container */}
              {nodeType.inputs.some((input) => input.name === field.name) && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`input-${field.name}-${matchingInput?.type || "any"}`}
                  style={{
                    left: -17,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: getColorByType(
                      matchingInput?.type.toLowerCase()
                    ),
                    width: "8px",
                    height: "8px",
                  }}
                />
              )}
              <Input
                value={currentValue || ""}
                variant="outline"
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.value}
                className="mt-2 border border-black/50 rounded-lg"
                disabled={isDisabled}
              />
            </div>
          </div>
        );

      case "Number":
      case "number":
        return (
          <div key={field.name} className="mb-2 relative">
            <div className="text-xs font-medium mb-1 capitalize">
              {field.name}
            </div>
            <div className="flex items-center relative">
              {nodeType.inputs.some((input) => input.name === field.name) && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`input-${field.name}-${matchingInput?.type || "any"}`}
                  style={{
                    left: -17,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: getColorByType(
                      matchingInput?.type.toLowerCase()
                    ),
                    width: "8px",
                    height: "8px",
                  }}
                />
              )}
              <Input
                type="number"
                variant="outline"
                value={currentValue || 0}
                onChange={(e) =>
                  handleChange(field.name, Number.parseFloat(e.target.value))
                }
                placeholder={field.value?.toString()}
                className="mt-2 border border-black/50 rounded-lg"
                disabled={isDisabled}
              />
            </div>
          </div>
        );

      case "textArea":
        return (
          <div key={field.name} className="mb-2 relative">
            <div className="text-xs font-medium mb-1 capitalize">
              {field.name}
            </div>
            <div className="flex items-center relative">
              {nodeType.inputs.some((input) => input.name === field.name) && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`input-${field.name}-${matchingInput?.type || "any"}`}
                  style={{
                    left: -17,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: getColorByType(
                      matchingInput?.type.toLowerCase()
                    ),
                    width: "8px",
                    height: "8px",
                  }}
                />
              )}
              <Textarea
                value={currentValue || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.value}
                className="text-xs min-h-[80px]"
                disabled={isDisabled}
              />
            </div>
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="mb-2 relative">
            <div className="text-xs font-medium mb-1 capitalize">
              {field.name}
            </div>
            <div className="flex items-center relative">
              {nodeType.inputs.some((input) => input.name === field.name) && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`input-${field.name}-${matchingInput?.type || "any"}`}
                  style={{
                    left: -17,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: getColorByType(
                      matchingInput?.type.toLowerCase()
                    ),
                    width: "8px",
                    height: "8px",
                  }}
                />
              )}
              <Select
                value={currentValue || field.value}
                onValueChange={(value) => handleChange(field.name, value)}
                disabled={isDisabled}
              >
                <SelectTrigger className="text-xs border border-black/50 rounded-lg">
                  <SelectValue placeholder={field.value} />
                </SelectTrigger>
                <SelectContent className="text-xs border border-black/50 rounded-lg bg-background">
                  {field.options?.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="hover:bg-black/5 rounded-md"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "Map":
      case "map":
        return (
          <div key={field.name} className="mb-2 relative">
            <div className="text-xs font-medium mb-2 capitalize">
              {field.name}
            </div>
            <div className="flex items-center relative">
              {nodeType.inputs.some((input) => input.name === field.name) && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`input-${field.name}-${matchingInput?.type || "any"}`}
                  style={{
                    left: -17,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: getColorByType(
                      matchingInput?.type.toLowerCase()
                    ),
                    width: "8px",
                    height: "8px",
                  }}
                />
              )}
              <div className="w-full">
                <MapFieldEditor
                  value={currentValue || {}}
                  onChange={(value) => handleChange(field.name, value)}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render output handles
  const renderOutputs = (outputs) => {
    return outputs.map((output, index) => (
      <div key={output.name} className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <Handle
            type="source"
            position={Position.Right}
            id={`output-${output.name}-${output.type}`}
            style={{
              backgroundColor: getColorByType(output.type.toLowerCase()),
              width: "8px",
              height: "8px",
            }}
            data-type={output.type}
          />
        </div>
      </div>
    ));
  };

  // Render standalone inputs (inputs that don't have corresponding fields)
  const renderStandaloneInputs = () => {
    return nodeType.inputs
      .filter(
        (input) => !nodeType.fields.some((field) => field.name === input.name)
      )
      .map((input) => (
        <div key={input.name} className="mb-2 relative">
          <div className="text-xs font-medium mb-1">{input.name}</div>
          <div className="flex items-center">
            <Handle
              type="target"
              position={Position.Left}
              id={`input-${input.name}-${input.type}`}
              className={`h-3 w-3 bg-${categoryColor} -ml-1.5`}
              data-type={input.type}
            />
            <div className="h-8 border rounded-md bg-muted/30 text-xs flex items-center justify-between w-full px-2">
              <span>
                {connectedInputs.has(input.name)
                  ? "Connected"
                  : "Not connected"}
              </span>
              <span className="text-xs text-muted-foreground">
                {input.type}
              </span>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <Card className={`w-64 border-black/50 bg-background `}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center">
            {data.label || nodeType.title}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {/* Render standalone inputs */}
        {renderStandaloneInputs()}

        {/* Render fields with their handles */}
        {nodeType.fields.map(renderField)}

        {/* Render outputs */}
        {renderOutputs(nodeType.outputs)}

        {/* Render Environment Warning */}
        {nodeType.fields.some((field) => field.type === "env") && (
          <div className="text-xs text-red-500 flex">
            <FileWarning className="mr-2 h-7 w-7" />
            <span className="text-xs w-fit">
              This Node requires Environment Variables, Select this node to
              customize its properties
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
