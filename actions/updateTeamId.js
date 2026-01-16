"use server";

import { cookies } from "next/headers";

export async function updateLastTeamIdCookie(value) {
  const cookieStore = await cookies();

  cookieStore.set("lastTeamId", value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: process.env.NODE_ENV === "production" ? ".deforge.io" : "localhost",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}
