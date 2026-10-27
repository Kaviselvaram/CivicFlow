import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthorityDashboardWrapper } from "@/components/authority/AuthorityDashboardClient";

export const revalidate = 0;

export default async function AuthorityDashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login?redirect=/authority/dashboard");
  }

  if (currentUser.role !== "AUTHORITY" && currentUser.role !== "ADMIN") {
    redirect("/citizen/dashboard?error=unauthorized_authority");
  }

  const [issues, departments, crews] = await Promise.all([
    db.issue.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reporter: {
          select: { name: true, email: true, phone: true },
        },
        department: {
          select: { id: true, name: true, slug: true },
        },
        crew: {
          select: { id: true, name: true, leadName: true },
        },
      },
    }),
    db.department.findMany({
      select: { id: true, name: true, slug: true },
    }),
    db.fieldCrew.findMany({
      select: { id: true, name: true, leadName: true, departmentId: true },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#182026]">
      <Navbar currentUser={currentUser} />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AuthorityDashboardWrapper
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialIssues={issues as any}
          departments={departments}
          crews={crews}
        />
      </main>

      <Footer />
    </div>
  );
}
