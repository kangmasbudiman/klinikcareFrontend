import { z } from "zod";

// Available colors
const departmentColors = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "pink",
  "indigo",
  "cyan",
  "orange",
  "teal",
] as const;

// Available icons
const departmentIcons = [
  "stethoscope",
  "tooth",
  "baby",
  "heart",
  "eye",
  "ear",
  "hand",
  "flask",
  "scan",
  "pill",
  "syringe",
  "bandage",
  "hospital",
  "activity",
] as const;

// Schema untuk create department
export const createDepartmentSchema = z.object({
  code: z
    .string()
    .min(1, "Kode wajib diisi")
    .max(20, "Kode maksimal 20 karakter")
    .regex(/^[A-Z0-9-]+$/, "Kode hanya boleh huruf kapital, angka, dan strip"),
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  icon: z.enum(departmentIcons).optional(),
  color: z.enum(departmentColors).default("blue"),
  quota_per_day: z
    .number()
    .min(1, "Kuota minimal 1")
    .max(1000, "Kuota maksimal 1000")
    .default(30),
  default_service_id: z.number().nullable().optional(),
  is_active: z.boolean().default(true),
});

// Schema untuk update department
export const updateDepartmentSchema = z.object({
  code: z
    .string()
    .min(1, "Kode wajib diisi")
    .max(20, "Kode maksimal 20 karakter")
    .regex(/^[A-Z0-9-]+$/, "Kode hanya boleh huruf kapital, angka, dan strip"),
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  icon: z.enum(departmentIcons).optional(),
  color: z.enum(departmentColors).default("blue"),
  quota_per_day: z
    .number()
    .min(1, "Kuota minimal 1")
    .max(1000, "Kuota maksimal 1000")
    .default(30),
  default_service_id: z.number().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;
