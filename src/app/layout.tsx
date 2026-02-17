import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Clinexa - Bicara. Catat. Sembuhkan.",
  description:
    "Sistem manajemen klinik berbasis AI dengan fitur lengkap untuk mengelola pasien, rekam medis, farmasi, dan operasional klinik",
  icons: {
    icon: "/logo/clinexa-icon-32x32.png",
    apple: "/logo/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
