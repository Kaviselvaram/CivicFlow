import { NextResponse } from "next/server";
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

    if (!category || !address || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Category, address, and coordinates are required" },
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

    // Auto-generate ticketNumber (e.g. CF-1007)
    const count = await db.issue.count();
    const ticketNumber = `CF-${1000 + count + 1}`;

    // Auto-resolve department based on category
    const catConfig = CATEGORIES_CONFIG[category as IssueCategory];
    const deptSlug = catConfig?.departmentSlug || "public-works";
    const dept = await db.department.findUnique({
      where: { slug: deptSlug },
    });

    const newIssue = await db.issue.create({
      data: {
        ticketNumber,
        title: title || `${catConfig?.name || category} Observation`,
        description: description || "Defect observed by citizen.",
        category,
        priority: suggestedPriority || "MEDIUM",
        status: "REPORTED",
        address,
        latitude: Number(latitude),
        longitude: Number(longitude),
        ward: ward || "Ward 4 (Central)",
        photoUrl:
          photoUrl ||
          "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80",
        reporterId,
        departmentId: dept?.id || null,
      },
    });

    // Create initial audit trail event
    await db.statusHistory.create({
      data: {
        issueId: newIssue.id,
        fromStatus: "REPORTED",
        toStatus: "REPORTED",
        actorId: reporterId,
        note: "Issue observed and submitted via citizen mobile web app.",
      },
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
