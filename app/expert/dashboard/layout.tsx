import DashboardLayout from "@/components/expert/dashboard/layout/dashboard-layout";

export default function ExpertDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}