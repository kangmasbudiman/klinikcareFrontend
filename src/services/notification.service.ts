import { purchaseOrderService } from "./pharmacy.service";
import type { Notification, NotificationType } from "@/types/notification";
import type { PurchaseOrder } from "@/types/pharmacy";

// Storage key for read notifications
const READ_NOTIFICATIONS_KEY = "read_notifications";

// Helper untuk get read notification IDs from localStorage
const getReadNotificationIds = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error("Error reading notification state:", error);
  }
  return new Set();
};

// Helper untuk save read notification IDs to localStorage
const saveReadNotificationIds = (ids: Set<string>): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...ids]));
  } catch (error) {
    console.error("Error saving notification state:", error);
  }
};

// Helper untuk format waktu relatif
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Convert PO to notification
const poToNotification = (
  po: PurchaseOrder,
  readIds: Set<string>,
): Notification => {
  const id = `po-${po.id}`;
  return {
    id,
    type: "po_pending_approval" as NotificationType,
    title: "PO Menunggu Persetujuan",
    message: `${po.po_number} dari ${po.supplier?.name || "Supplier"} - ${new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      },
    ).format(po.total_amount)}`,
    data: {
      id: po.id,
      po_number: po.po_number,
      supplier_name: po.supplier?.name,
      total_amount: po.total_amount,
      link: "/pharmacy/purchase-orders",
    },
    read: readIds.has(id),
    created_at: po.created_at,
  };
};

export const notificationService = {
  // Fetch all notifications (combines different sources)
  async getNotifications(): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const readIds = getReadNotificationIds();

    try {
      // Fetch PO pending approval
      const pendingPOs = await purchaseOrderService.getPendingApproval();
      if (Array.isArray(pendingPOs)) {
        pendingPOs.forEach((po) => {
          notifications.push(poToNotification(po, readIds));
        });
      }
    } catch (error) {
      console.error("Error fetching pending POs:", error);
    }

    // Sort by created_at descending (newest first)
    notifications.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return notifications;
  },

  // Get unread count
  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter((n) => !n.read).length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  },

  // Mark single notification as read
  markAsRead(notificationId: string): void {
    const readIds = getReadNotificationIds();
    readIds.add(notificationId);
    saveReadNotificationIds(readIds);
  },

  // Mark all notifications as read
  markAllAsRead(notificationIds: string[]): void {
    const readIds = getReadNotificationIds();
    notificationIds.forEach((id) => readIds.add(id));
    saveReadNotificationIds(readIds);
  },

  // Check if notification is read
  isRead(notificationId: string): boolean {
    const readIds = getReadNotificationIds();
    return readIds.has(notificationId);
  },

  // Clear read status (useful when notification is no longer relevant)
  clearReadStatus(notificationId: string): void {
    const readIds = getReadNotificationIds();
    readIds.delete(notificationId);
    saveReadNotificationIds(readIds);
  },

  // Clear all read statuses
  clearAllReadStatus(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(READ_NOTIFICATIONS_KEY);
  },

  // Format notification time
  formatTime(dateString: string): string {
    return getRelativeTime(dateString);
  },
};

export default notificationService;
