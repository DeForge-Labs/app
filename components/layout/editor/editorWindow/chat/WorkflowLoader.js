import { Skeleton } from "@/components/ui/skeleton";
import NodeLoader from "../NodeLoader";

export default function WorkflowLoader() {
  return (
    <div className="absolute z-50 w-full h-full inset-0 flex flex-col-reverse items-end">
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -150;
          }
        }
      `}</style>
      <div className="p-2">
        <div className="bg-card p-4 rounded-lg flex items-center gap-3">
          <NodeLoader className="py-0" />

          <p className="text-xs font-medium">Working on it...</p>
        </div>
      </div>

      <svg
        className="absolute top-0 right-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="10 5"
          strokeDashoffset="0"
          rx="8"
          className="text-foreground opacity-20"
          style={{
            animation: "dash 1s linear infinite",
          }}
        />
      </svg>

      <div className="absolute top-0 right-0 w-full h-full dark:opacity-30">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}
