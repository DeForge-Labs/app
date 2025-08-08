"use client";

import Image from "next/image";
import { Select, SelectItem } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ThemeChanger from "../dashboard/ThemeChanger";
import GetStartedButton from "./GetStartedButton";
import { setSelectedTeam } from "@/redux/slice/templateSlice";
import { useEffect } from "react";

export default function TemplateNavbar() {
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const teams = useSelector((state) => state.template.teams);
  const selectedTeam = useSelector((state) => state.template.selectedTeam);
  const dispatch = useDispatch();

  useEffect(() => {
    if (teams.length > 0) {
      const teamId = localStorage.getItem(`team_${user.id}`);
      if (teamId && teams.find((team) => team.team.id === teamId)) {
        dispatch(setSelectedTeam(teamId));
      } else {
        dispatch(setSelectedTeam(teams[0].team.id));
      }
    }
  }, [teams]);

  return (
    <header className="sticky top-0 z-10">
      <div className="max-w-5xl px-8 mx-auto flex h-16 items-center justify-between py-10 border border-t-0 rounded-xl rounded-t-none border-black/50 bg-background dark:bg-dark dark:border-background">
        <div className="flex items-center gap-2">
          <Image
            src="/logo/logo-black.svg"
            alt="Logo"
            width={22}
            height={22}
            className="dark:invert"
          />
          <span className="font-bold inline-block text-2xl dark:text-background">
            Deforge
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeChanger />
          {!user && <GetStartedButton />}
          {user && (
            <Select
              classNames={{
                mainWrapper: "h-8",
                base: "",
                trigger:
                  "min-h-6 h-9 rounded-lg bg-dark dark:bg-background hover:text-black/80 group-data-[focus=true]:bg-black/80 text-black/80 border border-black/50 data-[hover=true]:bg-dark dark:border-background dark:text-black",
                label:
                  "group-data-[filled=true]:text-black/80 dark:group-data-[filled=true]:text-background -mt-3 ",
                selectorIcon:
                  "group-hover:text-background dark:group-hover:text-black text-background dark:text-dark dark:border-background",
                innerWrapper: "group",
                value: "text-black/80 group-hover:text-black",
                listbox: "dark:text-background",
              }}
              items={teams}
              placeholder="Team not selected"
              labelPlacement="outside"
              selectedKeys={selectedTeam ? new Set([selectedTeam]) : new Set()}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                dispatch(setSelectedTeam(selectedKey));
              }}
              renderValue={(items) => {
                return items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center w-32 line-clamp-1 gap-2 text-background group-hover:text-background text-xs dark:text-black dark:group-hover:text-black"
                  >
                    <span>{item.data.team.name}</span>
                  </div>
                ));
              }}
            >
              {(team) => (
                <SelectItem key={team.team.id} textValue={team.team.name}>
                  <div className="flex gap-2 items-center w-32 line-clamp-1">
                    <span className="text-small">{team.team.name}</span>
                  </div>
                </SelectItem>
              )}
            </Select>
          )}
        </div>
      </div>
    </header>
  );
}
