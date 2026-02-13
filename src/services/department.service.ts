import api from "@/lib/axios";
import type {
  Department,
  DepartmentFilters,
  DepartmentListResponse,
  DepartmentResponse,
  DepartmentStats,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  ColorOption,
  IconOption,
  DepartmentColor,
  DepartmentIcon,
} from "@/types/department";

const departmentService = {
  /**
   * Get all departments with pagination and filters
   */
  async getDepartments(
    filters: DepartmentFilters = {}
  ): Promise<DepartmentListResponse> {
    const response = await api.get<DepartmentListResponse>("/api/departments", {
      params: {
        search: filters.search || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
      },
    });
    return response.data;
  },

  /**
   * Get active departments only (for dropdown/select)
   */
  async getActiveDepartments(): Promise<{
    success: boolean;
    data: Department[];
  }> {
    const response = await api.get<{ success: boolean; data: Department[] }>(
      "/api/departments/active"
    );
    return response.data;
  },

  /**
   * Get single department by ID
   */
  async getDepartmentById(id: number | string): Promise<DepartmentResponse> {
    const response = await api.get<DepartmentResponse>(
      `/api/departments/${id}`
    );
    return response.data;
  },

  /**
   * Create new department
   */
  async createDepartment(
    payload: CreateDepartmentPayload
  ): Promise<DepartmentResponse> {
    const response = await api.post<DepartmentResponse>(
      "/api/departments",
      payload
    );
    return response.data;
  },

  /**
   * Update existing department
   */
  async updateDepartment(
    id: number | string,
    payload: UpdateDepartmentPayload
  ): Promise<DepartmentResponse> {
    const response = await api.put<DepartmentResponse>(
      `/api/departments/${id}`,
      payload
    );
    return response.data;
  },

  /**
   * Delete department
   */
  async deleteDepartment(
    id: number | string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/departments/${id}`
    );
    return response.data;
  },

  /**
   * Toggle department active status
   */
  async toggleDepartmentStatus(
    id: number | string
  ): Promise<DepartmentResponse> {
    const response = await api.patch<DepartmentResponse>(
      `/api/departments/${id}/toggle-status`
    );
    return response.data;
  },

  /**
   * Get department statistics
   */
  async getDepartmentStats(): Promise<{
    success: boolean;
    data: DepartmentStats;
  }> {
    const response = await api.get<{ success: boolean; data: DepartmentStats }>(
      "/api/departments/stats"
    );
    return response.data;
  },

  /**
   * Get available color options
   */
  getColorOptions(): ColorOption[] {
    return [
      { value: "blue", label: "Biru", class: "bg-blue-500" },
      { value: "green", label: "Hijau", class: "bg-green-500" },
      { value: "red", label: "Merah", class: "bg-red-500" },
      { value: "yellow", label: "Kuning", class: "bg-yellow-500" },
      { value: "purple", label: "Ungu", class: "bg-purple-500" },
      { value: "pink", label: "Pink", class: "bg-pink-500" },
      { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
      { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
      { value: "orange", label: "Oranye", class: "bg-orange-500" },
      { value: "teal", label: "Teal", class: "bg-teal-500" },
    ];
  },

  /**
   * Get available icon options
   */
  getIconOptions(): IconOption[] {
    return [
      { value: "stethoscope", label: "Stetoskop" },
      { value: "tooth", label: "Gigi" },
      { value: "baby", label: "Bayi" },
      { value: "heart", label: "Jantung" },
      { value: "eye", label: "Mata" },
      { value: "ear", label: "Telinga" },
      { value: "hand", label: "Tangan" },
      { value: "flask", label: "Lab" },
      { value: "scan", label: "Radiologi" },
      { value: "pill", label: "Obat" },
      { value: "syringe", label: "Suntik" },
      { value: "bandage", label: "Perban" },
      { value: "hospital", label: "Rumah Sakit" },
      { value: "activity", label: "Aktivitas" },
    ];
  },

  /**
   * Get color class for badge
   */
  getColorClass(color: DepartmentColor): string {
    const colorMap: Record<DepartmentColor, string> = {
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      green:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      yellow:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      purple:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      indigo:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      orange:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      teal: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    };
    return colorMap[color] || colorMap.blue;
  },
};

export default departmentService;
