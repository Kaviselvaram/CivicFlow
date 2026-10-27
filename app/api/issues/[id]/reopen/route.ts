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
        { error: "Unauthorized: authentication required to reopen an issue" },
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

    // Only issues in RESOLVED or VERIFIED status can be reopened
    if (issue.status !== "RESOLVED" && issue.status !== "VERIFIED") {
      return NextResponse.json(
        {
          error: `Invalid transition: Only issues with status RESOLVED or VERIFIED can be reopened. Current status is ${issue.status}.`,
        },
        { status: 400 }
      );
    }

    // Citizen can only reopen their own reported issues (or ADMIN override)
    if (currentUser.role === "CITIZEN" && issue.reporterId !== currentUser.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only reopen your own reported issues" },
        { status: 403 }
      );
    }

    const actorId = currentUser.id;

    // Escalate priority when reopened
    const escalatedPriority =
      issue.priority === "LOW"
        ? "MEDIUM"
        : issue.priority === "MEDIUM"
        ? "HIGH"
        : "CRITICAL";

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
