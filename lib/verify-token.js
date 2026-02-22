import { cookies } from "next/headers";

export async function verifyToken() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(`${process.env.API_URL}/verify/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Token verification failed");
    }

    return {
      payload: data,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return {
      payload: null,
    };
  }
}
