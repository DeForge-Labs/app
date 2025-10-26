import { NextResponse } from "next/server";

const unprotectedRoutes = ["/about-us", "/privacy", "/ToS"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token");
  const lastTeamId = req.cookies.get("lastTeamId");

  if (unprotectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/authenticate`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token.value}`,
        },
      }
    );

    const data = await response.json();

    if (!data.success || !response.ok) {
      const redirectResponse = NextResponse.redirect(new URL("/", req.url));
      return redirectResponse;
    }

    if (pathname === "/" && lastTeamId) {
      return NextResponse.redirect(
        new URL(`/dashboard/${lastTeamId.value}`, req.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);
    const redirectResponse = NextResponse.redirect(new URL("/", req.url));
    redirectResponse.cookies.delete("token");
    return redirectResponse;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)",
  ],
};
