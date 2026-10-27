import { runAIEvaluation } from "./ai-evaluation";
import { runSecurityAndLifecycleTests } from "./security-lifecycle";
import { runAnalyticsIntegrityTests } from "./analytics-integrity";

async function main() {
  console.log("══════════════════════════════════════════════════════════════════════");
  console.log("  CIVICFLOW INTEGRATED TEST SUITE: COMPLETE VERIFICATION RUN");
  console.log("══════════════════════════════════════════════════════════════════════\n");

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  // Check server liveness
  try {
    const healthCheck = await fetch(`${baseUrl}/api/issues`);
    if (!healthCheck.ok) {
      throw new Error(`Server returned status ${healthCheck.status}`);
    }
  } catch {
    console.error(`\n❌ CivicFlow web server is not reachable at ${baseUrl}.`);
    console.error("   Please ensure 'npm run dev' is running in another terminal.\n");
    process.exit(1);
  }

  const results: Record<string, boolean> = {};

  // 1. AI Evaluation
  try {
    await runAIEvaluation();
    results["AI Classification & Heuristic Engine"] = true;
  } catch (e) {
    console.error("AI Evaluation failed:", e);
    results["AI Classification & Heuristic Engine"] = false;
  }

  // 2. Security & Lifecycle Transitions
  try {
    await runSecurityAndLifecycleTests(baseUrl);
    results["Security, Authorization & Lifecycle Guard"] = true;
  } catch (e) {
    console.error("Security & Lifecycle Tests failed:", e);
    results["Security, Authorization & Lifecycle Guard"] = false;
  }

  // 3. Analytics Integrity
  try {
    await runAnalyticsIntegrityTests(baseUrl);
    results["Operational Analytics Data Consistency"] = true;
  } catch (e) {
    console.error("Analytics Integrity Tests failed:", e);
    results["Operational Analytics Data Consistency"] = false;
  }

  console.log("\n══════════════════════════════════════════════════════════════════════");
  console.log("  TEST SUITE EXECUTION SUMMARY");
  console.log("══════════════════════════════════════════════════════════════════════");

  let allPassed = true;
  for (const [suite, passed] of Object.entries(results)) {
    console.log(`  ${passed ? "✓ PASS" : "❌ FAIL"} — ${suite}`);
    if (!passed) allPassed = false;
  }
  console.log("══════════════════════════════════════════════════════════════════════\n");

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Unhandled error in test runner:", e);
  process.exit(1);
});
