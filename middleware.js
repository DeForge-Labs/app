import { NextResponse } from "next/server";
import { verifyToken } from "./lib/verify-token";

const unprotectedRoutes = [
  "/about-us",
  "/privacy",
  "/ToS",
  "/server-not-found",
];

const semiProtectedRoutes = ["/template"];

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get("token");
  const lastTeamId = req.cookies.get("lastTeamId");

  if (unprotectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname === "/") return NextResponse.next();

    if (semiProtectedRoutes.some((route) => pathname.startsWith(route))) {
      const response = NextResponse.next();
      response.headers.set("X-User-Status", "inactive");
      return response;
    }

    const loginUrl = new URL("/", req.url);
    if (search) {
      loginUrl.search = search;
    }
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await verifyToken(`Bearer ${token.value}`);

    if (!payload) {
      if (pathname === "/") return NextResponse.next();

      const loginUrl = new URL("/", req.url);
      if (search) loginUrl.search = search;
      return NextResponse.redirect(loginUrl);
    }

    if (pathname === "/" && lastTeamId) {
      const dashboardUrl = new URL("/dashboard", req.url);
      if (search) dashboardUrl.search = search;
      return NextResponse.redirect(dashboardUrl);
    }

    if (!lastTeamId && pathname !== "/teams") {
      const teamsUrl = new URL("/teams", req.url);
      if (search) teamsUrl.search = search;
      return NextResponse.redirect(teamsUrl);
    }

    const response = NextResponse.next();
    response.headers.set("X-User-Status", "active");
    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)",
  ],
};
