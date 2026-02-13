"use client";

import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { ClinicSettingsProvider } from "./clinic-settings-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>
          <ClinicSettingsProvider>
            {children}
            <Toaster position="top-right" richColors />
          </ClinicSettingsProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
