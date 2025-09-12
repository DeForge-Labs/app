import FormNavbar from "@/components/layout/form/FormNavbar";
import FormWindow from "@/components/layout/form/FormWindow";
import LogWindow from "@/components/layout/editor/LogWindow";

export default function FormPage() {
  return (
    <div className="flex flex-col h-screen dark:bg-dark">
      <FormNavbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <FormWindow />
        <LogWindow isForm />
      </div>
    </div>
  );
}
