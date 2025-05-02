"use client";

import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@heroui/react";
import { useDispatch } from "react-redux";
import { updateNodeData } from "@/redux/slice/WorkflowSlice";

export function APINode({ id, data }) {
  const dispatch = useDispatch();
  const handleEndpointChange = (e) => {
    dispatch(
      updateNodeData({
        nodeId: id,
        newData: { ...data, endpoint: e.target.value },
      })
    );
  };

  const handleMethodChange = (value) => {
    dispatch(
      updateNodeData({
        nodeId: id,
        newData: { ...data, method: value },
      })
    );
  };

  return (
    <Card className="w-64 border-green-500/50 bg-background">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center">
            <Globe className="mr-2 h-4 w-4 text-green-500" />
            {data.label || "API Output"}
          </div>
        </CardTitle>
        <Select value={data.method || "GET"} onValueChange={handleMethodChange}>
          <SelectTrigger className="h-7 w-20 text-xs">
            <SelectValue placeholder="Method" />
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
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Input
          value={data.endpoint || ""}
          onChange={handleEndpointChange}
          placeholder="https://api.example.com"
          className="mt-2 text-xs border border-black/50 rounded-lg"
          variant="outline"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          className="h-3 w-3 bg-green-500"
        />
      </CardContent>
    </Card>
  );
}
