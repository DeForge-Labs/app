"use client";

import { getNodeTypeByType } from "@/lib/node-registry";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import TextField from "../editorWindow/nodes/customizer/TextField";
import NumberField from "../editorWindow/nodes/customizer/NumberField";
import TextAreaField from "../editorWindow/nodes/customizer/TextAreaField";
import SelectField from "../editorWindow/nodes/customizer/SelectField";
import CheckBoxField from "../editorWindow/nodes/customizer/CheckBoxField";
import DateTimeField from "../editorWindow/nodes/customizer/DateTimeField";
import SliderField from "../editorWindow/nodes/customizer/SliderField";
import SocialField from "../editorWindow/nodes/customizer/SocialField";
import EnvField from "../editorWindow/nodes/customizer/EnvField";
import MapField from "../editorWindow/nodes/customizer/MapField";
import useWorkflowStore from "@/store/useWorkspaceStore";
import useNodeLibraryStore from "@/store/useNodeLibraryStore";
import MarkdownRenderer from "../../template/MarkdownRenderer";
import RunButton from "./RunButton";

export default function PreviewRenderer({ component, isTemplate = false }) {
  const renderNodeComponent = () => {
    const { nodes, connections: edges, workflow } = useWorkflowStore();

    const { nodeRegistry } = useNodeLibraryStore();
    const node =
      nodes && nodes.find((node) => node.id === component?.content?.nodeId);

    const nodeTypes = node && getNodeTypeByType(node?.type, nodeRegistry);
    const selectedField =
      nodeTypes &&
      nodeTypes?.fields.find((field) => field.name === component.content?.name);

    const matchingInput =
      nodeTypes &&
      nodeTypes?.inputs.find((input) => input.name === selectedField?.name);

    const isInput = !!matchingInput;

    const [connectedInputs, setConnectedInputs] = useState(new Map());

    const { updateNodeData } = useWorkflowStore();

    if (!node) {
      return (
        <div className="pr-7">
          <div
            className={`h-full flex gap-2 text-xs items-center justify-center border w-fit border-red-500 rounded-lg p-2`}
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <div className="text-red-500">
              Node is either deleted or not found, Please remove the Component
            </div>
          </div>
        </div>
      );
    }

    const handleChange = (key, value) => {
      if (workflow?.status === "LIVE") {
        return;
      }

      updateNodeData({
        nodeId: node.id,
        newData: { ...node.data, [key]: value },
      });
    };

    useEffect(() => {
      if (!node) return;

      const connected = new Map();
      edges.forEach((edge) => {
        if (edge.target === node.id) {
          // Extract the input name from the handle ID
          const inputName = edge.targetHandle?.split("-")[1];

          if (inputName) {
            connected.set(inputName, edge.id);
          }
        }
      });
      setConnectedInputs(connected);
    }, [edges, node]);

    const isConnected = connectedInputs.has(selectedField?.name);

    if (isConnected) {
      return (
        <div className="pr-7">
          <div
            className={`h-full flex gap-2 text-xs items-center justify-center border w-fit border-red-500 rounded-lg p-2`}
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <div className="text-red-500">
              Field is already connected, disconnect or remove the connection
            </div>
          </div>
        </div>
      );
    }

    switch (selectedField?.type) {
      case "Text":
      case "text":
        return (
          <TextField
            key={component.id}
            field={selectedField}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
          />
        );
      case "Number":
      case "number":
        return (
          <NumberField
            key={component.id}
            field={selectedField}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
          />
        );
      case "TextArea":
      case "textarea":
        return (
          <TextAreaField
            key={component.id}
            field={selectedField}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
          />
        );
      case "select":
        return (
          <SelectField
            key={component.id}
            field={selectedField}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
          />
        );
      case "Map":
      case "map":
        return (
          <MapField
            field={selectedField}
            key={component.id}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
            nodeType={nodeTypes}
          />
        );
      case "CheckBox":
      case "checkbox":
        return (
          <CheckBoxField
            field={selectedField}
            key={component.id}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
            nodeType={nodeTypes}
          />
        );
      case "Date":
      case "date":
        return (
          <DateTimeField
            field={selectedField}
            key={component.id}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
            nodeType={nodeTypes}
          />
        );
      case "Slider":
      case "slider":
        return (
          <SliderField
            field={selectedField}
            key={component.id}
            isInput={isInput}
            isConnected={isConnected}
            selectedNode={node}
            handleChange={handleChange}
            nodeType={nodeTypes}
          />
        );
      case "social":
        return (
          <SocialField
            field={selectedField}
            key={component.id}
            isTemplate={isTemplate}
          />
        );
      case "env":
        return (
          <EnvField
            field={selectedField}
            key={component.id}
            isTemplate={isTemplate}
          />
        );
      default:
        return null;
    }
  };

  const renderComponent = () => {
    switch (component.type) {
      case "heading1":
        return (
          <h1 className="text-4xl font-bold dark:text-background text-dark mb-4">
            {component.content}
          </h1>
        );
      case "heading2":
        return (
          <h2 className="text-2xl font-bold dark:text-background text-dark mb-3">
            {component.content}
          </h2>
        );
      case "heading3":
        return (
          <h3 className="text-xl font-bold dark:text-background text-dark mb-2">
            {component.content}
          </h3>
        );
      case "paragraph":
        return <MarkdownRenderer content={component.content} />;
      case "link":
        return (
          <div className="mb-4">
            <a
              href={component.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              {component.content}
            </a>
          </div>
        );
      case "divider":
        return <hr className="border-dark dark:border-background my-6" />;
      case "run":
        return <RunButton />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      {component.type === "component"
        ? renderNodeComponent()
        : renderComponent()}
    </div>
  );
}
