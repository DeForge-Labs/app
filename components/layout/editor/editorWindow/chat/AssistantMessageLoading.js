import {
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  Search,
  Wrench,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AssistantMessageLoading({ message }) {
  const [isThoughtsOpen, setIsThoughtsOpen] = useState(true);

  const toolLogs = message.content.filter((c) => c.type === "tool");

  const markdownContent = message.content
    .filter((c) => c.type === "content" || c.type === "context")
    .map((c) => c.content)
    .join("\n");

  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto p-4 text-foreground animate-in fade-in duration-300">
      {toolLogs.length > 0 && (
        <div className="flex flex-col mb-2">
          <div
            onClick={() => setIsThoughtsOpen(!isThoughtsOpen)}
            className="flex items-center gap-2 cursor-pointer text-blue-400 hover:text-blue-300 transition-colors w-fit select-none"
          >
            <BrainCircuit size={16} className="animate-pulse" />
            <span className="text-xs font-medium">
              Thinking ({toolLogs.length} steps)...
            </span>
            {isThoughtsOpen ? (
              <ChevronDown size={14} className="mt-0.5 -ml-1" />
            ) : (
              <ChevronRight size={14} className="mt-0.5 -ml-1" />
            )}
          </div>

          {isThoughtsOpen && (
            <div className="relative pl-2 ml-2 mt-2 border-l border-blue-500/30 space-y-3">
              {toolLogs.map((tool, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 pl-4 relative group ${
                    index === toolLogs.length - 1
                      ? "animate-in slide-in-from-left-2 fade-in duration-300"
                      : ""
                  }`}
                >
                  <div className="absolute -left-2 top-3 w-3 h-px bg-foreground/20" />

                  <div className="mt-1.5 text-foreground/50">
                    {tool.content.toLowerCase().includes("getting") ||
                    tool.content.toLowerCase().includes("reviewing") ? (
                      <Search size={14} />
                    ) : (
                      <Wrench size={14} />
                    )}
                  </div>

                  <span className="text-xs text-foreground/70 leading-snug mt-1">
                    {tool.content}
                  </span>
                </div>
              ))}
              <div className="pl-4 pt-1">
                <Loader2 className="size-3 animate-spin text-blue-500/50" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-sm leading-7 min-h-[20px]">
        {markdownContent ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="mb-4 last:mb-0 leading-relaxed text-foreground/80">
                  {children}
                </p>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="px-1.5 py-0.5 bg-foreground/10 text-foreground/50 rounded text-[12px] font-mono border border-foreground/10">
                    {children}
                  </code>
                ) : (
                  <pre className="p-3 my-3 bg-foreground/10 text-foreground/50 rounded-md text-[12px] overflow-x-auto border border-foreground/10 font-mono leading-tight">
                    <code>{children}</code>
                  </pre>
                ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        ) : (
          <span className="text-foreground/40 italic text-xs">
            Generating response...
          </span>
        )}

        <span className="inline-block w-2.5 h-2.5 -mb-[1px] rounded-full bg-blue-500 ml-1 align-middle animate-pulse" />
      </div>

      <div className="flex items-center gap-2 mt-2 border-t border-foreground/10 text-foreground pt-3 opacity-70">
        <Loader2 className="size-[12px] animate-spin text-blue-500" />
        <span className="text-[10px] text-foreground/50 font-mono">
          Generating...
        </span>
      </div>
    </div>
  );
}
