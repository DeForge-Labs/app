import { NextResponse } from "next/server";
import { verifyToken } from "./lib/verify-token";

const unprotectedRoutes = [
  "/about-us",
  "/privacy",
  "/ToS",
  "/server-not-found",
];

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
    const { payload } = await verifyToken(`Bearer ${token.value}`);

    if (!payload) {
      if (pathname === "/") {
        return NextResponse.next();
      }
      const redirectResponse = NextResponse.redirect(new URL("/", req.url));
      return redirectResponse;
    }

    if (pathname === "/" && lastTeamId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!lastTeamId) {
      if (pathname !== "/teams") {
        return NextResponse.redirect(new URL("/teams", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);
    const redirectResponse = NextResponse.redirect(new URL("/", req.url));
    return redirectResponse;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)",
  ],
};
