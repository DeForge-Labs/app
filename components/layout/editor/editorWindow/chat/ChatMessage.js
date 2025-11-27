// "use client";

// import { useState } from "react";
// import { Copy, Check } from "lucide-react";

// import { Button } from "@/components/ui/button";

// const ChatMessage = ({ message }) => {
//   const [isCopied, setIsCopied] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);

//   const isStreaming = !!message.streaming;
//   const isAssistant = message.type === "assistant";
//   const isLongMessage = (message.content || "").length > 200;

//   const hasError = !!message.error;

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(message.content || "");

//       setIsCopied(true);
//       setTimeout(() => setIsCopied(false), 2000);
//     } catch (err) {
//       console.error("[chat] copy failed", err);
//     }
//   };

//   const displayContent = isExpanded
//     ? message.content
//     : (message.content || "").slice(0, 200);

//   return (
//     <div
//       className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
//         isAssistant ? "justify-start" : "justify-end"
//       }`}
//     >
//       {isAssistant && (
//         <div className="flex flex-col items-start gap-2 shrink-0">
//           <div
//             className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
//               isStreaming
//                 ? "bg-primary/10 ring-2 ring-primary/30"
//                 : "bg-linear-to-br from-primary to-primary/70"
//             }`}
//           >
//             <span className="text-xs font-bold text-primary-foreground">
//               v0
//             </span>
//           </div>
//         </div>
//       )}

//       <div
//         className={`flex flex-col gap-2 max-w-[280px] ${
//           isAssistant ? "items-start" : "items-end"
//         }`}
//       >
//         <div
//           className={`px-4 py-3 rounded-lg text-sm leading-relaxed wrap-break-words ${
//             isAssistant
//               ? "bg-muted/60 text-foreground border border-border/30"
//               : "bg-primary text-primary-foreground"
//           }`}
//           style={{
//             wordBreak: "break-word",
//             overflowWrap: "break-word",
//             wordWrap: "break-word",
//           }}
//         >
//           <p
//             style={{ wordBreak: "break-word" }}
//             className="text-pretty whitespace-pre-wrap"
//           >
//             {displayContent}
//           </p>

//           {isLongMessage && !isExpanded && !isStreaming && (
//             <button
//               onClick={() => setIsExpanded(true)}
//               className="mt-2 text-xs font-medium opacity-60 hover:opacity-100 transition-opacity"
//             >
//               Show more...
//             </button>
//           )}

//           {isLongMessage && isExpanded && !isStreaming && (
//             <button
//               onClick={() => setIsExpanded(false)}
//               className="mt-2 text-xs font-medium opacity-60 hover:opacity-100 transition-opacity"
//             >
//               Show less
//             </button>
//           )}
//         </div>

//         <div
//           className={`flex gap-1.5 ${
//             isAssistant ? "justify-start pl-12" : "justify-end"
//           }`}
//         >
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleCopy}
//             className="h-7 px-2 text-xs gap-1 hover:bg-muted/50"
//             title="Copy message"
//             disabled={isStreaming}
//           >
//             {isCopied ? (
//               <>
//                 <Check className="w-3 h-3" /> Copied
//               </>
//             ) : (
//               <>
//                 <Copy className="w-3 h-3" /> Copy
//               </>
//             )}
//           </Button>
//         </div>

//         <span className="text-xs text-muted-foreground/60 px-2">
//           {message.timestamp
//             ? new Date(message.timestamp).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : ""}
//           {hasError ? " • Error" : ""}
//           {isStreaming ? " • Streaming…" : ""}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;

"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ChatMessage = ({ message }) => {
  if (!message?.content || message.content.trim() === "") return null;

  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isAssistant = message.type === "assistant";
  const isStreaming = !!message.streaming;
  const isLongMessage = message.content.length > 200;

  const displayContent = isExpanded
    ? message.content
    : message.content.slice(0, 200);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isAssistant ? "items-start" : "items-end"
      }`}
    >
      {/* ASSISTANT PROFILE */}
      {isAssistant && (
        <div className="flex items-center gap-2 mb-1">
          <div className="rounded-full border border-ring shadow-sm overflow-hidden p-1.5">
            <Image
              width={16}
              height={16}
              alt="assistant"
              src="/logo/logo-white.svg"
            />
          </div>

          {isStreaming && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground animate-pulse">
              <span>Thinking</span>
              <span className="inline-block w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
            </div>
          )}
        </div>
      )}

      <div
        className={`relative max-w-[280px] px-3 py-2 rounded-lg text-sm leading-relaxed shadow-sm 
          whitespace-pre-wrap wrap-break-words
          ${
            isAssistant
              ? "bg-muted/60 text-foreground border border-border/30"
              : "bg-primary text-primary-foreground"
          }
        `}
      >
        <div className="pb-1">{displayContent}</div>

        {isLongMessage && !isExpanded && !isStreaming && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs font-medium opacity-60 hover:opacity-100 cursor-pointer"
          >
            Show more...
          </button>
        )}

        {isLongMessage && isExpanded && !isStreaming && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-xs font-medium opacity-60 hover:opacity-100 cursor-pointer"
          >
            Show less
          </button>
        )}

        <span className="block text-[10px] opacity-70 text-right">
          {message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </span>

        {isStreaming && (
          <span className="block mt-1 text-[10px] opacity-80">
            • Streaming…"
          </span>
        )}
      </div>

      <div
        className={`flex w-full mt-2 ${
          isAssistant ? "justify-start pl-1" : "justify-end pr-1"
        }`}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-[10px] gap-1 hover:bg-muted/50"
          disabled={isStreaming}
        >
          {isCopied ? (
            <>
              <Check className="w-3! h-3!" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3! h-3!" /> Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatMessage;
