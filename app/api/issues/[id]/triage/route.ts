import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized: authentication required" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "AUTHORITY" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: authority role required to triage issues" },
        { status: 403 }
      );
    }

    const actorId = currentUser.id;

    const body = await req.json();
    const { departmentId, priority, crewId, note } = body;

    const validPriorities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(", ")}` },
        { status: 400 }
      );
    }

    const issue = await db.issue.findUnique({ where: { id } });
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (departmentId) updateData.departmentId = departmentId;
    if (priority) updateData.priority = priority;
    if (crewId !== undefined) updateData.crewId = crewId || null;
    updateData.assigneeId = actorId;

    const updatedIssue = await db.issue.update({
      where: { id },
      data: updateData,
    });

    // Record audit event
    await db.statusHistory.create({
      data: {
        issueId: id,
        fromStatus: issue.status,
        toStatus: issue.status,
        actorId,
        note: note || `Triage parameters updated: Priority set to ${priority || issue.priority}.`,
      },
    });

    return NextResponse.json({ success: true, issue: updatedIssue });
  } catch (error) {
    console.error("Triage update error:", error);
    return NextResponse.json(
      { error: "Failed to update triage details" },
      { status: 500 }
    );
  }
}
