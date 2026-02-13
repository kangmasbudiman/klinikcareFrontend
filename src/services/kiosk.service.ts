import publicApi from "@/lib/axios-public";
import type { Department } from "@/types/department";
import type { Queue, QueueDisplayData } from "@/types/queue";
import type { KioskSchedulesResponse } from "@/types/schedule";

/**
 * Kiosk Service - Public API endpoints (no auth required)
 */
const kioskService = {
  // Get active departments for kiosk
  async getDepartments(): Promise<{ success: boolean; data: Department[] }> {
    const response = await publicApi.get("/api/kiosk/departments");
    return response.data;
  },

  // Get today's doctor schedules for a department
  async getSchedulesByDepartment(
    departmentId: number,
  ): Promise<KioskSchedulesResponse> {
    const response = await publicApi.get(
      `/api/kiosk/departments/${departmentId}/schedules`,
    );
    return response.data;
  },

  // Take queue number from kiosk
  async takeQueue(
    departmentId: number,
    doctorId?: number,
  ): Promise<{ success: boolean; data: Queue; message: string }> {
    const response = await publicApi.post("/api/kiosk/take-queue", {
      department_id: departmentId,
      doctor_id: doctorId ?? null,
    });
    return response.data;
  },

  // Get queue display data
  async getQueueDisplay(): Promise<{
    success: boolean;
    data: QueueDisplayData;
  }> {
    const response = await publicApi.get("/api/kiosk/queue-display");
    return response.data;
  },
};

export default kioskService;
