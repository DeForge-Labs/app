import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyToken } from "@/lib/verify-token";

// Extract user ID from the /verify/session response.
//
// Shape returned by verifyController.verifySession:
//   { success: true, sessionData: <BetterAuth getSession() result> }
//
// BetterAuth getSession() returns:
//   { session: { id, userId, ... }, user: { id, name, email, ... } }
//
// So the full path from the frontend's `payload` variable is:
//   payload.sessionData.user.id   (preferred)
//   payload.sessionData.session.userId  (fallback)
function extractDeforgeIdFromPayload(payload) {
  if (!payload || typeof payload !== "object") return null;

  // Primary: BetterAuth sessionData.user.id
  const sessionData = payload.sessionData;
  if (sessionData && typeof sessionData === "object") {
    const baUser = sessionData.user;
    if (baUser && typeof baUser === "object") {
      const id = baUser.id ?? baUser.deforge_id ?? baUser.deforgeId;
      if (typeof id === "string" && id.trim()) return id.trim();
    }

    // Fallback: sessionData.session.userId
    const baSession = sessionData.session;
    if (baSession && typeof baSession === "object") {
      const id = baSession.userId ?? baSession.user_id;
      if (typeof id === "string" && id.trim()) return id.trim();
    }
  }

  return null;
}

export async function GET() {
  const cookieStore = await cookies();

  // Quick guard — verifyToken() itself reads cookies internally, but this avoids
  // a backend round-trip if the session cookie is obviously absent.
  const sessionCookie = cookieStore.get("token");
  if (!sessionCookie?.value) {
    return NextResponse.json(
      { deforge_id: null, error: "missing_session" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  // verifyToken forwards all cookies to the backend /verify/session endpoint.
  const { payload } = await verifyToken();

  if (!payload || !payload.success) {
    return NextResponse.json(
      { deforge_id: null, error: "session_invalid" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const deforge_id = extractDeforgeIdFromPayload(payload);

  if (!deforge_id) {
    return NextResponse.json(
      { deforge_id: null, error: "missing_deforge_id" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { deforge_id },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
