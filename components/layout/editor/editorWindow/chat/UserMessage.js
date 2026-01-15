import { formatDistance } from "date-fns";
import { Clock, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function UserMessage({ message }) {
  const timeAgo = formatDistance(new Date(message.timestamp), new Date(), {
    addSuffix: true,
  });
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content?.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1800);
  };

  return (
    <div className="flex flex-col items-end">
      <div className="bg-foreground/10 rounded-md text-xs p-2 px-3 text-right max-w-[80%]">
        {message.content?.type === "text" && <p>{message.content?.content}</p>}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Clock className="size-[14px] opacity-60" />
        <span className="-ml-1 text-[11px] opacity-60">{timeAgo}</span>

        <div
          className="hover:bg-foreground/10 cursor-pointer p-1 rounded-sm"
          onClick={handleCopy}
        >
          {isCopied ? (
            <Check className="size-[14px] opacity-60" />
          ) : (
            <Copy className="size-[14px] opacity-60" />
          )}
        </div>
      </div>
    </div>
  );
}
