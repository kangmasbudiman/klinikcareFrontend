import { z } from "zod";

export const patientSchema = z.object({
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka")
    .optional()
    .or(z.literal("")),
  bpjs_number: z
    .string()
    .max(13, "No. BPJS maksimal 13 karakter")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(2, "Nama minimal 2 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  birth_place: z
    .string()
    .max(255, "Tempat lahir maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"], {
    required_error: "Jenis kelamin wajib dipilih",
    invalid_type_error: "Jenis kelamin tidak valid",
  }),
  blood_type: z
    .enum(["A", "B", "AB", "O"])
    .optional()
    .nullable(),
  religion: z
    .enum(["islam", "kristen", "katolik", "hindu", "buddha", "konghucu", "lainnya"])
    .optional()
    .nullable(),
  marital_status: z
    .enum(["single", "married", "divorced", "widowed"])
    .optional()
    .nullable(),
  occupation: z
    .string()
    .max(255, "Pekerjaan maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  education: z
    .string()
    .max(255, "Pendidikan maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(20, "No. telepon maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .optional()
    .or(z.literal("")),
  rt: z
    .string()
    .max(5, "RT maksimal 5 karakter")
    .optional()
    .or(z.literal("")),
  rw: z
    .string()
    .max(5, "RW maksimal 5 karakter")
    .optional()
    .or(z.literal("")),
  village: z
    .string()
    .max(255, "Kelurahan maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  district: z
    .string()
    .max(255, "Kecamatan maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(255, "Kota/Kabupaten maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  province: z
    .string()
    .max(255, "Provinsi maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  postal_code: z
    .string()
    .max(10, "Kode pos maksimal 10 karakter")
    .optional()
    .or(z.literal("")),
  emergency_contact_name: z
    .string()
    .max(255, "Nama kontak darurat maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  emergency_contact_relation: z
    .string()
    .max(255, "Hubungan maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  emergency_contact_phone: z
    .string()
    .max(20, "No. telepon kontak darurat maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  allergies: z
    .string()
    .optional()
    .or(z.literal("")),
  medical_notes: z
    .string()
    .optional()
    .or(z.literal("")),
  patient_type: z.enum(["umum", "bpjs", "asuransi"], {
    required_error: "Jenis pasien wajib dipilih",
    invalid_type_error: "Jenis pasien tidak valid",
  }),
  insurance_name: z
    .string()
    .max(255, "Nama asuransi maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  insurance_number: z
    .string()
    .max(255, "No. polis maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  photo: z.string().optional().or(z.literal("")),
});

export type PatientFormData = z.infer<typeof patientSchema>;

export const patientSearchSchema = z.object({
  q: z.string().min(2, "Minimal 2 karakter untuk pencarian"),
});

export type PatientSearchFormData = z.infer<typeof patientSearchSchema>;
