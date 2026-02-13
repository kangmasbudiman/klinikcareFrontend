import type { Patient } from "./patient";
import type { Department } from "./department";
import type { Service } from "./service";
import type { User } from "./auth";

// Queue types
export type QueueStatus =
  | "waiting"
  | "called"
  | "in_service"
  | "completed"
  | "skipped"
  | "cancelled";

export interface Queue {
  id: number;
  queue_number: number;
  queue_code: string;
  queue_date: string;
  patient_id: number | null;
  department_id: number;
  doctor_id: number | null;
  service_id: number | null;
  status: QueueStatus;
  called_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  counter_number: number | null;
  served_by: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  patient?: Patient | null;
  department?: Department;
  doctor?: User | null;
  service?: Service | null;
  servedBy?: User | null;
  // Computed
  status_label: string;
  status_color: string;
  wait_time: number | null;
  service_time: number | null;
}

export interface QueueFilters {
  date?: string;
  department_id?: number | "";
  status?: QueueStatus | "";
  page?: number;
  per_page?: number;
}

export interface QueueStats {
  total: number;
  waiting: number;
  called: number;
  in_service: number;
  completed: number;
  skipped: number;
  cancelled: number;
  avg_wait_time: number;
  avg_service_time: number;
}

export interface TakeQueuePayload {
  department_id: number;
  doctor_id?: number | null;
  patient_id?: number | null;
  service_id?: number | null;
}

export interface CallQueuePayload {
  counter_number?: number;
}

export interface QueueListResponse {
  success: boolean;
  data: Queue[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface QueueResponse {
  success: boolean;
  data: Queue;
  message?: string;
}

export interface QueueTodayResponse {
  success: boolean;
  data: {
    waiting: Queue[];
    called: Queue[];
    in_service: Queue[];
    completed: Queue[];
    skipped: Queue[];
    cancelled: Queue[];
  };
  total: number;
}

export interface QueueStatsResponse {
  success: boolean;
  data: QueueStats;
}

export interface QueueDisplayData {
  current: {
    queue_code: string;
    department: string;
    department_color: string;
    counter: number | null;
    status: QueueStatus;
    patient_name: string | null;
  }[];
  waiting: {
    queue_code: string;
    department: string;
    department_color: string;
  }[];
  timestamp: string;
}

export interface QueueDisplayResponse {
  success: boolean;
  data: QueueDisplayData;
}

export interface QueueCurrentResponse {
  success: boolean;
  data: {
    current: Queue | null;
    next: Queue | null;
    remaining_quota: number;
  };
}

// Queue Setting
export interface QueueSetting {
  id: number | null;
  department_id: number;
  prefix: string;
  daily_quota: number;
  start_number: number;
  is_active: boolean;
  department?: Department;
  created_at: string | null;
  updated_at: string | null;
}

export interface UpdateQueueSettingPayload {
  prefix: string;
  daily_quota: number;
  start_number: number;
  is_active: boolean;
}

export interface QueueSettingListResponse {
  success: boolean;
  data: QueueSetting[];
}

export interface QueueSettingResponse {
  success: boolean;
  data: QueueSetting;
  message?: string;
}

// Labels
export const QUEUE_STATUS_LABELS: Record<QueueStatus, string> = {
  waiting: "Menunggu",
  called: "Dipanggil",
  in_service: "Dilayani",
  completed: "Selesai",
  skipped: "Dilewati",
  cancelled: "Dibatalkan",
};

export const QUEUE_STATUS_COLORS: Record<QueueStatus, string> = {
  waiting: "yellow",
  called: "blue",
  in_service: "purple",
  completed: "green",
  skipped: "orange",
  cancelled: "red",
};
