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
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#182026]">
        <Navbar currentUser={currentUser} />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#788290]">
            <Link
              href="/citizen/dashboard"
              className="hover:text-[#182026] transition"
            >
              ← My Citizen Reports
            </Link>
            <span>/</span>
            <span className="font-bold text-[#182026]">{issue.ticketNumber}</span>
          </div>

          {/* Issue Header Ribbon */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#182026]">
                  {issue.ticketNumber}
                </span>
                <CategoryBadge category={issue.category} />
                <PriorityBadge priority={issue.priority} />
              </div>
              <StatusBadge status={issue.status} />
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#182026]">
              {issue.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#788290] pt-1">
              <span className="flex items-center gap-1 font-medium text-[#182026]">
                <MapPinIcon size={14} className="text-[#E05A47]" />
                {issue.address} ({issue.ward || "Ward 4"})
              </span>
              <span>•</span>
              <span className="font-mono">
                Reported {new Date(issue.createdAt).toLocaleDateString()}
              </span>
              {issue.department && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BuildingIcon size={14} className="text-[#244B5C]" />
                    {issue.department.name}
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-[#4B5563] leading-relaxed pt-2 border-t border-[#F4EFEA]">
              {issue.description}
            </p>
          </div>

          {/* Verification Call-To-Action Box (If RESOLVED or VERIFIED) */}
          <VerificationPrompt
            issueId={issue.id}
            ticketNumber={issue.ticketNumber}
            status={issue.status}
            citizenRating={issue.citizenRating}
            citizenFeedback={issue.citizenFeedback}
            reopenReason={issue.reopenReason}
            verifiedAt={issue.verifiedAt}
          />

          {/* Visual Evidence Section */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-[#182026]">
                Photographic Evidence
              </h2>
              {issue.resolutionPhotoUrl && (
                <span className="text-xs font-mono text-[#19382F] font-bold bg-[#EBF3F0] px-2 py-0.5 rounded">
                  Dual Evidence Comparison Available
                </span>
              )}
            </div>

            {issue.resolutionPhotoUrl ? (
              <div className="space-y-3">
                <SplitBeforeAfter
                  beforeUrl={issue.photoUrl}
                  afterUrl={issue.resolutionPhotoUrl}
                  beforeLabel="Original Defect"
                  afterLabel="Completed Field Repair"
                />
                <p className="text-xs text-[#788290] text-center font-mono">
                  Drag the slider horizontally to compare before and after conditions
                </p>
                {issue.resolutionNotes && (
                  <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E8E2D8] mt-3">
                    <span className="text-xs font-mono font-bold uppercase text-[#19382F]">
                      Field Crew Supervisor Remarks
                    </span>
                    <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                      {issue.resolutionNotes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-[#E8E2D8] max-h-96 aspect-video bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={issue.photoUrl}
                  alt="Issue photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs font-mono px-2.5 py-1 rounded">
                  Observed Defect Photo
                </div>
              </div>
            )}
          </div>

          {/* Chronological Audit Timeline */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
              <div>
                <h2 className="font-display font-bold text-xl text-[#182026]">
                  Resolution Audit Trail
                </h2>
                <p className="text-xs text-[#788290] mt-0.5">
                  Verified timestamp log of every status transition and work action.
                </p>
              </div>
              {issue.crew && (
                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#19382F] bg-[#EBF3F0] px-3 py-1.5 rounded-lg border border-[#D0E2DB]">
                  <TruckIcon size={16} />
                  <span>Assigned: {issue.crew.name}</span>
                </div>
              )}
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
