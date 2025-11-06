import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import TeamRadioButton from "./TeamRadioButton";

import ErrorDialog from "@/components/ui/ErrorDialog";

const getAllTeams = async () => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/teams/list`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieHeader,
        },
        credentials: "include",
      }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default async function TeamMenuList() {
  const teamsData = await getAllTeams();

  if (!teamsData) {
    redirect("/server-not-found");
  }

  if (!teamsData?.success) {
    return <ErrorDialog error={teamsData?.message} />;
  }

  const teams = teamsData?.teams;

  if (!teams) {
    return <ErrorDialog error="Invalid team data" />;
  }

  return teams?.map((team, index) => {
    return <TeamRadioButton key={index} team={team} />;
  });
}
