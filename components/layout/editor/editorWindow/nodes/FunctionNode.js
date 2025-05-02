"use client";

import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";
import { Textarea } from "@heroui/react";
import { useDispatch } from "react-redux";
import { updateNodeData } from "@/redux/slice/WorkflowSlice";

export function FunctionNode({ id, data }) {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(
      updateNodeData({
        nodeId: id,
        newData: { ...data, code: e.target.value },
      })
    );
  };

  return (
    <Card className="w-64 border-indigo-500/50 bg-background">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center">
            <Code className="mr-2 h-4 w-4 text-indigo-500" />
            {data.label || "Function"}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Textarea
          value={data.code || ""}
          onChange={handleChange}
          placeholder="return input;"
          className="mt-2 h-24 text-xs font-mono border shadow-none border-black/50 rounded-lg"
          variant="outline"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          className="h-3 w-3 bg-indigo-500"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="h-3 w-3 bg-indigo-500"
        />
      </CardContent>
    </Card>
  );
}
