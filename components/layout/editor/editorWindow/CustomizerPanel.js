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
import { Link2Off, Lock, Save } from "lucide-react";
import { getNodeTypeByType, isArrayType } from "@/lib/node-registry";
import { useEffect, useState } from "react";
import MapFieldEditor from "./MapFieldEditor";
import getColorByType from "@/lib/color-profile";
import EnvField from "./customizerPanel/EnvField";

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

  const handleDisconnectExact = (inputName, edgeId) => {
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
            {nodeType.fields.map((field) => {
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
                    <div key={field.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium capitalize">
                          {field.name}
                          {isInput && (
                            <span className="ml-1 text-xs text-black/50">
                              {
                                nodeType.inputs.find(
                                  (i) => i.name === field.name
                                )?.type
                              }
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

                      <div className="text-[10px]">{field.desc}</div>
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
                              {
                                nodeType.inputs.find(
                                  (i) => i.name === field.name
                                )?.type
                              }
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
                        placeholder={field.value?.toString()}
                        className="mt-2 border border-black/50 rounded-lg"
                        variant="outline"
                        disabled={isInput && isConnected}
                      />

                      <div className="text-[10px]">{field.desc}</div>
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
                              {
                                nodeType.inputs.find(
                                  (i) => i.name === field.name
                                )?.type
                              }
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

                      <div className="text-[10px]">{field.desc}</div>
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
                              {
                                nodeType.inputs.find(
                                  (i) => i.name === field.name
                                )?.type
                              }
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

                      <div className="text-[10px]">{field.desc}</div>
                    </div>
                  );

                case "JSON[]":
                case "json[]":
                  return (
                    <div key={field.name} className="space-y-2">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium capitalize">
                          {field.name}
                          <span className="ml-2 text-xs text-black/50">
                            (Array Input)
                          </span>
                        </div>
                        {totalValidConnections.length > 0 && (
                          <div className="flex items-center justify-between mt-2 mb-1">
                            <div className="text-sm">
                              {totalValidConnections.length} connection
                              {totalValidConnections.length !== 1 ? "s" : ""}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs bg-black/80 text-background"
                              onPress={() => handleDisconnectAll(field.name)}
                            >
                              <Link2Off className="h-3 w-3 mr-1" />
                              Disconnect All
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="border rounded-md p-3 bg-black/5 border-black/50 text-xs">
                        <p className="">
                          This is an array input that accepts multiple
                          connections.
                        </p>
                        {totalValidConnections.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {totalConnectedInputs.map((edgeId, index) => {
                              return (
                                <div
                                  key={index}
                                  className="flex justify-between items-center text-xs"
                                >
                                  <span>Connection {index + 1}</span>
                                  <Button
                                    variant="icon"
                                    size="icon"
                                    className="h-5 w-5 p-0 bg-black/80 text-background rounded-md"
                                    onPress={() =>
                                      handleDisconnectExact(
                                        field.name,
                                        edgeId.edgeId
                                      )
                                    }
                                  >
                                    <Link2Off className="h-3 w-3" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="mt-2 text-xs">No connections yet.</p>
                        )}
                      </div>

                      <div className="text-[10px]">{field.desc}</div>
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
                              {
                                nodeType.inputs.find(
                                  (i) => i.name === field.name
                                )?.type
                              }
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

                      <div className="text-[10px]">{field.desc}</div>
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
                  <EnvField key={field.name} field={field} />
                )
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
                  <div key={output.name} className="">
                    <div className="flex justify-between items-center">
                      <span className="text-sm capitalize">{output.name}</span>
                      <div className="flex items-center gap-2 border border-black/50 rounded-md p-1">
                        <span className="text-xs">{output.type}</span>
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
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
