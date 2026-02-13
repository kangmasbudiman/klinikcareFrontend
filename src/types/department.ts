// Department color options
export type DepartmentColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "pink"
  | "indigo"
  | "cyan"
  | "orange"
  | "teal";

// Department icon options
export type DepartmentIcon =
  | "stethoscope"
  | "tooth"
  | "baby"
  | "heart"
  | "eye"
  | "ear"
  | "hand"
  | "flask"
  | "scan"
  | "pill"
  | "syringe"
  | "bandage"
  | "hospital"
  | "activity";

// Simple Service reference for Department
export interface DepartmentDefaultService {
  id: number;
  code: string;
  name: string;
  total_price: number;
}

// Main Department interface
export interface Department {
  id: number;
  code: string;
  name: string;
  description: string | null;
  icon: DepartmentIcon | null;
  color: DepartmentColor;
  quota_per_day: number;
  default_service_id: number | null;
  default_service?: DepartmentDefaultService | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Create department payload
export interface CreateDepartmentPayload {
  code: string;
  name: string;
  description?: string;
  icon?: DepartmentIcon;
  color?: DepartmentColor;
  quota_per_day?: number;
  default_service_id?: number | null;
  is_active?: boolean;
}

// Update department payload
export interface UpdateDepartmentPayload {
  code?: string;
  name?: string;
  description?: string;
  icon?: DepartmentIcon;
  color?: DepartmentColor;
  quota_per_day?: number;
  default_service_id?: number | null;
  is_active?: boolean;
}

// Department filters for listing
export interface DepartmentFilters {
  search?: string;
  status?: "all" | "active" | "inactive";
  page?: number;
  per_page?: number;
}

// Department list response
export interface DepartmentListResponse {
  success: boolean;
  message: string;
  data: Department[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Single department response
export interface DepartmentResponse {
  success: boolean;
  message: string;
  data: Department;
}

// Department stats for dashboard cards
export interface DepartmentStats {
  total: number;
  active: number;
  inactive: number;
  total_quota: number;
}

// Color options response
export interface ColorOption {
  value: DepartmentColor;
  label: string;
  class: string;
}

// Icon options response
export interface IconOption {
  value: DepartmentIcon;
  label: string;
}
