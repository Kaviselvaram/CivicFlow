import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { persona } = await req.json();

    // Default to citizen if not specified
    const targetEmail =
      persona === "authority"
        ? "authority@civicflow.org"
        : "citizen@civicflow.org";

    const user = await db.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Demo persona not found. Please run seed script." },
        { status: 404 }
      );
    }

    const sessionPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "CITIZEN" | "AUTHORITY" | "ADMIN",
      departmentId: user.departmentId,
      avatarUrl: user.avatarUrl,
    };

    await setSessionCookie(sessionPayload);

    return NextResponse.json({
      success: true,
      user: sessionPayload,
    });
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: "Failed to switch demo persona" },
      { status: 500 }
    );
  }
}
