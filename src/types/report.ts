import type { PaymentMethod } from "./medical-record";

// Report filter types
export interface ReportFilters {
  start_date: string;
  end_date: string;
  department_id?: number | "";
  doctor_id?: number | "";
  group_by?: "daily" | "monthly";
}

// Summary stats (for cards)
export interface ReportSummary {
  total_visits: number;
  total_revenue: number;
  total_new_patients: number;
  total_unique_patients: number;
  avg_revenue_per_visit: number;
  visits_change_percent: number;
  revenue_change_percent: number;
  new_patients_change_percent: number;
}

// Visit report types
export interface VisitByDate {
  date: string;
  total: number;
  new_patients: number;
  returning_patients: number;
}

export interface VisitByDepartment {
  department_id: number;
  department_name: string;
  total: number;
}

export interface VisitByDoctor {
  doctor_id: number;
  doctor_name: string;
  total: number;
}

export interface VisitReportData {
  by_date: VisitByDate[];
  by_department: VisitByDepartment[];
  by_doctor: VisitByDoctor[];
  totals: {
    total_visits: number;
    new_patients: number;
    returning_patients: number;
  };
}

// Revenue report types
export interface RevenueByDate {
  date: string;
  total_amount: number;
  paid_amount: number;
  count: number;
}

export interface RevenueByPaymentMethod {
  payment_method: PaymentMethod;
  label: string;
  total_amount: number;
  count: number;
}

export interface RevenueByDepartment {
  department_id: number;
  department_name: string;
  total_amount: number;
  count: number;
}

export interface RevenueReportData {
  by_date: RevenueByDate[];
  by_payment_method: RevenueByPaymentMethod[];
  by_department: RevenueByDepartment[];
  totals: {
    total_amount: number;
    paid_amount: number;
    unpaid_amount: number;
    invoice_count: number;
  };
}

// Diagnosis report types
export interface DiagnosisReportItem {
  icd_code: string;
  icd_name: string;
  count: number;
  percentage: number;
}

// Doctor report types
export interface DoctorReportItem {
  doctor_id: number;
  doctor_name: string;
  department_name: string;
  total_patients: number;
  total_revenue: number;
  avg_revenue_per_visit: number;
  completed_records: number;
  cancelled_records: number;
}

// Department report types
export interface DepartmentReportItem {
  department_id: number;
  department_name: string;
  department_color: string;
  total_visits: number;
  total_revenue: number;
  total_patients: number;
  avg_revenue_per_visit: number;
  top_diagnoses: { icd_code: string; icd_name: string; count: number }[];
}

// API Response types
export interface ReportSummaryResponse {
  success: boolean;
  data: ReportSummary;
}

export interface VisitReportResponse {
  success: boolean;
  data: VisitReportData;
}

export interface RevenueReportResponse {
  success: boolean;
  data: RevenueReportData;
}

export interface DiagnosisReportResponse {
  success: boolean;
  data: DiagnosisReportItem[];
  totals: { total_diagnoses: number; unique_codes: number };
}

export interface DoctorReportResponse {
  success: boolean;
  data: DoctorReportItem[];
}

export interface DepartmentReportResponse {
  success: boolean;
  data: DepartmentReportItem[];
}
