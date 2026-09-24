import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const issue = await db.issue.findUnique({
      where: { id },
      include: {
        reporter: {
          select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
        },
        department: {
          select: { id: true, name: true, slug: true, contactEmail: true, slaHoursDefault: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, phone: true },
        },
        crew: {
          select: { id: true, name: true, leadName: true, vehicleId: true, phone: true },
        },
        statusHistory: {
          orderBy: { createdAt: "asc" },
          include: {
            actor: {
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
    });

    if (!issue) {
      return NextResponse.json(
        { error: "Civic issue record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ issue });
  } catch (error) {
    console.error("Fetch issue detail error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve issue details" },
      { status: 500 }
    );
  }
}
