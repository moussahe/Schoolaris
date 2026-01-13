import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  StudentSidebar,
  StudentHeader,
  StudentMobileNav,
  StudentBottomNav,
} from "@/components/student";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get selected child from cookie
  const cookieStore = await cookies();
  const selectedChildId = cookieStore.get("selectedChildId")?.value;

  // Get parent's children
  const children_list = await prisma.child.findMany({
    where: { parentId: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      xp: true,
      level: true,
      currentStreak: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // If no children, redirect to parent dashboard to add one
  if (children_list.length === 0) {
    redirect("/parent/children?message=add_child_first");
  }

  // Get selected child or default to first child
  let selectedChild = children_list.find((c) => c.id === selectedChildId);
  if (!selectedChild) {
    selectedChild = children_list[0];
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <StudentSidebar child={selectedChild} />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <StudentHeader child={selectedChild} />

        {/* Mobile Navigation */}
        <StudentMobileNav child={selectedChild} />

        {/* Page Content */}
        <main className="p-4 pb-20 lg:p-8 lg:pb-8">{children}</main>

        {/* Mobile Bottom Navigation */}
        <StudentBottomNav />
      </div>
    </div>
  );
}
