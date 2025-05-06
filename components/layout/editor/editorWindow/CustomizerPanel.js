"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateNodeData, deleteEdge } from "@/redux/slice/WorkflowSlice";
import { Input, Textarea, Button } from "@heroui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2Off, Save } from "lucide-react";
import { getNodeTypeByType } from "@/lib/node-registry";
import { useEffect, useState } from "react";
import MapFieldEditor from "./MapFieldEditor";
import getColorByType from "@/lib/color-profile";

export default function CustomizerPanel() {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state) => state.workflow?.selectedNode);
  const edges = useSelector((state) => state.workflow?.connections || []);
  const [connectedInputs, setConnectedInputs] = useState(new Map());
  const [envValues, setEnvValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({});

  // Track which inputs are connected and store their edge IDs
  useEffect(() => {
    if (!selectedNode) return;

    const connected = new Map();
    edges.forEach((edge) => {
      if (edge.target === selectedNode.id) {
        // Extract the input name from the handle ID
        const inputName = edge.targetHandle?.split("-")[1];
        if (inputName) {
          connected.set(inputName, edge.id);
        }
      }
    });
    setConnectedInputs(connected);
  }, [edges, selectedNode]);

  // Initialize env values when selected node changes
  useEffect(() => {
    if (!selectedNode) return;

    const nodeType = getNodeTypeByType(selectedNode.type);
    if (!nodeType) return;

    const initialEnvValues = {};
    nodeType.fields.forEach((field) => {
      if (field.type === "env") {
        initialEnvValues[field.name] = "";
      }
    });
    setEnvValues(initialEnvValues);
  }, [selectedNode]);

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
  const nodeType = getNodeTypeByType(selectedNode.type);

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
    dispatch(
      updateNodeData({
        nodeId: selectedNode.id,
        newData: { ...selectedNode.data, [key]: value },
      })
    );
  };

  const handleEnvChange = (name, value) => {
    setEnvValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEnv = async (name, value) => {
    setIsSubmitting((prev) => ({ ...prev, [name]: true }));

    try {
      // This would be replaced with your actual API call
      // Example: await fetch('/api/env-variables', { method: 'POST', body: JSON.stringify({ name, value }) })

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error updating environment variable:", error);
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleDisconnect = (inputName) => {
    const edgeId = connectedInputs.get(inputName);
    if (edgeId) {
      dispatch(deleteEdge(edgeId));
    }
  };

  return (
    <div className="space-y-4 absolute p-4 w-full">
      <h2 className="font-semibold">Node Properties</h2>
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
            </div>

            {/* Show all fields based on node type */}
            {nodeType.fields.map((field) => {
              const isConnected = connectedInputs.has(field.name);
              const isInput = nodeType.inputs.some(
                (input) => input.name === field.name
              );

              // Render the field based on its type
              switch (field.type) {
                case "Text":
                case "text":
                  return (
                    <div key={field.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium capitalize">
                          {field.name}
                          {isInput && (
                            <span className="ml-1 text-xs text-black/50">
                              (Input:{" "}
                              {
                                nodeType.inputs.find(
                                  (i) => i.name === field.name
                                )?.type
                              }
                              )
                            </span>
                          )}
                        </div>
                        {isInput && isConnected && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs bg-black/80 text-background"
                            onPress={() => handleDisconnect(field.name)}
                          >
                            <Link2Off className="h-3 w-3" />
                            Disconnect
                          </Button>
                        )}
                      </div>
                      <Input
                        id={field.name}
                        value={selectedNode.data[field.name] || ""}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        placeholder={field.value}
                        disabled={isInput && isConnected}
                        className="border-black/50 border rounded-lg"
                        variant="outline"
                      />
                    </div>
                  );

                case "Number":
                case "number":
                  return (
                    <div key={field.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">
                          {field.name}
                          {isInput && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (Input:{" "}
                              {
                                nodeType.inputs.find(
                                  (i) => i.name === field.name
                                )?.type
                              }
                              )
                            </span>
                          )}
                        </div>
                        {isInput && isConnected && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleDisconnect(field.name)}
                          >
                            <Link2Off className="h-3 w-3 mr-1" />
                            Disconnect
                          </Button>
                        )}
                      </div>
                      <Input
                        id={field.name}
                        type="number"
                        value={selectedNode.data[field.name] || field.value}
                        onChange={(e) =>
                          handleChange(
                            field.name,
                            Number.parseFloat(e.target.value)
                          )
                        }
                        disabled={isInput && isConnected}
                      />
                    </div>
                  );

                case "textArea":
                  return (
                    <div key={field.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium capitalize">
                          {field.name}
                          {isInput && (
                            <span className="ml-2 text-xs text-black/50">
                              (Input:{" "}
                              {
                                nodeType.inputs.find(
                                  (i) => i.name === field.name
                                )?.type
                              }
                              )
                            </span>
                          )}
                        </div>
                        {isInput && isConnected && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs bg-black/80 text-background"
                            onPress={() => handleDisconnect(field.name)}
                          >
                            <Link2Off className="h-3 w-3 mr-1" />
                            Disconnect
                          </Button>
                        )}
                      </div>
                      <Textarea
                        id={field.name}
                        value={selectedNode.data[field.name] || ""}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        placeholder={field.value}
                        className="border-black/50 border rounded-lg"
                        variant="outline"
                        disabled={isInput && isConnected}
                      />
                    </div>
                  );

                case "select":
                  return (
                    <div key={field.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium capitalize">
                          {field.name}
                          {isInput && (
                            <span className="ml-2 text-xs text-black/50">
                              (Input:{" "}
                              {
                                nodeType.inputs.find(
                                  (i) => i.name === field.name
                                )?.type
                              }
                              )
                            </span>
                          )}
                        </div>
                        {isInput && isConnected && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs bg-black/80 text-background"
                            onPress={() => handleDisconnect(field.name)}
                          >
                            <Link2Off className="h-3 w-3 mr-1" />
                            Disconnect
                          </Button>
                        )}
                      </div>
                      <Select
                        value={selectedNode.data[field.name] || field.value}
                        onValueChange={(value) =>
                          handleChange(field.name, value)
                        }
                        disabled={isInput && isConnected}
                      >
                        <SelectTrigger
                          id={field.name}
                          className="border-black/50 border rounded-lg"
                        >
                          <SelectValue placeholder={`Select ${field.name}`} />
                        </SelectTrigger>
                        <SelectContent className="border-black/50 border rounded-lg bg-background">
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
                  );

                case "Map":
                case "map":
                  return (
                    <div key={field.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium capitalize">
                          {field.name}
                          {isInput && (
                            <span className="ml-2 text-xs text-black/50">
                              (Input:{" "}
                              {
                                nodeType.inputs.find(
                                  (i) => i.name === field.name
                                )?.type
                              }
                              )
                            </span>
                          )}
                        </div>
                        {isInput && isConnected && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs bg-black/80 text-background"
                            onPress={() => handleDisconnect(field.name)}
                          >
                            <Link2Off className="h-3 w-3 mr-1" />
                            Disconnect
                          </Button>
                        )}
                      </div>
                      <MapFieldEditor
                        value={selectedNode.data[field.name] || {}}
                        onChange={(value) => handleChange(field.name, value)}
                        disabled={isInput && isConnected}
                      />
                    </div>
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
              .map((input) => {
                const isConnected = connectedInputs.has(input.name);

                return (
                  <div key={input.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium capitalize">
                        {input.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Input: {input.type})
                        </span>
                      </div>
                      {isConnected && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs bg-black/80 text-background"
                          onPress={() => handleDisconnect(input.name)}
                        >
                          <Link2Off className="h-3 w-3 mr-1" />
                          Disconnect
                        </Button>
                      )}
                    </div>
                    <div className="h-10 border rounded-md bg-muted/30 text-xs flex items-center justify-between px-3">
                      <span>{isConnected ? "Connected" : "Not connected"}</span>
                      <span className="text-muted-foreground">
                        {input.type}
                      </span>
                    </div>
                  </div>
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
            {nodeType.fields.map((field) => {
              return (
                field.type === "env" && (
                  <div key={field.name} className="space-y-2">
                    <div className="text-sm font-medium">{field.name}</div>
                    <div className="flex gap-2 items-center">
                      <Input
                        id={field.name}
                        value={envValues[field.name] || ""}
                        onChange={(e) =>
                          handleEnvChange(field.name, e.target.value)
                        }
                        className="flex-1 border border-black/50 rounded-md"
                        variant="outline"
                        placeholder={field.defaultValue}
                      />
                      <Button
                        size="icon"
                        variant="icon"
                        className="p-3 rounded-md text-xs bg-black/80 text-background h-full"
                        onPress={() =>
                          handleSubmitEnv(
                            field.name,
                            envValues[field.name] || ""
                          )
                        }
                        disabled={isSubmitting[field.name]}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-[10px] text-black/50">
                      {field.desc}
                    </div>
                  </div>
                )
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card className="border border-black/50 shadow-none">
        <CardContent className="p-4 pt-0 ">
          {nodeType.outputs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-3">Outputs</h3>
              <div className="space-y-2">
                {nodeType.outputs.map((output) => (
                  <div key={output.name} className="">
                    <div className="flex justify-between">
                      <span className="text-sm">{output.type}</span>
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: getColorByType(
                            output.type.toLowerCase()
                          ),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
