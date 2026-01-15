import WorkflowProvider from "@/providers/WorkflowProvider";

export default function EditorLayout({ children, params }) {
  return <WorkflowProvider params={params}>{children}</WorkflowProvider>;
}
