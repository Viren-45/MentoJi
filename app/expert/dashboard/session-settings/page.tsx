// app/expert/dashboard/session-settings/page.tsx
import SessionSettingsLayout from "@/components/expert/dashboard/session-settings/session-settings-layout";
import SessionSettingsPage from "@/components/expert/dashboard/session-settings/session-settings-page";

export default function SessionSettingsPageRoute() {
  return (
    <SessionSettingsLayout>
      <SessionSettingsPage />
    </SessionSettingsLayout>
  );
}