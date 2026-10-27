import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CATEGORIES_CONFIG, IssueCategory } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const currentUser = await getCurrentUser();

    const mine = searchParams.get("mine") === "true";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const departmentId = searchParams.get("departmentId");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (mine) {
      if (!currentUser) {
        // Return demo citizen's issues if guest viewing demo
        const demoCitizen = await db.user.findUnique({
          where: { email: "citizen@civicflow.org" },
        });
        where.reporterId = demoCitizen?.id;
      } else {
        where.reporterId = currentUser.id;
      }
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (priority && priority !== "ALL") {
      where.priority = priority;
    }

    if (departmentId && departmentId !== "ALL") {
      where.departmentId = departmentId;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { ticketNumber: { contains: q } },
        { title: { contains: q } },
        { description: { contains: q } },
        { address: { contains: q } },
      ];
    }

    const issues = await db.issue.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        reporter: {
          select: { id: true, name: true, email: true, phone: true },
        },
        department: {
          select: { id: true, name: true, slug: true },
        },
        crew: {
          select: { id: true, name: true, leadName: true },
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

    return NextResponse.json({ issues, total: issues.length });
  } catch (error) {
    console.error("Fetch issues error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve civic issues" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentUser = await getCurrentUser();

    const {
      title,
      description,
      category,
      address,
      latitude,
      longitude,
      ward,
      photoUrl,
      suggestedPriority,
    } = body;

    if (!category || !address || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Category, address, and coordinates are required" },
        { status: 400 }
      );
    }

    const latNum = Number(latitude);
    const lngNum = Number(longitude);
    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      return NextResponse.json(
        { error: "Invalid geographic coordinates provided" },
        { status: 400 }
      );
    }

    const validCategories = ["ROADS", "SANITATION", "WATER", "ELECTRICAL", "INFRASTRUCTURE", "TRAFFIC"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(", ")}` },
        { status: 400 }
      );
    }

    // Determine reporter
    let reporterId = currentUser?.id;
    if (!reporterId) {
      const demoCitizen = await db.user.findUnique({
        where: { email: "citizen@civicflow.org" },
      });
      reporterId = demoCitizen?.id;
    }

    if (!reporterId) {
      return NextResponse.json(
        { error: "No citizen account available for report association" },
        { status: 500 }
      );
    }

    // Safe sequential ticket number generation
    const latest = await db.issue.findFirst({
      orderBy: { createdAt: "desc" },
      select: { ticketNumber: true },
    });
    let nextSeq = 1001;
    if (latest?.ticketNumber?.startsWith("CF-")) {
      const parsedNum = parseInt(latest.ticketNumber.replace("CF-", ""), 10);
      if (!isNaN(parsedNum)) nextSeq = Math.max(nextSeq, parsedNum + 1);
    }
    const ticketNumber = `CF-${nextSeq}`;

    // Auto-resolve department based on category
    const catConfig = CATEGORIES_CONFIG[category as IssueCategory];
    const deptSlug = catConfig?.departmentSlug || "public-works";
    const dept = await db.department.findUnique({
      where: { slug: deptSlug },
    });

    // Persist base64 data URL to physical disk in public/uploads if necessary
    let persistedPhotoUrl =
      photoUrl ||
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80";

    if (photoUrl && typeof photoUrl === "string" && photoUrl.startsWith("data:image/")) {
      try {
        const matches = photoUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const rawExt = matches[1].toLowerCase();
          const ext = rawExt === "jpeg" ? "jpg" : rawExt;
          const buffer = Buffer.from(matches[2], "base64");
          const uploadDir = path.join(process.cwd(), "public", "uploads");
          await mkdir(uploadDir, { recursive: true });
          const uniqueId = crypto.randomBytes(8).toString("hex");
          const filename = `civic-${Date.now()}-${uniqueId}.${ext}`;
          await writeFile(path.join(uploadDir, filename), buffer);
          persistedPhotoUrl = `/uploads/${filename}`;
        }
      } catch (saveErr) {
        console.error("Error saving base64 image to public/uploads disk:", saveErr);
      }
    }

    // Atomic creation of Issue and initial StatusHistory audit trail
    const newIssue = await db.$transaction(async (tx) => {
      const created = await tx.issue.create({
        data: {
          ticketNumber,
          title: title?.trim() || `${catConfig?.name || category} Observation`,
          description: description?.trim() || "Defect observed by citizen.",
          category,
          priority: suggestedPriority || "MEDIUM",
          status: "REPORTED",
          address: address.trim(),
          latitude: latNum,
          longitude: lngNum,
          ward: ward || "Ward 4 (Central)",
          photoUrl: persistedPhotoUrl,
          reporterId: reporterId!,
          departmentId: dept?.id || null,
        },
      });

      await tx.statusHistory.create({
        data: {
          issueId: created.id,
          fromStatus: "REPORTED",
          toStatus: "REPORTED",
          actorId: reporterId!,
          note: "Issue observed and submitted via citizen platform.",
        },
      });

      return created;
    });

    return NextResponse.json(
      { success: true, issue: newIssue },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create issue error:", error);
    return NextResponse.json(
      { error: "Failed to create civic issue report" },
      { status: 500 }
    );
  }
}
