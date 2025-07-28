"use client";

import { useSelector } from "react-redux";
import DeploymentTab from "../editor/editorWindow/DeploymentTab";
import FormToolPanel from "./FormToolPanel";
import FormRenderer from "./FormRenderer";

export default function FormWindow() {
  const panel = useSelector((state) => state.workflow.panel);

  return (
    <div className="flex flex-1">
      <div className="flex-1 relative flex flex-col">
        {panel === 1 && <FormRenderer />}
        {panel === 2 && <DeploymentTab padding={false} />}

        <FormToolPanel />
      </div>
    </div>
  );
}
