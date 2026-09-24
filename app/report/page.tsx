import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReportWizard } from "@/components/citizen/ReportWizard";
import { ToastProvider } from "@/components/ui/Toast";
import { IssueCategory } from "@/lib/types";

export const revalidate = 0;

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const currentUser = await getCurrentUser();
  const { cat } = await searchParams;
  const initialCategory = (cat?.toUpperCase() as IssueCategory) || "ROADS";

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#182026]">
        <Navbar currentUser={currentUser} />

        <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-8 text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E05A47]">
              Citizen Observation Intake
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#182026]">
              Report a Civic Defect
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] max-w-lg mx-auto">
              Follow our 5-step guided wizard. Your observation will be
              automatically triaged and dispatched to the appropriate municipal department.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-12">Loading intake wizard...</div>}>
            <ReportWizard initialCategory={initialCategory} />
          </Suspense>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
}
