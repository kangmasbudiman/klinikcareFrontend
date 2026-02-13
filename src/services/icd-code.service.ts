import api from "@/lib/axios";
import type {
  IcdCode,
  IcdType,
  IcdCodeFilters,
  IcdCodeListResponse,
  IcdCodeResponse,
  IcdCodeStats,
  IcdCodeStatsResponse,
  IcdCodePayload,
  IcdCodeSearchResponse,
  IcdCodeImportResponse,
} from "@/types/icd-code";

const icdCodeService = {
  /**
   * Get all ICD codes with pagination and filters
   */
  async getIcdCodes(filters: IcdCodeFilters = {}): Promise<IcdCodeListResponse> {
    const response = await api.get<IcdCodeListResponse>("/api/icd-codes", {
      params: {
        search: filters.search || undefined,
        type: filters.type === "all" ? undefined : filters.type,
        status: filters.status === "all" ? undefined : filters.status,
        bpjs: filters.bpjs === "all" ? undefined : filters.bpjs,
        chapter: filters.chapter === "all" ? undefined : filters.chapter,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
      },
    });
    return response.data;
  },

  /**
   * Search ICD codes (for autocomplete/select)
   */
  async searchIcdCodes(params: {
    query: string;
    type?: IcdType;
    limit?: number;
  }): Promise<IcdCodeSearchResponse> {
    const response = await api.get<IcdCodeSearchResponse>("/api/icd-codes/search", {
      params: {
        q: params.query,
        type: params.type,
        limit: params.limit || 20,
      },
    });
    return response.data;
  },

  /**
   * Get single ICD code by ID
   */
  async getIcdCodeById(id: number | string): Promise<IcdCodeResponse> {
    const response = await api.get<IcdCodeResponse>(`/api/icd-codes/${id}`);
    return response.data;
  },

  /**
   * Create new ICD code
   */
  async createIcdCode(payload: IcdCodePayload): Promise<IcdCodeResponse> {
    const response = await api.post<IcdCodeResponse>("/api/icd-codes", payload);
    return response.data;
  },

  /**
   * Update existing ICD code
   */
  async updateIcdCode(
    id: number | string,
    payload: IcdCodePayload
  ): Promise<IcdCodeResponse> {
    const response = await api.put<IcdCodeResponse>(
      `/api/icd-codes/${id}`,
      payload
    );
    return response.data;
  },

  /**
   * Delete ICD code
   */
  async deleteIcdCode(
    id: number | string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/icd-codes/${id}`
    );
    return response.data;
  },

  /**
   * Toggle ICD code active status
   */
  async toggleIcdCodeStatus(id: number | string): Promise<IcdCodeResponse> {
    const response = await api.patch<IcdCodeResponse>(
      `/api/icd-codes/${id}/toggle-status`
    );
    return response.data;
  },

  /**
   * Get ICD code statistics
   */
  async getIcdCodeStats(): Promise<IcdCodeStatsResponse> {
    const response = await api.get<IcdCodeStatsResponse>("/api/icd-codes/stats");
    return response.data;
  },

  /**
   * Import ICD codes from file
   */
  async importIcdCodes(
    file: File,
    type: IcdType
  ): Promise<IcdCodeImportResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await api.post<IcdCodeImportResponse>(
      "/api/icd-codes/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Get ICD type options
   */
  getTypeOptions(): { value: IcdType; label: string; description: string }[] {
    return [
      {
        value: "icd10",
        label: "ICD-10 (Diagnosis)",
        description: "International Classification of Diseases 10th Revision",
      },
      {
        value: "icd9cm",
        label: "ICD-9-CM (Prosedur)",
        description: "International Classification of Diseases 9th Revision Clinical Modification",
      },
    ];
  },

  /**
   * Get ICD-10 chapter options
   */
  getChapterOptions(): { value: string; label: string }[] {
    return [
      { value: "I", label: "I - Penyakit infeksi dan parasit" },
      { value: "II", label: "II - Neoplasma" },
      { value: "III", label: "III - Penyakit darah" },
      { value: "IV", label: "IV - Penyakit endokrin, nutrisi dan metabolik" },
      { value: "V", label: "V - Gangguan mental dan perilaku" },
      { value: "VI", label: "VI - Penyakit sistem saraf" },
      { value: "VII", label: "VII - Penyakit mata" },
      { value: "VIII", label: "VIII - Penyakit telinga" },
      { value: "IX", label: "IX - Penyakit sistem sirkulasi" },
      { value: "X", label: "X - Penyakit sistem pernapasan" },
      { value: "XI", label: "XI - Penyakit sistem pencernaan" },
      { value: "XII", label: "XII - Penyakit kulit" },
      { value: "XIII", label: "XIII - Penyakit muskuloskeletal" },
      { value: "XIV", label: "XIV - Penyakit sistem genitourinaria" },
      { value: "XV", label: "XV - Kehamilan, persalinan dan nifas" },
      { value: "XVI", label: "XVI - Kondisi perinatal" },
      { value: "XVII", label: "XVII - Malformasi kongenital" },
      { value: "XVIII", label: "XVIII - Gejala dan tanda" },
      { value: "XIX", label: "XIX - Cedera dan keracunan" },
      { value: "XX", label: "XX - Penyebab eksternal" },
      { value: "XXI", label: "XXI - Faktor yang mempengaruhi status kesehatan" },
    ];
  },

  /**
   * Get type color class for badge
   */
  getTypeColorClass(type: IcdType): string {
    const colorMap: Record<IcdType, string> = {
      icd10: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      icd9cm: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return colorMap[type] || colorMap.icd10;
  },

  /**
   * Get status badge class
   */
  getStatusClass(isActive: boolean): string {
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  },

  /**
   * Get BPJS claimable badge class
   */
  getBpjsClass(isClaimable: boolean): string {
    return isClaimable
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  },

  /**
   * Format ICD code display (code + name)
   */
  formatDisplay(icdCode: IcdCode): string {
    return `${icdCode.code} - ${icdCode.name_id}`;
  },

  /**
   * Format type label
   */
  formatTypeLabel(type: IcdType): string {
    return type === "icd10" ? "ICD-10" : "ICD-9-CM";
  },
};

export default icdCodeService;
