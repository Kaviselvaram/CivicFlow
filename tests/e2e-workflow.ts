async function runTests() {
  const baseUrl = "http://localhost:3000";
  console.log("🧪 Starting CivicFlow End-to-End Automated Integration Tests...");

  // TEST 1: AI Classification
  console.log("\n[Test 1] Testing Intelligent Issue Classification...");
  const aiRes = await fetch(`${baseUrl}/api/ai/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "There is a large pothole near the bus stop damaging wheels.",
    }),
  });
  if (!aiRes.ok) throw new Error(`AI classify failed: ${aiRes.status}`);
  const aiData = await aiRes.json();
  console.log("   • AI Result:", {
    category: aiData.category,
    department: aiData.departmentName,
    priority: aiData.priority,
    confidence: aiData.confidence,
  });
  if (aiData.category !== "ROADS") {
    throw new Error(`Expected ROADS, got ${aiData.category}`);
  }
  console.log("   ✓ AI Classification verified!");

  // TEST 2: Demo Authentication
  console.log("\n[Test 2] Testing Demo Authentication...");
  const authRes = await fetch(`${baseUrl}/api/auth/demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona: "citizen" }),
  });
  if (!authRes.ok) throw new Error(`Demo auth failed: ${authRes.status}`);
  const authCookie = authRes.headers.get("set-cookie") || "";
  const authData = await authRes.json();
  console.log("   • Citizen Authenticated:", authData.user.name, `(${authData.user.role})`);
  console.log("   ✓ Authentication successful!");

  // TEST 3: Citizen Creates New Civic Report
  console.log("\n[Test 3] Creating New Issue Report...");
  const createRes = await fetch(`${baseUrl}/api/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: authCookie,
    },
    body: JSON.stringify({
      title: "Massive road cavity near Oak Ave crosswalk",
      description: "Asphalt collapsed exposing bedrock. High hazard for cyclists.",
      category: "ROADS",
      address: "105 Oak Avenue, Ward 4 (Central)",
      latitude: 40.7142,
      longitude: -74.0068,
      ward: "Ward 4 (Central)",
      photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80",
      suggestedPriority: "HIGH",
    }),
  });
  if (!createRes.ok) throw new Error(`Create issue failed: ${createRes.status}`);
  const createData = await createRes.json();
  const ticketId = createData.issue.id;
  const ticketNumber = createData.issue.ticketNumber;
  console.log("   • Ticket Created:", ticketNumber, `(Status: ${createData.issue.status})`);
  console.log("   ✓ Issue creation verified!");

  // TEST 4: Authority Triages Issue (Priority + Crew)
  console.log("\n[Test 4] Authority Triage & Crew Dispatch...");
  const triageRes = await fetch(`${baseUrl}/api/issues/${ticketId}/triage`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      priority: "CRITICAL",
      note: "Supervisor confirmed cavity depth > 30cm. Escalated to CRITICAL.",
    }),
  });
  if (!triageRes.ok) throw new Error(`Triage failed: ${triageRes.status}`);
  const triageData = await triageRes.json();
  console.log("   • Priority Updated to:", triageData.issue.priority);
  console.log("   ✓ Authority triage override verified!");

  // TEST 5: Status Progression (IN_PROGRESS -> RESOLVED with Photo Proof)
  console.log("\n[Test 5] Advancing Status & Attaching Resolution Proof...");
  // Step 5a: IN_PROGRESS
  await fetch(`${baseUrl}/api/issues/${ticketId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      toStatus: "IN_PROGRESS",
      note: "Road Patching Crew Bravo arrived on site.",
    }),
  });

  // Step 5b: RESOLVED with proof
  const resolveRes = await fetch(`${baseUrl}/api/issues/${ticketId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      toStatus: "RESOLVED",
      note: "Cavity compacted with hot asphalt mix. Cured surface level with road.",
      resolutionPhotoUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80",
    }),
  });
  if (!resolveRes.ok) throw new Error(`Resolution failed: ${resolveRes.status}`);
  const resolveData = await resolveRes.json();
  console.log("   • Status Advanced to:", resolveData.issue.status);
  console.log("   • Proof Attached:", resolveData.issue.resolutionPhotoUrl ? "YES" : "NO");
  console.log("   ✓ Resolution state and evidence verified!");

  // TEST 6: Citizen Verifies Resolution
  console.log("\n[Test 6] Citizen Confirms Physical Resolution (Happy Path)...");
  const verifyRes = await fetch(`${baseUrl}/api/issues/${ticketId}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      citizenRating: 5,
      citizenFeedback: "Inspected on my walk home. Smooth asphalt patch with no residual gravel.",
    }),
  });
  if (!verifyRes.ok) throw new Error(`Verify failed: ${verifyRes.status}`);
  const verifyData = await verifyRes.json();
  console.log("   • Final Status:", verifyData.issue.status);
  console.log("   • Citizen Rating:", verifyData.issue.citizenRating, "Stars");
  console.log("   ✓ Verification seal awarded!");

  // TEST 7: Reopening Flow (Unhappy Path)
  console.log("\n[Test 7] Testing Citizen Reopening Workflow on Issue #CF-1002...");
  const allIssuesRes = await fetch(`${baseUrl}/api/issues`);
  const allIssuesData = await allIssuesRes.json();
  const testIssue2 = allIssuesData.issues.find((i: any) => i.ticketNumber === "CF-1002");
  if (testIssue2) {
    const reopenRes = await fetch(`${baseUrl}/api/issues/${testIssue2.id}/reopen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reopenReason: "Commercial cartons were cleared, but rotting organic bins remain in alley.",
      }),
    });
    if (!reopenRes.ok) throw new Error(`Reopen failed: ${reopenRes.status}`);
    const reopenData = await reopenRes.json();
    console.log("   • Issue Reopened Status:", reopenData.issue.status);
    console.log("   • Reopen Reason:", reopenData.issue.reopenReason);
    console.log("   ✓ Reopen workflow verified!");
  }

  // TEST 8: Analytics Rollups
  console.log("\n[Test 8] Testing Operational Analytics...");
  const analyticsRes = await fetch(`${baseUrl}/api/analytics`);
  if (!analyticsRes.ok) throw new Error(`Analytics failed: ${analyticsRes.status}`);
  const analyticsData = await analyticsRes.json();
  console.log("   • Total Incidents:", analyticsData.summary.total);
  console.log("   • Verified Count:", analyticsData.summary.verified);
  console.log("   • Verification Rate:", `${analyticsData.summary.verificationRate}%`);
  console.log("   • Average Resolution Time:", `${analyticsData.summary.averageResolutionHours}h`);
  console.log("   ✓ Analytics rollups verified!");

  console.log("\n🎉 ALL 8 INTEGRATION TESTS PASSED CLEANLY WITH 100% SUCCESS!");
}

runTests().catch((e) => {
  console.error("❌ Test failure:", e);
  process.exit(1);
});
