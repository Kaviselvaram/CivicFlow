import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
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
        { error: "Unauthorized: authentication required" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "AUTHORITY" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: authority role required to transition issue status" },
        { status: 403 }
      );
    }

    const actorId = currentUser.id;

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

    // Lifecycle State Machine: Valid transitions for authority operations
    const validTransitions: Record<string, string[]> = {
      REPORTED: ["IN_REVIEW", "ASSIGNED", "IN_PROGRESS"],
      IN_REVIEW: ["ASSIGNED", "IN_PROGRESS", "RESOLVED"],
      ASSIGNED: ["IN_PROGRESS", "RESOLVED", "IN_REVIEW"],
      IN_PROGRESS: ["RESOLVED", "ASSIGNED", "IN_REVIEW"],
      REOPENED: ["IN_REVIEW", "ASSIGNED", "IN_PROGRESS"],
      RESOLVED: ["IN_PROGRESS"], // Authority can resume work if needed
      VERIFIED: [], // Only citizens can reopen verified issues
    };

    const allowed = validTransitions[issue.status] || [];
    if (!allowed.includes(toStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status transition: cannot transition from ${issue.status} to ${toStatus}. Allowed transitions: ${allowed.join(", ") || "None"}`,
        },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      status: toStatus,
    };

    if (toStatus === "RESOLVED") {
      if (!note || !note.trim()) {
        return NextResponse.json(
          { error: "Resolution notes describing remediation work are required" },
          { status: 400 }
        );
      }
      updateData.resolvedAt = new Date();
      if (resolutionPhotoUrl) {
        let finalResPhoto = resolutionPhotoUrl;
        if (typeof resolutionPhotoUrl === "string" && resolutionPhotoUrl.startsWith("data:image/")) {
          try {
            const matches = resolutionPhotoUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
            if (matches) {
              const rawExt = matches[1].toLowerCase();
              const ext = rawExt === "jpeg" ? "jpg" : rawExt;
              const buffer = Buffer.from(matches[2], "base64");
              const uploadDir = path.join(process.cwd(), "public", "uploads");
              await mkdir(uploadDir, { recursive: true });
              const uniqueId = crypto.randomBytes(8).toString("hex");
              const filename = `civic-res-${Date.now()}-${uniqueId}.${ext}`;
              await writeFile(path.join(uploadDir, filename), buffer);
              finalResPhoto = `/uploads/${filename}`;
            }
          } catch (resSaveErr) {
            console.error("Error saving resolution photo to disk:", resSaveErr);
          }
        }
        updateData.resolutionPhotoUrl = finalResPhoto;
      }
      updateData.resolutionNotes = note.trim();
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
