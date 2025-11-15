"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RunButton() {
  return (
    <Button
      className="py-0 rounded-sm text-[10px] [&_svg:not([class*='size-'])]:size-3"
      onClick={() => {}}
    >
      <Play /> Run this workflow
    </Button>
  );
}
