"use client";

import { Input } from "@heroui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import MemberEmptySearch from "../../manage/MemberEmptySearch";
import MemberLoading from "../../manage/MemberLoading";
import MemberCard from "../../manage/MemberCard";
import InviteMembersButton from "../../manage/InviteMembersButton";

export default function Team() {
  const [search, setSearch] = useState("");
  const members = useSelector((state) => state.team.members);
  const team = useSelector((state) => state.team.team);
  const isMemberInitializing = useSelector(
    (state) => state.team.isMembersInitializing
  );
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    if (!members) return;
    const filtered = members.filter((member) =>
      member.user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [search, members]);

  return (
    <main className="absolute h-full w-full overflow-hidden overflow-y-auto hide-scroll p-6">
      <div className="flex w-full justify-between items-center">
        <Input
          variant="outline"
          placeholder="Search Members"
          className="w-[350px] shadow-none border-black/50 border rounded-lg dark:border-background dark:text-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <InviteMembersButton />
      </div>

      {members && members.length > 0 && !isMemberInitializing && (
        <div className="flex flex-col gap-4 mt-4">
          {filteredMembers.map((member, index) => (
            <MemberCard key={index} member={member} team={team} />
          ))}
        </div>
      )}

      {isMemberInitializing && <MemberLoading />}

      {members && filteredMembers.length === 0 && !isMemberInitializing && (
        <MemberEmptySearch setSearch={setSearch} />
      )}
    </main>
  );
}
