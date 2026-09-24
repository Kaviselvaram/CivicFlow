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

    const { reopenReason } = await req.json();

    if (!reopenReason?.trim()) {
      return NextResponse.json(
        { error: "Reason for reopening is required" },
        { status: 400 }
      );
    }

    const issue = await db.issue.findUnique({ where: { id } });
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Escalate priority when reopened
    const escalatedPriority =
      issue.priority === "LOW" ? "MEDIUM" : "HIGH";

    const updatedIssue = await db.issue.update({
      where: { id },
      data: {
        status: "REOPENED",
        reopenedAt: new Date(),
        reopenReason: reopenReason.trim(),
        priority: escalatedPriority,
      },
    });

    // Record audit event
    await db.statusHistory.create({
      data: {
        issueId: id,
        fromStatus: issue.status,
        toStatus: "REOPENED",
        actorId,
        note: `REOPENED BY CITIZEN: "${reopenReason.trim()}". Priority escalated to ${escalatedPriority}.`,
      },
    });

    return NextResponse.json({ success: true, issue: updatedIssue });
  } catch (error) {
    console.error("Reopen error:", error);
    return NextResponse.json(
      { error: "Failed to reopen issue" },
      { status: 500 }
    );
  }
}
