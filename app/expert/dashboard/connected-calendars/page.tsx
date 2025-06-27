// app/expert/dashboard/connected-calendars/page.tsx
import ConnectedCalendarsLayout from "@/components/expert/dashboard/connected-calendars/connected-calendars-layout";
import ConnectedCalendarsPage from "@/components/expert/dashboard/connected-calendars/connected-calendars-page";

export default function ConnectedCalendarsPageRoute() {
  return (
    <ConnectedCalendarsLayout>
      <ConnectedCalendarsPage />
    </ConnectedCalendarsLayout>
  );
}