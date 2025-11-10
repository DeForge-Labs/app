"use client";

import {
  BookOpen,
  CircleDot,
  ShieldAlert,
  ShieldUser,
  Trash,
  X,
} from "lucide-react";
import { getNodeTypeByType } from "@/lib/node-registry";
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
import useWorkspaceStore from "@/store/useWorkspaceStore";
import useNodeLibraryStore from "@/store/useNodeLibraryStore";
import { Badge } from "@/components/ui/badge";

export default function CustomizerPanel() {
  const { selectedNode, deleteEdge, updateNodeData } = useWorkspaceStore();
  const { connections: edges } = useWorkspaceStore();
  const [connectedInputs, setConnectedInputs] = useState(new Map());
  const [totalConnectedInputs, setTotalConnectedInputs] = useState([]);
  const { nodeRegistry } = useNodeLibraryStore();
  const { workflow, deleteNode, setShowCustomizerPanel } = useWorkspaceStore();

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

    updateNodeData({
      nodeId: selectedNode.id,
      newData: { ...selectedNode.data, [key]: value },
    });
  };

  const handleDisconnect = (inputName) => {
    if (workflow?.status === "LIVE") {
      return;
    }
    const edgeId = connectedInputs.get(inputName);
    if (edgeId) {
      deleteEdge(edgeId);
    }
  };

  const handleDisconnectExact = (edgeId) => {
    if (workflow?.status === "LIVE") {
      return;
    }
    deleteEdge(edgeId);
  };

  const handleDisconnectAll = (inputName) => {
    if (workflow?.status === "LIVE") {
      return;
    }
    const edgeIds = totalConnectedInputs.filter(
      (input) => input.inputName === inputName
    );
    edgeIds.forEach((edgeId) => {
      deleteEdge(edgeId.edgeId);
    });
  };

  return (
    <div className="flex flex-col w-72 bg-background border border-foreground/15 rounded-lg overflow-hidden max-h-full relative z-20">
      <div className="flex flex-col gap-2 text-sm border-b border-foreground/15 p-4 relative z-10 shrink-0">
        <div
          className="absolute right-2 top-2 z-10 p-1 hover:bg-foreground/5 rounded-sm cursor-pointer"
          onClick={() => {
            setShowCustomizerPanel(false);
          }}
        >
          <X className="size-3" />
        </div>

        <div className="flex flex-col">
          <p>{nodeType?.title}</p>
          <p className="text-xs text-muted-foreground max-w-64">
            {nodeType?.desc}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-[10px] w-fit px-2 py-1 hover:bg-foreground/10 cursor-pointer bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
            >
              <BookOpen className="size-3" /> Docs
            </Badge>

            <Badge
              variant="secondary"
              onClick={() => deleteNode(selectedNode.id)}
              className="text-[10px] w-fit px-2 hover:bg-foreground/10 cursor-pointer py-1 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
            >
              <Trash className="size-3" /> Delete
            </Badge>
          </div>

          <Badge
            variant="secondary"
            className="text-[10px] w-fit px-2 py-1 bg-foreground/5 border border-foreground/5 text-foreground/70 capitalize"
          >
            <CircleDot className="size-3" />{" "}
            {nodeType?.credit ? nodeType.credit : "0"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden relative z-10 flex-1 min-h-0">
        <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0">
          {nodeType.fields.length > 0 && (
            <div className="flex flex-col gap-3 p-4">
              {nodeType.fields.map((field, index) => {
                const type = nodeType.inputs.find(
                  (i) => i.name === field.name
                )?.type;
                const handleId = `input-${field.name}-${type}`;

                const connectionsForThisField = edges.filter(
                  (edge) =>
                    edge.target === selectedNode.id &&
                    edge.targetHandle === handleId
                );

                const totalValidConnections = connectionsForThisField.length;

                const isConnected = totalValidConnections > 0;

                const matchingInput = nodeType.inputs.find(
                  (input) => input.name === field.name
                );
                const isInput = !!matchingInput;

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
                        totalValidConnections={connectionsForThisField}
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
                        totalValidConnections={connectionsForThisField}
                        handleDisconnectAll={handleDisconnectAll}
                        handleDisconnectExact={handleDisconnectExact}
                      />
                    );

                  case "Tool[]":
                  case "tool[]":
                    return (
                      <ArrayField
                        field={field}
                        key={index}
                        totalValidConnections={connectionsForThisField}
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
          )}

          {nodeType.fields.some((field) => field.type === "env") && (
            <div className="flex flex-col gap-2 p-4 border-t border-foreground/15">
              {nodeType.fields.some((field) => field.type === "env") && (
                <div className="">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0.5 h-5 bg-red-200 dark:bg-red-700 w-fit flex justify-between items-center border mb-4 border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 capitalize"
                  >
                    <ShieldAlert className="" />
                    Environment Variables
                  </Badge>
                  <div className="flex flex-col gap-4">
                    {nodeType.fields.map((field, index) => {
                      return (
                        field.type === "env" && (
                          <EnvField key={index} field={field} />
                        )
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {nodeType.fields.some((field) => field.type === "social") && (
            <div className="flex flex-col gap-2 p-4 border-t border-foreground/15">
              {nodeType.fields.some((field) => field.type === "social") && (
                <div className="">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0.5 h-5 bg-blue-200 dark:bg-blue-700 w-fit flex justify-between items-center border mb-4 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-200 capitalize"
                  >
                    <ShieldUser className="" />
                    Social Connections
                  </Badge>

                  {nodeType.fields.map((field, index) => {
                    return (
                      field.type === "social" && (
                        <SocialField key={index} field={field} />
                      )
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {nodeType.outputs.length > 0 && (
            <div className="flex flex-col gap-2 p-4 border-t border-foreground/15">
              <div className="">
                <h3 className="text-sm mb-3">Outputs</h3>
                <div className="space-y-2">
                  {nodeType.outputs.map((output) => (
                    <OutputField key={output.name} output={output} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
