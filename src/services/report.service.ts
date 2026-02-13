import axios from "@/lib/axios";
import type {
  ReportFilters,
  ReportSummaryResponse,
  VisitReportResponse,
  RevenueReportResponse,
  DiagnosisReportResponse,
  DoctorReportResponse,
  DepartmentReportResponse,
} from "@/types/report";

const reportService = {
  async getSummary(filters: ReportFilters): Promise<ReportSummaryResponse> {
    const params = new URLSearchParams();
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.department_id)
      params.append("department_id", filters.department_id.toString());
    if (filters.doctor_id)
      params.append("doctor_id", filters.doctor_id.toString());

    const response = await axios.get(
      `/api/reports/summary?${params.toString()}`,
    );
    return response.data;
  },

  async getVisitReport(filters: ReportFilters): Promise<VisitReportResponse> {
    const params = new URLSearchParams();
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.department_id)
      params.append("department_id", filters.department_id.toString());
    if (filters.doctor_id)
      params.append("doctor_id", filters.doctor_id.toString());
    if (filters.group_by) params.append("group_by", filters.group_by);

    const response = await axios.get(
      `/api/reports/visits?${params.toString()}`,
    );
    return response.data;
  },

  async getRevenueReport(
    filters: ReportFilters,
  ): Promise<RevenueReportResponse> {
    const params = new URLSearchParams();
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.department_id)
      params.append("department_id", filters.department_id.toString());
    if (filters.group_by) params.append("group_by", filters.group_by);

    const response = await axios.get(
      `/api/reports/revenue?${params.toString()}`,
    );
    return response.data;
  },

  async getDiagnosisReport(
    filters: ReportFilters & { limit?: number },
  ): Promise<DiagnosisReportResponse> {
    const params = new URLSearchParams();
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.department_id)
      params.append("department_id", filters.department_id.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const response = await axios.get(
      `/api/reports/diagnoses?${params.toString()}`,
    );
    return response.data;
  },

  async getDoctorReport(filters: ReportFilters): Promise<DoctorReportResponse> {
    const params = new URLSearchParams();
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.department_id)
      params.append("department_id", filters.department_id.toString());

    const response = await axios.get(
      `/api/reports/doctors?${params.toString()}`,
    );
    return response.data;
  },

  async getDepartmentReport(
    filters: ReportFilters,
  ): Promise<DepartmentReportResponse> {
    const params = new URLSearchParams();
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);

    const response = await axios.get(
      `/api/reports/departments?${params.toString()}`,
    );
    return response.data;
  },
};

export default reportService;
