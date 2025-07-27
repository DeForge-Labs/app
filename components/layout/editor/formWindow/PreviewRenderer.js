"use client";
import { useSelector } from "react-redux";
import { getNodeTypeByType } from "@/lib/node-registry";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateNodeData } from "@/redux/slice/WorkflowSlice";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import TextField from "./componentRenderer/TextField";
import NumberField from "./componentRenderer/NumberField";
import TextAreaField from "./componentRenderer/TextAreaField";
import SelectField from "./componentRenderer/SelectField";
import MapField from "./componentRenderer/MapFields";
import CheckBoxField from "./componentRenderer/CheckBoxField";
import DateTimeField from "./componentRenderer/DateTimeField";
import SliderField from "./componentRenderer/SliderField";

export default function PreviewRenderer({ component }) {
  const renderNodeComponent = () => {
    const nodes = useSelector((state) => state.workflow.nodes);
    const edges = useSelector((state) => state.workflow.connections || []);
    const nodeRegistry = useSelector(
      (state) => state.library?.nodeRegistry || []
    );
    const node =
      nodes && nodes.find((node) => node.id === component?.id?.split("|")[0]);
    const nodeTypes = node && getNodeTypeByType(node?.type, nodeRegistry);
    const selectedField =
      nodeTypes &&
      nodeTypes?.fields.find((field) => field.name === component.name);

    const matchingInput =
      nodeTypes &&
      nodeTypes?.inputs.find((input) => input.name === selectedField?.name);

    const isInput = !!matchingInput;

    const [connectedInputs, setConnectedInputs] = useState(new Map());
    const workflow = useSelector((state) => state.workflow?.workflow);
    const dispatch = useDispatch();

    if (!node) {
      return (
        <div className="pr-7">
          <div
            className={`h-full flex gap-2 text-xs items-center justify-center border w-fit border-red-500 rounded-lg p-2 ${
              isSelected ? "-mt-2" : ""
            }`}
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
      dispatch(
        updateNodeData({
          nodeId: node.id,
          newData: { ...node.data, [key]: value },
        })
      );
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
            className={`h-full flex gap-2 text-xs items-center justify-center border w-fit border-red-500 rounded-lg p-2 ${
              isSelected ? "-mt-2" : ""
            }`}
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
        return (
          <p className="text-dark dark:text-background leading-relaxed mb-4 whitespace-pre-wrap">
            {component.content}
          </p>
        );
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
      default:
        return null;
    }
  };

  return (
    <div>
      {component.component === "component"
        ? renderNodeComponent()
        : renderComponent()}
    </div>
  );
}
