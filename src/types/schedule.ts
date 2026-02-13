import type { User } from "./auth";
import type { Department } from "./department";

// Day of week type
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Doctor Schedule interface
export interface DoctorSchedule {
  id: number;
  doctor_id: number;
  department_id: number;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  quota: number;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Computed
  day_label: string;
  time_range: string;
  // Relations
  doctor?: User;
  department?: Department;
}

// Schedule with availability info
export interface ScheduleWithAvailability {
  id: number;
  department: Department;
  day_of_week: DayOfWeek;
  day_label: string;
  start_time: string;
  end_time: string;
  time_range: string;
  quota: number;
  is_currently_available: boolean;
}

// Available doctor response
export interface AvailableDoctor {
  doctor: User;
  schedules: ScheduleWithAvailability[];
}

// Doctor schedule grouped by day
export interface DoctorScheduleByDay {
  day_of_week: DayOfWeek;
  day_label: string;
  schedules: {
    id: number;
    department: Department;
    start_time: string;
    end_time: string;
    time_range: string;
    quota: number;
  }[];
}

// Day option for dropdown
export interface DayOption {
  value: DayOfWeek;
  label: string;
}

// Filters
export interface ScheduleFilters {
  doctor_id?: number | "";
  department_id?: number | "";
  day_of_week?: DayOfWeek | "";
  is_active?: boolean;
  page?: number;
  per_page?: number;
  all?: boolean;
}

// Create/Update payloads
export interface CreateSchedulePayload {
  doctor_id: number;
  department_id: number;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  quota?: number;
  is_active?: boolean;
  notes?: string | null;
}

export interface UpdateSchedulePayload {
  doctor_id?: number;
  department_id?: number;
  day_of_week?: DayOfWeek;
  start_time?: string;
  end_time?: string;
  quota?: number;
  is_active?: boolean;
  notes?: string | null;
}

// Response types
export interface ScheduleListResponse {
  success: boolean;
  data: DoctorSchedule[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ScheduleResponse {
  success: boolean;
  data: DoctorSchedule;
  message?: string;
}

export interface AvailableDoctorsResponse {
  success: boolean;
  data: AvailableDoctor[];
  day_of_week: DayOfWeek;
  day_label: string;
}

export interface DoctorScheduleResponse {
  success: boolean;
  data: {
    doctor: User;
    schedules: DoctorScheduleByDay[];
  };
}

export interface DayOptionsResponse {
  success: boolean;
  data: DayOption[];
}

// Labels
export const DAY_LABELS: Record<DayOfWeek, string> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

// Day options for dropdown
export const DAY_OPTIONS: DayOption[] = [
  { value: 0, label: "Minggu" },
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
];

// Kiosk schedule types
export interface KioskDoctorSchedule {
  id: number;
  doctor: {
    id: number;
    name: string;
  };
  day_of_week: DayOfWeek;
  day_label: string;
  start_time: string;
  end_time: string;
  time_range: string;
  quota: number;
  remaining_quota: number;
  is_currently_available: boolean;
}

export interface KioskSchedulesResponse {
  success: boolean;
  data: KioskDoctorSchedule[];
  department: {
    id: number;
    name: string;
    color: string;
  };
  day_of_week: DayOfWeek;
  day_label: string;
}

// Colors for days (for calendar view)
export const DAY_COLORS: Record<DayOfWeek, string> = {
  0: "red",
  1: "blue",
  2: "green",
  3: "yellow",
  4: "purple",
  5: "pink",
  6: "orange",
};
