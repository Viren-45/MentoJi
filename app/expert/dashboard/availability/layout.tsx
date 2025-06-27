// app/expert/dashboard/availability/layout.tsx
import AvailabilityLayout from "@/components/expert/dashboard/availability/availabillity-layout";

export default function AvailabilityTabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AvailabilityLayout>{children}</AvailabilityLayout>;
}