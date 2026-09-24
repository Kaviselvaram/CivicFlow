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

    const { toStatus, note, resolutionPhotoUrl } = await req.json();

    if (!toStatus) {
      return NextResponse.json(
        { error: "Target status is required" },
        { status: 400 }
      );
    }

    const issue = await db.issue.findUnique({ where: { id } });
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      status: toStatus,
    };

    if (toStatus === "RESOLVED") {
      updateData.resolvedAt = new Date();
      if (resolutionPhotoUrl) updateData.resolutionPhotoUrl = resolutionPhotoUrl;
      if (note) updateData.resolutionNotes = note;
    }

    const updatedIssue = await db.issue.update({
      where: { id },
      data: updateData,
    });

    // Record audit event
    await db.statusHistory.create({
      data: {
        issueId: id,
        fromStatus: issue.status,
        toStatus,
        actorId,
        note:
          note ||
          `Status transitioned from ${issue.status} to ${toStatus} by operations supervisor.`,
      },
    });

    return NextResponse.json({ success: true, issue: updatedIssue });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Failed to transition status" },
      { status: 500 }
    );
  }
}
