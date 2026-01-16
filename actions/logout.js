"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();

  const cookieOptions = {
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".deforge.io" : "localhost",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  // You must pass the options to delete shared/cross-subdomain cookies
  cookieStore.delete({ name: "lastTeamId", ...cookieOptions });
  cookieStore.delete({ name: "token", ...cookieOptions });

  redirect("/");
}
