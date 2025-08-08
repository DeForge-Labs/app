"use client";

import { useSelector } from "react-redux";
import ShareButton from "./ShareButton";
import UseButton from "./UseButton";
import GetStartedButton from "./GetStartedButton";

export default function TemplateTool() {
  const template = useSelector((state) => state.template.template);
  const user = useSelector((state) => state.user.user);
  return (
    template && (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-32 flex items-end justify-center bg-gradient-to-t from-background to-transparent w-full dark:from-dark z-20">
        <div className="flex items-center gap-2 mb-5">
          {user && (
            <>
              <div className="relative">
                <div className="absolute top-0 left-0 rounded-full bg-black/50 dark:bg-background animate-ping-sm z-0 w-36 h-12"></div>
                <UseButton />
              </div>
              <ShareButton />
            </>
          )}

          {!user && (
            <div className="relative">
              <div className="absolute top-0 left-0 rounded-full bg-black/50 dark:bg-background animate-ping-sm z-0 w-36 h-12 text-center"></div>

              <GetStartedButton isNavbar />
            </div>
          )}
        </div>
      </div>
    )
  );
}
