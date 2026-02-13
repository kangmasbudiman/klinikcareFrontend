import api from "@/lib/axios";
import type {
  Service,
  ServiceFilters,
  ServiceListResponse,
  ServiceResponse,
  ServiceStats,
  ServiceStatsResponse,
  ServicePayload,
  ServiceCategory,
} from "@/types/service";

const serviceService = {
  /**
   * Get all services with pagination and filters
   */
  async getServices(filters: ServiceFilters = {}): Promise<ServiceListResponse> {
    const response = await api.get<ServiceListResponse>("/api/services", {
      params: {
        search: filters.search || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        category: filters.category === "all" ? undefined : filters.category,
        department_id: filters.department_id === "all" ? undefined : filters.department_id,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
      },
    });
    return response.data;
  },

  /**
   * Get active services only (for dropdown/select)
   */
  async getActiveServices(params?: {
    category?: ServiceCategory;
    department_id?: number;
  }): Promise<{ success: boolean; data: Service[] }> {
    const response = await api.get<{ success: boolean; data: Service[] }>(
      "/api/services/active",
      { params }
    );
    return response.data;
  },

  /**
   * Get single service by ID
   */
  async getServiceById(id: number | string): Promise<ServiceResponse> {
    const response = await api.get<ServiceResponse>(`/api/services/${id}`);
    return response.data;
  },

  /**
   * Create new service
   */
  async createService(payload: ServicePayload): Promise<ServiceResponse> {
    const response = await api.post<ServiceResponse>("/api/services", payload);
    return response.data;
  },

  /**
   * Update existing service
   */
  async updateService(
    id: number | string,
    payload: ServicePayload
  ): Promise<ServiceResponse> {
    const response = await api.put<ServiceResponse>(
      `/api/services/${id}`,
      payload
    );
    return response.data;
  },

  /**
   * Delete service
   */
  async deleteService(
    id: number | string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/services/${id}`
    );
    return response.data;
  },

  /**
   * Toggle service active status
   */
  async toggleServiceStatus(id: number | string): Promise<ServiceResponse> {
    const response = await api.patch<ServiceResponse>(
      `/api/services/${id}/toggle-status`
    );
    return response.data;
  },

  /**
   * Get service statistics
   */
  async getServiceStats(): Promise<ServiceStatsResponse> {
    const response = await api.get<ServiceStatsResponse>("/api/services/stats");
    return response.data;
  },

  /**
   * Get category options
   */
  getCategoryOptions(): { value: ServiceCategory; label: string }[] {
    return [
      { value: "konsultasi", label: "Konsultasi" },
      { value: "tindakan", label: "Tindakan Medis" },
      { value: "laboratorium", label: "Laboratorium" },
      { value: "radiologi", label: "Radiologi" },
      { value: "farmasi", label: "Farmasi" },
      { value: "rawat_inap", label: "Rawat Inap" },
      { value: "lainnya", label: "Lainnya" },
    ];
  },

  /**
   * Get color options
   */
  getColorOptions(): { value: string; label: string; class: string }[] {
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
   * Get icon options
   */
  getIconOptions(): { value: string; label: string }[] {
    return [
      { value: "stethoscope", label: "Stetoskop" },
      { value: "syringe", label: "Suntik" },
      { value: "pill", label: "Obat" },
      { value: "microscope", label: "Mikroskop" },
      { value: "scan", label: "Scan" },
      { value: "heart-pulse", label: "Detak Jantung" },
      { value: "thermometer", label: "Termometer" },
      { value: "clipboard", label: "Clipboard" },
      { value: "activity", label: "Aktivitas" },
      { value: "bed", label: "Tempat Tidur" },
      { value: "scissors", label: "Gunting" },
      { value: "droplet", label: "Tetesan" },
      { value: "eye", label: "Mata" },
      { value: "ear", label: "Telinga" },
      { value: "bone", label: "Tulang" },
    ];
  },

  /**
   * Get color class for badge by category
   */
  getCategoryColorClass(category: ServiceCategory): string {
    const colorMap: Record<ServiceCategory, string> = {
      konsultasi: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      tindakan: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      laboratorium: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      radiologi: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      farmasi: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rawat_inap: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      lainnya: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colorMap[category] || colorMap.lainnya;
  },

  /**
   * Get color class for badge
   */
  getColorClass(color: string | null): string {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
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
   * Format price to Indonesian Rupiah
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  /**
   * Format duration in minutes to readable string
   */
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} menit`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} jam`;
    }
    return `${hours} jam ${remainingMinutes} menit`;
  },
};

export default serviceService;
