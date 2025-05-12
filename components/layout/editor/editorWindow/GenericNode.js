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
import { FileWarning } from "lucide-react";
import getColorByType from "@/lib/color-profile";
import { useSelector } from "react-redux";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import TextField from "./nodes/generic/TextField";
import NumberField from "./nodes/generic/NumberField";
import TextAreaField from "./nodes/generic/TextAreaField";
import SelectField from "./nodes/generic/SelectField";
import JSONArrayField from "./nodes/generic/JSONArrayField";
import MapField from "./nodes/generic/MapField";
import StandaloneField from "./nodes/generic/StandaloneField";

export function GenericNode({ id, type, data }) {
  const dispatch = useDispatch();
  const edges = useEdges();
  const [connectedInputs, setConnectedInputs] = useState(new Set());
  const [totalConnectedInputs, setTotalConnectedInputs] = useState([]);
  const nodeRegistry =
    useSelector((state) => state.library?.nodeRegistry) || [];

  const workflow = useSelector((state) => state.workflow?.workflow || null);

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

  const handleChange = useCallback(
    (name, value) => {
      if (workflow?.status === "LIVE") {
        return;
      }

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
            handleChange={handleChange}
            matchingInput={matchingInput}
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
          />
        );

      case "textArea":
        return (
          <TextAreaField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
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
          <JSONArrayField
            key={index}
            field={field}
            nodeType={nodeType}
            isDisabled={isDisabled}
            currentValue={currentValue}
            handleChange={handleChange}
            matchingInput={matchingInput}
            totalValidConnections={totalValidConnections}
            isArrayInput={isArrayInput}
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
          />
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
              right: "-5px",
              top: "30%",
              marginTop: `${index * 30}px`,
              transform: "translateY(-50%)",
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
        <StandaloneField
          key={input.name}
          input={input}
          categoryColor={categoryColor}
          connectedInputs={connectedInputs}
        />
      ));
  };

  return (
    <Card
      className={`w-64 border-black/50 bg-background relative ${cn(
        workflow?.status === "LIVE" && "border-red-500"
      )} `}
    >
      {workflow?.status === "LIVE" && (
        <div className="absolute -top-2 -right-3 bg-black h-6 w-6 rounded-full flex items-center justify-center text-background">
          <Lock className="h-3 w-3" />
        </div>
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 ">
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
