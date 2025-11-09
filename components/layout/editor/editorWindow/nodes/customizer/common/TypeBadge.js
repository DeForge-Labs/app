import getColorByType from "@/lib/color-profile";
import { Badge } from "@/components/ui/badge";

export default function TypeBadge({ type }) {
  return (
    <Badge
      variant="outline"
      className="text-[10px] px-1.5 py-0.5 h-5 bg-foreground/5 w-fit flex justify-between items-center border border-foreground/5 text-foreground/70 capitalize"
    >
      <div
        className="h-2 w-2 rounded-full dark:border-foreground dark:border"
        style={{
          backgroundColor: getColorByType(type.toLowerCase()),
        }}
      />
      {type}
    </Badge>
  );
}
