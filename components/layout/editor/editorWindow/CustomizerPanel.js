"use client";

import { updateNodeData } from "@/redux/slice/WorkflowSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { Input, Textarea } from "@heroui/react";

export default function CustomizerPanel() {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state) => state.workflow.selectedNode);

  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center text-center text-muted-foreground p-4 opacity-50">
        <div>
          <p>Select a node to customize its properties</p>
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

  return (
    <div className="space-y-4 absolute p-4 w-full">
      <h2 className="font-semibold">Node Properties</h2>
      <Card className="border-black/50">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">
            {selectedNode.type === "inputNode"
              ? "Input Node"
              : selectedNode.type === "functionNode"
              ? "Function Node"
              : "API Node"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-medium">Label</div>
              <Input
                id="label"
                value={selectedNode.data.label || ""}
                onChange={() => {}}
                variant="outline"
                className="border-black/50 border rounded-lg"
              />
            </div>

            {selectedNode.type === "inputNode" && (
              <div className="space-y-2">
                <div className="text-xs font-medium">Default Value</div>
                <Input
                  id="defaultValue"
                  value={selectedNode.data.value || ""}
                  onChange={(e) => handleChange("value", e.target.value)}
                  placeholder="Default input value"
                  className="border-black/50 border rounded-lg"
                  variant="outline"
                />
              </div>
            )}

            {selectedNode.type === "functionNode" && (
              <div className="space-y-2">
                <div className="text-xs font-medium">Function Code</div>
                <Textarea
                  id="code"
                  value={selectedNode.data.code || ""}
                  onChange={(e) => handleChange("code", e.target.value)}
                  placeholder="return input;"
                  className="font-mono h-40 border-black/50 border rounded-lg"
                  variant="outline"
                />
              </div>
            )}

            {selectedNode.type === "apiNode" && (
              <>
                <div className="space-y-2">
                  <div className="text-xs font-medium">API Endpoint</div>
                  <Input
                    id="endpoint"
                    value={selectedNode.data.endpoint || ""}
                    onChange={(e) => handleChange("endpoint", e.target.value)}
                    placeholder="https://api.example.com/data"
                    className="border-black/50 border rounded-lg"
                    variant="outline"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium">HTTP Method</div>
                  <Select
                    value={selectedNode.data.method || "GET"}
                    onValueChange={(value) => handleChange("method", value)}
                    className="border-black/50 border rounded-lg"
                  >
                    <SelectTrigger
                      id="method"
                      className="border border-black/50"
                    >
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="GET" className="hover:bg-black/5">
                        GET
                      </SelectItem>
                      <SelectItem value="POST" className="hover:bg-black/5">
                        POST
                      </SelectItem>
                      <SelectItem value="PUT" className="hover:bg-black/5">
                        PUT
                      </SelectItem>
                      <SelectItem value="DELETE" className="hover:bg-black/5">
                        DELETE
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
