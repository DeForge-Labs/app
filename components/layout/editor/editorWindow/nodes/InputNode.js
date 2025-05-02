"use client";

import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@heroui/react";
import { MessageSquare } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateNodeData } from "@/redux/slice/WorkflowSlice";

export function InputNode({ id, data }) {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(
      updateNodeData({
        nodeId: id,
        newData: { ...data, value: e.target.value },
      })
    );
  };

  return (
    <Card className="w-64 border-black/50 bg-background">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4 text-black/50" />
            {data.label || "User Input"}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Input
          value={data.value || ""}
          onChange={handleChange}
          placeholder="Enter input..."
          className="mt-2 border border-black/50 rounded-lg"
          variant="outline"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="h-4 w-4 bg-black/50"
        />
      </CardContent>
    </Card>
  );
}
