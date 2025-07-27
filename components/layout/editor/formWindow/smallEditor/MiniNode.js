"use client";

import { useCallback, useEffect, useState } from "react";
import { Handle, Position, useEdges } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { updateNodeData } from "@/redux/slice/WorkflowSlice";
import {
  getNodeTypeByType,
  getCategoryColor,
  isArrayType,
} from "@/lib/node-registry";
import { FileWarning, Link2 } from "lucide-react";
import getColorByType from "@/lib/color-profile";
import { useSelector } from "react-redux";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import NumberField from "../../editorWindow/nodes/generic/NumberField";
import TextAreaField from "../../editorWindow/nodes/generic/TextAreaField";
import SelectField from "../../editorWindow/nodes/generic/SelectField";
import MapField from "../../editorWindow/nodes/generic/MapField";
import StandaloneField from "../../editorWindow/nodes/generic/StandaloneField";
import ArrayField from "../../editorWindow/nodes/generic/ArrayField";
import CheckBoxField from "../../editorWindow/nodes/generic/CheckBoxField";
import DateTimeField from "../../editorWindow/nodes/generic/DateTimeField";
import SliderField from "../../editorWindow/nodes/generic/SliderField";
import { useTheme } from "next-themes";
import TextField from "../../editorWindow/nodes/generic/TextField";

export function MiniNode({ id, type, data }) {
  const dispatch = useDispatch();
  const edges = useEdges();
  const [connectedInputs, setConnectedInputs] = useState(new Set());
  const [connectedOutputs, setConnectedOutputs] = useState(new Set());
  const [totalConnectedInputs, setTotalConnectedInputs] = useState([]);
  const [totalConnectedOutputs, setTotalConnectedOutputs] = useState([]);
  const nodeRegistry =
    useSelector((state) => state.library?.nodeRegistry) || [];

  const workflow = useSelector((state) => state.workflow?.workflow || null);
  const selectedNodeId = useSelector((state) => state.workflow?.selectedNodeId);
  const selectedNode = useSelector((state) => state.workflow?.selectedNode);

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

    setTotalConnectedInputs(totalConnected);
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

    setConnectedOutputs(connected);
    setTotalConnectedOutputs(totalConnected);
  }, [edges, id]);

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

    const isArrayInput = matchingInput && isArrayType(matchingInput.type);

    // Get current value or use default from field definition
    const currentValue = data[field.name] !== undefined ? data[field.name] : "";

    const totalValidConnections = isArrayInput
      ? totalConnectedInputs.filter(
          (input) =>
            input.toLowerCase() ===
            matchingInput?.type.split("[]")[0].toLowerCase()
        ).length
      : totalConnectedInputs.length;

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
            handleChange={() => {}}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={selectedNodeId === id}
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
            handleChange={() => {}}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={selectedNodeId === id}
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
            handleChange={() => {}}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={selectedNodeId === id}
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
            handleChange={() => {}}
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
            handleChange={() => {}}
            matchingInput={matchingInput}
            totalValidConnections={totalValidConnections}
            isArrayInput={isArrayInput}
            isSameNode={selectedNodeId === id}
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
            handleChange={() => {}}
            matchingInput={matchingInput}
            totalValidConnections={totalValidConnections}
            isArrayInput={isArrayInput}
            isSameNode={selectedNodeId === id}
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
            handleChange={() => {}}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={selectedNodeId === id}
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
            handleChange={() => {}}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={selectedNodeId === id}
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
            handleChange={() => {}}
            isConnected={isConnected}
            matchingInput={matchingInput}
            isSameNode={selectedNodeId === id}
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
            handleChange={() => {}}
            matchingInput={matchingInput}
            isConnected={isConnected}
            isSameNode={selectedNodeId === id}
          />
        );

      default:
        return null;
    }
  };

  // Render output handles
  const renderOutputs = (outputs) => {
    const selectedHandle = useSelector(
      (state) => state.workflow?.selectedHandle
    );
    const { resolvedTheme } = useTheme();
    const isSameNode = selectedNodeId === id;

    return outputs.map((output, index) => {
      return (
        <div key={output.name} className="mb-2 relative">
          <div className="text-xs font-medium text-right capitalize">
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
              className={`w-2 h-2 -right-[16.5px] -top-[12px] rounded-none rotate-45 absolute border-opacity-50 ${
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
                  className={`w-2 h-2 -right-[16.5px] -top-[12px] rounded-none rotate-45 absolute border-opacity-50`}
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
    <Card
      className={`w-64 border-black/50 bg-background relative dark:border-background dark:text-background rounded-md dark:bg-zinc-900 ${cn(
        workflow?.status === "LIVE" && "border-red-500 dark:border-red-500"
      )} ${cn(
        selectedNode?.id === id && "border-green-600 dark:border-green-500"
      )}`}
    >
      {workflow?.status === "LIVE" && (
        <div className="absolute -top-2 -right-3 bg-black h-6 w-6 rounded-full flex items-center justify-center text-background">
          <Lock className="h-3 w-3" />
        </div>
      )}
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between space-y-0 p-3 border-b border-black/50 dark:border-background mb-5",
          selectedNode?.id === id && "border-green-600 dark:border-green-500"
        )}
      >
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center">
            {data.label || nodeType.title}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-4">
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

        {/* Render Connection Warning */}
        {nodeType.fields.some((field) => field.type === "social") && (
          <div className="text-xs text-blue-500 flex pb-2">
            <Link2 className="mr-2 h-7 w-7" />
            <span className="text-xs w-fit">
              This Node requires Connections, Select this node to add
              connections to your form
            </span>
          </div>
        )}

        {/* Render Environment Warning */}
        {nodeType.fields.some((field) => field.type === "env") && (
          <div className="text-xs text-red-500 flex pb-2">
            <FileWarning className="mr-2 h-7 w-7" />
            <span className="text-xs w-fit">
              This Node requires Environment Variables, Select this node add
              environment variables to your form
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
