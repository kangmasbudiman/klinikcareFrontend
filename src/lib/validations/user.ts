import { z } from "zod";

// Schema untuk create user
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter")
    .max(50, "Password maksimal 50 karakter"),
  phone: z
    .string()
    .max(20, "Nomor telepon maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  role: z.enum(
    [
      "super_admin",
      "admin_klinik",
      "dokter",
      "perawat",
      "kasir",
      "apoteker",
      "pasien",
    ],
    {
      required_error: "Role wajib dipilih",
      invalid_type_error: "Role tidak valid",
    },
  ),
  is_active: z.boolean().default(true),
  avatar: z.string().optional(),
});

// Schema untuk update user (password optional)
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(50, "Password maksimal 50 karakter")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(20, "Nomor telepon maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  role: z.enum(
    [
      "super_admin",
      "admin_klinik",
      "dokter",
      "perawat",
      "kasir",
      "apoteker",
      "pasien",
    ],
    {
      required_error: "Role wajib dipilih",
      invalid_type_error: "Role tidak valid",
    },
  ),
  is_active: z.boolean().default(true),
  avatar: z.string().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
