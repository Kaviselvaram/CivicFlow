import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge, PriorityBadge, CategoryBadge } from "@/components/ui/Badge";
import {
  RoadIcon,
  CheckCircleIcon,
  ClockIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { ToastProvider } from "@/components/ui/Toast";

export const revalidate = 0;

export default async function CitizenDashboardPage() {
  const currentUser = await getCurrentUser();

  let targetUser = currentUser;
  if (!targetUser) {
    const fallback = await db.user.findUnique({
      where: { email: "citizen@civicflow.org" },
    });
    if (fallback) {
      targetUser = {
        id: fallback.id,
        name: fallback.name,
        email: fallback.email,
        role: fallback.role as "CITIZEN",
        departmentId: fallback.departmentId,
        avatarUrl: fallback.avatarUrl,
      };
    }
  }

  const issues = await db.issue.findMany({
    where: { reporterId: targetUser?.id },
    orderBy: { createdAt: "desc" },
    include: {
      department: true,
      crew: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const activeCount = issues.filter((i) =>
    ["REPORTED", "IN_REVIEW", "ASSIGNED", "IN_PROGRESS"].includes(i.status)
  ).length;
  const awaitingVerificationCount = issues.filter(
    (i) => i.status === "RESOLVED"
  ).length;
  const verifiedCount = issues.filter((i) => i.status === "VERIFIED").length;
  const reopenedCount = issues.filter((i) => i.status === "REOPENED").length;

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#12181F]">
        <Navbar currentUser={currentUser} />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Profile Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E1D7]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#14352B] text-white flex items-center justify-center font-serif font-black text-2xl shadow-xs">
                {targetUser?.name?.[0] || "M"}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#12181F] tracking-tight">
                    {targetUser?.name || "Maya Chen"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBF3F0] text-[#14352B] text-xs font-mono font-bold border border-[#C5DDD3]">
                    Resident Observer
                  </span>
                </div>
                <p className="text-xs text-[#687584] mt-1 font-mono">
                  Ward 4 (Central) • {issues.length} Total Submissions Recorded
                </p>
              </div>
            </div>

            <Link
              href="/report"
              className="bg-[#D94532] hover:bg-[#B83827] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <RoadIcon size={16} />
              + Report New Defect
            </Link>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E7E1D7] rounded-2xl p-4.5 shadow-xs transition hover:border-[#14352B]/40">
              <div className="flex items-center justify-between text-[#687584] mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                  Active Dispatch
                </span>
                <ClockIcon size={15} className="text-amber-600" />
              </div>
              <div className="font-serif font-black text-3xl text-[#12181F] tracking-tight">
                {activeCount}
              </div>
              <p className="text-[11px] text-[#687584] mt-0.5 font-mono">Under Field Remediation</p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-4.5 shadow-xs transition hover:border-emerald-400">
              <div className="flex items-center justify-between text-emerald-800 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                  Awaiting Signoff
                </span>
                <CheckCircleIcon size={15} className="text-emerald-700" />
              </div>
              <div className="font-serif font-black text-3xl text-emerald-950 tracking-tight">
                {awaitingVerificationCount}
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5 font-semibold font-mono">
                Action Required: Confirm
              </p>
            </div>

            <div className="bg-white border border-[#E7E1D7] rounded-2xl p-4.5 shadow-xs transition hover:border-[#14352B]/40">
              <div className="flex items-center justify-between text-[#687584] mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                  Verified & Sealed
                </span>
                <ShieldCheckIcon size={15} className="text-[#14352B]" />
              </div>
              <div className="font-serif font-black text-3xl text-[#12181F] tracking-tight">
                {verifiedCount}
              </div>
              <p className="text-[11px] text-[#687584] mt-0.5 font-mono">Complete Verified Loop</p>
            </div>

            <div className="bg-white border border-[#E7E1D7] rounded-2xl p-4.5 shadow-xs transition hover:border-rose-300">
              <div className="flex items-center justify-between text-[#687584] mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-rose-800">
                  Reopened
                </span>
                <RotateCcwIcon size={15} className="text-rose-600" />
              </div>
              <div className="font-serif font-black text-3xl text-rose-950 tracking-tight">
                {reopenedCount}
              </div>
              <p className="text-[11px] text-rose-700 mt-0.5 font-mono">Escalated for Re-repair</p>
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-black text-xl text-[#12181F]">
                My Civic Submissions
              </h2>
              <span className="text-xs font-mono text-[#687584]">
                {issues.length} Incidents Logged
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/citizen/reports/${issue.id}`}
                  className="bg-white border border-[#E7E1D7] hover:border-[#14352B] hover:shadow-md rounded-2xl p-5 transition flex flex-col justify-between group shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#12181F]">
                          {issue.ticketNumber}
                        </span>
                        <CategoryBadge category={issue.category} />
                      </div>
                      <StatusBadge status={issue.status} />
                    </div>

                    <div className="flex gap-4">
                      {issue.photoUrl && (
                        <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-[#E7E1D7] bg-black/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={issue.photoUrl}
                            alt="Issue photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-base text-[#12181F] group-hover:text-[#D94532] transition line-clamp-1">
                          {issue.title}
                        </h3>
                        <p className="text-xs text-[#687584] flex items-center gap-1 mt-1 truncate font-mono">
                          <MapPinIcon size={12} className="shrink-0 text-[#D94532]" />
                          <span>{issue.address}</span>
                        </p>
                        <p className="text-xs text-[#4B5563] mt-1.5 line-clamp-2 leading-relaxed">
                          {issue.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#FAF8F5] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#687584] font-mono">
                      <PriorityBadge priority={issue.priority} />
                      <span>•</span>
                      <span>
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span className="font-semibold text-xs text-[#14352B] group-hover:translate-x-1 transition flex items-center gap-1">
                      Inspect Timeline →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
}
