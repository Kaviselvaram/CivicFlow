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
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#182026]">
        <Navbar currentUser={currentUser} />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Profile Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#19382F] text-white flex items-center justify-center font-display font-bold text-2xl shadow-sm">
                {targetUser?.name?.[0] || "M"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#182026]">
                    {targetUser?.name || "Maya Chen"}
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-[#EBF3F0] text-[#19382F] text-xs font-mono font-bold">
                    Resident Observer
                  </span>
                </div>
                <p className="text-xs text-[#788290] mt-0.5">
                  Ward 4 (Central) • {issues.length} Total Submissions Recorded
                </p>
              </div>
            </div>

            <Link
              href="/report"
              className="bg-[#E05A47] hover:bg-[#CC4836] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <RoadIcon size={16} />
              + Report New Defect
            </Link>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[#788290] mb-1">
                <span className="text-[11px] font-mono uppercase font-semibold">
                  Active Dispatch
                </span>
                <ClockIcon size={16} className="text-orange-600" />
              </div>
              <div className="font-display font-bold text-2xl text-[#182026]">
                {activeCount}
              </div>
              <p className="text-[11px] text-[#788290] mt-0.5">Under Field Remediation</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-800 mb-1">
                <span className="text-[11px] font-mono uppercase font-semibold">
                  Awaiting Your Signoff
                </span>
                <CheckCircleIcon size={16} className="text-emerald-600" />
              </div>
              <div className="font-display font-bold text-2xl text-emerald-950">
                {awaitingVerificationCount}
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5 font-semibold">
                Action Required: Confirm
              </p>
            </div>

            <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[#788290] mb-1">
                <span className="text-[11px] font-mono uppercase font-semibold">
                  Verified & Sealed
                </span>
                <ShieldCheckIcon size={16} className="text-[#19382F]" />
              </div>
              <div className="font-display font-bold text-2xl text-[#182026]">
                {verifiedCount}
              </div>
              <p className="text-[11px] text-[#788290] mt-0.5">Complete Verified Loop</p>
            </div>

            <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[#788290] mb-1">
                <span className="text-[11px] font-mono uppercase font-semibold text-rose-800">
                  Reopened
                </span>
                <RotateCcwIcon size={16} className="text-rose-600" />
              </div>
              <div className="font-display font-bold text-2xl text-rose-950">
                {reopenedCount}
              </div>
              <p className="text-[11px] text-rose-700 mt-0.5">Escalated for Re-repair</p>
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-[#182026]">
                My Civic Submissions
              </h2>
              <span className="text-xs font-mono text-[#788290]">
                {issues.length} Incidents Logged
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/citizen/reports/${issue.id}`}
                  className="bg-white border border-[#E8E2D8] hover:border-[#19382F] hover:shadow-md rounded-2xl p-5 transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#182026]">
                          {issue.ticketNumber}
                        </span>
                        <CategoryBadge category={issue.category} />
                      </div>
                      <StatusBadge status={issue.status} />
                    </div>

                    <div className="flex gap-4">
                      {issue.photoUrl && (
                        <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-[#E8E2D8] bg-black/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={issue.photoUrl}
                            alt="Issue photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-base text-[#182026] group-hover:text-[#E05A47] transition line-clamp-1">
                          {issue.title}
                        </h3>
                        <p className="text-xs text-[#788290] flex items-center gap-1 mt-1 truncate">
                          <MapPinIcon size={12} className="shrink-0 text-[#E05A47]" />
                          <span>{issue.address}</span>
                        </p>
                        <p className="text-xs text-[#4B5563] mt-1.5 line-clamp-2 leading-relaxed">
                          {issue.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F4EFEA] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#788290]">
                      <PriorityBadge priority={issue.priority} />
                      <span>•</span>
                      <span>
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span className="font-semibold text-[#19382F] group-hover:translate-x-1 transition flex items-center gap-1">
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
