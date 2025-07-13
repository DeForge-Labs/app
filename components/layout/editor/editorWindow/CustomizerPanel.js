"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateNodeData, deleteEdge } from "@/redux/slice/WorkflowSlice";
import { Button } from "@heroui/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, StickyNote } from "lucide-react";
import { getNodeTypeByType, isArrayType } from "@/lib/node-registry";
import { useEffect, useState } from "react";
import EnvField from "./nodes/customizer/EnvField";
import TextField from "./nodes/customizer/TextField";
import NumberField from "./nodes/customizer/NumberField";
import TextAreaField from "./nodes/customizer/TextAreaField";
import SelectField from "./nodes/customizer/SelectField";
import ArrayField from "./nodes/customizer/ArrayField";
import MapField from "./nodes/customizer/MapField";
import StandaloneField from "./nodes/customizer/StandaloneField";
import OutputField from "./nodes/customizer/OutputField";
import CheckBoxField from "./nodes/customizer/CheckBoxField";
import DateTimeField from "./nodes/customizer/DateTimeField";
import SliderField from "./nodes/customizer/SliderField";
import SocialField from "./nodes/customizer/SocialField";

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
      <div className="flex items-center justify-between dark:text-background dark:border-background">
        <div className="font-semibold dark:text-background">
          Node Properties
        </div>
        {workflow?.status === "LIVE" && (
          <div className="bg-black h-6 w-6 rounded-full flex items-center justify-center text-background dark:bg-background dark:text-black">
            <Lock className="h-3 w-3" />
          </div>
        )}
      </div>
      <Card className="border-black/50 dark:border-background dark:bg-zinc-900">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex flex-col gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border border-black/50 text-xs dark:border-background dark:text-background"
              onPress={() =>
                window.open(
                  "https://docs.deforge.io/docs/nodes/" + nodeType.type,
                  "_blank"
                )
              }
            >
              <StickyNote className="h-3 w-3" />
              Docs
            </Button>

            {nodeType.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {/* Node label */}
            <div className="-mt-1">
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

                case "TextArea":
                case "textarea":
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
                    <ArrayField
                      field={field}
                      key={index}
                      totalValidConnections={totalValidConnections}
                      totalConnectedInputs={totalConnectedInputs}
                      handleDisconnectAll={handleDisconnectAll}
                      handleDisconnectExact={handleDisconnectExact}
                    />
                  );

                case "Text[]":
                case "text[]":
                  return (
                    <ArrayField
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

                case "CheckBox":
                case "checkbox":
                  return (
                    <CheckBoxField
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

                case "Date":
                case "date":
                  return (
                    <DateTimeField
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

                case "Slider":
                case "slider":
                  return (
                    <SliderField
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
        <Card className="border border-black/50 shadow-none dark:bg-zinc-900 dark:border-background dark:text-background">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm dark:text-background">
              Environment Variables
            </CardTitle>
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

      {nodeType.fields.some((field) => field.type === "social") && (
        <Card className="border border-black/50 dark:bg-zinc-900 shadow-none dark:border-background dark:text-background">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm">Connections</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {nodeType.fields.map((field, index) => {
              return (
                field.type === "social" && (
                  <SocialField key={index} field={field} />
                )
              );
            })}
          </CardContent>
        </Card>
      )}

      {nodeType.outputs.length > 0 && (
        <Card className="border border-black/50 shadow-none dark:bg-zinc-900 dark:border-background dark:text-background">
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
