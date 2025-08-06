"use client";

import { useSelector } from "react-redux";
import Workspace from "./tabs/Workspace";
import Published from "./tabs/Published";
import Team from "./tabs/Team";
import Templates from "./tabs/Templates";

export default function TabViewer() {
  const tab = useSelector((state) => state.team.tab);

  if (tab === "workspaces") return <Workspace />;
  if (tab === "published") return <Published />;
  if (tab === "team") return <Team />;
  if (tab === "templates") return <Templates />;
}
