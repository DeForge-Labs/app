"use client";

import { ShieldAlert, ShieldUser, X } from "lucide-react";
import { getNodeTypeByType } from "@/lib/node-registry";
import { useEffect, useState } from "react";
import EnvField from "../editorWindow/nodes/customizer/EnvField";
import TextField from "../editorWindow/nodes/customizer/TextField";
import NumberField from "../editorWindow/nodes/customizer/NumberField";
import TextAreaField from "../editorWindow/nodes/customizer/TextAreaField";
import SelectField from "../editorWindow/nodes/customizer/SelectField";

import MapField from "../editorWindow/nodes/customizer/MapField";

import CheckBoxField from "../editorWindow/nodes/customizer/CheckBoxField";
import DateTimeField from "../editorWindow/nodes/customizer/DateTimeField";
import SliderField from "../editorWindow/nodes/customizer/SliderField";
import SocialField from "../editorWindow/nodes/customizer/SocialField";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import useNodeLibraryStore from "@/store/useNodeLibraryStore";
import { Badge } from "@/components/ui/badge";

import ComponentHolder from "./ComponentHolder";

export default function ComponentPanel({
  selectedComponent,
  setSelectedComponent,
}) {
  const { selectedNode, deleteEdge, updateNodeData, setSelectedNode } =
    useWorkspaceStore();

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
    return null;
  }

  // Get the node type definition
  const nodeType = getNodeTypeByType(selectedNode.type, nodeRegistry);

  if (!nodeType) {
    return null;
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

  return (
    <div className="flex flex-col w-80 bg-card border border-foreground/15 rounded-lg overflow-hidden max-h-full relative z-20">
      <div className="flex flex-col gap-2 text-sm border-b border-foreground/15 p-4 relative z-10 shrink-0">
        <div
          className="absolute right-2 top-2 z-10 p-1 hover:bg-foreground/5 rounded-sm cursor-pointer"
          onClick={() => {
            setShowCustomizerPanel(false);
            setSelectedNode(null);
          }}
        >
          <X className="size-3" />
        </div>

        <div className="flex flex-col max-w-[250px]">
          <p>Select Component</p>
          <p className="text-xs text-muted-foreground max-w-64">
            Click to select the component from <br />
            <span className="font-semibold">{nodeType?.title}</span>
          </p>
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

                if (isConnected) {
                  return null;
                }

                switch (field.type) {
                  case "Text":
                  case "text":
                    return (
                      <ComponentHolder
                        key={index}
                        onClick={() => {
                          setSelectedComponent({
                            name: field.name,
                            type: field.type,
                            nodeId: selectedNode.id,
                          });
                        }}
                        isSelected={
                          selectedComponent?.name === field.name &&
                          selectedComponent?.type === field.type &&
                          selectedComponent?.nodeId === selectedNode.id
                        }
                      >
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
                      </ComponentHolder>
                    );

                  case "Number":
                  case "number":
                    return (
                      <ComponentHolder
                        key={index}
                        onClick={() => {
                          setSelectedComponent({
                            name: field.name,
                            type: field.type,
                            nodeId: selectedNode.id,
                          });
                        }}
                        isSelected={
                          selectedComponent?.name === field.name &&
                          selectedComponent?.type === field.type &&
                          selectedComponent?.nodeId === selectedNode.id
                        }
                      >
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
                      </ComponentHolder>
                    );

                  case "TextArea":
                  case "textarea":
                    return (
                      <ComponentHolder
                        key={index}
                        onClick={() => {
                          setSelectedComponent({
                            name: field.name,
                            type: field.type,
                            nodeId: selectedNode.id,
                          });
                        }}
                        isSelected={
                          selectedComponent?.name === field.name &&
                          selectedComponent?.type === field.type &&
                          selectedComponent?.nodeId === selectedNode.id
                        }
                      >
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
                      </ComponentHolder>
                    );

                  case "select":
                    return (
                      <ComponentHolder
                        key={index}
                        onClick={() => {
                          setSelectedComponent({
                            name: field.name,
                            type: field.type,
                            nodeId: selectedNode.id,
                          });
                        }}
                        isSelected={
                          selectedComponent?.name === field.name &&
                          selectedComponent?.type === field.type &&
                          selectedComponent?.nodeId === selectedNode.id
                        }
                      >
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
                      </ComponentHolder>
                    );

                  case "Map":
                  case "map":
                    return (
                      <ComponentHolder
                        key={index}
                        onClick={() => {
                          setSelectedComponent({
                            name: field.name,
                            type: field.type,
                            nodeId: selectedNode.id,
                          });
                        }}
                        isSelected={
                          selectedComponent?.name === field.name &&
                          selectedComponent?.type === field.type &&
                          selectedComponent?.nodeId === selectedNode.id
                        }
                      >
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
                      </ComponentHolder>
                    );

                  case "CheckBox":
                  case "checkbox":
                    return (
                      <ComponentHolder
                        key={index}
                        onClick={() => {
                          setSelectedComponent({
                            name: field.name,
                            type: field.type,
                            nodeId: selectedNode.id,
                          });
                        }}
                        isSelected={
                          selectedComponent?.name === field.name &&
                          selectedComponent?.type === field.type &&
                          selectedComponent?.nodeId === selectedNode.id
                        }
                      >
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
                      </ComponentHolder>
                    );

                  case "Date":
                  case "date":
                    return (
                      <ComponentHolder
                        key={index}
                        onClick={() => {
                          setSelectedComponent({
                            name: field.name,
                            type: field.type,
                            nodeId: selectedNode.id,
                          });
                        }}
                        isSelected={
                          selectedComponent?.name === field.name &&
                          selectedComponent?.type === field.type &&
                          selectedComponent?.nodeId === selectedNode.id
                        }
                      >
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
                      </ComponentHolder>
                    );

                  case "Slider":
                  case "slider":
                    return (
                      <ComponentHolder
                        key={index}
                        onClick={() => {
                          setSelectedComponent({
                            name: field.name,
                            type: field.type,
                            nodeId: selectedNode.id,
                          });
                        }}
                        isSelected={
                          selectedComponent?.name === field.name &&
                          selectedComponent?.type === field.type &&
                          selectedComponent?.nodeId === selectedNode.id
                        }
                      >
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
                      </ComponentHolder>
                    );

                  default:
                    return null;
                }
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
                          <ComponentHolder
                            key={index}
                            onClick={() => {
                              setSelectedComponent({
                                name: field.name,
                                type: field.type,
                                nodeId: selectedNode.id,
                              });
                            }}
                            isSelected={
                              selectedComponent?.name === field.name &&
                              selectedComponent?.type === field.type &&
                              selectedComponent?.nodeId === selectedNode.id
                            }
                          >
                            <EnvField key={index} field={field} />
                          </ComponentHolder>
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
                        <ComponentHolder
                          key={index}
                          onClick={() => {
                            setSelectedComponent({
                              name: field.name,
                              type: field.type,
                              nodeId: selectedNode.id,
                            });
                          }}
                          isSelected={
                            selectedComponent?.name === field.name &&
                            selectedComponent?.type === field.type &&
                            selectedComponent?.nodeId === selectedNode.id
                          }
                        >
                          <SocialField key={index} field={field} />
                        </ComponentHolder>
                      )
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
