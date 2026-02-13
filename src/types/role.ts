import type { Permission } from "./permission";

// Role interface
export interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  color: string;
  is_system: boolean;
  is_active: boolean;
  permissions?: Permission[];
  permissions_count?: number;
  users_count?: number;
  created_at: string;
  updated_at: string;
}

// Role filters
export interface RoleFilters {
  search?: string;
  status?: "all" | "active" | "inactive";
  page?: number;
  per_page?: number;
}

// Role statistics
export interface RoleStats {
  total: number;
  active: number;
  inactive: number;
  system: number;
}

// Create/Update role payload
export interface RolePayload {
  name: string;
  display_name: string;
  description?: string | null;
  color?: string;
  is_active?: boolean;
  permissions?: number[];
}

// API Response types
export interface RoleListResponse {
  success: boolean;
  message: string;
  data: Role[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface RoleResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface RoleStatsResponse {
  success: boolean;
  data: RoleStats;
}

// Role colors
export const ROLE_COLORS = [
  { value: "red", label: "Merah", class: "bg-red-500" },
  { value: "blue", label: "Biru", class: "bg-blue-500" },
  { value: "green", label: "Hijau", class: "bg-green-500" },
  { value: "yellow", label: "Kuning", class: "bg-yellow-500" },
  { value: "purple", label: "Ungu", class: "bg-purple-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { value: "orange", label: "Oranye", class: "bg-orange-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
];
