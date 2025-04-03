import Link from "next/link";
import Image from "next/image";
import { Headset, StickyNote } from "lucide-react";

export default function StartContainer({ children }) {
  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative">{children}</div>
      </div>
      <div className="flex items-center justify-center text-black/60 gap-3 mb-8">
        <div className="flex gap-1 items-center hover:cursor-pointer hover:text-black/80">
          <StickyNote className="w-4 h-4" />
          <p className="text-sm">Docs</p>
        </div>

        <div className="flex gap-1 items-center hover:cursor-pointer hover:text-black/80">
          <Headset className="w-4 h-4" />
          <p className="text-sm">Contact Us</p>
        </div>
      </div>
    </div>
  );
}
