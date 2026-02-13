import api from "@/lib/axios";
import type {
  Role,
  RoleFilters,
  RoleListResponse,
  RoleResponse,
  RoleStats,
  RoleStatsResponse,
  RolePayload,
} from "@/types/role";
import type { PermissionGroup } from "@/types/permission";

const roleService = {
  /**
   * Get all roles with pagination and filters
   */
  async getRoles(filters: RoleFilters = {}): Promise<RoleListResponse> {
    const response = await api.get<RoleListResponse>("/api/roles", {
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
   * Get active roles for dropdown
   */
  async getActiveRoles(): Promise<{ success: boolean; data: Role[] }> {
    const response = await api.get<{ success: boolean; data: Role[] }>(
      "/api/roles/active"
    );
    return response.data;
  },

  /**
   * Get single role by ID
   */
  async getRoleById(id: number | string): Promise<RoleResponse> {
    const response = await api.get<RoleResponse>(`/api/roles/${id}`);
    return response.data;
  },

  /**
   * Create new role
   */
  async createRole(payload: RolePayload): Promise<RoleResponse> {
    const response = await api.post<RoleResponse>("/api/roles", payload);
    return response.data;
  },

  /**
   * Update existing role
   */
  async updateRole(
    id: number | string,
    payload: RolePayload
  ): Promise<RoleResponse> {
    const response = await api.put<RoleResponse>(`/api/roles/${id}`, payload);
    return response.data;
  },

  /**
   * Delete role
   */
  async deleteRole(
    id: number | string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/roles/${id}`
    );
    return response.data;
  },

  /**
   * Toggle role active status
   */
  async toggleRoleStatus(id: number | string): Promise<RoleResponse> {
    const response = await api.patch<RoleResponse>(
      `/api/roles/${id}/toggle-status`
    );
    return response.data;
  },

  /**
   * Get role statistics
   */
  async getRoleStats(): Promise<RoleStatsResponse> {
    const response = await api.get<RoleStatsResponse>("/api/roles/stats");
    return response.data;
  },

  /**
   * Update permissions for a role
   */
  async updateRolePermissions(
    id: number | string,
    permissions: number[]
  ): Promise<RoleResponse> {
    const response = await api.put<RoleResponse>(`/api/roles/${id}/permissions`, {
      permissions,
    });
    return response.data;
  },

  /**
   * Get permissions matrix for role management
   */
  async getPermissionsMatrix(): Promise<{
    success: boolean;
    data: PermissionGroup[];
  }> {
    const response = await api.get<{ success: boolean; data: PermissionGroup[] }>(
      "/api/roles/permissions-matrix"
    );
    return response.data;
  },

  /**
   * Get color options
   */
  getColorOptions(): { value: string; label: string; class: string }[] {
    return [
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
  },

  /**
   * Get color class for badge
   */
  getColorClass(color: string | null): string {
    const colorMap: Record<string, string> = {
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      teal: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    };
    return colorMap[color || "blue"] || colorMap.blue;
  },

  /**
   * Get solid color class for avatar/icon
   */
  getSolidColorClass(color: string | null): string {
    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      indigo: "bg-indigo-500",
      cyan: "bg-cyan-500",
      orange: "bg-orange-500",
      teal: "bg-teal-500",
    };
    return colorMap[color || "blue"] || colorMap.blue;
  },
};

export default roleService;
