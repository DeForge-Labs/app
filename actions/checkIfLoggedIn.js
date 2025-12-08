"use server";

import { verifyToken } from "@/lib/verify-token";
import { cookies } from "next/headers";

export async function checkIfLogin() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token");

    if (!token || !token.value) {
      return false;
    }

    const { payload } = await verifyToken(`Bearer ${token.value}`);

    if (!payload) {
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
