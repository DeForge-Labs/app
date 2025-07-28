import WorkflowProvider from "@/providers/WorkflowProvider";

export default function FormLayout({ children, params }) {
  return <WorkflowProvider params={params}>{children}</WorkflowProvider>;
}
