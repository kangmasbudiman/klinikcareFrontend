import axios from "@/lib/axios";
import type {
  Patient,
  PatientFilters,
  PatientListResponse,
  PatientResponse,
  PatientSearchResponse,
  PatientStatsResponse,
  CreatePatientPayload,
  UpdatePatientPayload,
  PatientType,
  Gender,
  Religion,
  MaritalStatus,
  BloodType,
  GENDER_LABELS,
  PATIENT_TYPE_LABELS,
  RELIGION_LABELS,
  MARITAL_STATUS_LABELS,
  BLOOD_TYPE_LABELS,
  PATIENT_TYPE_COLORS,
} from "@/types/patient";

const patientService = {
  // Get list of patients with filters
  async getPatients(
    filters: PatientFilters = {},
  ): Promise<PatientListResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.status && filters.status !== "all")
      params.append("status", filters.status);
    if (filters.patient_type)
      params.append("patient_type", filters.patient_type);
    if (filters.gender) params.append("gender", filters.gender);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());
    if (filters.sort_by) params.append("sort_by", filters.sort_by);
    if (filters.sort_dir) params.append("sort_dir", filters.sort_dir);

    const response = await axios.get(`/api/patients?${params.toString()}`);
    return response.data;
  },

  // Search patients (for autocomplete)
  async searchPatients(
    query: string,
    limit: number = 10,
  ): Promise<PatientSearchResponse> {
    const response = await axios.get(
      `/api/patients/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
    return response.data;
  },

  // Get patient statistics
  async getPatientStats(): Promise<PatientStatsResponse> {
    const response = await axios.get("/api/patients/stats");
    return response.data;
  },

  // Get patient by ID
  async getPatientById(id: number): Promise<PatientResponse> {
    const response = await axios.get(`/api/patients/${id}`);
    return response.data;
  },

  // Create patient
  async createPatient(payload: CreatePatientPayload): Promise<PatientResponse> {
    const response = await axios.post("/api/patients", payload);
    return response.data;
  },

  // Update patient
  async updatePatient(
    id: number,
    payload: UpdatePatientPayload,
  ): Promise<PatientResponse> {
    const response = await axios.put(`/api/patients/${id}`, payload);
    return response.data;
  },

  // Delete patient
  async deletePatient(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`/api/patients/${id}`);
    return response.data;
  },

  // Toggle patient status
  async togglePatientStatus(id: number): Promise<PatientResponse> {
    const response = await axios.patch(`/api/patients/${id}/toggle-status`);
    return response.data;
  },

  // Get patient visits
  async getPatientVisits(
    id: number,
    page: number = 1,
  ): Promise<PatientListResponse> {
    const response = await axios.get(`/api/patients/${id}/visits?page=${page}`);
    return response.data;
  },

  // Generate medical record number
  async generateMrn(): Promise<{
    success: boolean;
    data: { medical_record_number: string };
  }> {
    const response = await axios.post("/api/patients/generate-mrn");
    return response.data;
  },

  // Get options for dropdowns
  async getOptions(): Promise<{
    success: boolean;
    data: {
      genders: Record<Gender, string>;
      patient_types: Record<PatientType, string>;
      religions: Record<Religion, string>;
      marital_statuses: Record<MaritalStatus, string>;
      blood_types: Record<BloodType, string>;
    };
  }> {
    const response = await axios.get("/api/patients/options");
    return response.data;
  },

  // Helper: Get gender options
  getGenderOptions(): { value: Gender; label: string }[] {
    return [
      { value: "male", label: "Laki-laki" },
      { value: "female", label: "Perempuan" },
    ];
  },

  // Helper: Get patient type options
  getPatientTypeOptions(): { value: PatientType; label: string }[] {
    return [
      { value: "umum", label: "Umum" },
      { value: "bpjs", label: "BPJS" },
      { value: "asuransi", label: "Asuransi" },
    ];
  },

  // Helper: Get religion options
  getReligionOptions(): { value: Religion; label: string }[] {
    return [
      { value: "islam", label: "Islam" },
      { value: "kristen", label: "Kristen" },
      { value: "katolik", label: "Katolik" },
      { value: "hindu", label: "Hindu" },
      { value: "buddha", label: "Buddha" },
      { value: "konghucu", label: "Konghucu" },
      { value: "lainnya", label: "Lainnya" },
    ];
  },

  // Helper: Get marital status options
  getMaritalStatusOptions(): { value: MaritalStatus; label: string }[] {
    return [
      { value: "single", label: "Belum Menikah" },
      { value: "married", label: "Menikah" },
      { value: "divorced", label: "Cerai" },
      { value: "widowed", label: "Janda/Duda" },
    ];
  },

  // Helper: Get blood type options
  getBloodTypeOptions(): { value: BloodType; label: string }[] {
    return [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "AB", label: "AB" },
      { value: "O", label: "O" },
    ];
  },

  // Helper: Get patient type color class
  getPatientTypeColorClass(type: PatientType): string {
    const colors: Record<PatientType, string> = {
      umum: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      bpjs: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      asuransi:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return (
      colors[type] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  },

  // Helper: Get gender color class
  getGenderColorClass(gender: Gender): string {
    const colors: Record<Gender, string> = {
      male: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      female: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    };
    return (
      colors[gender] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  },

  // Helper: Format age
  formatAge(birthDate: string): string {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return `${age} tahun`;
  },

  // Helper: Format phone
  formatPhone(phone: string | null): string {
    if (!phone) return "-";
    // Format: 0812-3456-7890
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length >= 10) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
    }
    return phone;
  },
};

export default patientService;
