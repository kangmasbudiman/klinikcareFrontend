import type { Department } from "./department";

// Service category types
export type ServiceCategory =
  | "konsultasi"
  | "tindakan"
  | "laboratorium"
  | "radiologi"
  | "farmasi"
  | "rawat_inap"
  | "lainnya";

// Service interface
export interface Service {
  id: number;
  code: string;
  name: string;
  description: string | null;
  category: ServiceCategory;
  department_id: number | null;
  department?: Department | null;
  base_price: number;
  doctor_fee: number;
  hospital_fee: number;
  total_price: number;
  duration: number;
  is_active: boolean;
  requires_appointment: boolean;
  icon: string | null;
  color: string | null;
  category_label: string;
  formatted_base_price: string;
  formatted_total_price: string;
  created_at: string;
  updated_at: string;
}

// Service filters
export interface ServiceFilters {
  search?: string;
  status?: "all" | "active" | "inactive";
  category?: ServiceCategory | "all";
  department_id?: number | "all";
  page?: number;
  per_page?: number;
}

// Service statistics
export interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
  by_category: Record<ServiceCategory, number>;
}

// Create/Update service payload
export interface ServicePayload {
  code: string;
  name: string;
  description?: string;
  category: ServiceCategory;
  department_id?: number | null;
  base_price: number;
  doctor_fee?: number;
  hospital_fee?: number;
  duration: number;
  is_active?: boolean;
  requires_appointment?: boolean;
  icon?: string;
  color?: string;
}

// API Response types
export interface ServiceListResponse {
  success: boolean;
  message: string;
  data: Service[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: Service;
}

export interface ServiceStatsResponse {
  success: boolean;
  data: ServiceStats;
}

// Category labels
export const SERVICE_CATEGORIES: Record<ServiceCategory, string> = {
  konsultasi: "Konsultasi",
  tindakan: "Tindakan Medis",
  laboratorium: "Laboratorium",
  radiologi: "Radiologi",
  farmasi: "Farmasi",
  rawat_inap: "Rawat Inap",
  lainnya: "Lainnya",
};

// Category colors for badges
export const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  konsultasi: "blue",
  tindakan: "red",
  laboratorium: "purple",
  radiologi: "cyan",
  farmasi: "green",
  rawat_inap: "orange",
  lainnya: "gray",
};

// Service icons
export const SERVICE_ICONS = [
  { value: "stethoscope", label: "Stethoscope" },
  { value: "syringe", label: "Syringe" },
  { value: "pill", label: "Pill" },
  { value: "microscope", label: "Microscope" },
  { value: "scan", label: "Scan" },
  { value: "heart-pulse", label: "Heart Pulse" },
  { value: "thermometer", label: "Thermometer" },
  { value: "clipboard", label: "Clipboard" },
  { value: "activity", label: "Activity" },
  { value: "bed", label: "Bed" },
  { value: "scissors", label: "Scissors" },
  { value: "droplet", label: "Droplet" },
  { value: "eye", label: "Eye" },
  { value: "ear", label: "Ear" },
  { value: "bone", label: "Bone" },
];

// Service colors
export const SERVICE_COLORS = [
  { value: "blue", label: "Biru" },
  { value: "green", label: "Hijau" },
  { value: "red", label: "Merah" },
  { value: "yellow", label: "Kuning" },
  { value: "purple", label: "Ungu" },
  { value: "pink", label: "Pink" },
  { value: "indigo", label: "Indigo" },
  { value: "teal", label: "Teal" },
  { value: "orange", label: "Orange" },
  { value: "cyan", label: "Cyan" },
];
