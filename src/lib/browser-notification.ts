// Browser Push Notification Utility

export interface BrowserNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  onClick?: () => void;
}

class BrowserNotification {
  private permission: NotificationPermission = "default";
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSettings();
      this.checkPermission();
    }
  }

  private loadSettings() {
    try {
      const settings = localStorage.getItem("browser_notification_settings");
      if (settings) {
        const parsed = JSON.parse(settings);
        this.enabled = parsed.enabled ?? true;
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(
        "browser_notification_settings",
        JSON.stringify({ enabled: this.enabled }),
      );
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  }

  private checkPermission() {
    if ("Notification" in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return "denied";
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  }

  isSupported(): boolean {
    return "Notification" in window;
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }

  isPermissionGranted(): boolean {
    return this.permission === "granted";
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.saveSettings();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async show(
    options: BrowserNotificationOptions,
  ): Promise<Notification | null> {
    if (!this.enabled) return null;
    if (!this.isSupported()) return null;

    // Request permission if not granted
    if (this.permission !== "granted") {
      const result = await this.requestPermission();
      if (result !== "granted") return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || "/icons/notification-icon.png",
        badge: options.badge || "/icons/badge-icon.png",
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction ?? false,
        silent: options.silent ?? false,
      });

      if (options.onClick) {
        notification.onclick = () => {
          window.focus();
          options.onClick?.();
          notification.close();
        };
      }

      // Auto close after 5 seconds if not requireInteraction
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      return notification;
    } catch (error) {
      console.error("Error showing notification:", error);
      return null;
    }
  }

  // Shorthand methods
  async info(title: string, body: string, onClick?: () => void) {
    return this.show({ title, body, onClick });
  }

  async success(title: string, body: string, onClick?: () => void) {
    return this.show({ title, body, onClick, tag: "success" });
  }

  async warning(title: string, body: string, onClick?: () => void) {
    return this.show({
      title,
      body,
      onClick,
      tag: "warning",
      requireInteraction: true,
    });
  }

  async error(title: string, body: string, onClick?: () => void) {
    return this.show({
      title,
      body,
      onClick,
      tag: "error",
      requireInteraction: true,
    });
  }
}

// Singleton instance
export const browserNotification = new BrowserNotification();

export default browserNotification;
