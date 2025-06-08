"use client";

import { Button } from "@heroui/react";
import { Grid2X2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function DashboardButton() {
  const router = useRouter();
  const team = useSelector((state) => state.team.team);
  return (
    <>
      <Button
        variant="outline"
        size="md"
        className="border h-9 border-black/50 rounded-lg text-black/80 text-xs"
        onPress={() => {
          router.push(`/dashboard/${team?.id}`);
        }}
      >
        <Grid2X2 size={16} />
        Dashboard
      </Button>
    </>
  );
}
