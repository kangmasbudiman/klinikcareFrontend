import api from "@/lib/axios";
import type {
  UserFilters,
  UserListResponse,
  UserResponse,
  CreateUserPayload,
  UpdateUserPayload,
  UserStats,
} from "@/types/user";
import type { UserRole } from "@/types/auth";

const userService = {
  /**
   * Get all users with pagination and filters
   */
  async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    const response = await api.get<UserListResponse>("/api/users", {
      params: {
        search: filters.search || undefined,
        role: filters.role === "all" ? undefined : filters.role,
        status: filters.status === "all" ? undefined : filters.status,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
      },
    });
    return response.data;
  },

  /**
   * Get single user by ID
   */
  async getUserById(id: number | string): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/api/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  async createUser(payload: CreateUserPayload): Promise<UserResponse> {
    const response = await api.post<UserResponse>("/api/users", payload);
    return response.data;
  },

  /**
   * Update existing user
   */
  async updateUser(
    id: number | string,
    payload: UpdateUserPayload,
  ): Promise<UserResponse> {
    const response = await api.put<UserResponse>(`/api/users/${id}`, payload);
    return response.data;
  },

  /**
   * Delete user
   */
  async deleteUser(
    id: number | string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/users/${id}`,
    );
    return response.data;
  },

  /**
   * Toggle user active status
   */
  async toggleUserStatus(id: number | string): Promise<UserResponse> {
    const response = await api.patch<UserResponse>(
      `/api/users/${id}/toggle-status`,
    );
    return response.data;
  },

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{ success: boolean; data: UserStats }> {
    const response = await api.get<{ success: boolean; data: UserStats }>(
      "/api/users/stats",
    );
    return response.data;
  },

  /**
   * Get role options for select dropdown
   */
  getRoleOptions(): { value: UserRole; label: string }[] {
    return [
      { value: "super_admin", label: "Super Admin" },
      { value: "admin_klinik", label: "Admin Klinik" },
      { value: "dokter", label: "Dokter" },
      { value: "perawat", label: "Perawat" },
      { value: "kasir", label: "Kasir" },
      { value: "apoteker", label: "Apoteker" },
      { value: "pasien", label: "Pasien" },
    ];
  },

  /**
   * Assign departments to user (for dokter/perawat)
   */
  async assignDepartments(
    userId: number,
    payload: {
      department_ids: number[];
      primary_department_id?: number | null;
    },
  ): Promise<UserResponse> {
    const response = await api.post<UserResponse>(
      `/api/users/${userId}/departments`,
      payload,
    );
    return response.data;
  },

  /**
   * Get user's departments
   */
  async getUserDepartments(
    userId: number,
  ): Promise<{ success: boolean; data: any[] }> {
    const response = await api.get<{ success: boolean; data: any[] }>(
      `/api/users/${userId}/departments`,
    );
    return response.data;
  },

  /**
   * Get doctors by department
   */
  async getDoctorsByDepartment(
    departmentId?: number,
  ): Promise<{ success: boolean; data: any[] }> {
    const params = departmentId ? { department_id: departmentId } : {};
    const response = await api.get<{ success: boolean; data: any[] }>(
      "/api/users/doctors",
      { params },
    );
    return response.data;
  },
};

export default userService;
