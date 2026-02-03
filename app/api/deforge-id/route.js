import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyToken } from "@/lib/verify-token";

function extractDeforgeIdFromPayload(payload) {
  if (!payload || typeof payload !== "object") return null;

  // First: explicit/common claim names
  const directCandidates = [
    payload.deforge_id,
    payload.deforgeId,
    payload.user_id,
    payload.userId,
    payload.id,
    payload.sub,
  ].filter(Boolean);

  const direct = directCandidates.find(
    (v) => typeof v === "string" && v.trim().length > 0
  );
  if (direct) return direct.trim();

  // Second: namespaced/custom claims (Auth0 commonly uses URL-like keys)
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value !== "string") continue;
    if (!value.trim()) continue;

    if (/deforge[_-]?id/i.test(key)) {
      return value.trim();
    }
  }

  return null;
}

export async function GET() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie?.value) {
    return NextResponse.json(
      { deforge_id: null, error: "missing_token" },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const { payload } = await verifyToken(`Bearer ${tokenCookie.value}`);
  const deforge_id = extractDeforgeIdFromPayload(payload);

  if (!deforge_id) {
    return NextResponse.json(
      { deforge_id: null, error: "missing_deforge_id" },
      {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return NextResponse.json(
    { deforge_id },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
