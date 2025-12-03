"use client";

import { useCallback, useEffect, useState } from "react";
import { Handle, Position, useEdges } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getNodeTypeByType,
  getCategoryColor,
  isArrayType,
} from "@/lib/node-registry";
import { CircleDot, ShieldAlert, ShieldUser } from "lucide-react";
import getColorByType from "@/lib/color-profile";
import TextField from "@/components/layout/editor/editorWindow/nodes/generic/TextField";
import NumberField from "@/components/layout/editor/editorWindow/nodes/generic/NumberField";
import TextAreaField from "@/components/layout/editor/editorWindow/nodes/generic/TextAreaField";
import SelectField from "@/components/layout/editor/editorWindow/nodes/generic/SelectField";
import MapField from "@/components/layout/editor/editorWindow/nodes/generic/MapField";
import StandaloneField from "@/components/layout/editor/editorWindow/nodes/generic/StandaloneField";
import ArrayField from "@/components/layout/editor/editorWindow/nodes/generic/ArrayField";
import CheckBoxField from "@/components/layout/editor/editorWindow/nodes/generic/CheckBoxField";
import DateTimeField from "@/components/layout/editor/editorWindow/nodes/generic/DateTimeField";
import SliderField from "@/components/layout/editor/editorWindow/nodes/generic/SliderField";
import { useTheme } from "next-themes";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { Badge } from "@/components/ui/badge";
import { useNodeViewerStore } from "./ViewerContext";

export default function ViewerGenericNode({ id, type, data }) {
  const edges = useEdges();
  const [connectedInputs, setConnectedInputs] = useState(new Set());
  const { nodeRegistry } = useNodeViewerStore();

  // Get the node type definition
  const nodeType = getNodeTypeByType(type, nodeRegistry);
  const categoryColor = nodeType
    ? getCategoryColor(nodeType.category)
    : "gray-500";

  // Track which inputs are connected
  useEffect(() => {
    const connected = new Set();
    const totalConnected = [];
    edges.forEach((edge) => {
      if (edge.target === id) {
        // Extract the input name from the handle ID
        const inputName = edge.targetHandle?.split("-")[1];
        const sourceName = edge.sourceHandle?.split("-")[2];
        if (sourceName) {
          totalConnected.push(sourceName);
        }
        if (inputName) {
          connected.add(inputName);
        }
      }
    });

    setConnectedInputs(connected);
  }, [edges, id]);

  useEffect(() => {
    const connected = new Set();
    const totalConnected = [];
    edges.forEach((edge) => {
      if (edge.source === id) {
        // Extract the output name from the handle ID
        const outputName = edge.sourceHandle?.split("-")[1];
        const targetName = edge.targetHandle?.split("-")[2];
        if (targetName) {
          totalConnected.push(targetName);
        }
        if (outputName) {
          connected.add(outputName);
        }
      }
    });
  }, [edges, id]);

  const handleChange = useCallback((name, value) => {}, [id, data]);

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
    const handleId = `input-${field.name}-${field.type}`;
    const totalValidConnections = edges.filter(
      (edge) => edge.target === id && edge.targetHandle === handleId
    ).length;

    const isConnected = totalValidConnections > 0;

    const isDisabled =
      isConnected && nodeType.inputs.some((input) => input.name === field.name);

    // Find matching input for this field
    const matchingInput = nodeType.inputs.find(
      (input) => input.name === field.name
    );

    const isArrayInput = matchingInput && isArrayType(matchingInput.type);

    // Get current value or use default from field definition
    const currentValue =
      data[field.name] !== undefined && data[field.name] !== null
        ? data[field.name]
        : "";

    switch (field.type) {
      case "Text":
      case "text":
        return (
          <TextField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={false}
          />
        );

      case "Number":
      case "number":
        return (
          <NumberField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={false}
          />
        );

      case "TextArea":
      case "textarea":
        return (
          <TextAreaField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={false}
          />
        );

      case "select":
        return (
          <SelectField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
          />
        );

      case "JSON[]":
      case "json[]":
        return (
          <ArrayField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
            totalValidConnections={totalValidConnections}
            isArrayInput={isArrayInput}
            isSameNode={false}
          />
        );

      case "Text[]":
      case "text[]":
        return (
          <ArrayField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
            totalValidConnections={totalValidConnections}
            isArrayInput={isArrayInput}
            isSameNode={false}
          />
        );

      case "Tool[]":
      case "tool[]":
        return (
          <ArrayField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
            totalValidConnections={totalValidConnections}
            isArrayInput={isArrayInput}
            isSameNode={false}
          />
        );

      case "Map":
      case "map":
        return (
          <MapField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={false}
          />
        );

      case "CheckBox":
      case "checkbox":
        return (
          <CheckBoxField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={false}
          />
        );

      case "Date":
      case "date":
        return (
          <DateTimeField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            isConnected={isConnected}
            matchingInput={matchingInput}
            isSameNode={false}
          />
        );

      case "Slider":
      case "slider":
        return (
          <SliderField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={false}
          />
        );

      default:
        return null;
    }
  };

  // Render output handles
  const renderOutputs = (outputs) => {
    const { selectedHandle } = useWorkspaceStore();
    const { resolvedTheme } = useTheme();
    const isSameNode = false;

    return outputs.map((output, index) => {
      return (
        <div key={output.name} className="mb-2 relative">
          <div className="text-[10px] text-right font-medium text-foreground/80 capitalize">
            {output.name}
          </div>
          <div className="flex items-center relative">
            <Handle
              type="source"
              position={Position.Right}
              id={`output-${output.name}-${output.type}`}
              className=""
              style={{
                right: "-15.3px",
                top: "-8px",
                zIndex: 10,
                backgroundColor: "transparent",
                border: "none",
              }}
              data-type={output.type}
            ></Handle>

            <div
              className={`w-2 h-2 -right-[16.2px] -top-[12px] rounded-none rotate-45 absolute border-opacity-50 ${
                selectedHandle?.split("-")[0] === "input" &&
                selectedHandle?.split("-")[2]?.toLowerCase() ===
                  (output?.type.toLowerCase() || "any") &&
                !isSameNode
                  ? "animate-ping-rotated"
                  : ""
              }`}
              style={{
                backgroundColor: getColorByType(output.type.toLowerCase()),
                borderColor: resolvedTheme === "dark" ? "white" : "black",
                borderWidth: "1px",
              }}
            ></div>

            {selectedHandle?.split("-")[0] === "input" &&
              selectedHandle?.split("-")[2]?.toLowerCase() ===
                (output?.type.toLowerCase() || "any") &&
              !isSameNode && (
                <div
                  className={`w-2 h-2 -right-[16.2px] -top-[12px] rounded-none rotate-45 absolute border-opacity-50`}
                  style={{
                    backgroundColor: getColorByType(output?.type.toLowerCase()),
                    borderColor: "black",
                    borderWidth: "1px",
                  }}
                ></div>
              )}
          </div>
        </div>
      );
    });
  };

  // Render standalone inputs (inputs that don't have corresponding fields)
  const renderStandaloneInputs = () => {
    return nodeType.inputs
      .filter(
        (input) => !nodeType.fields.some((field) => field.name === input.name)
      )
      .map((input) => (
        <StandaloneField
          key={input.name}
          input={input}
          categoryColor={categoryColor}
          connectedInputs={connectedInputs}
          isConnected={connectedInputs.has(input.name)}
        />
      ));
  };

  return (
    <Card className={`w-56 relative py-0`}>
      <div className="absolute -top-7 flex items-center gap-2">
        {/* Render Environment Warning */}
        {nodeType.fields.some((field) => field.type === "env") && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 h-5 bg-red-200 dark:bg-red-700 w-fit flex justify-between items-center border mb-4 border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 capitalize"
          >
            <ShieldAlert className="" />
            Env
          </Badge>
        )}

        {nodeType.fields.some((field) => field.type === "social") && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 h-5 bg-blue-200 dark:bg-blue-700 w-fit flex justify-between items-center border mb-4 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-200 capitalize"
          >
            <ShieldUser className="" />
            Social
          </Badge>
        )}
      </div>

      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 p-3 border-b border-foreground/15 [.border-b]:pb-3">
        <CardTitle className="text-[10px] font-medium">
          <div className="flex items-center">
            {data.label || nodeType.title}
          </div>
        </CardTitle>

        {/* Render minimum credit requirement */}

        <div className="flex items-center justify-end">
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 bg-foreground/5 [&_svg:not([class*='size-'])]:size-2.5 border border-foreground/5 text-foreground/70 capitalize"
          >
            <CircleDot />
            <p>{nodeType?.credit ? nodeType.credit : "0"}</p>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pb-2 pt-0 space-y-2">
        <div className="space-y-2">
          {/* Render outputs */}
          {renderOutputs(nodeType.outputs)}
        </div>

        <div className="space-y-2">
          {/* Render standalone inputs */}
          {renderStandaloneInputs()}
        </div>

        <div className="space-y-2">
          {/* Render fields with their handles */}
          {nodeType.fields.map(renderField)}
        </div>
      </CardContent>
    </Card>
  );
}
