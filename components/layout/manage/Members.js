"use client";

import { Input } from "@heroui/react";
import InviteMembersButton from "./InviteMembersButton";
import { useState } from "react";
import { useSelector } from "react-redux";
import MemberCard from "./MemberCard";
import { useEffect } from "react";
import MemberLoading from "./MemberLoading";
import MemberEmptySearch from "./MemberEmptySearch";

export default function Members() {
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
    <main className="container mx-auto py-6">
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
