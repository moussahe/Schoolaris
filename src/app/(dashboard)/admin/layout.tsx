import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar, AdminHeader } from "@/components/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <AdminSidebar className="hidden lg:flex" />

      {/* Main Content */}
      <div className="lg:pl-64">
        <AdminHeader user={session.user} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
