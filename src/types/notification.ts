// Notification types
export type NotificationType =
  | "po_pending_approval"
  | "po_approved"
  | "po_rejected"
  | "low_stock"
  | "expiring_medicine"
  | "new_patient"
  | "general";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    id?: number;
    link?: string;
    [key: string]: any;
  };
  read: boolean;
  created_at: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: Record<NotificationType, number>;
}

// Notification type labels
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  po_pending_approval: "PO Menunggu Persetujuan",
  po_approved: "PO Disetujui",
  po_rejected: "PO Ditolak",
  low_stock: "Stok Menipis",
  expiring_medicine: "Obat Kadaluarsa",
  new_patient: "Pasien Baru",
  general: "Umum",
};

// Notification type colors
export const NOTIFICATION_TYPE_COLORS: Record<NotificationType, string> = {
  po_pending_approval: "bg-yellow-500",
  po_approved: "bg-green-500",
  po_rejected: "bg-red-500",
  low_stock: "bg-orange-500",
  expiring_medicine: "bg-red-500",
  new_patient: "bg-blue-500",
  general: "bg-gray-500",
};
