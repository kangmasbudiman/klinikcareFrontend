import { z } from "zod";

export const serviceSchema = z.object({
  code: z
    .string()
    .min(1, "Kode layanan wajib diisi")
    .max(20, "Kode maksimal 20 karakter"),
  name: z
    .string()
    .min(1, "Nama layanan wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  description: z
    .string()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
  category: z.enum(
    ["konsultasi", "tindakan", "laboratorium", "radiologi", "farmasi", "rawat_inap", "lainnya"],
    { errorMap: () => ({ message: "Kategori wajib dipilih" }) }
  ),
  department_id: z
    .number()
    .nullable()
    .optional(),
  base_price: z
    .number({ invalid_type_error: "Tarif dasar harus berupa angka" })
    .min(0, "Tarif dasar minimal 0"),
  doctor_fee: z
    .number({ invalid_type_error: "Biaya dokter harus berupa angka" })
    .min(0, "Biaya dokter minimal 0")
    .optional()
    .default(0),
  hospital_fee: z
    .number({ invalid_type_error: "Biaya klinik harus berupa angka" })
    .min(0, "Biaya klinik minimal 0")
    .optional()
    .default(0),
  duration: z
    .number({ invalid_type_error: "Durasi harus berupa angka" })
    .min(5, "Durasi minimal 5 menit")
    .max(480, "Durasi maksimal 480 menit (8 jam)"),
  is_active: z.boolean().optional().default(true),
  requires_appointment: z.boolean().optional().default(false),
  icon: z
    .string()
    .max(50, "Icon maksimal 50 karakter")
    .optional()
    .or(z.literal("")),
  color: z
    .string()
    .max(20, "Warna maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
