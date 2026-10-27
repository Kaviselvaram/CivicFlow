import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [
      total,
      reported,
      inReview,
      assigned,
      inProgress,
      resolved,
      verified,
      reopened,
      critical,
      high,
      medium,
      low,
      allIssues,
      recentHistory,
      departments,
    ] = await Promise.all([
      db.issue.count(),
      db.issue.count({ where: { status: "REPORTED" } }),
      db.issue.count({ where: { status: "IN_REVIEW" } }),
      db.issue.count({ where: { status: "ASSIGNED" } }),
      db.issue.count({ where: { status: "IN_PROGRESS" } }),
      db.issue.count({ where: { status: "RESOLVED" } }),
      db.issue.count({ where: { status: "VERIFIED" } }),
      db.issue.count({ where: { status: "REOPENED" } }),
      db.issue.count({ where: { priority: "CRITICAL" } }),
      db.issue.count({ where: { priority: "HIGH" } }),
      db.issue.count({ where: { priority: "MEDIUM" } }),
      db.issue.count({ where: { priority: "LOW" } }),
      db.issue.findMany({
        select: {
          id: true,
          category: true,
          ward: true,
          createdAt: true,
          resolvedAt: true,
        },
      }),
      db.statusHistory.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          issue: {
            select: { ticketNumber: true, title: true, category: true },
          },
          actor: {
            select: { name: true, role: true },
          },
        },
      }),
      db.department.findMany({
        include: {
          _count: {
            select: { issues: true },
          },
        },
      }),
    ]);

    // Calculate category breakdown
    const categoryCounts: Record<string, number> = {};
    const wardCounts: Record<string, number> = {};
    let totalResolvedDurationMs = 0;
    let resolvedItemCount = 0;

    for (const item of allIssues) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      const wardKey = item.ward || "Central";
      wardCounts[wardKey] = (wardCounts[wardKey] || 0) + 1;

      if (item.resolvedAt) {
        totalResolvedDurationMs +=
          new Date(item.resolvedAt).getTime() - new Date(item.createdAt).getTime();
        resolvedItemCount++;
      }
    }

    const averageResolutionHours =
      resolvedItemCount > 0
        ? Number((totalResolvedDurationMs / (resolvedItemCount * 1000 * 60 * 60)).toFixed(1))
        : 0.0;

    const verificationRate =
      verified + reopened > 0
        ? Math.round((verified / (verified + reopened)) * 100)
        : 0;

    return NextResponse.json({
      summary: {
        total,
        reported,
        inReview,
        assigned,
        inProgress,
        resolved,
        verified,
        reopened,
        critical,
        high,
        medium,
        low,
        averageResolutionHours,
        verificationRate,
      },
      categoryCounts,
      wardCounts,
      departmentStats: departments.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        slaHoursDefault: d.slaHoursDefault,
        totalIssues: d._count.issues,
      })),
      recentActivity: recentHistory.map((h) => ({
        id: h.id,
        ticketNumber: h.issue.ticketNumber,
        title: h.issue.title,
        category: h.issue.category,
        fromStatus: h.fromStatus,
        toStatus: h.toStatus,
        note: h.note,
        actorName: h.actor.name,
        actorRole: h.actor.role,
        createdAt: h.createdAt,
      })),
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to generate operational analytics" },
      { status: 500 }
    );
  }
}
