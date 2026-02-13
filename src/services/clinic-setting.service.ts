import api from "@/lib/axios";
import publicApi from "@/lib/axios-public";
import type {
  ClinicSetting,
  ClinicSettingResponse,
  UpdateClinicSettingPayload,
  UploadResponse,
} from "@/types/clinic-setting";

const clinicSettingService = {
  /**
   * Get clinic settings
   */
  async getSettings(): Promise<ClinicSettingResponse> {
    const response = await api.get<ClinicSettingResponse>(
      "/api/clinic-settings",
    );
    return response.data;
  },

  /**
   * Update clinic settings
   */
  async updateSettings(
    payload: UpdateClinicSettingPayload,
  ): Promise<ClinicSettingResponse> {
    const response = await api.put<ClinicSettingResponse>(
      "/api/clinic-settings",
      payload,
    );
    return response.data;
  },

  /**
   * Upload logo
   */
  async uploadLogo(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await api.post<UploadResponse>(
      "/api/clinic-settings/logo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Upload favicon
   */
  async uploadFavicon(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("favicon", file);

    const response = await api.post<UploadResponse>(
      "/api/clinic-settings/favicon",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Get timezone options
   */
  async getTimezones(): Promise<{
    success: boolean;
    data: Record<string, string>;
  }> {
    const response = await api.get<{
      success: boolean;
      data: Record<string, string>;
    }>("/api/clinic-settings/timezones");
    return response.data;
  },

  /**
   * Get public clinic info (no auth)
   */
  async getPublicInfo(): Promise<{
    success: boolean;
    data: Partial<ClinicSetting>;
  }> {
    const response = await publicApi.get<{
      success: boolean;
      data: Partial<ClinicSetting>;
    }>("/api/clinic-info");
    return response.data;
  },

  /**
   * Get timezone options (static)
   */
  getTimezoneOptions(): { value: string; label: string }[] {
    return [
      { value: "Asia/Jakarta", label: "WIB - Jakarta" },
      { value: "Asia/Makassar", label: "WITA - Makassar" },
      { value: "Asia/Jayapura", label: "WIT - Jayapura" },
    ];
  },

  /**
   * Get currency options
   */
  getCurrencyOptions(): { value: string; label: string }[] {
    return [
      { value: "IDR", label: "IDR - Rupiah" },
      { value: "USD", label: "USD - Dollar" },
    ];
  },

  /**
   * Get date format options
   */
  getDateFormatOptions(): { value: string; label: string }[] {
    return [
      { value: "d/m/Y", label: "31/12/2024" },
      { value: "d-m-Y", label: "31-12-2024" },
      { value: "Y-m-d", label: "2024-12-31" },
      { value: "d M Y", label: "31 Des 2024" },
    ];
  },

  /**
   * Get time format options
   */
  getTimeFormatOptions(): { value: string; label: string }[] {
    return [
      { value: "H:i", label: "14:30 (24 jam)" },
      { value: "h:i A", label: "02:30 PM (12 jam)" },
    ];
  },

  /**
   * Get province options (Indonesia)
   */
  getProvinceOptions(): string[] {
    return [
      "Aceh",
      "Bali",
      "Banten",
      "Bengkulu",
      "DI Yogyakarta",
      "DKI Jakarta",
      "Gorontalo",
      "Jambi",
      "Jawa Barat",
      "Jawa Tengah",
      "Jawa Timur",
      "Kalimantan Barat",
      "Kalimantan Selatan",
      "Kalimantan Tengah",
      "Kalimantan Timur",
      "Kalimantan Utara",
      "Kepulauan Bangka Belitung",
      "Kepulauan Riau",
      "Lampung",
      "Maluku",
      "Maluku Utara",
      "Nusa Tenggara Barat",
      "Nusa Tenggara Timur",
      "Papua",
      "Papua Barat",
      "Riau",
      "Sulawesi Barat",
      "Sulawesi Selatan",
      "Sulawesi Tengah",
      "Sulawesi Tenggara",
      "Sulawesi Utara",
      "Sumatera Barat",
      "Sumatera Selatan",
      "Sumatera Utara",
    ];
  },
};

export default clinicSettingService;
