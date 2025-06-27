// components/expert/dashboard/availability/schedules/shared/timezone-data.ts

export interface TimezoneOption {
  value: string;
  display: string;
  region: string;
  city: string;
}

// Comprehensive timezone data with IANA names and regions
export const ALL_TIMEZONES: TimezoneOption[] = [
  // US/CANADA
  {
    value: "America/Adak",
    display: "Alaska Time",
    region: "US/CANADA",
    city: "Adak",
  },
  {
    value: "America/Anchorage",
    display: "Alaska Time",
    region: "US/CANADA",
    city: "Anchorage",
  },
  {
    value: "America/Los_Angeles",
    display: "Pacific Time - US & Canada",
    region: "US/CANADA",
    city: "Los Angeles",
  },
  {
    value: "America/Denver",
    display: "Mountain Time - US & Canada",
    region: "US/CANADA",
    city: "Denver",
  },
  {
    value: "America/Chicago",
    display: "Central Time - US & Canada",
    region: "US/CANADA",
    city: "Chicago",
  },
  {
    value: "America/New_York",
    display: "Eastern Time - US & Canada",
    region: "US/CANADA",
    city: "New York",
  },
  {
    value: "America/Halifax",
    display: "Atlantic Time - Canada",
    region: "US/CANADA",
    city: "Halifax",
  },
  {
    value: "America/St_Johns",
    display: "Newfoundland Time - Canada",
    region: "US/CANADA",
    city: "St. Johns",
  },

  // EUROPE/AFRICA
  {
    value: "Atlantic/Azores",
    display: "Azores Time",
    region: "EUROPE/AFRICA",
    city: "Azores",
  },
  {
    value: "Atlantic/Cape_Verde",
    display: "Cape Verde Time",
    region: "EUROPE/AFRICA",
    city: "Cape Verde",
  },
  {
    value: "Europe/London",
    display: "Greenwich Mean Time",
    region: "EUROPE/AFRICA",
    city: "London",
  },
  {
    value: "Europe/Berlin",
    display: "Central European Time",
    region: "EUROPE/AFRICA",
    city: "Berlin",
  },
  {
    value: "Europe/Paris",
    display: "Central European Time",
    region: "EUROPE/AFRICA",
    city: "Paris",
  },
  {
    value: "Europe/Rome",
    display: "Central European Time",
    region: "EUROPE/AFRICA",
    city: "Rome",
  },
  {
    value: "Europe/Madrid",
    display: "Central European Time",
    region: "EUROPE/AFRICA",
    city: "Madrid",
  },
  {
    value: "Europe/Amsterdam",
    display: "Central European Time",
    region: "EUROPE/AFRICA",
    city: "Amsterdam",
  },
  {
    value: "Europe/Athens",
    display: "Eastern European Time",
    region: "EUROPE/AFRICA",
    city: "Athens",
  },
  {
    value: "Europe/Moscow",
    display: "Moscow Standard Time",
    region: "EUROPE/AFRICA",
    city: "Moscow",
  },
  {
    value: "Africa/Lagos",
    display: "West Africa Time",
    region: "EUROPE/AFRICA",
    city: "Lagos",
  },
  {
    value: "Africa/Cairo",
    display: "Eastern European Time",
    region: "EUROPE/AFRICA",
    city: "Cairo",
  },
  {
    value: "Africa/Johannesburg",
    display: "South Africa Standard Time",
    region: "EUROPE/AFRICA",
    city: "Johannesburg",
  },

  // ASIA/PACIFIC
  {
    value: "Asia/Dubai",
    display: "Gulf Standard Time",
    region: "ASIA/PACIFIC",
    city: "Dubai",
  },
  {
    value: "Asia/Kabul",
    display: "Afghanistan Time",
    region: "ASIA/PACIFIC",
    city: "Kabul",
  },
  {
    value: "Asia/Karachi",
    display: "Pakistan Standard Time",
    region: "ASIA/PACIFIC",
    city: "Karachi",
  },
  {
    value: "Asia/Kolkata",
    display: "India Standard Time",
    region: "ASIA/PACIFIC",
    city: "Mumbai",
  },
  {
    value: "Asia/Kathmandu",
    display: "Nepal Time",
    region: "ASIA/PACIFIC",
    city: "Kathmandu",
  },
  {
    value: "Asia/Dhaka",
    display: "Bangladesh Standard Time",
    region: "ASIA/PACIFIC",
    city: "Dhaka",
  },
  {
    value: "Asia/Yangon",
    display: "Myanmar Time",
    region: "ASIA/PACIFIC",
    city: "Yangon",
  },
  {
    value: "Asia/Bangkok",
    display: "Indochina Time",
    region: "ASIA/PACIFIC",
    city: "Bangkok",
  },
  {
    value: "Asia/Shanghai",
    display: "China Standard Time",
    region: "ASIA/PACIFIC",
    city: "Beijing",
  },
  {
    value: "Asia/Hong_Kong",
    display: "Hong Kong Standard Time",
    region: "ASIA/PACIFIC",
    city: "Hong Kong",
  },
  {
    value: "Asia/Singapore",
    display: "Singapore Standard Time",
    region: "ASIA/PACIFIC",
    city: "Singapore",
  },
  {
    value: "Asia/Tokyo",
    display: "Japan Standard Time",
    region: "ASIA/PACIFIC",
    city: "Tokyo",
  },
  {
    value: "Asia/Seoul",
    display: "Korea Standard Time",
    region: "ASIA/PACIFIC",
    city: "Seoul",
  },
  {
    value: "Australia/Darwin",
    display: "Australian Central Standard Time",
    region: "ASIA/PACIFIC",
    city: "Darwin",
  },
  {
    value: "Australia/Sydney",
    display: "Australian Eastern Standard Time",
    region: "ASIA/PACIFIC",
    city: "Sydney",
  },
  {
    value: "Australia/Melbourne",
    display: "Australian Eastern Standard Time",
    region: "ASIA/PACIFIC",
    city: "Melbourne",
  },
  {
    value: "Pacific/Auckland",
    display: "New Zealand Standard Time",
    region: "ASIA/PACIFIC",
    city: "Auckland",
  },

  // SOUTH AMERICA
  {
    value: "America/Caracas",
    display: "Venezuela Time",
    region: "SOUTH AMERICA",
    city: "Caracas",
  },
  {
    value: "America/La_Paz",
    display: "Bolivia Time",
    region: "SOUTH AMERICA",
    city: "La Paz",
  },
  {
    value: "America/Santiago",
    display: "Chile Standard Time",
    region: "SOUTH AMERICA",
    city: "Santiago",
  },
  {
    value: "America/Sao_Paulo",
    display: "Brasilia Standard Time",
    region: "SOUTH AMERICA",
    city: "São Paulo",
  },
  {
    value: "America/Argentina/Buenos_Aires",
    display: "Argentina Standard Time",
    region: "SOUTH AMERICA",
    city: "Buenos Aires",
  },

  // OTHER
  {
    value: "UTC",
    display: "Coordinated Universal Time",
    region: "OTHER",
    city: "UTC",
  },
];

// Helper function to group timezones by region
export const getTimezonesByRegion = () => {
  const groups: Record<string, TimezoneOption[]> = {};
  ALL_TIMEZONES.forEach((tz) => {
    if (!groups[tz.region]) {
      groups[tz.region] = [];
    }
    groups[tz.region].push(tz);
  });
  return groups;
};

// Helper function to find timezone by value or display name
export const findTimezone = (
  valueOrDisplay: string
): TimezoneOption | undefined => {
  return ALL_TIMEZONES.find(
    (tz) => tz.value === valueOrDisplay || tz.display === valueOrDisplay
  );
};
