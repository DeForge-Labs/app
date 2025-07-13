"use client";

import { formatDistanceToNow } from "date-fns";
import { CalendarRange, User } from "lucide-react";

export default function MemberCard({ member }) {
  const timeAgo = formatDistanceToNow(member.joinedAt, { addSuffix: true });

  return (
    <div className="flex items-center justify-between p-3 border border-black/80 rounded-lg hover:shadow-md transition-colors dark:border-background dark:text-background">
      <div className="flex items-center">
        <div className="h-10 w-10  rounded-md flex text-black bg-black/5  items-center justify-center mr-4 dark:bg-white/5 dark:text-background">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{member?.user?.name}</h3>
          <div className="flex items-center text-xs text-black/80 mt-1 dark:text-background">
            <CalendarRange className="mr-1 h-3 w-3" />
            <span>Joined {timeAgo}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <div className="flex items-center capitalize bg-black/70 p-2 py-1 rounded-md text-xs text-[var(--primary)] dark:bg-white/5 dark:text-background">
          {member.role.toLowerCase()}
        </div>
      </div>
    </div>
  );
}
