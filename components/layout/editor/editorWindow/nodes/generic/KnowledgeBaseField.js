import FilePicker from "./FilePicker";

export default function KnowledgeBaseField({
  field,
  currentValue,
  handleChange,
  isTemplate = false,
}) {
  return (
    <>
      <div key={field.name} className="mb-2 relative nodrag nopan">
        <div className="text-[10px] text-foreground/80 font-medium capitalize">
          {field.name}
        </div>
        <div className="flex items-center mt-0.5">
          <FilePicker
            field={field}
            onChange={handleChange}
            value={currentValue}
            isTemplate={isTemplate}
          />
        </div>
      </div>
    </>
  );
}
