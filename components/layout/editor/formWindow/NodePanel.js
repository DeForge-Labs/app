"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  updateNodeData,
  deleteEdge,
  setSelectedNode,
} from "@/redux/slice/WorkflowSlice";
import { Button } from "@heroui/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Plus, StickyNote, X } from "lucide-react";
import { getNodeTypeByType, isArrayType } from "@/lib/node-registry";
import { useEffect, useState } from "react";
import EnvField from "./nodePanel/EnvField";
import NumberField from "./nodePanel/NumberField";
import TextAreaField from "./nodePanel/TextAreaField";
import SelectField from "./nodePanel/SelectField";
import MapField from "./nodePanel/MapField";
import CheckBoxField from "./nodePanel/CheckBoxField";
import DateTimeField from "./nodePanel/DateTimeField";
import SliderField from "./nodePanel/SliderField";
import SocialField from "./nodePanel/SocialField";
import TextField from "./nodePanel/TextField";
import { setIsSelector } from "@/redux/slice/formSlice";

export default function NodePanel() {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state) => state.workflow?.selectedNode);
  const edges = useSelector((state) => state.workflow?.connections || []);
  const [connectedInputs, setConnectedInputs] = useState(new Map());
  const [totalConnectedInputs, setTotalConnectedInputs] = useState([]);
  const nodeRegistry = useSelector(
    (state) => state.library?.nodeRegistry || []
  );
  const workflow = useSelector((state) => state.workflow?.workflow || null);
  const isSelector = useSelector((state) => state.form?.isSelector);
  const components = useSelector((state) => state.form.components);

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
      <div className="flex h-full items-center justify-center text-center text-muted-foreground p-4 ">
        <div>
          <p className="opacity-50">Select a node to view its components</p>

          {!isSelector && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs w-fit mt-3 px-3 bg-black/80 text-background dark:bg-background dark:text-black"
              onPress={() => {
                dispatch(setIsSelector(true));
              }}
            >
              <Plus className="h-4 w-4" />
              Select Node
            </Button>
          )}
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
        <div className="font-semibold dark:text-background text-xl">
          Node Components
        </div>
      </div>
      <Card className="p-0 border-0 shadow-none">
        <CardHeader className="p-0">
          <CardTitle className="flex flex-col gap-1 text-lg border border-dashed border-black/50 dark:border-background dark:text-background p-3 pb-4 rounded-lg mb-5">
            {nodeType.title}
            <div className="">
              <div className="text-xs">{nodeType.desc}</div>
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-xs mt-3 bg-black/80 text-background w-full dark:bg-background dark:text-black"
                onPress={() => {
                  dispatch(setSelectedNode(null));
                }}
              >
                <X className="h-4 w-4" />
                Deselect
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            {/* Node label */}

            {/* Show all fields based on node type */}
            {nodeType.fields.map((field, index) => {
              const isComponentPresent =
                components &&
                components.find(
                  (component) =>
                    component.id === `${selectedNode.id}|${field.name}`
                );

              if (isComponentPresent) {
                return null;
              }
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
                      nodeId={selectedNode.id}
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
                      nodeId={selectedNode.id}
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
                      nodeId={selectedNode.id}
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
                      nodeId={selectedNode.id}
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
                      nodeId={selectedNode.id}
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
                      nodeId={selectedNode.id}
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
                      nodeId={selectedNode.id}
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
                      nodeId={selectedNode.id}
                    />
                  );

                default:
                  return null;
              }
            })}
          </div>
        </CardContent>
      </Card>

      {nodeType.fields.some((field) => field.type === "env") && (
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            {nodeType.fields.map((field, index) => {
              return (
                field.type === "env" && (
                  <EnvField
                    key={index}
                    field={field}
                    nodeId={selectedNode.id}
                  />
                )
              );
            })}
          </CardContent>
        </Card>
      )}

      {nodeType.fields.some((field) => field.type === "social") && (
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            {nodeType.fields.map((field, index) => {
              return (
                field.type === "social" && (
                  <SocialField
                    key={index}
                    field={field}
                    nodeId={selectedNode.id}
                  />
                )
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
