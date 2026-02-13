import type { Patient } from "./patient";
import type { User } from "./auth";
import type { MedicalRecord } from "./medical-record";

export type LetterType =
  | "surat_sehat"
  | "surat_sakit"
  | "surat_rujukan"
  | "surat_keterangan";

export interface MedicalLetter {
  id: number;
  letter_number: string;
  letter_type: LetterType;
  letter_type_label: string;
  patient_id: number;
  doctor_id: number;
  medical_record_id: number | null;
  letter_date: string;
  purpose: string | null;
  notes: string | null;
  // Surat Sakit
  sick_start_date: string | null;
  sick_end_date: string | null;
  sick_days: number | null;
  // Surat Rujukan
  referral_destination: string | null;
  referral_specialist: string | null;
  referral_reason: string | null;
  diagnosis_summary: string | null;
  treatment_summary: string | null;
  // Surat Sehat
  health_purpose: string | null;
  examination_result: string | null;
  // Surat Keterangan
  statement_content: string | null;
  // Relations
  patient?: Patient;
  doctor?: User;
  medical_record?: MedicalRecord;
  creator?: User;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMedicalLetterPayload {
  letter_type: LetterType;
  patient_id: number;
  doctor_id: number;
  medical_record_id?: number | null;
  letter_date: string;
  purpose?: string;
  notes?: string;
  sick_start_date?: string;
  sick_end_date?: string;
  sick_days?: number;
  referral_destination?: string;
  referral_specialist?: string;
  referral_reason?: string;
  diagnosis_summary?: string;
  treatment_summary?: string;
  health_purpose?: string;
  examination_result?: string;
  statement_content?: string;
}

export type UpdateMedicalLetterPayload = Partial<CreateMedicalLetterPayload>;

export interface MedicalLetterFilters {
  search?: string;
  letter_type?: LetterType | "";
  patient_id?: number;
  doctor_id?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface MedicalLetterStats {
  total: number;
  this_month: number;
  by_type: Record<LetterType, number>;
}

// Response types
export interface MedicalLetterListResponse {
  success: boolean;
  data: MedicalLetter[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface MedicalLetterResponse {
  success: boolean;
  data: MedicalLetter;
  message?: string;
}

export interface MedicalLetterStatsResponse {
  success: boolean;
  data: MedicalLetterStats;
}

export interface MedicalLetterPrintResponse {
  success: boolean;
  data: {
    letter: MedicalLetter;
    clinic: {
      name: string;
      address: string;
      phone: string;
      email: string;
      logo_url: string | null;
    };
  };
}

// Labels
export const LETTER_TYPE_LABELS: Record<LetterType, string> = {
  surat_sehat: "Surat Keterangan Sehat",
  surat_sakit: "Surat Keterangan Sakit",
  surat_rujukan: "Surat Rujukan",
  surat_keterangan: "Surat Keterangan Dokter",
};

export const LETTER_TYPE_SHORT_LABELS: Record<LetterType, string> = {
  surat_sehat: "Ket. Sehat",
  surat_sakit: "Ket. Sakit",
  surat_rujukan: "Rujukan",
  surat_keterangan: "Ket. Dokter",
};

export const LETTER_TYPE_COLORS: Record<LetterType, string> = {
  surat_sehat:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  surat_sakit: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  surat_rujukan:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  surat_keterangan:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};
