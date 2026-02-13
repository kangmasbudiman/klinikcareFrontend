import api from "@/lib/axios";
import type {
  Permission,
  PermissionGroup,
  PermissionFilters,
  PermissionListResponse,
  PermissionResponse,
  PermissionGroupedResponse,
  PermissionStats,
  PermissionStatsResponse,
  ModuleOption,
} from "@/types/permission";

const permissionService = {
  /**
   * Get all permissions with pagination and filters
   */
  async getPermissions(
    filters: PermissionFilters = {}
  ): Promise<PermissionListResponse> {
    const response = await api.get<PermissionListResponse>("/api/permissions", {
      params: {
        search: filters.search || undefined,
        module: filters.module === "all" ? undefined : filters.module,
        action: filters.action === "all" ? undefined : filters.action,
        page: filters.page || 1,
        per_page: filters.per_page || 50,
      },
    });
    return response.data;
  },

  /**
   * Get all permissions grouped by module
   */
  async getGroupedPermissions(): Promise<PermissionGroupedResponse> {
    const response = await api.get<PermissionGroupedResponse>(
      "/api/permissions/grouped"
    );
    return response.data;
  },

  /**
   * Get single permission by ID
   */
  async getPermissionById(id: number | string): Promise<PermissionResponse> {
    const response = await api.get<PermissionResponse>(`/api/permissions/${id}`);
    return response.data;
  },

  /**
   * Get permission statistics
   */
  async getPermissionStats(): Promise<PermissionStatsResponse> {
    const response = await api.get<PermissionStatsResponse>(
      "/api/permissions/stats"
    );
    return response.data;
  },

  /**
   * Get available modules
   */
  async getModules(): Promise<{ success: boolean; data: ModuleOption[] }> {
    const response = await api.get<{ success: boolean; data: ModuleOption[] }>(
      "/api/permissions/modules"
    );
    return response.data;
  },

  /**
   * Get module labels
   */
  getModuleLabels(): Record<string, string> {
    return {
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
  },

  /**
   * Get action labels
   */
  getActionLabels(): Record<string, string> {
    return {
      view: "Lihat",
      create: "Tambah",
      edit: "Edit",
      delete: "Hapus",
      manage: "Kelola",
      export: "Export",
    };
  },

  /**
   * Get action color class
   */
  getActionColorClass(action: string): string {
    const colorMap: Record<string, string> = {
      view: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      create: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      edit: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      delete: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      manage: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      export: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    };
    return colorMap[action] || colorMap.view;
  },
};

export default permissionService;
