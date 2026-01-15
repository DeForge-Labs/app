import { formatDistance } from "date-fns";
import {
  Clock,
  Copy,
  Check,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  Search,
  Wrench,
  CircleDot,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AssistantMessage({ message }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isThoughtsOpen, setIsThoughtsOpen] = useState(false);

  const toolLogs = message.content.filter((c) => c.type === "tool");

  const markdownContent = message.content
    .filter((c) => c.type === "content" || c.type === "context")
    .map((c) => c.content)
    .join("\n");

  const timeAgo = message.timestamp
    ? formatDistance(new Date(message.timestamp), new Date(), {
        addSuffix: true,
      })
    : "Just now";

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto p-4 text-gray-200">
      {toolLogs.length > 0 && (
        <div className="flex flex-col mb-2">
          <div
            onClick={() => setIsThoughtsOpen(!isThoughtsOpen)}
            className="flex items-center gap-2 cursor-pointer text-foreground/50 hover:text-foreground/70 transition-colors w-fit select-none"
          >
            <BrainCircuit size={16} />
            <span className="text-xs font-medium">
              Thought for {toolLogs.length} steps
            </span>
            {isThoughtsOpen ? (
              <ChevronDown size={14} className="mt-0.5 -ml-1" />
            ) : (
              <ChevronRight size={14} className="mt-0.5 -ml-1" />
            )}
          </div>

          {isThoughtsOpen && (
            <div className="relative pl-2 ml-2 mt-2 border-l border-foreground/20 space-y-3">
              {toolLogs.map((tool, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pl-4 relative group"
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

                  <span className="text-xs mt-1 text-foreground/50 leading-snug">
                    {tool.content}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-sm leading-7">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="mb-4 last:mb-0 leading-relaxed text-foreground/80">
                {children}
              </p>
            ),
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mb-3 mt-4 text-foreground">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mb-2 mt-4 text-foreground">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-md font-semibold mb-2 mt-3 text-foreground">
                {children}
              </h3>
            ),
            ul: ({ children }) => (
              <ul className="list-disc ml-4 mb-4 space-y-1 text-foreground/80">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-4 mb-4 space-y-1 text-foreground/80">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed pl-1 text-foreground/80">
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground/80">
                {children}
              </strong>
            ),
            code: ({ inline, children }) =>
              inline ? (
                <code className="px-1.5 py-0.5 bg-card text-foreground/80 border border-foreground/15 rounded text-[12px] font-mono">
                  {children}
                </code>
              ) : (
                <div className="relative group">
                  <pre className="p-3 my-3 bg-card text-foreground/80 border border-foreground/15 rounded text-[12px] overflow-x-auto font-mono leading-tight">
                    <code>{children}</code>
                  </pre>
                </div>
              ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400 hover:text-blue-300 transition-colors"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-foreground/80 pl-4 py-1 my-4 text-foreground/80 italic">
                {children}
              </blockquote>
            ),
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>

      <div className="text-[11px] text-foreground/50 mt-2">
        <p>
          Deforge can make mistakes, test your workflow before deploying it.
        </p>
      </div>

      <div className="flex items-center gap-2 text-foreground border-t border-foreground/10 pt-2">
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

        {message.creditsUsed > 0 && (
          <div className="text-xs text-foreground/50 ml-auto flex items-center gap-1">
            <CircleDot className="size-[14px] opacity-60" />{" "}
            {message.creditsUsed}
          </div>
        )}
      </div>
    </div>
  );
}
