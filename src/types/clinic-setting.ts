// Operational hours for each day
export interface DayHours {
  open: string;
  close: string;
  is_open: boolean;
}

// Operational hours for the week
export interface OperationalHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

// Main clinic setting interface
export interface ClinicSetting {
  id: number;

  // Basic Information
  name: string;
  tagline: string | null;
  description: string | null;
  logo: string | null;
  logo_url: string | null;
  favicon: string | null;
  favicon_url: string | null;

  // Contact Information
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  phone: string | null;
  phone_2: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;

  // Social Media
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;

  // Legal Information
  license_number: string | null;
  npwp: string | null;
  owner_name: string | null;

  // Operational Hours
  operational_hours: OperationalHours | null;

  // Settings
  timezone: string;
  currency: string;
  date_format: string;
  time_format: string;

  // Queue Settings
  default_queue_quota: number;
  appointment_duration: number;

  created_at: string;
  updated_at: string;
}

// Update payload
export interface UpdateClinicSettingPayload {
  // Basic Information
  name: string;
  tagline?: string;
  description?: string;

  // Contact Information
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  phone_2?: string;
  whatsapp?: string;
  email?: string;
  website?: string;

  // Social Media
  facebook?: string;
  instagram?: string;
  twitter?: string;

  // Legal Information
  license_number?: string;
  npwp?: string;
  owner_name?: string;

  // Operational Hours
  operational_hours?: OperationalHours;

  // Settings
  timezone?: string;
  currency?: string;
  date_format?: string;
  time_format?: string;

  // Queue Settings
  default_queue_quota?: number;
  appointment_duration?: number;
}

// Response types
export interface ClinicSettingResponse {
  success: boolean;
  message: string;
  data: ClinicSetting;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    logo?: string;
    favicon?: string;
    url: string;
  };
}

// Day names for iteration
export const DAY_NAMES: (keyof OperationalHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<keyof OperationalHours, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};
