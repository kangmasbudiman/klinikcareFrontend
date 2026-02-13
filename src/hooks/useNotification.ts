"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notification.service";
import { notificationSound, type RingtoneType } from "@/lib/notification-sound";
import { browserNotification } from "@/lib/browser-notification";
import type { Notification } from "@/types/notification";

interface UseNotificationOptions {
  enabled?: boolean;
  refreshInterval?: number; // in milliseconds
  soundEnabled?: boolean;
  browserNotificationEnabled?: boolean;
  onNewNotification?: (notification: Notification) => void;
}

interface UseNotificationReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  // Settings
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  soundVolume: number;
  setSoundVolume: (volume: number) => void;
  ringtone: RingtoneType;
  setRingtone: (ringtone: RingtoneType) => void;
  previewRingtone: (ringtone: RingtoneType) => void;
  browserNotificationEnabled: boolean;
  setBrowserNotificationEnabled: (enabled: boolean) => void;
  browserNotificationPermission: NotificationPermission;
  requestBrowserNotificationPermission: () => Promise<NotificationPermission>;
  // Actions
  handleNotificationClick: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  testSound: () => void;
  // Repeat sound
  isRinging: boolean;
  stopRinging: () => void;
}

export function useNotification(
  options: UseNotificationOptions = {},
): UseNotificationReturn {
  const {
    enabled = true,
    refreshInterval = 30000, // 30 seconds default
    onNewNotification,
  } = options;

  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Sound settings
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [soundVolume, setSoundVolumeState] = useState(0.8);
  const [ringtone, setRingtoneState] = useState<RingtoneType>("chime");

  // Browser notification settings
  const [browserNotificationEnabled, setBrowserNotificationEnabledState] =
    useState(true);
  const [browserNotificationPermission, setBrowserNotificationPermission] =
    useState<NotificationPermission>("default");

  // Track previous notification IDs to detect new ones
  const prevNotificationIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  // Ringing state
  const [isRinging, setIsRinging] = useState(false);

  // Initialize settings from localStorage
  useEffect(() => {
    setSoundEnabledState(notificationSound.isEnabled());
    setSoundVolumeState(notificationSound.getVolume());
    setRingtoneState(notificationSound.getRingtone());
    setBrowserNotificationEnabledState(browserNotification.isEnabled());
    setBrowserNotificationPermission(browserNotification.getPermission());
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const data = await notificationService.getNotifications();

      // Check for new notifications (not on first load)
      if (!isFirstLoad.current) {
        const newNotifications = data.filter(
          (n) => !prevNotificationIds.current.has(n.id),
        );

        if (newNotifications.length > 0) {
          // Start repeating sound for new notifications
          if (soundEnabled && !notificationSound.isCurrentlyRepeating()) {
            notificationSound.startRepeat();
            setIsRinging(true);
          }

          // Show browser notification for each new notification
          if (browserNotificationEnabled) {
            for (const notification of newNotifications) {
              browserNotification.show({
                title: notification.title,
                body: notification.message,
                tag: notification.id,
                data: notification.data,
                onClick: () => {
                  // Stop ringing when notification clicked
                  notificationSound.stopRepeat();
                  setIsRinging(false);
                  if (notification.data?.link) {
                    router.push(notification.data.link);
                  }
                },
              });
            }
          }

          // Callback for new notifications
          newNotifications.forEach((n) => onNewNotification?.(n));
        }
      }

      // If there are unread notifications and sound is not playing, start it
      const unreadNotifs = data.filter((n) => !n.read);
      if (unreadNotifs.length > 0 && soundEnabled && !isFirstLoad.current) {
        if (!notificationSound.isCurrentlyRepeating()) {
          notificationSound.startRepeat();
          setIsRinging(true);
        }
      }

      // Update previous IDs
      prevNotificationIds.current = new Set(data.map((n) => n.id));
      isFirstLoad.current = false;

      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch notifications"),
      );
    } finally {
      setLoading(false);
    }
  }, [
    enabled,
    soundEnabled,
    browserNotificationEnabled,
    router,
    onNewNotification,
  ]);

  // Initial fetch and interval
  useEffect(() => {
    fetchNotifications();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchNotifications, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchNotifications, refreshInterval]);

  // Sound settings handlers
  const setSoundEnabled = useCallback((enabled: boolean) => {
    notificationSound.setEnabled(enabled);
    setSoundEnabledState(enabled);
  }, []);

  const setSoundVolume = useCallback((volume: number) => {
    notificationSound.setVolume(volume);
    setSoundVolumeState(volume);
  }, []);

  const setRingtone = useCallback((newRingtone: RingtoneType) => {
    notificationSound.setRingtone(newRingtone);
    setRingtoneState(newRingtone);
  }, []);

  const previewRingtone = useCallback((ringtoneToPreview: RingtoneType) => {
    notificationSound.preview(ringtoneToPreview);
  }, []);

  // Browser notification settings handlers
  const setBrowserNotificationEnabled = useCallback((enabled: boolean) => {
    browserNotification.setEnabled(enabled);
    setBrowserNotificationEnabledState(enabled);
  }, []);

  const requestBrowserNotificationPermission = useCallback(async () => {
    const permission = await browserNotification.requestPermission();
    setBrowserNotificationPermission(permission);
    return permission;
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(
    (notificationId: string) => {
      notificationService.markAsRead(notificationId);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );

      // Check if all notifications are now read, stop ringing
      const stillUnread = notifications.filter(
        (n) => n.id !== notificationId && !n.read,
      );
      if (stillUnread.length === 0) {
        notificationSound.stopRepeat();
        setIsRinging(false);
      }
    },
    [notifications],
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const ids = notifications.map((n) => n.id);
    notificationService.markAllAsRead(ids);
    // Update local state
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // Stop ringing
    notificationSound.stopRepeat();
    setIsRinging(false);
  }, [notifications]);

  // Handle notification click - mark as read and stop ringing
  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      // Mark this notification as read
      notificationService.markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
      );

      // Stop ringing
      notificationSound.stopRepeat();
      setIsRinging(false);

      if (notification.data?.link) {
        router.push(notification.data.link);
      }
    },
    [router],
  );

  // Stop ringing manually
  const stopRinging = useCallback(() => {
    notificationSound.stopRepeat();
    setIsRinging(false);
  }, []);

  // Test sound
  const testSound = useCallback(() => {
    notificationSound.test();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      notificationSound.stopRepeat();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: fetchNotifications,
    // Settings
    soundEnabled,
    setSoundEnabled,
    soundVolume,
    setSoundVolume,
    ringtone,
    setRingtone,
    previewRingtone,
    browserNotificationEnabled,
    setBrowserNotificationEnabled,
    browserNotificationPermission,
    requestBrowserNotificationPermission,
    // Actions
    handleNotificationClick,
    markAsRead,
    markAllAsRead,
    testSound,
    // Repeat sound
    isRinging,
    stopRinging,
  };
}

export default useNotification;
