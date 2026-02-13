import axios from "@/lib/axios";
import type {
  DoctorSchedule,
  ScheduleFilters,
  ScheduleListResponse,
  ScheduleResponse,
  AvailableDoctorsResponse,
  DoctorScheduleResponse,
  DayOptionsResponse,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  DayOfWeek,
  DAY_LABELS,
} from "@/types/schedule";

const scheduleService = {
  // Get list of schedules with filters
  async getSchedules(
    filters: ScheduleFilters = {}
  ): Promise<ScheduleListResponse> {
    const params = new URLSearchParams();

    if (filters.doctor_id) params.append("doctor_id", filters.doctor_id.toString());
    if (filters.department_id) params.append("department_id", filters.department_id.toString());
    if (filters.day_of_week !== undefined && filters.day_of_week !== "") {
      params.append("day_of_week", filters.day_of_week.toString());
    }
    if (filters.is_active !== undefined) {
      params.append("is_active", filters.is_active ? "1" : "0");
    }
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page) params.append("per_page", filters.per_page.toString());
    if (filters.all) params.append("all", "1");

    const response = await axios.get(`/api/schedules?${params.toString()}`);
    return response.data;
  },

  // Get schedule by ID
  async getScheduleById(id: number): Promise<ScheduleResponse> {
    const response = await axios.get(`/api/schedules/${id}`);
    return response.data;
  },

  // Create schedule
  async createSchedule(payload: CreateSchedulePayload): Promise<ScheduleResponse> {
    const response = await axios.post("/api/schedules", payload);
    return response.data;
  },

  // Update schedule
  async updateSchedule(
    id: number,
    payload: UpdateSchedulePayload
  ): Promise<ScheduleResponse> {
    const response = await axios.put(`/api/schedules/${id}`, payload);
    return response.data;
  },

  // Delete schedule
  async deleteSchedule(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`/api/schedules/${id}`);
    return response.data;
  },

  // Toggle schedule status
  async toggleScheduleStatus(id: number): Promise<ScheduleResponse> {
    const response = await axios.patch(`/api/schedules/${id}/toggle-status`);
    return response.data;
  },

  // Get available doctors for a specific day
  async getAvailableDoctors(
    day?: DayOfWeek,
    departmentId?: number
  ): Promise<AvailableDoctorsResponse> {
    const params = new URLSearchParams();
    if (day !== undefined) params.append("day", day.toString());
    if (departmentId) params.append("department_id", departmentId.toString());

    const response = await axios.get(
      `/api/schedules/available-doctors?${params.toString()}`
    );
    return response.data;
  },

  // Get schedule for a specific doctor
  async getDoctorSchedule(doctorId: number): Promise<DoctorScheduleResponse> {
    const response = await axios.get(`/api/doctors/${doctorId}/schedules`);
    return response.data;
  },

  // Get day options for dropdown
  async getDayOptions(): Promise<DayOptionsResponse> {
    const response = await axios.get("/api/schedules/day-options");
    return response.data;
  },

  // Helper: Get day label
  getDayLabel(day: DayOfWeek): string {
    const labels: Record<DayOfWeek, string> = {
      0: "Minggu",
      1: "Senin",
      2: "Selasa",
      3: "Rabu",
      4: "Kamis",
      5: "Jumat",
      6: "Sabtu",
    };
    return labels[day] || "";
  },

  // Helper: Get current day of week
  getCurrentDay(): DayOfWeek {
    return new Date().getDay() as DayOfWeek;
  },

  // Helper: Format time (HH:mm)
  formatTime(time: string): string {
    if (!time) return "";
    // Handle both "HH:mm:ss" and "HH:mm" formats
    const parts = time.split(":");
    return `${parts[0]}:${parts[1]}`;
  },

  // Helper: Get day options for dropdown (static)
  getDayOptionsStatic(): { value: DayOfWeek; label: string }[] {
    return [
      { value: 1, label: "Senin" },
      { value: 2, label: "Selasa" },
      { value: 3, label: "Rabu" },
      { value: 4, label: "Kamis" },
      { value: 5, label: "Jumat" },
      { value: 6, label: "Sabtu" },
      { value: 0, label: "Minggu" },
    ];
  },

  // Helper: Get status badge color class
  getStatusColorClass(isActive: boolean): string {
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  },

  // Helper: Generate time options for dropdown (08:00, 08:30, 09:00, etc.)
  getTimeOptions(
    startHour: number = 7,
    endHour: number = 21,
    intervalMinutes: number = 30
  ): { value: string; label: string }[] {
    const options: { value: string; label: string }[] = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        if (hour === endHour && minute > 0) break;

        const hourStr = hour.toString().padStart(2, "0");
        const minuteStr = minute.toString().padStart(2, "0");
        const value = `${hourStr}:${minuteStr}`;

        options.push({
          value,
          label: value,
        });
      }
    }

    return options;
  },
};

export default scheduleService;
