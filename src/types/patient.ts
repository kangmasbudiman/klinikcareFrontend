// Patient types
export type Gender = "male" | "female";
export type BloodType = "A" | "B" | "AB" | "O";
export type Religion = "islam" | "kristen" | "katolik" | "hindu" | "buddha" | "konghucu" | "lainnya";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type PatientType = "umum" | "bpjs" | "asuransi";

export interface Patient {
  id: number;
  medical_record_number: string;
  nik: string | null;
  bpjs_number: string | null;
  name: string;
  birth_place: string | null;
  birth_date: string;
  gender: Gender;
  blood_type: BloodType | null;
  religion: Religion | null;
  marital_status: MaritalStatus | null;
  occupation: string | null;
  education: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  rt: string | null;
  rw: string | null;
  village: string | null;
  district: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  emergency_contact_name: string | null;
  emergency_contact_relation: string | null;
  emergency_contact_phone: string | null;
  allergies: string | null;
  medical_notes: string | null;
  patient_type: PatientType;
  insurance_name: string | null;
  insurance_number: string | null;
  photo: string | null;
  satusehat_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Computed attributes
  age: number | null;
  full_address: string;
  gender_label: string;
  patient_type_label: string;
  religion_label: string | null;
  marital_status_label: string | null;
}

export interface PatientFilters {
  search?: string;
  status?: "all" | "active" | "inactive";
  patient_type?: PatientType | "";
  gender?: Gender | "";
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}

export interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  by_type: {
    umum: number;
    bpjs: number;
    asuransi: number;
  };
  this_month: number;
}

export interface CreatePatientPayload {
  nik?: string | null;
  bpjs_number?: string | null;
  name: string;
  birth_place?: string | null;
  birth_date: string;
  gender: Gender;
  blood_type?: BloodType | null;
  religion?: Religion | null;
  marital_status?: MaritalStatus | null;
  occupation?: string | null;
  education?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  rt?: string | null;
  rw?: string | null;
  village?: string | null;
  district?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_relation?: string | null;
  emergency_contact_phone?: string | null;
  allergies?: string | null;
  medical_notes?: string | null;
  patient_type: PatientType;
  insurance_name?: string | null;
  insurance_number?: string | null;
  photo?: string | null;
}

export interface UpdatePatientPayload extends Partial<CreatePatientPayload> {
  is_active?: boolean;
}

export interface PatientListResponse {
  success: boolean;
  data: Patient[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PatientResponse {
  success: boolean;
  data: Patient;
  message?: string;
}

export interface PatientSearchResponse {
  success: boolean;
  data: Patient[];
}

export interface PatientStatsResponse {
  success: boolean;
  data: PatientStats;
}

export interface PatientOptions {
  genders: Record<Gender, string>;
  patient_types: Record<PatientType, string>;
  religions: Record<Religion, string>;
  marital_statuses: Record<MaritalStatus, string>;
  blood_types: Record<BloodType, string>;
}

// Labels
export const GENDER_LABELS: Record<Gender, string> = {
  male: "Laki-laki",
  female: "Perempuan",
};

export const PATIENT_TYPE_LABELS: Record<PatientType, string> = {
  umum: "Umum",
  bpjs: "BPJS",
  asuransi: "Asuransi",
};

export const RELIGION_LABELS: Record<Religion, string> = {
  islam: "Islam",
  kristen: "Kristen",
  katolik: "Katolik",
  hindu: "Hindu",
  buddha: "Buddha",
  konghucu: "Konghucu",
  lainnya: "Lainnya",
};

export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  single: "Belum Menikah",
  married: "Menikah",
  divorced: "Cerai",
  widowed: "Janda/Duda",
};

export const BLOOD_TYPE_LABELS: Record<BloodType, string> = {
  A: "A",
  B: "B",
  AB: "AB",
  O: "O",
};

// Colors
export const PATIENT_TYPE_COLORS: Record<PatientType, string> = {
  umum: "blue",
  bpjs: "green",
  asuransi: "purple",
};
