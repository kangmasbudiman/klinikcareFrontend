import axios from "@/lib/axios";
import type {
  MedicalRecord,
  MedicalRecordFilters,
  MedicalRecordListResponse,
  MedicalRecordResponse,
  MedicalRecordPendingResponse,
  MedicalRecordStatsResponse,
  MedicalRecordStatus,
  CreateMedicalRecordPayload,
  UpdateMedicalRecordPayload,
  Prescription,
  PrescriptionListResponse,
  PrescriptionResponse,
  PrescriptionStatus,
  CreatePrescriptionPayload,
  Invoice,
  InvoiceListResponse,
  InvoiceResponse,
  InvoiceStatsResponse,
  InvoicePrintResponse,
  PayInvoicePayload,
  PaymentMethod,
  PaymentStatus,
} from "@/types/medical-record";

const medicalRecordService = {
  // =====================
  // MEDICAL RECORDS
  // =====================

  // Get list of medical records with filters
  async getMedicalRecords(
    filters: MedicalRecordFilters = {},
  ): Promise<MedicalRecordListResponse> {
    const params = new URLSearchParams();

    if (filters.date) params.append("date", filters.date);
    if (filters.department_id)
      params.append("department_id", filters.department_id.toString());
    if (filters.doctor_id)
      params.append("doctor_id", filters.doctor_id.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());

    const response = await axios.get(
      `/api/medical-records?${params.toString()}`,
    );
    return response.data;
  },

  // Get pending examinations (waiting + in_progress)
  async getPendingExaminations(
    departmentId?: number,
  ): Promise<MedicalRecordPendingResponse> {
    const params = departmentId ? `?department_id=${departmentId}` : "";
    const response = await axios.get(`/api/medical-records/pending${params}`);
    return response.data;
  },

  // Get examination statistics
  async getExaminationStats(
    date?: string,
    departmentId?: number,
    doctorId?: number,
  ): Promise<MedicalRecordStatsResponse> {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (departmentId) params.append("department_id", departmentId.toString());
    if (doctorId) params.append("doctor_id", doctorId.toString());

    const response = await axios.get(
      `/api/medical-records/stats?${params.toString()}`,
    );
    return response.data;
  },

  // Get medical record by ID
  async getMedicalRecordById(id: number): Promise<MedicalRecordResponse> {
    const response = await axios.get(`/api/medical-records/${id}`);
    return response.data;
  },

  // Start examination (create medical record)
  async startExamination(
    payload: CreateMedicalRecordPayload,
  ): Promise<MedicalRecordResponse> {
    const response = await axios.post("/api/medical-records", payload);
    return response.data;
  },

  // Update medical record
  async updateMedicalRecord(
    id: number,
    payload: UpdateMedicalRecordPayload,
  ): Promise<MedicalRecordResponse> {
    const response = await axios.put(`/api/medical-records/${id}`, payload);
    return response.data;
  },

  // Complete examination
  async completeExamination(
    id: number,
    createInvoice: boolean = true,
  ): Promise<MedicalRecordResponse> {
    const response = await axios.patch(`/api/medical-records/${id}/complete`, {
      create_invoice: createInvoice,
    });
    return response.data;
  },

  // Cancel examination
  async cancelExamination(id: number): Promise<MedicalRecordResponse> {
    const response = await axios.delete(`/api/medical-records/${id}`);
    return response.data;
  },

  // Get patient medical history
  async getPatientMedicalHistory(
    patientId: number,
    page: number = 1,
    perPage: number = 10,
  ): Promise<MedicalRecordListResponse> {
    const response = await axios.get(
      `/api/patients/${patientId}/medical-history?page=${page}&per_page=${perPage}`,
    );
    return response.data;
  },

  // Get completed examinations (for examination page and cashier)
  async getCompletedExaminations(
    departmentId?: number,
    date?: string,
    unpaidOnly?: boolean,
  ): Promise<{ success: boolean; data: MedicalRecord[] }> {
    const params = new URLSearchParams();
    if (departmentId) params.append("department_id", departmentId.toString());
    if (date) params.append("date", date);
    if (unpaidOnly) params.append("unpaid_only", "1");
    // Request to include prescriptions and invoice items
    params.append("with", "prescriptions.items,invoice.items");

    const response = await axios.get(
      `/api/medical-records/completed?${params.toString()}`,
    );
    return response.data;
  },

  // Add prescription to medical record
  async addPrescription(
    medicalRecordId: number,
    payload: CreatePrescriptionPayload,
  ): Promise<PrescriptionResponse> {
    const response = await axios.post(
      `/api/medical-records/${medicalRecordId}/prescription`,
      payload,
    );
    return response.data;
  },

  // =====================
  // PRESCRIPTIONS
  // =====================

  // Get prescriptions list
  async getPrescriptions(
    filters: {
      date?: string;
      status?: PrescriptionStatus;
      search?: string;
      page?: number;
      per_page?: number;
    } = {},
  ): Promise<PrescriptionListResponse> {
    const params = new URLSearchParams();
    if (filters.date) params.append("date", filters.date);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());

    const response = await axios.get(`/api/prescriptions?${params.toString()}`);
    return response.data;
  },

  // Get prescription by ID
  async getPrescriptionById(id: number): Promise<PrescriptionResponse> {
    const response = await axios.get(`/api/prescriptions/${id}`);
    return response.data;
  },

  // Create prescription
  async createPrescription(
    payload: CreatePrescriptionPayload,
  ): Promise<PrescriptionResponse> {
    const response = await axios.post("/api/prescriptions", payload);
    return response.data;
  },

  // Update prescription
  async updatePrescription(
    id: number,
    payload: Partial<CreatePrescriptionPayload>,
  ): Promise<PrescriptionResponse> {
    const response = await axios.put(`/api/prescriptions/${id}`, payload);
    return response.data;
  },

  // Update prescription status
  async updatePrescriptionStatus(
    id: number,
    status: PrescriptionStatus,
  ): Promise<PrescriptionResponse> {
    const response = await axios.patch(`/api/prescriptions/${id}/status`, {
      status,
    });
    return response.data;
  },

  // =====================
  // INVOICES
  // =====================

  // Get invoices list
  async getInvoices(
    filters: {
      date?: string;
      start_date?: string;
      end_date?: string;
      payment_status?: PaymentStatus;
      payment_method?: PaymentMethod;
      search?: string;
      page?: number;
      per_page?: number;
    } = {},
  ): Promise<InvoiceListResponse> {
    const params = new URLSearchParams();
    // Support both single date and date range
    if (filters.start_date && filters.end_date) {
      params.append("start_date", filters.start_date);
      params.append("end_date", filters.end_date);
    } else if (filters.date) {
      params.append("date", filters.date);
    }
    if (filters.payment_status)
      params.append("payment_status", filters.payment_status);
    if (filters.payment_method)
      params.append("payment_method", filters.payment_method);
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());

    const response = await axios.get(`/api/invoices?${params.toString()}`);
    return response.data;
  },

  // Get unpaid invoices
  async getUnpaidInvoices(date?: string): Promise<InvoiceListResponse> {
    const params = date ? `?date=${date}` : "";
    const response = await axios.get(`/api/invoices/unpaid${params}`);
    return response.data;
  },

  // Get invoice statistics
  async getInvoiceStats(
    filters: {
      date?: string;
      start_date?: string;
      end_date?: string;
    } = {},
  ): Promise<InvoiceStatsResponse> {
    const params = new URLSearchParams();
    // Support both single date and date range
    if (filters.start_date && filters.end_date) {
      params.append("start_date", filters.start_date);
      params.append("end_date", filters.end_date);
    } else if (filters.date) {
      params.append("date", filters.date);
    }
    const queryString = params.toString();
    const response = await axios.get(
      `/api/invoices/stats${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  },

  // Get invoice by ID
  async getInvoiceById(id: number): Promise<InvoiceResponse> {
    // Request to include items relation
    const response = await axios.get(`/api/invoices/${id}?with=items`);
    return response.data;
  },

  // Process payment
  async payInvoice(
    id: number,
    payload: PayInvoicePayload,
  ): Promise<InvoiceResponse> {
    const response = await axios.patch(`/api/invoices/${id}/pay`, payload);
    return response.data;
  },

  // Get invoice for printing
  async getInvoicePrint(id: number): Promise<InvoicePrintResponse> {
    const response = await axios.get(`/api/invoices/${id}/print`);
    return response.data;
  },

  // =====================
  // HELPERS
  // =====================

  // Get medical record status color class
  getStatusColorClass(status: MedicalRecordStatus): string {
    const colors: Record<MedicalRecordStatus, string> = {
      in_progress:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  },

  // Get payment status color class
  getPaymentStatusColorClass(status: PaymentStatus): string {
    const colors: Record<PaymentStatus, string> = {
      unpaid: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      partial:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  },

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  // Format vital signs
  formatBloodPressure(
    systolic?: number | null,
    diastolic?: number | null,
  ): string {
    if (systolic && diastolic) {
      return `${systolic}/${diastolic} mmHg`;
    }
    return "-";
  },

  formatTemperature(temp?: number | null): string {
    if (temp) {
      return `${temp}°C`;
    }
    return "-";
  },

  formatWeight(weight?: number | null): string {
    if (weight) {
      return `${weight} kg`;
    }
    return "-";
  },

  formatHeight(height?: number | null): string {
    if (height) {
      return `${height} cm`;
    }
    return "-";
  },

  formatBMI(bmi?: number | null): string {
    if (bmi) {
      let category = "";
      if (bmi < 18.5) category = " (Kurus)";
      else if (bmi < 25) category = " (Normal)";
      else if (bmi < 30) category = " (Gemuk)";
      else category = " (Obesitas)";
      return `${bmi.toFixed(1)}${category}`;
    }
    return "-";
  },

  // Get today's date string
  getTodayDateString(): string {
    return new Date().toISOString().split("T")[0];
  },
};

export default medicalRecordService;
