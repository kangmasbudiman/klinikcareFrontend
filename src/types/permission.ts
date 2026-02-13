// Permission interface
export interface Permission {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  module: string;
  action: string;
  sort_order: number;
  roles_count?: number;
  created_at: string;
  updated_at: string;
}

// Permission grouped by module
export interface PermissionGroup {
  module: string;
  label: string;
  permissions: Permission[];
}

// Permission filters
export interface PermissionFilters {
  search?: string;
  module?: string | "all";
  action?: string | "all";
  page?: number;
  per_page?: number;
}

// Permission statistics
export interface PermissionStats {
  total: number;
  modules: number;
  by_module: Record<string, number>;
}

// Create/Update permission payload
export interface PermissionPayload {
  name: string;
  display_name: string;
  description?: string | null;
  module: string;
  action: string;
  sort_order?: number;
}

// Bulk create permissions payload
export interface BulkPermissionPayload {
  module: string;
  module_label: string;
  actions: string[];
}

// API Response types
export interface PermissionListResponse {
  success: boolean;
  message: string;
  data: Permission[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PermissionResponse {
  success: boolean;
  message: string;
  data: Permission;
}

export interface PermissionGroupedResponse {
  success: boolean;
  data: PermissionGroup[];
}

export interface PermissionStatsResponse {
  success: boolean;
  data: PermissionStats;
}

// Module options
export interface ModuleOption {
  value: string;
  label: string;
}

// Module labels
export const MODULE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Pengguna",
  roles: "Hak Akses",
  departments: "Departemen",
  services: "Layanan",
  icd_codes: "Kode ICD",
  clinic_settings: "Pengaturan Klinik",
  patients: "Pasien",
  appointments: "Janji Temu",
  medical_records: "Rekam Medis",
  prescriptions: "Resep",
  billing: "Tagihan",
  payments: "Pembayaran",
  pharmacy: "Farmasi",
  inventory: "Inventaris",
  reports: "Laporan",
};

// Action labels
export const ACTION_LABELS: Record<string, string> = {
  view: "Lihat",
  create: "Tambah",
  edit: "Edit",
  delete: "Hapus",
  manage: "Kelola",
  export: "Export",
};

// Available actions
export const PERMISSION_ACTIONS = [
  { value: "view", label: "Lihat" },
  { value: "create", label: "Tambah" },
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Hapus" },
  { value: "manage", label: "Kelola" },
  { value: "export", label: "Export" },
];
