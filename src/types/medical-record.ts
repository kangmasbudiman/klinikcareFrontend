import type { Patient } from "./patient";
import type { Department } from "./department";
import type { User } from "./auth";
import type { Queue } from "./queue";

// Medical Record Status
export type MedicalRecordStatus = "in_progress" | "completed" | "cancelled";

// Diagnosis Type
export type DiagnosisType = "primary" | "secondary";

// Medical Record Diagnosis
export interface MedicalRecordDiagnosis {
  id: number;
  medical_record_id: number;
  icd_code: string | null;
  icd_name: string | null;
  diagnosis_type: DiagnosisType;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Medical Record Service
export interface MedicalRecordService {
  id: number;
  medical_record_id: number;
  service_id: number | null;
  service_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Main Medical Record
export interface MedicalRecord {
  id: number;
  record_number: string;
  queue_id: number;
  patient_id: number;
  department_id: number;
  doctor_id: number;
  visit_date: string;
  // Anamnesis
  chief_complaint: string | null;
  present_illness: string | null;
  past_medical_history: string | null;
  family_history: string | null;
  allergy_notes: string | null;
  // Vital Signs
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  heart_rate: number | null;
  respiratory_rate: number | null;
  temperature: number | null;
  weight: number | null;
  height: number | null;
  oxygen_saturation: number | null;
  physical_examination: string | null;
  // Diagnosis
  diagnosis: string | null;
  diagnosis_notes: string | null;
  // Treatment
  treatment: string | null;
  treatment_notes: string | null;
  // Recommendations
  recommendations: string | null;
  follow_up_date: string | null;
  // CPPT / SOAP
  soap_subjective: string | null;
  soap_objective: string | null;
  soap_assessment: string | null;
  soap_plan: string | null;
  // Status
  status: MedicalRecordStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Computed
  blood_pressure: string | null;
  bmi: number | null;
  status_label: string;
  // Relations
  patient?: Patient;
  department?: Department;
  doctor?: User;
  queue?: Queue;
  diagnoses?: MedicalRecordDiagnosis[];
  services?: MedicalRecordService[];
  prescriptions?: Prescription[];
  invoice?: Invoice;
}

// Prescription Status
export type PrescriptionStatus =
  | "pending"
  | "processed"
  | "completed"
  | "cancelled";

// Prescription Item
export interface PrescriptionItem {
  id: number;
  prescription_id: number;
  medicine_name: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  quantity: number;
  instructions: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Prescription
export interface Prescription {
  id: number;
  medical_record_id: number;
  prescription_number: string | null;
  notes: string | null;
  status: PrescriptionStatus;
  status_label: string;
  created_at: string;
  updated_at: string;
  // Relations
  medical_record?: MedicalRecord;
  items?: PrescriptionItem[];
}

// Invoice types
export type PaymentMethod = "cash" | "card" | "transfer" | "bpjs" | "insurance";
export type PaymentStatus = "unpaid" | "partial" | "paid";

// Invoice Item
export interface InvoiceItem {
  id: number;
  invoice_id: number;
  item_type: "service" | "medicine" | "other";
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Invoice
export interface Invoice {
  id: number;
  invoice_number: string;
  medical_record_id: number;
  patient_id: number;
  subtotal: number;
  discount_amount: number;
  discount_percent: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  change_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_date: string | null;
  notes: string | null;
  cashier_id: number | null;
  created_at: string;
  updated_at: string;
  // Computed
  payment_method_label: string;
  payment_status_label: string;
  // Relations
  patient?: Patient;
  medical_record?: MedicalRecord;
  cashier?: User;
  items?: InvoiceItem[];
}

// Request/Response types
export interface MedicalRecordFilters {
  date?: string;
  department_id?: number | "";
  doctor_id?: number | "";
  status?: MedicalRecordStatus | "";
  search?: string;
  page?: number;
  per_page?: number;
}

export interface MedicalRecordStats {
  total: number;
  waiting: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  avg_exam_time: number;
}

export interface CreateMedicalRecordPayload {
  queue_id: number;
}

export interface UpdateMedicalRecordPayload {
  // Anamnesis
  chief_complaint?: string | null;
  present_illness?: string | null;
  past_medical_history?: string | null;
  family_history?: string | null;
  allergy_notes?: string | null;
  // Vital Signs
  blood_pressure_systolic?: number | null;
  blood_pressure_diastolic?: number | null;
  heart_rate?: number | null;
  respiratory_rate?: number | null;
  temperature?: number | null;
  weight?: number | null;
  height?: number | null;
  oxygen_saturation?: number | null;
  physical_examination?: string | null;
  // Diagnosis
  diagnosis?: string | null;
  diagnosis_notes?: string | null;
  // Treatment
  treatment?: string | null;
  treatment_notes?: string | null;
  // Recommendations
  recommendations?: string | null;
  follow_up_date?: string | null;
  // CPPT / SOAP
  soap_subjective?: string | null;
  soap_objective?: string | null;
  soap_assessment?: string | null;
  soap_plan?: string | null;
  // Diagnoses (ICD)
  diagnoses?: {
    icd_code?: string | null;
    icd_name?: string | null;
    diagnosis_type?: DiagnosisType;
    notes?: string | null;
  }[];
  // Services
  services?: {
    service_id?: number | null;
    service_name: string;
    quantity?: number;
    unit_price?: number;
    notes?: string | null;
  }[];
}

export interface CreatePrescriptionPayload {
  medical_record_id?: number;
  notes?: string | null;
  items: {
    medicine_name: string;
    dosage?: string | null;
    frequency?: string | null;
    duration?: string | null;
    quantity?: number;
    instructions?: string | null;
    notes?: string | null;
  }[];
}

export interface PayInvoicePayload {
  paid_amount: number;
  payment_method: PaymentMethod;
  notes?: string | null;
}

// Response types
export interface MedicalRecordListResponse {
  success: boolean;
  data: MedicalRecord[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface MedicalRecordResponse {
  success: boolean;
  data: MedicalRecord;
  message?: string;
}

export interface MedicalRecordPendingResponse {
  success: boolean;
  data: {
    waiting: Queue[];
    in_progress: MedicalRecord[];
  };
}

export interface MedicalRecordStatsResponse {
  success: boolean;
  data: MedicalRecordStats;
}

export interface PrescriptionListResponse {
  success: boolean;
  data: Prescription[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PrescriptionResponse {
  success: boolean;
  data: Prescription;
  message?: string;
}

export interface InvoiceListResponse {
  success: boolean;
  data: Invoice[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface InvoiceResponse {
  success: boolean;
  data: Invoice;
  message?: string;
}

export interface InvoiceStats {
  total: number;
  unpaid: number;
  paid: number;
  total_revenue: number;
  total_unpaid: number;
  payment_by_method: {
    payment_method: PaymentMethod;
    count: number;
    total: number;
  }[];
}

export interface InvoiceStatsResponse {
  success: boolean;
  data: InvoiceStats;
}

export interface InvoicePrintResponse {
  success: boolean;
  data: {
    invoice: Invoice;
    clinic: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
  };
}

// Labels
export const MEDICAL_RECORD_STATUS_LABELS: Record<MedicalRecordStatus, string> =
  {
    in_progress: "Sedang Diperiksa",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

export const DIAGNOSIS_TYPE_LABELS: Record<DiagnosisType, string> = {
  primary: "Primer",
  secondary: "Sekunder",
};

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  pending: "Menunggu",
  processed: "Diproses",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Tunai",
  card: "Kartu",
  transfer: "Transfer",
  bpjs: "BPJS",
  insurance: "Asuransi",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Belum Bayar",
  partial: "Bayar Sebagian",
  paid: "Lunas",
};

// Colors
export const MEDICAL_RECORD_STATUS_COLORS: Record<MedicalRecordStatus, string> =
  {
    in_progress: "blue",
    completed: "green",
    cancelled: "red",
  };

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  unpaid: "red",
  partial: "yellow",
  paid: "green",
};
