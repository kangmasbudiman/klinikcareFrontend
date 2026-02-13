export type UserRole =
  | "super_admin"
  | "admin_klinik"
  | "dokter"
  | "perawat"
  | "kasir"
  | "pasien"
  | "apoteker";

export interface UserDepartment {
  id: number;
  code: string;
  name: string;
  color: string;
  is_primary: boolean;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  is_active: boolean;
  departments?: UserDepartment[];
  primary_department_id?: number | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  // Alias untuk backward compatibility
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin_klinik: "Admin Klinik",
  dokter: "Dokter",
  perawat: "Perawat",
  kasir: "Kasir",
  pasien: "Pasien",
  apoteker: "Apoteker",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "bg-purple-100 text-purple-800",
  admin_klinik: "bg-blue-100 text-blue-800",
  dokter: "bg-green-100 text-green-800",
  perawat: "bg-teal-100 text-teal-800",
  kasir: "bg-orange-100 text-orange-800",
  pasien: "bg-gray-100 text-gray-800",
  apoteker: "bg-emerald-100 text-emerald-800",
};
