import { User, UserRole } from "./auth";

// Extended user interface for user management
export interface UserWithStats extends User {
  last_login_at?: string | null;
  login_count?: number;
}

// Create user payload
export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  avatar?: string;
}

// Update user payload
export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: UserRole;
  is_active?: boolean;
  avatar?: string;
}

// User filters for listing
export interface UserFilters {
  search?: string;
  role?: UserRole | "all";
  status?: "all" | "active" | "inactive";
  page?: number;
  per_page?: number;
}

// User list response
export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Single user response
export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

// User stats for dashboard cards
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  by_role: Record<UserRole, number>;
}
