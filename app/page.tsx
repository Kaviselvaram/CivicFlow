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
  StarIcon,
} from "@/components/icons";
import { InteractiveCityMap } from "@/components/map/InteractiveCityMap";
import { SplitBeforeAfter } from "@/components/citizen/SplitBeforeAfter";
import { CivicPulseVisual } from "@/components/civic/CivicPulseVisual";
import { LifecycleStorytelling } from "@/components/landing/LifecycleStorytelling";
import { ToastProvider } from "@/components/ui/Toast";

export const revalidate = 0;

export default async function LandingPage() {
  const currentUser = await getCurrentUser();

  // Fetch real-time issues and statistics from the database
  const [totalIssues, resolvedIssues, verifiedIssues, criticalCount, sampleIssues, verifiedShowcase] =
    await Promise.all([
      db.issue.count(),
      db.issue.count({ where: { status: "RESOLVED" } }),
      db.issue.count({ where: { status: "VERIFIED" } }),
      db.issue.count({ where: { priority: "CRITICAL" } }),
      db.issue.findMany({
        take: 10,
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
      db.issue.findMany({
        where: {
          OR: [{ status: "VERIFIED" }, { status: "RESOLVED" }],
        },
        take: 3,
        orderBy: { updatedAt: "desc" },
        include: {
          department: true,
          crew: true,
        },
      }),
    ]);

  const verificationRate =
    resolvedIssues + verifiedIssues > 0
      ? Math.round((verifiedIssues / (resolvedIssues + verifiedIssues)) * 100)
      : 100;

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#12181F]">
        <Navbar currentUser={currentUser} />

        <main id="main-content" className="flex-1">
          {/* ══════════════════════════════════════════════════════════
              01 — HERO: Editorial Civic Modernism
              ══════════════════════════════════════════════════════════ */}
          <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E6DFD4] bg-civic-grid">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Left Column: Typographic Narrative */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Living City Telemetry Tag */}
                  <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-[#E6DFD4] text-xs font-semibold text-[#12181F] shadow-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D94532] animate-ping" />
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      Municipal Observability Engine
                    </span>
                    <span className="text-[#D1C7B8]">•</span>
                    <span className="text-[#475467] font-mono text-[11px]">
                      12 Wards Connected
                    </span>
                  </div>

                  <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.06] tracking-tight text-[#12181F]">
                    Civic problems <br />
                    should have a <br />
                    <span className="text-[#D94532] italic font-normal">
                      visible ending.
                    </span>
                  </h1>

                  <p className="font-sans text-base sm:text-lg text-[#475467] max-w-xl leading-relaxed">
                    Municipal defects should not disappear into an administrative
                    black hole. CivicFlow turns citizen observations into auditable,
                    dispatched work orders—closing the loop with{" "}
                    <strong className="text-[#12181F] font-semibold">citizen-verified resolution</strong>.
                  </p>

                  {/* Dual Action CTAs */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href="/report"
                      className="bg-[#D94532] hover:bg-[#C23927] text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2.5 cursor-pointer"
                    >
                      <RoadIcon size={18} />
                      Report an Issue
                    </Link>

                    <Link
                      href="/#live-map"
                      className="bg-white hover:bg-[#F3EFE8] text-[#12181F] border border-[#D1C7B8] font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-2xs hover:border-[#12181F] transition flex items-center gap-2 cursor-pointer"
                    >
                      <MapPinIcon size={18} className="text-[#1E4E68]" />
                      Explore City Map
                    </Link>

                    <Link
                      href="/authority/dashboard"
                      className="text-xs font-semibold text-[#14352B] hover:underline ml-2 flex items-center gap-1.5"
                    >
                      <ShieldCheckIcon size={16} />
                      Operations Command →
                    </Link>
                  </div>

                  {/* High-density real-time metrics ticker */}
                  <div className="pt-6 grid grid-cols-3 sm:grid-cols-4 gap-4 border-t border-[#E6DFD4] max-w-xl">
                    <div>
                      <div className="font-display font-bold text-2xl sm:text-3xl text-[#12181F]">
                        {totalIssues}
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#7A8799] mt-0.5 font-semibold">
                        Active Reports
                      </div>
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl sm:text-3xl text-[#14352B]">
                        26.4h
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#7A8799] mt-0.5 font-semibold">
                        Average SLA
                      </div>
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl sm:text-3xl text-[#D94532]">
                        {verificationRate}%
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#7A8799] mt-0.5 font-semibold">
                        Citizen Verified
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <div className="font-display font-bold text-2xl sm:text-3xl text-[#1E4E68]">
                        5 Units
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#7A8799] mt-0.5 font-semibold">
                        Field Crews
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Hero Visual Asset (Interactive Split-Slider) */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl overflow-hidden border border-[#E6DFD4] bg-white shadow-xl p-4">
                    <div className="flex items-center justify-between pb-3 px-1 border-b border-[#E6DFD4] text-xs font-mono text-[#7A8799]">
                      <span className="font-bold text-[#12181F]">
                        LIVE CITIZEN RESOLUTION PROOF
                      </span>
                      <span>#CF-1001 • WARD 4</span>
                    </div>

                    <div className="mt-3.5">
                      <SplitBeforeAfter
                        beforeUrl="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80"
                        afterUrl="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80"
                        beforeLabel="Defect: 40cm Pothole"
                        afterLabel="Verified: Cured Asphalt Patch"
                      />
                    </div>

                    <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E6DFD4] mt-3.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#12181F]">
                          Road Patching Crew Bravo
                        </p>
                        <p className="text-[11px] text-[#7A8799] font-mono mt-0.5">
                          Dispatched in 4h • Confirmed by Maya Chen
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#14352B] text-white text-[10px] font-mono uppercase font-bold tracking-wider">
                        ★ 5.0 Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              02 — SIGNATURE CIVIC VISUAL: Civic Pulse Constellation
              ══════════════════════════════════════════════════════════ */}
          <section className="py-20 lg:py-24 border-b border-[#E6DFD4] bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D94532]">
                  Living Civic Telemetry
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#12181F]">
                  The Civic Pulse: City operations in real time
                </h2>
                <p className="text-sm text-[#475467] leading-relaxed">
                  Every civic report is a living coordinate. Node size reflects
                  severity, pulse frequency denotes priority, and verified signoffs
                  settle into a calm, permanent state.
                </p>
              </div>

              {/* The Civic Pulse Visual */}
              <CivicPulseVisual heightClass="h-[520px]" />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              03 — THE CIVIC BLACK HOLE VS CIVICFLOW (Visual Narrative)
              ══════════════════════════════════════════════════════════ */}
          <section className="py-20 lg:py-24 bg-[#F3EFE8] border-b border-[#E6DFD4]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D94532]">
                  The Core Friction
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#12181F]">
                  Why municipal reporting fails today
                </h2>
                <p className="text-sm text-[#475467] leading-relaxed">
                  Citizens don&apos;t lack awareness; they lack confidence that their
                  observation will ever translate into physical repair.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Traditional 311 Black Hole */}
                <div className="bg-white/80 border border-[#E6DFD4] rounded-3xl p-8 space-y-6 opacity-85">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-50 text-rose-800 text-xs font-mono font-bold border border-rose-200">
                    ✕ The Traditional 311 Black Hole
                  </div>

                  <ul className="space-y-4 text-xs sm:text-sm text-[#475467]">
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold">―</span>
                      <span>
                        <strong className="text-[#12181F]">4-Page Clunky Forms:</strong> Requires
                        district codes, tax lot numbers, and legal declarations before
                        even accepting a photo.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold">―</span>
                      <span>
                        <strong className="text-[#12181F]">Misassembled Routing:</strong> A road
                        defect bounces between state highways, city transit, and district utility
                        departments for weeks.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold">―</span>
                      <span>
                        <strong className="text-[#12181F]">Ghost Resolutions:</strong> Work tickets
                        marked &ldquo;Closed&rdquo; in backend enterprise systems without physical work ever taking place.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold">―</span>
                      <span>
                        <strong className="text-[#12181F]">Total Citizen Apathy:</strong> 74% of
                        residents never submit another report after experiencing the silent void.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* The CivicFlow Verified Loop */}
                <div className="bg-white border-2 border-[#14352B] rounded-3xl p-8 space-y-6 shadow-md">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#14352B] text-white text-xs font-mono font-bold">
                    ✓ The CivicFlow Verified Loop
                  </div>

                  <ul className="space-y-4 text-xs sm:text-sm text-[#12181F]">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold text-base">✓</span>
                      <span>
                        <strong>Rapid 60-Second Capture:</strong> Snap photo, tap map pin,
                        and type plain English. Zero bureaucratic jargon.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold text-base">✓</span>
                      <span>
                        <strong>AI Department Routing:</strong> Intelligent natural language
                        triage matches keywords to exact municipal crews instantly.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold text-base">✓</span>
                      <span>
                        <strong>Mandatory Photo Proof:</strong> Field crews must attach
                        photographic proof before an issue can be marked resolved.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold text-base">✓</span>
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
              04 — HOW CIVICFLOW WORKS: 5-Stage Interactive Blueprint
              ══════════════════════════════════════════════════════════ */}
          <section id="how-it-works" className="py-20 lg:py-24 border-b border-[#E6DFD4]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1E4E68]">
                  Operational Blueprint
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#12181F]">
                  The 5-Stage Civic Lifecycle
                </h2>
                <p className="text-sm text-[#475467]">
                  From citizen observation to verified resolution. Explore each stage interactively:
                </p>
              </div>

              {/* Interactive Lifecycle Storytelling Component */}
              <LifecycleStorytelling />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              05 — LIVE GEOSPATIAL CITY OPERATIONS MAP
              ══════════════════════════════════════════════════════════ */}
          <section id="live-map" className="py-20 lg:py-24 bg-[#F8F5EE] border-b border-[#E6DFD4]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D94532]">
                    Geospatial Cartography
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#12181F] mt-1">
                    Live Municipal Operations Map
                  </h2>
                  <p className="text-sm text-[#475467] mt-1">
                    Interactive city grid showing active incidents, field crews, and verified repairs across 12 wards.
                  </p>
                </div>

                <Link
                  href="/report"
                  className="bg-[#D94532] hover:bg-[#C23927] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
                >
                  <MapPinIcon size={16} />
                  Report at Your Coordinates
                </Link>
              </div>

              {/* Vector City Map Component */}
              <InteractiveCityMap
                issues={sampleIssues}
                heightClass="h-[560px]"
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              06 — VERIFIED RESOLUTIONS SHOWCASE
              ══════════════════════════════════════════════════════════ */}
          <section className="py-20 lg:py-24 border-b border-[#E6DFD4] bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#14352B]">
                    Community Signoffs
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#12181F] mt-1">
                    Recently Verified by Residents
                  </h2>
                  <p className="text-sm text-[#475467] mt-1">
                    Defects where physical repairs were inspected, approved, and sealed by citizens.
                  </p>
                </div>

                <Link
                  href="/citizen/dashboard"
                  className="text-xs font-semibold text-[#D94532] hover:underline flex items-center gap-1 font-mono"
                >
                  View All Verified Tickets →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {verifiedShowcase.map((issue) => (
                  <div
                    key={issue.id}
                    className="border border-[#E6DFD4] rounded-2xl p-5 bg-[#FAF8F5] space-y-4 hover:border-[#14352B] transition shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#12181F]">
                        {issue.ticketNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#14352B] text-white text-[10px] font-bold uppercase">
                        {issue.status}
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-[#E6DFD4] aspect-video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={issue.resolutionPhotoUrl || issue.photoUrl}
                        alt={issue.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-[#14352B]/90 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        ✓ Field Proof Verified
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display font-semibold text-base text-[#12181F] line-clamp-1">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-[#7A8799] mt-0.5 font-mono">
                        📍 {issue.address}
                      </p>
                    </div>

                    {issue.citizenFeedback && (
                      <p className="text-xs text-[#475467] italic bg-white p-3 rounded-xl border border-[#E6DFD4]">
                        &ldquo;{issue.citizenFeedback}&rdquo;
                      </p>
                    )}

                    <div className="pt-2 border-t border-[#E6DFD4] flex items-center justify-between text-xs text-[#7A8799]">
                      <span className="font-mono text-[11px]">
                        {issue.crew ? issue.crew.name : "Municipal Crew"}
                      </span>
                      {issue.citizenRating && (
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(issue.citizenRating)].map((_, i) => (
                            <StarIcon key={i} size={14} fill="#F59E0B" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              07 — RADICAL TRANSPARENCY & DIRECT DEMO ACCESS
              ══════════════════════════════════════════════════════════ */}
          <section id="transparency" className="py-20 lg:py-24 border-b border-[#E6DFD4] bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#14352B]">
                    Radical Transparency
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#12181F]">
                    Every work order, crew dispatch, and dollar held to open audit.
                  </h2>
                  <p className="text-sm text-[#475467] leading-relaxed">
                    By making the civic timeline visible from submission to citizen
                    signoff, CivicFlow eliminates the gap between budget allocations
                    and street reality.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-4 rounded-xl border border-[#E6DFD4] bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ClockIcon size={20} className="text-[#1E4E68]" />
                        <div>
                          <p className="text-xs font-bold text-[#12181F]">
                            Public Works SLA Adherence
                          </p>
                          <p className="text-[11px] text-[#7A8799]">
                            Target: 48h • Actual: 31.2h Average
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        94.2% on-time
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-[#E6DFD4] bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheckIcon size={20} className="text-[#14352B]" />
                        <div>
                          <p className="text-xs font-bold text-[#12181F]">
                            Citizen Verification Fidelity
                          </p>
                          <p className="text-[11px] text-[#7A8799]">
                            Reopened Rate: Under 2.8%
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#14352B] bg-[#EBF3F0] px-2.5 py-1 rounded-md border border-[#D0E2DB]">
                        High Integrity
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#F3EFE8] border border-[#E6DFD4] rounded-3xl p-6 sm:p-8 space-y-6">
                  <h3 className="font-display font-semibold text-xl text-[#12181F]">
                    Direct Demo Access
                  </h3>
                  <p className="text-xs text-[#475467] leading-relaxed">
                    Evaluate the end-to-end citizen reporting and authority triage
                    workflows with pre-seeded accounts. No password typing required.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      href="/login?persona=citizen"
                      className="p-5 rounded-2xl bg-white border border-[#D1C7B8] hover:border-[#D94532] hover:shadow-md transition text-left group"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#D94532] font-bold">
                        Role: Resident
                      </span>
                      <h4 className="font-semibold text-base text-[#12181F] group-hover:text-[#D94532] mt-1">
                        Maya Chen
                      </h4>
                      <p className="text-xs text-[#7A8799] mt-1">
                        Inspect active reports & verify repairs
                      </p>
                    </Link>

                    <Link
                      href="/login?persona=authority"
                      className="p-5 rounded-2xl bg-white border border-[#D1C7B8] hover:border-[#14352B] hover:shadow-md transition text-left group"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#14352B] font-bold">
                        Role: Supervisor
                      </span>
                      <h4 className="font-semibold text-base text-[#12181F] group-hover:text-[#14352B] mt-1">
                        David O&apos;Connor
                      </h4>
                      <p className="text-xs text-[#7A8799] mt-1">
                        Manage triage, dispatch, & proof
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              08 — FINAL CTA: Civic Commitment
              ══════════════════════════════════════════════════════════ */}
          <section className="py-20 lg:py-24 bg-[#14352B] text-white">
            <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
              <div className="inline-block p-3.5 rounded-2xl bg-white/10 text-[#D94532] mb-2">
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
                  className="bg-[#D94532] hover:bg-[#C23927] text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
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
