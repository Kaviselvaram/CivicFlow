import { createSessionToken } from "../lib/auth";
import { db } from "../lib/db";

export async function runSecurityAndLifecycleTests(baseUrl = "http://localhost:3000") {
  console.log("🔒 Running CivicFlow Security, Authorization & Lifecycle Tests...");

  // 1. Setup test users and issue directly in database for controlled verification
  const citizen1 = await db.user.findUnique({ where: { email: "citizen@civicflow.org" } });
  const citizen2 = await db.user.findUnique({ where: { email: "elena@civicflow.org" } });
  const authority = await db.user.findUnique({ where: { email: "authority@civicflow.org" } });

  if (!citizen1 || !citizen2 || !authority) {
    throw new Error("Missing seeded test users. Please run npm run seed first.");
  }

  // Create valid tokens
  const tokenCitizen1 = await createSessionToken({
    id: citizen1.id,
    name: citizen1.name,
    email: citizen1.email,
    role: "CITIZEN",
    departmentId: citizen1.departmentId,
    avatarUrl: citizen1.avatarUrl,
  });

  const tokenCitizen2 = await createSessionToken({
    id: citizen2.id,
    name: citizen2.name,
    email: citizen2.email,
    role: "CITIZEN",
    departmentId: citizen2.departmentId,
    avatarUrl: citizen2.avatarUrl,
  });

  const tokenAuthority = await createSessionToken({
    id: authority.id,
    name: authority.name,
    email: authority.email,
    role: "AUTHORITY",
    departmentId: authority.departmentId,
    avatarUrl: authority.avatarUrl,
  });

  // Create isolated test issue reported by citizen1
  const testIssue = await db.issue.create({
    data: {
      ticketNumber: `CF-SEC-${Date.now().toString().slice(-4)}`,
      title: "Security Test Defect",
      description: "Automated security test payload",
      category: "ROADS",
      priority: "MEDIUM",
      status: "REPORTED",
      address: "100 Security Boulevard, Ward 4",
      latitude: 40.7128,
      longitude: -74.006,
      ward: "Ward 4 (Central)",
      photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80",
      reporterId: citizen1.id,
    },
  });

  const issueId = testIssue.id;

  try {
    // TEST S1: Unauthenticated triage mutation MUST return 401
    console.log("\n[Test S1] Verify unauthenticated request to /triage is rejected with 401...");
    const s1Res = await fetch(`${baseUrl}/api/issues/${issueId}/triage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: "CRITICAL" }),
    });
    if (s1Res.status !== 401) throw new Error(`Expected 401, got ${s1Res.status}`);
    console.log("   ✓ Unauthenticated triage blocked (401)");

    // TEST S2: Citizen attempting authority triage MUST return 403 Forbidden
    console.log("\n[Test S2] Verify citizen attempting authority triage is rejected with 403...");
    const s2Res = await fetch(`${baseUrl}/api/issues/${issueId}/triage`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `civicflow_session=${tokenCitizen1}`,
      },
      body: JSON.stringify({ priority: "CRITICAL" }),
    });
    if (s2Res.status !== 403) throw new Error(`Expected 403, got ${s2Res.status}`);
    console.log("   ✓ Citizen triage impersonation blocked (403)");

    // TEST S3: Authority triage mutation succeeds
    console.log("\n[Test S3] Verify authority triage mutation succeeds...");
    const s3Res = await fetch(`${baseUrl}/api/issues/${issueId}/triage`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `civicflow_session=${tokenAuthority}`,
      },
      body: JSON.stringify({ priority: "HIGH", note: "Escalated by supervisor." }),
    });
    if (!s3Res.ok) throw new Error(`Expected 200, got ${s3Res.status}`);
    console.log("   ✓ Authority triage authorized (200)");

    // TEST S4: Invalid status transition: jumping from REPORTED directly to VERIFIED must return 400
    console.log("\n[Test S4] Verify illegal lifecycle jump (REPORTED → VERIFIED) is rejected...");
    const s4Res = await fetch(`${baseUrl}/api/issues/${issueId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `civicflow_session=${tokenAuthority}`,
      },
      body: JSON.stringify({ toStatus: "VERIFIED" }),
    });
    if (s4Res.status !== 400) throw new Error(`Expected 400, got ${s4Res.status}`);
    console.log("   ✓ Invalid status transition rejected (400)");

    // TEST S5: RESOLVED status requires resolution notes
    console.log("\n[Test S5] Verify transition to RESOLVED without notes is rejected...");
    // First advance to IN_PROGRESS
    await fetch(`${baseUrl}/api/issues/${issueId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `civicflow_session=${tokenAuthority}`,
      },
      body: JSON.stringify({ toStatus: "IN_PROGRESS" }),
    });

    const s5Res = await fetch(`${baseUrl}/api/issues/${issueId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `civicflow_session=${tokenAuthority}`,
      },
      body: JSON.stringify({ toStatus: "RESOLVED", note: "" }),
    });
    if (s5Res.status !== 400) throw new Error(`Expected 400, got ${s5Res.status}`);
    console.log("   ✓ Missing resolution notes rejected (400)");

    // Successfully resolve with notes and proof
    await fetch(`${baseUrl}/api/issues/${issueId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `civicflow_session=${tokenAuthority}`,
      },
      body: JSON.stringify({
        toStatus: "RESOLVED",
        note: "Cavity patched with cold mix.",
        resolutionPhotoUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec",
      }),
    });

    // TEST S6: Another citizen cannot verify someone else's issue (must return 403)
    console.log("\n[Test S6] Verify citizen2 cannot verify citizen1's issue (cross-user verify)...");
    const s6Res = await fetch(`${baseUrl}/api/issues/${issueId}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `civicflow_session=${tokenCitizen2}`,
      },
      body: JSON.stringify({ citizenRating: 5 }),
    });
    if (s6Res.status !== 403) throw new Error(`Expected 403, got ${s6Res.status}`);
    console.log("   ✓ Cross-user verification blocked (403)");

    // TEST S7: Reporting citizen verifies their own resolved issue (200)
    console.log("\n[Test S7] Verify reporting citizen can verify their own resolved issue...");
    const s7Res = await fetch(`${baseUrl}/api/issues/${issueId}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `civicflow_session=${tokenCitizen1}`,
      },
      body: JSON.stringify({ citizenRating: 5, citizenFeedback: "Great work!" }),
    });
    if (!s7Res.ok) throw new Error(`Expected 200, got ${s7Res.status}`);
    console.log("   ✓ Legitimate verification succeeded (200)");

    // TEST S8: Citizen2 cannot reopen citizen1's issue (403)
    console.log("\n[Test S8] Verify citizen2 cannot reopen citizen1's issue (cross-user reopen)...");
    const s8Res = await fetch(`${baseUrl}/api/issues/${issueId}/reopen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `civicflow_session=${tokenCitizen2}`,
      },
      body: JSON.stringify({ reopenReason: "Not my issue anyway" }),
    });
    if (s8Res.status !== 403) throw new Error(`Expected 403, got ${s8Res.status}`);
    console.log("   ✓ Cross-user reopen blocked (403)");

    // TEST S9: Reporting citizen reopens verified issue with priority escalation
    console.log("\n[Test S9] Verify reporting citizen can reopen with priority escalation...");
    const s9Res = await fetch(`${baseUrl}/api/issues/${issueId}/reopen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `civicflow_session=${tokenCitizen1}`,
      },
      body: JSON.stringify({ reopenReason: "Asphalt washed away in heavy rain." }),
    });
    if (!s9Res.ok) throw new Error(`Expected 200, got ${s9Res.status}`);
    const s9Data = await s9Res.json();
    if (s9Data.issue.status !== "REOPENED") throw new Error("Status should be REOPENED");
    console.log(`   ✓ Reopen succeeded: Status ${s9Data.issue.status}, Escalated Priority: ${s9Data.issue.priority}`);

    // TEST S10: Unauthenticated file upload is rejected (401)
    console.log("\n[Test S10] Verify unauthenticated upload to /api/upload is rejected with 401...");
    const s10Res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
    });
    if (s10Res.status !== 401) throw new Error(`Expected 401, got ${s10Res.status}`);
    console.log("   ✓ Unauthenticated upload blocked (401)");

    console.log("\n🎉 ALL 10 SECURITY & LIFECYCLE TESTS PASSED CLEANLY!");
  } finally {
    // Clean up test issue
    await db.statusHistory.deleteMany({ where: { issueId } });
    await db.issue.delete({ where: { id: issueId } }).catch(() => {});
  }
}

if (require.main === module) {
  runSecurityAndLifecycleTests().catch((e) => {
    console.error("❌ Test failed:", e);
    process.exit(1);
  });
}
