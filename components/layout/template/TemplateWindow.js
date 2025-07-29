"use client";

import TemplateRenderer from "./TemplateRenderer";
import TemplateTool from "./TemplateTool";

export default function TemplateWindow() {
  return (
    <div className="flex flex-1">
      <div className="flex-1 relative flex flex-col">
        <TemplateRenderer />
        <TemplateTool />
      </div>
    </div>
  );
}
