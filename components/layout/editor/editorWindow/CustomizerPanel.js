"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateNodeData, deleteEdge } from "@/redux/slice/WorkflowSlice";
import { Input } from "@heroui/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { getNodeTypeByType, isArrayType } from "@/lib/node-registry";
import { useEffect, useState } from "react";
import EnvField from "./nodes/customizer/EnvField";
import TextField from "./nodes/customizer/TextField";
import NumberField from "./nodes/customizer/NumberField";
import TextAreaField from "./nodes/customizer/TextAreaField";
import SelectField from "./nodes/customizer/SelectField";
import JSONArrayField from "./nodes/customizer/JSONArrayField";
import MapField from "./nodes/customizer/MapField";
import StandaloneField from "./nodes/customizer/StandaloneField";
import OutputField from "./nodes/customizer/OutputField";

export default function CustomizerPanel() {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state) => state.workflow?.selectedNode);
  const edges = useSelector((state) => state.workflow?.connections || []);
  const [connectedInputs, setConnectedInputs] = useState(new Map());
  const [totalConnectedInputs, setTotalConnectedInputs] = useState([]);
  const nodeRegistry = useSelector(
    (state) => state.library?.nodeRegistry || []
  );
  const workflow = useSelector((state) => state.workflow?.workflow || null);

  useEffect(() => {
    if (!selectedNode) return;

    const connected = new Map();
    const totalConnectedInputs = [];
    edges.forEach((edge) => {
      if (edge.target === selectedNode.id) {
        // Extract the input name from the handle ID
        const inputName = edge.targetHandle?.split("-")[1];
        const sourceName = edge.sourceHandle?.split("-")[2];

        if (sourceName) {
          totalConnectedInputs.push({
            inputName,
            sourceName,
            sourceId: edge.source,
            sourceHandle: edge.sourceHandle,
            edgeId: edge.id,
          });
        }

        if (inputName) {
          connected.set(inputName, edge.id);
        }
      }
    });
    setConnectedInputs(connected);
    setTotalConnectedInputs(totalConnectedInputs);
  }, [edges, selectedNode]);

  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center text-center text-muted-foreground p-4 opacity-50">
        <div>
          <p>Select a node to customize its properties</p>
        </div>
      </div>
    );
  }

  // Get the node type definition
  const nodeType = getNodeTypeByType(selectedNode.type, nodeRegistry);

  if (!nodeType) {
    return (
      <div className="flex h-full items-center justify-center text-center text-muted-foreground p-4 opacity-50">
        <div>
          <p>Unknown node type: {selectedNode.type}</p>
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
        nodeId: selectedNode.id,
        newData: { ...selectedNode.data, [key]: value },
      })
    );
  };

  const handleDisconnect = (inputName) => {
    if (workflow?.status === "LIVE") {
      return;
    }
    const edgeId = connectedInputs.get(inputName);
    if (edgeId) {
      dispatch(deleteEdge(edgeId));
    }
  };

  const handleDisconnectExact = (edgeId) => {
    if (workflow?.status === "LIVE") {
      return;
    }
    dispatch(deleteEdge(edgeId));
  };

  const handleDisconnectAll = (inputName) => {
    if (workflow?.status === "LIVE") {
      return;
    }
    const edgeIds = totalConnectedInputs.filter(
      (input) => input.inputName === inputName
    );
    edgeIds.forEach((edgeId) => {
      dispatch(deleteEdge(edgeId.edgeId));
    });
  };

  return (
    <div className="space-y-4 absolute p-4 w-full">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Node Properties</div>
        {workflow?.status === "LIVE" && (
          <div className="bg-black h-6 w-6 rounded-full flex items-center justify-center text-background">
            <Lock className="h-3 w-3" />
          </div>
        )}
      </div>
      <Card className="border-black/50">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center">
            {nodeType.reactIcon && (
              <span className="mr-2">{nodeType.reactIcon}</span>
            )}
            {nodeType.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {/* Node label */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Label</div>
              <Input
                id="label"
                value={selectedNode.data.label || ""}
                onChange={() => {}}
                variant="outline"
                className="border-black/50 border rounded-lg"
              />

              <div className="text-[10px]">{nodeType.desc}</div>
            </div>

            {/* Show all fields based on node type */}
            {nodeType.fields.map((field, index) => {
              // Check if this field corresponds to an input
              const matchingInput = nodeType.inputs.find(
                (input) => input.name === field.name
              );
              const isInput = !!matchingInput;

              const isConnected = connectedInputs.has(field.name);

              const isArrayInput =
                matchingInput && isArrayType(matchingInput.type);

              const totalValidConnections = isArrayInput
                ? totalConnectedInputs.filter(
                    (input) =>
                      input.sourceName.toLowerCase() ===
                      matchingInput?.type.split("[]")[0].toLowerCase()
                  )
                : totalConnectedInputs;

              // Render the field based on its type
              switch (field.type) {
                case "Text":
                case "text":
                  return (
                    <TextField
                      key={index}
                      field={field}
                      isInput={isInput}
                      isConnected={isConnected}
                      selectedNode={selectedNode}
                      handleChange={handleChange}
                      handleDisconnect={handleDisconnect}
                      nodeType={nodeType}
                    />
                  );

                case "Number":
                case "number":
                  return (
                    <NumberField
                      key={index}
                      field={field}
                      isInput={isInput}
                      isConnected={isConnected}
                      selectedNode={selectedNode}
                      handleChange={handleChange}
                      handleDisconnect={handleDisconnect}
                      nodeType={nodeType}
                    />
                  );

                case "textArea":
                  return (
                    <TextAreaField
                      key={index}
                      field={field}
                      isInput={isInput}
                      isConnected={isConnected}
                      selectedNode={selectedNode}
                      handleChange={handleChange}
                      handleDisconnect={handleDisconnect}
                      nodeType={nodeType}
                    />
                  );

                case "select":
                  return (
                    <SelectField
                      key={index}
                      field={field}
                      isInput={isInput}
                      isConnected={isConnected}
                      selectedNode={selectedNode}
                      handleChange={handleChange}
                      handleDisconnect={handleDisconnect}
                      nodeType={nodeType}
                    />
                  );

                case "JSON[]":
                case "json[]":
                  return (
                    <JSONArrayField
                      field={field}
                      key={index}
                      totalValidConnections={totalValidConnections}
                      totalConnectedInputs={totalConnectedInputs}
                      handleDisconnectAll={handleDisconnectAll}
                      handleDisconnectExact={handleDisconnectExact}
                    />
                  );

                case "Map":
                case "map":
                  return (
                    <MapField
                      field={field}
                      key={index}
                      isInput={isInput}
                      isConnected={isConnected}
                      selectedNode={selectedNode}
                      handleChange={handleChange}
                      handleDisconnect={handleDisconnect}
                      nodeType={nodeType}
                    />
                  );

                default:
                  return null;
              }
            })}

            {/* Show standalone inputs that don't have corresponding fields */}
            {nodeType.inputs
              .filter(
                (input) =>
                  !nodeType.fields.some((field) => field.name === input.name)
              )
              .map((input, index) => {
                const isConnected = connectedInputs.has(input.name);

                return (
                  <StandaloneField
                    key={index}
                    input={input}
                    isConnected={isConnected}
                    handleDisconnect={handleDisconnect}
                  />
                );
              })}
          </div>
        </CardContent>
      </Card>

      {nodeType.fields.some((field) => field.type === "env") && (
        <Card className="border border-black/50 shadow-none">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm">Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {nodeType.fields.map((field, index) => {
              return (
                field.type === "env" && <EnvField key={index} field={field} />
              );
            })}
          </CardContent>
        </Card>
      )}
      {nodeType.outputs.length > 0 && (
        <Card className="border border-black/50 shadow-none">
          <CardContent className="p-4 pt-0 ">
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-3">Outputs</h3>
              <div className="space-y-2">
                {nodeType.outputs.map((output) => (
                  <OutputField key={output.name} output={output} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
