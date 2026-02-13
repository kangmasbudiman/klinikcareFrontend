import axios from "@/lib/axios";
import type {
  Queue,
  QueueFilters,
  QueueListResponse,
  QueueResponse,
  QueueTodayResponse,
  QueueStatsResponse,
  QueueDisplayResponse,
  QueueCurrentResponse,
  QueueSetting,
  QueueSettingListResponse,
  QueueSettingResponse,
  TakeQueuePayload,
  CallQueuePayload,
  UpdateQueueSettingPayload,
  QueueStatus,
} from "@/types/queue";

const queueService = {
  // Get list of queues with filters
  async getQueues(filters: QueueFilters = {}): Promise<QueueListResponse> {
    const params = new URLSearchParams();

    if (filters.date) params.append("date", filters.date);
    if (filters.department_id)
      params.append("department_id", filters.department_id.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());

    const response = await axios.get(`/api/queues?${params.toString()}`);
    return response.data;
  },

  // Get today's queues grouped by status
  async getTodayQueues(departmentId?: number): Promise<QueueTodayResponse> {
    const params = departmentId ? `?department_id=${departmentId}` : "";
    const response = await axios.get(`/api/queues/today${params}`);
    return response.data;
  },

  // Get queue statistics
  async getQueueStats(
    date?: string,
    departmentId?: number,
  ): Promise<QueueStatsResponse> {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (departmentId) params.append("department_id", departmentId.toString());

    const response = await axios.get(`/api/queues/stats?${params.toString()}`);
    return response.data;
  },

  // Get queue display data (for TV/Monitor)
  async getQueueDisplay(departmentId?: number): Promise<QueueDisplayResponse> {
    const params = departmentId ? `?department_id=${departmentId}` : "";
    const response = await axios.get(`/api/queues/display${params}`);
    return response.data;
  },

  // Get current queue for department
  async getCurrentQueue(departmentId: number): Promise<QueueCurrentResponse> {
    const response = await axios.get(`/api/queues/current/${departmentId}`);
    return response.data;
  },

  // Get queue by ID
  async getQueueById(id: number): Promise<QueueResponse> {
    const response = await axios.get(`/api/queues/${id}`);
    return response.data;
  },

  // Take new queue number
  async takeQueue(payload: TakeQueuePayload): Promise<QueueResponse> {
    const response = await axios.post("/api/queues/take", payload);
    return response.data;
  },

  // Call queue
  async callQueue(
    id: number,
    payload?: CallQueuePayload,
  ): Promise<QueueResponse> {
    const response = await axios.patch(`/api/queues/${id}/call`, payload || {});
    return response.data;
  },

  // Start serving queue
  async startQueue(id: number): Promise<QueueResponse> {
    const response = await axios.patch(`/api/queues/${id}/start`);
    return response.data;
  },

  // Complete queue
  async completeQueue(id: number, notes?: string): Promise<QueueResponse> {
    const response = await axios.patch(`/api/queues/${id}/complete`, { notes });
    return response.data;
  },

  // Skip queue
  async skipQueue(id: number, notes?: string): Promise<QueueResponse> {
    const response = await axios.patch(`/api/queues/${id}/skip`, { notes });
    return response.data;
  },

  // Cancel queue
  async cancelQueue(id: number, notes?: string): Promise<QueueResponse> {
    const response = await axios.patch(`/api/queues/${id}/cancel`, { notes });
    return response.data;
  },

  // Assign patient to queue
  async assignPatient(
    queueId: number,
    patientId: number,
  ): Promise<QueueResponse> {
    const response = await axios.patch(
      `/api/queues/${queueId}/assign-patient`,
      { patient_id: patientId },
    );
    return response.data;
  },

  // Reset queue
  async resetQueue(
    date: string,
    departmentId?: number,
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.post("/api/queues/reset", {
      date,
      department_id: departmentId,
    });
    return response.data;
  },

  // Queue Settings
  async getQueueSettings(): Promise<QueueSettingListResponse> {
    const response = await axios.get("/api/queue-settings");
    return response.data;
  },

  async updateQueueSetting(
    departmentId: number,
    payload: UpdateQueueSettingPayload,
  ): Promise<QueueSettingResponse> {
    const response = await axios.put(
      `/api/queue-settings/${departmentId}`,
      payload,
    );
    return response.data;
  },

  // Helper: Get status color class
  getStatusColorClass(status: QueueStatus): string {
    const colors: Record<QueueStatus, string> = {
      waiting:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      called: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      in_service:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      skipped:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  },

  // Helper: Get status solid color class (for backgrounds)
  getStatusSolidColorClass(status: QueueStatus): string {
    const colors: Record<QueueStatus, string> = {
      waiting: "bg-yellow-500",
      called: "bg-blue-500",
      in_service: "bg-purple-500",
      completed: "bg-green-500",
      skipped: "bg-orange-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  },

  // Helper: Get status options
  getStatusOptions(): { value: QueueStatus; label: string }[] {
    return [
      { value: "waiting", label: "Menunggu" },
      { value: "called", label: "Dipanggil" },
      { value: "in_service", label: "Dilayani" },
      { value: "completed", label: "Selesai" },
      { value: "skipped", label: "Dilewati" },
      { value: "cancelled", label: "Dibatalkan" },
    ];
  },

  // Helper: Format wait time
  formatWaitTime(minutes: number | null): string {
    if (minutes === null || minutes === undefined) return "-";
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
  },

  // Helper: Format queue code for display
  formatQueueCode(code: string): string {
    // Already formatted as A-001, just return
    return code;
  },

  // Helper: Get today's date string
  getTodayDateString(): string {
    return new Date().toISOString().split("T")[0];
  },
};

export default queueService;
