import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "./analytics-dashboard";

export default async function TeacherAnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER") {
    redirect("/dashboard");
  }

  return <AnalyticsDashboard />;
}
