import { z } from "zod";

export const icdCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Kode ICD wajib diisi")
    .max(20, "Kode maksimal 20 karakter")
    .regex(/^[A-Z0-9.]+$/i, "Kode hanya boleh berisi huruf, angka, dan titik"),
  type: z.enum(["icd10", "icd9cm"], {
    errorMap: () => ({ message: "Tipe ICD wajib dipilih" }),
  }),
  name_id: z
    .string()
    .min(1, "Nama (Indonesia) wajib diisi")
    .max(500, "Nama maksimal 500 karakter"),
  name_en: z
    .string()
    .max(500, "Nama (English) maksimal 500 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  chapter: z
    .string()
    .max(10, "Chapter maksimal 10 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  chapter_name: z
    .string()
    .max(255, "Nama chapter maksimal 255 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  block: z
    .string()
    .max(20, "Block maksimal 20 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  block_name: z
    .string()
    .max(255, "Nama block maksimal 255 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  parent_code: z
    .string()
    .max(20, "Parent code maksimal 20 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  dtd_code: z
    .string()
    .max(20, "DTD code maksimal 20 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  is_bpjs_claimable: z.boolean().optional().default(true),
  is_active: z.boolean().optional().default(true),
  notes: z
    .string()
    .max(1000, "Catatan maksimal 1000 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type IcdCodeFormData = z.infer<typeof icdCodeSchema>;

// Import validation
export const icdCodeImportSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, "File wajib dipilih")
    .refine(
      (file) =>
        ["text/csv", "application/json", "application/vnd.ms-excel"].includes(
          file.type
        ) || file.name.endsWith(".csv") || file.name.endsWith(".json"),
      "File harus berupa CSV atau JSON"
    )
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "Ukuran file maksimal 10MB"
    ),
  type: z.enum(["icd10", "icd9cm"], {
    errorMap: () => ({ message: "Tipe ICD wajib dipilih" }),
  }),
});

export type IcdCodeImportFormData = z.infer<typeof icdCodeImportSchema>;
