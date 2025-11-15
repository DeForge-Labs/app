"use client";

import { Button } from "@/components/ui/button";
import useFormStore from "@/store/useFormStore";
import { Play } from "lucide-react";

export default function FormToolPanel() {
  const { isPreview, setIsPreview } = useFormStore();
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center z-20">
      <Button className="text-[10px] rounded-md rounded-r-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3">
        <Play />
      </Button>
      <Button
        variant={"outline"}
        className="text-[10px] w-16 rounded-md rounded-l-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3"
      >
        Save
      </Button>
      <Button
        variant={isPreview ? "outline" : "default"}
        className="ml-2 text-[10px] w-16 rounded-md rounded-r-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3"
        onClick={() => setIsPreview(false)}
      >
        Edit
      </Button>
      <Button
        variant={isPreview ? "default" : "outline"}
        className="text-[10px] w-16 rounded-md rounded-l-none gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3"
        onClick={() => setIsPreview(true)}
      >
        Preview
      </Button>
    </div>
  );
}
