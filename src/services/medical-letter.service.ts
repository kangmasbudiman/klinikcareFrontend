import axios from "@/lib/axios";
import type {
  MedicalLetterFilters,
  MedicalLetterListResponse,
  MedicalLetterResponse,
  MedicalLetterStatsResponse,
  MedicalLetterPrintResponse,
  CreateMedicalLetterPayload,
  UpdateMedicalLetterPayload,
} from "@/types/medical-letter";

const medicalLetterService = {
  async getLetters(
    filters: MedicalLetterFilters = {},
  ): Promise<MedicalLetterListResponse> {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.letter_type) params.append("letter_type", filters.letter_type);
    if (filters.patient_id)
      params.append("patient_id", filters.patient_id.toString());
    if (filters.doctor_id)
      params.append("doctor_id", filters.doctor_id.toString());
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());

    const response = await axios.get(
      `/api/medical-letters?${params.toString()}`,
    );
    return response.data;
  },

  async getLetterById(id: number): Promise<MedicalLetterResponse> {
    const response = await axios.get(`/api/medical-letters/${id}`);
    return response.data;
  },

  async createLetter(
    payload: CreateMedicalLetterPayload,
  ): Promise<MedicalLetterResponse> {
    const response = await axios.post("/api/medical-letters", payload);
    return response.data;
  },

  async updateLetter(
    id: number,
    payload: UpdateMedicalLetterPayload,
  ): Promise<MedicalLetterResponse> {
    const response = await axios.put(`/api/medical-letters/${id}`, payload);
    return response.data;
  },

  async deleteLetter(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`/api/medical-letters/${id}`);
    return response.data;
  },

  async getLetterStats(): Promise<MedicalLetterStatsResponse> {
    const response = await axios.get("/api/medical-letters/stats");
    return response.data;
  },

  async getLetterPrint(id: number): Promise<MedicalLetterPrintResponse> {
    const response = await axios.get(`/api/medical-letters/${id}/print`);
    return response.data;
  },
};

export default medicalLetterService;
