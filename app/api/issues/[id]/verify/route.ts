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

    let actorId = currentUser?.id;
    if (!actorId) {
      const demoCitizen = await db.user.findUnique({
        where: { email: "citizen@civicflow.org" },
      });
      actorId = demoCitizen?.id;
    }

    if (!actorId) {
      return NextResponse.json(
        { error: "Citizen session required" },
        { status: 401 }
      );
    }

    const { citizenRating, citizenFeedback } = await req.json();

    const issue = await db.issue.findUnique({ where: { id } });
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const updatedIssue = await db.issue.update({
      where: { id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        citizenRating: citizenRating || 5,
        citizenFeedback: citizenFeedback || "Verified by citizen.",
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
