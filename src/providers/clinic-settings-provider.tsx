"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import type { ClinicSetting } from "@/types/clinic-setting";
import clinicSettingService from "@/services/clinic-setting.service";

interface ClinicSettingsContextType {
  settings: ClinicSetting | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ClinicSettingsContext = createContext<
  ClinicSettingsContextType | undefined
>(undefined);

// Public routes that should use public API
const publicRoutes = ["/kiosk", "/queue/display", "/login", "/forgot-password"];

export function ClinicSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<ClinicSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const isPublicRoute = publicRoutes.some((route) =>
    pathname?.startsWith(route),
  );

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For public routes, always fetch fresh data from public API
      if (isPublicRoute) {
        try {
          const response = await clinicSettingService.getPublicInfo();
          if (response.success && response.data) {
            setSettings(response.data as ClinicSetting);
            // Also update the cache so it stays fresh
            localStorage.setItem(
              "clinic_settings",
              JSON.stringify(response.data),
            );
          }
        } catch {
          // On error, try to use cached data as fallback
          const cached = localStorage.getItem("clinic_settings");
          if (cached) {
            try {
              const parsedCache = JSON.parse(cached);
              setSettings(parsedCache);
            } catch {
              // Invalid cache, ignore
            }
          }
        }
      } else {
        // For authenticated routes, try cache first for faster load
        const cached = localStorage.getItem("clinic_settings");
        if (cached) {
          try {
            const parsedCache = JSON.parse(cached);
            setSettings(parsedCache);
          } catch {
            // Invalid cache, ignore
          }
        }

        // Fetch from authenticated API
        const response = await clinicSettingService.getSettings();
        if (response.success && response.data) {
          setSettings(response.data);
          // Cache the settings
          localStorage.setItem(
            "clinic_settings",
            JSON.stringify(response.data),
          );
        }
      }
    } catch (err) {
      console.error("Failed to fetch clinic settings:", err);
      setError("Gagal memuat pengaturan klinik");
      // Keep using cached data if available
    } finally {
      setIsLoading(false);
    }
  }, [isPublicRoute]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const refetch = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  return (
    <ClinicSettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </ClinicSettingsContext.Provider>
  );
}

export function useClinicSettings() {
  const context = useContext(ClinicSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useClinicSettings must be used within a ClinicSettingsProvider",
    );
  }
  return context;
}
