import { z } from "zod";

// Day hours schema
const dayHoursSchema = z.object({
  open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid"),
  close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid"),
  is_open: z.boolean(),
});

// Operational hours schema
const operationalHoursSchema = z.object({
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
  saturday: dayHoursSchema,
  sunday: dayHoursSchema,
});

// Main clinic setting schema
export const clinicSettingSchema = z.object({
  // Basic Information
  name: z
    .string()
    .min(1, "Nama klinik wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  tagline: z
    .string()
    .max(200, "Tagline maksimal 200 karakter")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),

  // Contact Information
  address: z
    .string()
    .max(500, "Alamat maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(100, "Kota maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  province: z
    .string()
    .max(100, "Provinsi maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  postal_code: z
    .string()
    .max(10, "Kode pos maksimal 10 karakter")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(20, "Telepon maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  phone_2: z
    .string()
    .max(20, "Telepon 2 maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  whatsapp: z
    .string()
    .max(20, "WhatsApp maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Format email tidak valid")
    .max(100, "Email maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Format URL tidak valid")
    .max(200, "Website maksimal 200 karakter")
    .optional()
    .or(z.literal("")),

  // Social Media
  facebook: z
    .string()
    .max(200, "Facebook maksimal 200 karakter")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .max(200, "Instagram maksimal 200 karakter")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .max(200, "Twitter maksimal 200 karakter")
    .optional()
    .or(z.literal("")),

  // Legal Information
  license_number: z
    .string()
    .max(100, "Nomor izin maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  npwp: z
    .string()
    .max(50, "NPWP maksimal 50 karakter")
    .optional()
    .or(z.literal("")),
  owner_name: z
    .string()
    .max(100, "Nama pemilik maksimal 100 karakter")
    .optional()
    .or(z.literal("")),

  // Operational Hours
  operational_hours: operationalHoursSchema.optional(),

  // Settings
  timezone: z.string().default("Asia/Jakarta"),
  currency: z.string().default("IDR"),
  date_format: z.string().default("d/m/Y"),
  time_format: z.string().default("H:i"),

  // Queue Settings
  default_queue_quota: z
    .number()
    .min(1, "Kuota minimal 1")
    .max(500, "Kuota maksimal 500")
    .default(50),
  appointment_duration: z
    .number()
    .min(5, "Durasi minimal 5 menit")
    .max(120, "Durasi maksimal 120 menit")
    .default(15),
});

export type ClinicSettingFormData = z.infer<typeof clinicSettingSchema>;
