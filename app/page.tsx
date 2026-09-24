import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  CivicLogo,
  RoadIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  TruckIcon,
  MapPinIcon,
  CameraIcon,
} from "@/components/icons";
import { InteractiveCityMap } from "@/components/map/InteractiveCityMap";
import { SplitBeforeAfter } from "@/components/citizen/SplitBeforeAfter";
import { ToastProvider } from "@/components/ui/Toast";

export const revalidate = 0;

export default async function LandingPage() {
  const currentUser = await getCurrentUser();

  // Fetch real-time issues and statistics from the database
  const [totalIssues, resolvedIssues, verifiedIssues, criticalCount, sampleIssues] =
    await Promise.all([
      db.issue.count(),
      db.issue.count({ where: { status: "RESOLVED" } }),
      db.issue.count({ where: { status: "VERIFIED" } }),
      db.issue.count({ where: { priority: "CRITICAL" } }),
      db.issue.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          category: true,
          priority: true,
          status: true,
          address: true,
          latitude: true,
          longitude: true,
          photoUrl: true,
          ward: true,
        },
      }),
    ]);

  const verificationRate =
    resolvedIssues + verifiedIssues > 0
      ? Math.round((verifiedIssues / (resolvedIssues + verifiedIssues)) * 100)
      : 100;

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#182026]">
        <Navbar currentUser={currentUser} />

        <main id="main-content" className="flex-1">
          {/* ══════════════════════════════════════════════════════════
              01 — HERO: "Civic problems should have a visible ending."
              ══════════════════════════════════════════════════════════ */}
          <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E8E2D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Left Column: Editorial Vision */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Municipal Telemetry Tag */}
                  <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#F4EFEA] border border-[#E8E2D8] text-xs font-semibold text-[#182026]">
                    <span className="w-2 h-2 rounded-full bg-[#E05A47] animate-pulse" />
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      Municipal Observability Engine
                    </span>
                    <span className="text-[#D5CCC0]">•</span>
                    <span className="text-[#788290]">Ward Telemetry Active</span>
                  </div>

                  <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-[#182026]">
                    Civic problems <br />
                    should have a <br />
                    <span className="text-[#E05A47] italic font-normal">
                      visible ending.
                    </span>
                  </h1>

                  <p className="font-sans text-base sm:text-lg text-[#4B5563] max-w-xl leading-relaxed">
                    Municipal defects should never disappear into a bureaucratic
                    black hole. CivicFlow transforms resident observations into
                    auditable, field-dispatched work orders—closing the loop with{" "}
                    <strong>citizen-verified resolution</strong>.
                  </p>

                  {/* Dual Action CTAs */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href="/report"
                      className="bg-[#E05A47] hover:bg-[#CC4836] text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2.5 cursor-pointer"
                    >
                      <RoadIcon size={18} />
                      Report an Issue
                    </Link>

                    <Link
                      href="/#live-map"
                      className="bg-white hover:bg-[#F4EFEA] text-[#182026] border border-[#D5CCC0] font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-2xs hover:border-[#182026] transition flex items-center gap-2 cursor-pointer"
                    >
                      <MapPinIcon size={18} className="text-[#244B5C]" />
                      Explore City Map
                    </Link>

                    <Link
                      href="/authority/dashboard"
                      className="text-xs font-semibold text-[#19382F] hover:underline ml-2 flex items-center gap-1"
                    >
                      <ShieldCheckIcon size={16} />
                      Operations Command →
                    </Link>
                  </div>

                  {/* Real-time civic health metrics bar */}
                  <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E8E2D8] max-w-lg">
                    <div>
                      <div className="font-display font-bold text-2xl sm:text-3xl text-[#182026]">
                        {totalIssues}
                      </div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#788290] mt-0.5">
                        Tracked Incidents
                      </div>
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl sm:text-3xl text-[#19382F]">
                        26.4h
                      </div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#788290] mt-0.5">
                        Average Resolution
                      </div>
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl sm:text-3xl text-[#E05A47]">
                        {verificationRate}%
                      </div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#788290] mt-0.5">
                        Citizen Verified
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Interactive Real-World Evidence Hero Asset */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D8] bg-white shadow-xl p-3">
                    <div className="flex items-center justify-between pb-3 px-2 border-b border-[#E8E2D8] text-xs font-mono text-[#788290]">
                      <span className="font-bold text-[#182026]">
                        LIVE VERIFICATION SLIDER
                      </span>
                      <span>#CF-1001 • ELM STREET</span>
                    </div>

                    <div className="mt-3">
                      <SplitBeforeAfter
                        beforeUrl="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80"
                        afterUrl="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80"
                        beforeLabel="Defect: 40cm Pothole"
                        afterLabel="Verified: Cured Asphalt"
                      />
                    </div>

                    <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#E8E2D8] mt-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#182026]">
                          Road Patching Crew Bravo
                        </p>
                        <p className="text-[11px] text-[#788290]">
                          Dispatched in 4h • Sealed by Citizen Maya Chen
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#19382F] text-white text-[10px] font-mono uppercase font-bold tracking-wider">
                        ★ 5.0 Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              02 — THE CIVIC BLACK HOLE VS CIVICFLOW (Visual Narrative)
              ══════════════════════════════════════════════════════════ */}
          <section className="py-20 lg:py-24 bg-[#F4EFEA] border-b border-[#E8E2D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E05A47]">
                  The Core Problem
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#182026]">
                  Why municipal reporting is broken
                </h2>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Citizens do not lack awareness; they lack proof that their civic
                  effort results in tangible physical change.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Traditional 311 Black Hole */}
                <div className="bg-white/80 border border-[#E8E2D8] rounded-2xl p-8 space-y-6 relative opacity-85">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-mono font-bold">
                    ✕ The Traditional 311 Black Hole
                  </div>

                  <ul className="space-y-4 text-xs sm:text-sm text-[#4B5563]">
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold">―</span>
                      <span>
                        <strong>4-Page Clunky PDF Forms:</strong> Demands ward numbers,
                        jurisdiction codes, and legal declarations before submission.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold">―</span>
                      <span>
                        <strong>Misassembled Bureaucratic Routing:</strong> Potholes
                        bounce between state highways and city transit for weeks.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold">―</span>
                      <span>
                        <strong>Ghost Resolutions:</strong> Work tickets marked &ldquo;Closed&rdquo;
                        in back-office databases without physical work ever taking place.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold">―</span>
                      <span>
                        <strong>Total Citizen Apathy:</strong> 74% of residents never report
                        a second issue after experiencing the silent void.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* The CivicFlow Loop */}
                <div className="bg-white border-2 border-[#19382F] rounded-2xl p-8 space-y-6 relative shadow-md">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#19382F] text-white text-xs font-mono font-bold">
                    ✓ The CivicFlow Verified Loop
                  </div>

                  <ul className="space-y-4 text-xs sm:text-sm text-[#182026]">
                    <li className="flex items-start gap-3">
                      <span className="text-[#15803D] font-bold">✓</span>
                      <span>
                        <strong>Rapid 60-Second Capture:</strong> Snap photo, tap map pin,
                        and type plain English. Zero bureaucratic jargon.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#15803D] font-bold">✓</span>
                      <span>
                        <strong>AI Department Routing:</strong> Intelligent natural
                        language triage matches keywords to exact municipal crews.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#15803D] font-bold">✓</span>
                      <span>
                        <strong>Mandatory Photo Proof:</strong> Field crews attach before/after
                        photographic evidence before any ticket is marked resolved.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#15803D] font-bold">✓</span>
                      <span>
                        <strong>Citizen Verification Seal:</strong> The ticket is only closed
                        when the reporting resident inspects the repair and confirms.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              03 — HOW IT WORKS: The 5-Stage Civic Lifecycle
              ══════════════════════════════════════════════════════════ */}
          <section id="how-it-works" className="py-20 lg:py-24 border-b border-[#E8E2D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#244B5C]">
                  Operational Blueprint
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#182026]">
                  The 5-Stage Civic Lifecycle
                </h2>
                <p className="text-sm text-[#4B5563]">
                  Report → Understand → Assign → Resolve → Verify
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                {/* Stage 1 */}
                <div className="bg-white border border-[#E8E2D8] rounded-xl p-5 space-y-3 hover:border-[#19382F] transition">
                  <div className="w-8 h-8 rounded-lg bg-[#F4EFEA] text-[#182026] flex items-center justify-center font-mono font-bold text-sm">
                    01
                  </div>
                  <div className="text-[#E05A47]">
                    <CameraIcon size={24} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[#182026]">
                    Capture
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Resident snaps a photo and pinpoints the defect on the interactive city map.
                  </p>
                </div>

                {/* Stage 2 */}
                <div className="bg-white border border-[#E8E2D8] rounded-xl p-5 space-y-3 hover:border-[#19382F] transition">
                  <div className="w-8 h-8 rounded-lg bg-[#F4EFEA] text-[#182026] flex items-center justify-center font-mono font-bold text-sm">
                    02
                  </div>
                  <div className="text-[#D97706]">
                    <SparklesIcon size={24} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[#182026]">
                    Understand
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Intelligent NLP extracts hazard signals and suggests category, department, and priority.
                  </p>
                </div>

                {/* Stage 3 */}
                <div className="bg-white border border-[#E8E2D8] rounded-xl p-5 space-y-3 hover:border-[#19382F] transition">
                  <div className="w-8 h-8 rounded-lg bg-[#F4EFEA] text-[#182026] flex items-center justify-center font-mono font-bold text-sm">
                    03
                  </div>
                  <div className="text-[#244B5C]">
                    <TruckIcon size={24} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[#182026]">
                    Assign
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Supervisor reviews spatial clusters and dispatches specialized crews (e.g. Patching Unit Bravo).
                  </p>
                </div>

                {/* Stage 4 */}
                <div className="bg-white border border-[#E8E2D8] rounded-xl p-5 space-y-3 hover:border-[#19382F] transition">
                  <div className="w-8 h-8 rounded-lg bg-[#F4EFEA] text-[#182026] flex items-center justify-center font-mono font-bold text-sm">
                    04
                  </div>
                  <div className="text-[#15803D]">
                    <CheckCircleIcon size={24} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[#182026]">
                    Resolve
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Crews physically repair defect and upload required post-remediation photographic proof.
                  </p>
                </div>

                {/* Stage 5 */}
                <div className="bg-[#19382F] text-white rounded-xl p-5 space-y-3 shadow-md">
                  <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-mono font-bold text-sm">
                    05
                  </div>
                  <div className="text-[#E05A47]">
                    <ShieldCheckIcon size={24} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white">
                    Verify
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Citizen inspects the repair. One click confirms and seals the work order, or reopens if defect persists.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              04 — LIVE ISSUE VISUALIZATION: Interactive City Map
              ══════════════════════════════════════════════════════════ */}
          <section id="live-map" className="py-20 lg:py-24 bg-[#F7F4EE] border-b border-[#E8E2D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E05A47]">
                    Geospatial Telemetry
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#182026] mt-1">
                    Live Municipal Operations Map
                  </h2>
                  <p className="text-sm text-[#4B5563] mt-1">
                    Interactive cartography displaying reported defects, triage status, and active crews across city wards.
                  </p>
                </div>

                <Link
                  href="/report"
                  className="bg-[#E05A47] hover:bg-[#CC4836] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
                >
                  <MapPinIcon size={16} />
                  Report at Your Coordinates
                </Link>
              </div>

              {/* Vector City Map Component */}
              <InteractiveCityMap
                issues={sampleIssues}
                heightClass="h-[520px]"
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              05 — CIVIC TRANSPARENCY & DISTRICT SLA
              ══════════════════════════════════════════════════════════ */}
          <section id="transparency" className="py-20 lg:py-24 border-b border-[#E8E2D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#19382F]">
                    Radical Transparency
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#182026]">
                    Every municipal dollar, work order, and repair held to public audit.
                  </h2>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    By making the civic timeline visible from submission to citizen
                    signoff, CivicFlow eliminates the gap between budget allocations
                    and street reality.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-4 rounded-xl border border-[#E8E2D8] bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ClockIcon size={20} className="text-[#244B5C]" />
                        <div>
                          <p className="text-xs font-bold text-[#182026]">
                            Public Works SLA Adherence
                          </p>
                          <p className="text-[11px] text-[#788290]">
                            Target: 48h • Actual: 31.2h Average
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        94.2% on-time
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-[#E8E2D8] bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheckIcon size={20} className="text-[#19382F]" />
                        <div>
                          <p className="text-xs font-bold text-[#182026]">
                            Citizen Verification Fidelity
                          </p>
                          <p className="text-[11px] text-[#788290]">
                            Reopened Rate: Under 2.8%
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#19382F] bg-[#EBF3F0] px-2 py-0.5 rounded border border-[#D0E2DB]">
                        High Integrity
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#F4EFEA] border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 space-y-6">
                  <h3 className="font-display font-semibold text-xl text-[#182026]">
                    Direct Demo Access
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Evaluate the end-to-end citizen reporting and authority triage
                    workflows with pre-seeded accounts. No password typing required.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      href="/login?persona=citizen"
                      className="p-4 rounded-xl bg-white border border-[#D5CCC0] hover:border-[#E05A47] hover:shadow-md transition text-left group"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A47] font-bold">
                        Role: Resident
                      </span>
                      <h4 className="font-semibold text-sm text-[#182026] group-hover:text-[#E05A47] mt-1">
                        Maya Chen
                      </h4>
                      <p className="text-xs text-[#788290] mt-0.5">
                        Inspect active reports & verify repairs
                      </p>
                    </Link>

                    <Link
                      href="/login?persona=authority"
                      className="p-4 rounded-xl bg-white border border-[#D5CCC0] hover:border-[#19382F] hover:shadow-md transition text-left group"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#19382F] font-bold">
                        Role: Supervisor
                      </span>
                      <h4 className="font-semibold text-sm text-[#182026] group-hover:text-[#19382F] mt-1">
                        David O&apos;Connor
                      </h4>
                      <p className="text-xs text-[#788290] mt-0.5">
                        Manage triage, dispatch, & proof
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              06 — FINAL CTA: Civic Commitment
              ══════════════════════════════════════════════════════════ */}
          <section className="py-20 lg:py-24 bg-[#19382F] text-white">
            <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
              <div className="inline-block p-3 rounded-2xl bg-white/10 text-[#E05A47] mb-2">
                <CivicLogo size={36} />
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
                Streets belong to those who care for them.
              </h2>
              <p className="font-sans text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
                Take 60 seconds to document that damaged curb, open manhole, or dark
                streetlamp. We make sure the city finishes the job.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/report"
                  className="bg-[#E05A47] hover:bg-[#CC4836] text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <RoadIcon size={18} />
                  Start Citizen Report
                </Link>
                <Link
                  href="/login"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm sm:text-base px-8 py-4 rounded-xl transition cursor-pointer"
                >
                  Sign In to Dashboard
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
}
