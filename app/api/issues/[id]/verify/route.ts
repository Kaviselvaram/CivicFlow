import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized: authentication required to verify resolution" },
        { status: 401 }
      );
    }

    const { citizenRating, citizenFeedback } = await req.json();

    const issue = await db.issue.findUnique({ where: { id } });
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Only issues in RESOLVED status are eligible for citizen verification
    if (issue.status !== "RESOLVED") {
      return NextResponse.json(
        {
          error: `Invalid transition: Only issues with status RESOLVED can be verified. Current status is ${issue.status}.`,
        },
        { status: 400 }
      );
    }

    // Citizen can only verify their own reported issues (or ADMIN override)
    if (currentUser.role === "CITIZEN" && issue.reporterId !== currentUser.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only verify resolutions for your own reported issues" },
        { status: 403 }
      );
    }

    const rating = typeof citizenRating === "number" ? Math.min(5, Math.max(1, citizenRating)) : 5;
    const actorId = currentUser.id;

    const updatedIssue = await db.issue.update({
      where: { id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        citizenRating: rating,
        citizenFeedback: citizenFeedback || "Verified by resident in satisfactory condition.",
      },
    });

    // Record audit event
    await db.statusHistory.create({
      data: {
        issueId: id,
        fromStatus: issue.status,
        toStatus: "VERIFIED",
        actorId,
        note: `Citizen verified physical resolution. Awarded ${citizenRating || 5} Stars: "${citizenFeedback || "Satisfactory repair"}"`,
      },
    });

    return NextResponse.json({ success: true, issue: updatedIssue });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify issue resolution" },
      { status: 500 }
    );
  }
}
