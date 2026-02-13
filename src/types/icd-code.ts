// ICD code types
export type IcdType = "icd10" | "icd9cm";

// ICD Code interface
export interface IcdCode {
  id: number;
  code: string;
  type: IcdType;
  name_id: string;
  name_en: string | null;
  chapter: string | null;
  chapter_name: string | null;
  block: string | null;
  block_name: string | null;
  parent_code: string | null;
  parent?: IcdCode | null;
  children?: IcdCode[];
  dtd_code: string | null;
  is_bpjs_claimable: boolean;
  is_active: boolean;
  notes: string | null;
  type_label: string;
  created_at: string;
  updated_at: string;
}

// SatuSehat FHIR format
export interface IcdCodeSatuSehatFormat {
  coding: Array<{
    system: string;
    code: string;
    display: string;
  }>;
  text: string;
}

// ICD code filters
export interface IcdCodeFilters {
  search?: string;
  type?: IcdType | "all";
  status?: "all" | "active" | "inactive";
  bpjs?: "all" | "claimable" | "non-claimable";
  chapter?: string | "all";
  page?: number;
  per_page?: number;
}

// ICD code statistics
export interface IcdCodeStats {
  total: number;
  active: number;
  inactive: number;
  icd10_count: number;
  icd9cm_count: number;
  bpjs_claimable: number;
}

// Create/Update ICD code payload
export interface IcdCodePayload {
  code: string;
  type: IcdType;
  name_id: string;
  name_en?: string | null;
  chapter?: string | null;
  chapter_name?: string | null;
  block?: string | null;
  block_name?: string | null;
  parent_code?: string | null;
  dtd_code?: string | null;
  is_bpjs_claimable?: boolean;
  is_active?: boolean;
  notes?: string | null;
}

// Import payload
export interface IcdCodeImportPayload {
  file: File;
  type: IcdType;
}

// API Response types
export interface IcdCodeListResponse {
  success: boolean;
  message: string;
  data: IcdCode[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface IcdCodeResponse {
  success: boolean;
  message: string;
  data: IcdCode;
}

export interface IcdCodeStatsResponse {
  success: boolean;
  data: IcdCodeStats;
}

export interface IcdCodeSearchResponse {
  success: boolean;
  data: IcdCode[];
}

export interface IcdCodeImportResponse {
  success: boolean;
  message: string;
  data: {
    imported: number;
    skipped: number;
    errors: string[];
  };
}

// Type labels
export const ICD_TYPE_LABELS: Record<IcdType, string> = {
  icd10: "ICD-10 (Diagnosis)",
  icd9cm: "ICD-9-CM (Prosedur)",
};

// Type colors for badges
export const ICD_TYPE_COLORS: Record<IcdType, string> = {
  icd10: "blue",
  icd9cm: "purple",
};

// Type descriptions
export const ICD_TYPE_DESCRIPTIONS: Record<IcdType, string> = {
  icd10: "International Classification of Diseases 10th Revision - untuk kode diagnosis",
  icd9cm:
    "International Classification of Diseases 9th Revision Clinical Modification - untuk kode prosedur/tindakan",
};

// Common ICD-10 chapters
export const ICD10_CHAPTERS = [
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
