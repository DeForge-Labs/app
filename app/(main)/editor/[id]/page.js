import EditorNavbar from "@/components/layout/editor/EditorNavbar";
import EditorWindow from "@/components/layout/editor/EditorWindow";
import LogWindow from "@/components/layout/editor/LogWindow";

export default function EditorPage() {
  return (
    <div className="flex flex-col h-screen dark:bg-dark">
      <EditorNavbar />
      <div className="flex-1 flex bg-foreground/5 pb-2 px-2">
        <div className="flex-1 flex flex-col overflow-hidden rounded-lg border border-foreground/15">
          <EditorWindow />
          <LogWindow />
        </div>
      </div>
    </div>
  );
}
