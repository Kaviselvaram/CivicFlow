import { db } from "../lib/db";

export async function runAnalyticsIntegrityTests(baseUrl = "http://localhost:3000") {
  console.log("📈 Running CivicFlow Analytics Integrity & Data Consistency Tests...");

  const [
    dbTotal,
    dbReported,
    dbInProgress,
    dbResolved,
    dbVerified,
    dbReopened,
    dbCritical,
    dbHigh,
    dbMedium,
    dbLow,
    resolvedIssues,
  ] = await Promise.all([
    db.issue.count(),
    db.issue.count({ where: { status: "REPORTED" } }),
    db.issue.count({ where: { status: "IN_PROGRESS" } }),
    db.issue.count({ where: { status: "RESOLVED" } }),
    db.issue.count({ where: { status: "VERIFIED" } }),
    db.issue.count({ where: { status: "REOPENED" } }),
    db.issue.count({ where: { priority: "CRITICAL" } }),
    db.issue.count({ where: { priority: "HIGH" } }),
    db.issue.count({ where: { priority: "MEDIUM" } }),
    db.issue.count({ where: { priority: "LOW" } }),
    db.issue.findMany({
      where: { resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
    }),
  ]);

  const res = await fetch(`${baseUrl}/api/analytics`);
  if (!res.ok) throw new Error(`Analytics API returned status ${res.status}`);
  const data = await res.json();
  const summary = data.summary;

  console.log("\n[Test A1] Verifying Total Incidents Consistency...");
  if (summary.total !== dbTotal) {
    throw new Error(`Summary total ${summary.total} does not match DB count ${dbTotal}`);
  }
  console.log(`   ✓ Total Incidents match: ${summary.total} == ${dbTotal}`);

  console.log("\n[Test A2] Verifying Status Pipeline Breakdown...");
  if (
    summary.reported !== dbReported ||
    summary.inProgress !== dbInProgress ||
    summary.resolved !== dbResolved ||
    summary.verified !== dbVerified ||
    summary.reopened !== dbReopened
  ) {
    throw new Error("Status counts in summary do not match database counts");
  }
  console.log(
    `   ✓ Status counts confirmed (Reported: ${summary.reported}, InProgress: ${summary.inProgress}, Resolved: ${summary.resolved}, Verified: ${summary.verified}, Reopened: ${summary.reopened})`
  );

  console.log("\n[Test A3] Verifying Priority Distribution...");
  if (
    summary.critical !== dbCritical ||
    summary.high !== dbHigh ||
    summary.medium !== dbMedium ||
    summary.low !== dbLow
  ) {
    throw new Error("Priority counts in summary do not match database counts");
  }
  console.log(
    `   ✓ Priority counts confirmed (Critical: ${summary.critical}, High: ${summary.high}, Medium: ${summary.medium}, Low: ${summary.low})`
  );

  console.log("\n[Test A4] Verifying Mathematical Verification Rate...");
  const expectedRate =
    dbVerified + dbReopened > 0
      ? Math.round((dbVerified / (dbVerified + dbReopened)) * 100)
      : 0;
  if (summary.verificationRate !== expectedRate) {
    throw new Error(
      `Expected verificationRate ${expectedRate}%, but API returned ${summary.verificationRate}%`
    );
  }
  console.log(`   ✓ Verification Rate mathematically accurate: ${summary.verificationRate}% (expected ${expectedRate}%)`);

  console.log("\n[Test A5] Verifying Mean Time to Resolution (MTTR)...");
  let expectedAvgHours = 0.0;
  if (resolvedIssues.length > 0) {
    const totalMs = resolvedIssues.reduce((acc, r) => {
      return acc + (new Date(r.resolvedAt!).getTime() - new Date(r.createdAt).getTime());
    }, 0);
    expectedAvgHours = Number((totalMs / (resolvedIssues.length * 1000 * 60 * 60)).toFixed(1));
  }
  if (summary.averageResolutionHours !== expectedAvgHours) {
    throw new Error(
      `Expected averageResolutionHours ${expectedAvgHours}h, but API returned ${summary.averageResolutionHours}h`
    );
  }
  console.log(`   ✓ Average Resolution Time verified: ${summary.averageResolutionHours}h (expected ${expectedAvgHours}h)`);

  console.log("\n🎉 ALL ANALYTICS INTEGRITY TESTS PASSED ACCURATELY!");
}

if (require.main === module) {
  runAnalyticsIntegrityTests().catch((e) => {
    console.error("❌ Test failed:", e);
    process.exit(1);
  });
}
