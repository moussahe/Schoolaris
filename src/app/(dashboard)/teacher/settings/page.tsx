import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsDashboard } from "./settings-dashboard";

export default async function TeacherSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER") {
    redirect("/dashboard");
  }

  return <SettingsDashboard />;
}
