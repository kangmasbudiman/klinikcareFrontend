import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Nama role wajib diisi")
    .max(50, "Nama maksimal 50 karakter")
    .regex(
      /^[a-z_]+$/,
      "Nama hanya boleh huruf kecil dan underscore (contoh: admin_klinik)"
    ),
  display_name: z
    .string()
    .min(1, "Nama tampilan wajib diisi")
    .max(100, "Nama tampilan maksimal 100 karakter"),
  description: z
    .string()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  color: z.string().max(20, "Warna maksimal 20 karakter").optional(),
  is_active: z.boolean().optional().default(true),
  permissions: z.array(z.number()).optional(),
});

export type RoleFormData = z.infer<typeof roleSchema>;
