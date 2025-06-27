// components/expert/dashboard/session-settings/session-settings-page.tsx
"use client";

import React, { useState } from "react";
import DurationPricingSection from "./sections/duration-pricing-section";
import BookingRulesSection from "./sections/booking-rules-section";
import BookingPreferencesSection from "./sections/booking-preferences-section";
import MeetingSettingsSection from "./sections/meeting-settings-section";

const SessionSettingsPage = () => {
  const [openSection, setOpenSection] = useState("duration-pricing");

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? "" : sectionId);
  };

  return (
    <div className="space-y-4">
      <DurationPricingSection
        isOpen={openSection === "duration-pricing"}
        onToggle={() => toggleSection("duration-pricing")}
      />
      
      <BookingRulesSection
        isOpen={openSection === "booking-rules"}
        onToggle={() => toggleSection("booking-rules")}
      />
      
      <BookingPreferencesSection
        isOpen={openSection === "booking-preferences"}
        onToggle={() => toggleSection("booking-preferences")}
      />
      
      <MeetingSettingsSection
        isOpen={openSection === "meeting-settings"}
        onToggle={() => toggleSection("meeting-settings")}
      />
    </div>
  );
};

export default SessionSettingsPage;