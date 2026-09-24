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

    // Default to demo authority if testing as guest
    let actorId = currentUser?.id;
    if (!actorId) {
      const demoAuth = await db.user.findUnique({
        where: { email: "authority@civicflow.org" },
      });
      actorId = demoAuth?.id;
    }

    if (!actorId) {
      return NextResponse.json(
        { error: "Unauthorized: authority session required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { departmentId, priority, crewId, note } = body;

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
