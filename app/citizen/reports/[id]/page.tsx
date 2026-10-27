import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge, PriorityBadge, CategoryBadge } from "@/components/ui/Badge";
import { SplitBeforeAfter } from "@/components/citizen/SplitBeforeAfter";
import { IssueTimeline } from "@/components/citizen/IssueTimeline";
import { VerificationPrompt } from "@/components/citizen/VerificationPrompt";
import { ToastProvider } from "@/components/ui/Toast";
import { MapPinIcon, BuildingIcon, TruckIcon } from "@/components/icons";

export const revalidate = 0;

export default async function CitizenIssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const issue = await db.issue.findUnique({
    where: { id },
    include: {
      reporter: true,
      department: true,
      crew: true,
      statusHistory: {
        orderBy: { createdAt: "asc" },
        include: {
          actor: true,
        },
      },
    },
  });

  if (!issue) {
    notFound();
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#12181F]">
        <Navbar currentUser={currentUser} />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#7A8799]">
            <Link
              href="/citizen/dashboard"
              className="hover:text-[#12181F] transition"
            >
              ← My Citizen Reports
            </Link>
            <span>/</span>
            <span className="font-bold text-[#12181F]">{issue.ticketNumber}</span>
          </div>

          {/* 1. THE PROBLEM: Issue Header Card */}
          <div className="bg-white border border-[#E6DFD4] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#12181F]">
                  {issue.ticketNumber}
                </span>
                <CategoryBadge category={issue.category} />
                <PriorityBadge priority={issue.priority} />
              </div>
              <StatusBadge status={issue.status} />
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-4xl text-[#12181F]">
              {issue.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#7A8799] pt-1">
              <span className="flex items-center gap-1 font-medium text-[#12181F]">
                <MapPinIcon size={14} className="text-[#D94532]" />
                {issue.address} ({issue.ward || "Ward 4"})
              </span>
              <span>•</span>
              <span className="font-mono">
                Reported {new Date(issue.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="font-mono text-[#14352B] font-bold">
                Target SLA: {issue.department?.slaHoursDefault || 48}h
              </span>
            </div>

            <p className="text-sm text-[#475467] leading-relaxed pt-3 border-t border-[#F3EFE8]">
              {issue.description}
            </p>
          </div>

          {/* 2. WHO IS HANDLING IT: Operational Assignment Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E6DFD4] rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#7A8799] font-bold">
                Assigned Municipal Department
              </span>
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#12181F]">
                <BuildingIcon size={18} className="text-[#1E4E68]" />
                <span>{issue.department ? issue.department.name : "Department of Public Works"}</span>
              </div>
              <p className="text-xs text-[#7A8799]">
                Responsible for district maintenance & material standards
              </p>
            </div>

            <div className="bg-white border border-[#E6DFD4] rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#7A8799] font-bold">
                Dispatched Field Unit
              </span>
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#14352B]">
                <TruckIcon size={18} className="text-[#14352B]" />
                <span>
                  {issue.crew ? `${issue.crew.name} (${issue.crew.vehicleId || "Unit"})` : "Triage Assignment Pending"}
                </span>
              </div>
              <p className="text-xs text-[#7A8799]">
                {issue.crew?.leadName ? `Lead Foreman: ${issue.crew.leadName}` : "Crew being assigned by supervisor"}
              </p>
            </div>
          </div>

          {/* 3. VERIFICATION CALL-TO-ACTION (When RESOLVED or VERIFIED) */}
          <VerificationPrompt
            issueId={issue.id}
            ticketNumber={issue.ticketNumber}
            status={issue.status}
            citizenRating={issue.citizenRating}
            citizenFeedback={issue.citizenFeedback}
            reopenReason={issue.reopenReason}
            verifiedAt={issue.verifiedAt}
          />

          {/* 4. BEFORE / AFTER RESOLUTION PROOF */}
          <div className="bg-white border border-[#E6DFD4] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E6DFD4] pb-4">
              <div>
                <h2 className="font-display font-bold text-xl text-[#12181F]">
                  Photographic Resolution Evidence
                </h2>
                <p className="text-xs text-[#7A8799] mt-0.5">
                  Physical comparison of the defect before remediation and after field completion.
                </p>
              </div>
              {issue.resolutionPhotoUrl && (
                <span className="text-xs font-mono text-[#14352B] font-bold bg-[#EBF3F0] px-2.5 py-1 rounded-md">
                  Interactive Comparison Active
                </span>
              )}
            </div>

            {issue.resolutionPhotoUrl ? (
              <div className="space-y-4">
                <SplitBeforeAfter
                  beforeUrl={issue.photoUrl}
                  afterUrl={issue.resolutionPhotoUrl}
                  beforeLabel="Original Defect Observed"
                  afterLabel="Field Crew Resolution Proof"
                />
                <p className="text-xs text-[#7A8799] text-center font-mono">
                  Drag the slider or use left/right arrow keys to inspect the repair boundary
                </p>

                {issue.resolutionNotes && (
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E6DFD4] space-y-1 mt-4">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#14352B]">
                      Supervisor Resolution Remarks
                    </span>
                    <p className="text-xs text-[#475467] leading-relaxed">
                      {issue.resolutionNotes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-[#E6DFD4] max-h-96 aspect-video bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={issue.photoUrl}
                  alt="Issue photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-[#12181F]/90 backdrop-blur-md text-white text-xs font-mono px-3 py-1 rounded-lg">
                  Observed Defect Evidence
                </div>
              </div>
            )}
          </div>

          {/* 5. CHRONOLOGICAL AUDIT TRAIL */}
          <div className="bg-white border border-[#E6DFD4] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6DFD4] pb-4">
              <div>
                <h2 className="font-display font-bold text-xl text-[#12181F]">
                  Chronological Resolution Audit
                </h2>
                <p className="text-xs text-[#7A8799] mt-0.5">
                  Immutable event trail tracking every operational handover and status change.
                </p>
              </div>
              <span className="font-mono text-xs text-[#7A8799]">
                {issue.statusHistory.length} Recorded Milestones
              </span>
            </div>

            <IssueTimeline
              history={issue.statusHistory.map((h) => ({
                id: h.id,
                fromStatus: h.fromStatus,
                toStatus: h.toStatus,
                note: h.note,
                createdAt: h.createdAt,
                actor: {
                  name: h.actor.name,
                  role: h.actor.role,
                },
              }))}
              currentStatus={issue.status}
            />
          </div>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
}
