"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { patientSchema, type PatientFormData } from "@/lib/validations/patient";
import type { Patient } from "@/types/patient";
import patientService from "@/services/patient.service";

interface PatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
  onSuccess: () => void;
}

export function PatientModal({
  open,
  onOpenChange,
  patient,
  onSuccess,
}: PatientModalProps) {
  const isEdit = !!patient;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      nik: "",
      bpjs_number: "",
      birth_place: "",
      birth_date: "",
      gender: "male",
      blood_type: null,
      religion: null,
      marital_status: null,
      occupation: "",
      education: "",
      phone: "",
      email: "",
      address: "",
      rt: "",
      rw: "",
      village: "",
      district: "",
      city: "",
      province: "",
      postal_code: "",
      emergency_contact_name: "",
      emergency_contact_relation: "",
      emergency_contact_phone: "",
      allergies: "",
      medical_notes: "",
      patient_type: "umum",
      insurance_name: "",
      insurance_number: "",
    },
  });

  const watchedPatientType = watch("patient_type");
  const watchedGender = watch("gender");

  useEffect(() => {
    if (open) {
      setActiveTab("basic");
      if (patient) {
        reset({
          name: patient.name,
          nik: patient.nik || "",
          bpjs_number: patient.bpjs_number || "",
          birth_place: patient.birth_place || "",
          birth_date: patient.birth_date,
          gender: patient.gender,
          blood_type: patient.blood_type,
          religion: patient.religion,
          marital_status: patient.marital_status,
          occupation: patient.occupation || "",
          education: patient.education || "",
          phone: patient.phone || "",
          email: patient.email || "",
          address: patient.address || "",
          rt: patient.rt || "",
          rw: patient.rw || "",
          village: patient.village || "",
          district: patient.district || "",
          city: patient.city || "",
          province: patient.province || "",
          postal_code: patient.postal_code || "",
          emergency_contact_name: patient.emergency_contact_name || "",
          emergency_contact_relation: patient.emergency_contact_relation || "",
          emergency_contact_phone: patient.emergency_contact_phone || "",
          allergies: patient.allergies || "",
          medical_notes: patient.medical_notes || "",
          patient_type: patient.patient_type,
          insurance_name: patient.insurance_name || "",
          insurance_number: patient.insurance_number || "",
        });
      } else {
        reset({
          name: "",
          nik: "",
          bpjs_number: "",
          birth_place: "",
          birth_date: "",
          gender: "male",
          blood_type: null,
          religion: null,
          marital_status: null,
          occupation: "",
          education: "",
          phone: "",
          email: "",
          address: "",
          rt: "",
          rw: "",
          village: "",
          district: "",
          city: "",
          province: "",
          postal_code: "",
          emergency_contact_name: "",
          emergency_contact_relation: "",
          emergency_contact_phone: "",
          allergies: "",
          medical_notes: "",
          patient_type: "umum",
          insurance_name: "",
          insurance_number: "",
        });
      }
    }
  }, [open, patient, reset]);

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    try {
      // Clean empty strings to null
      const payload = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      );

      if (isEdit && patient) {
        await patientService.updatePatient(patient.id, payload);
      } else {
        await patientService.createPatient(payload as any);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving patient:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = patientService.getGenderOptions();
  const patientTypeOptions = patientService.getPatientTypeOptions();
  const religionOptions = patientService.getReligionOptions();
  const maritalStatusOptions = patientService.getMaritalStatusOptions();
  const bloodTypeOptions = patientService.getBloodTypeOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Data Pasien" : "Registrasi Pasien Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi pasien."
              : "Isi data pasien baru untuk pendaftaran."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-4 py-2"
          >
            <div
              className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                watchedGender === "male" ? "bg-blue-500" : "bg-pink-500"
              }`}
            >
              {watch("name")?.charAt(0)?.toUpperCase() || "?"}
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Data Diri</TabsTrigger>
              <TabsTrigger value="address">Alamat</TabsTrigger>
              <TabsTrigger value="emergency">Darurat</TabsTrigger>
              <TabsTrigger value="medical">Medis</TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic Info */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              {/* Name & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Nama lengkap sesuai KTP"
                      className="pl-10"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Jenis Kelamin <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* NIK & BPJS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK (No. KTP)</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nik"
                      placeholder="16 digit NIK"
                      maxLength={16}
                      className="pl-10"
                      {...register("nik")}
                    />
                  </div>
                  {errors.nik && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.nik.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bpjs_number">No. BPJS</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="bpjs_number"
                      placeholder="No. kartu BPJS"
                      maxLength={13}
                      className="pl-10"
                      {...register("bpjs_number")}
                    />
                  </div>
                </div>
              </div>

              {/* Birth */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birth_place">Tempat Lahir</Label>
                  <Input
                    id="birth_place"
                    placeholder="Kota tempat lahir"
                    {...register("birth_place")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">
                    Tanggal Lahir <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="birth_date"
                      type="date"
                      className="pl-10"
                      {...register("birth_date")}
                    />
                  </div>
                  {errors.birth_date && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.birth_date.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">No. Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="08xxxxxxxxxx"
                      className="pl-10"
                      {...register("phone")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      {...register("email")}
                    />
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Gol. Darah</Label>
                  <Controller
                    name="blood_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={(v) => field.onChange(v || null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Agama</Label>
                  <Controller
                    name="religion"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={(v) => field.onChange(v || null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          {religionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status Pernikahan</Label>
                  <Controller
                    name="marital_status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={(v) => field.onChange(v || null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          {maritalStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Jenis Pasien <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="patient_type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                        <SelectContent>
                          {patientTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Insurance (show if asuransi) */}
              <AnimatePresence>
                {watchedPatientType === "asuransi" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="insurance_name">Nama Asuransi</Label>
                      <Input
                        id="insurance_name"
                        placeholder="Prudential, Allianz, dll"
                        {...register("insurance_name")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurance_number">No. Polis</Label>
                      <Input
                        id="insurance_number"
                        placeholder="Nomor polis asuransi"
                        {...register("insurance_number")}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Occupation & Education */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Pekerjaan</Label>
                  <Input
                    id="occupation"
                    placeholder="Pekerjaan saat ini"
                    {...register("occupation")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Pendidikan Terakhir</Label>
                  <Input
                    id="education"
                    placeholder="SD/SMP/SMA/D3/S1/S2/dll"
                    {...register("education")}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Address */}
            <TabsContent value="address" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    id="address"
                    placeholder="Jalan, nomor rumah, gang, dll"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...register("address")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rt">RT</Label>
                  <Input id="rt" placeholder="001" maxLength={5} {...register("rt")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rw">RW</Label>
                  <Input id="rw" placeholder="002" maxLength={5} {...register("rw")} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="village">Kelurahan/Desa</Label>
                  <Input id="village" placeholder="Nama kelurahan" {...register("village")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">Kecamatan</Label>
                  <Input id="district" placeholder="Nama kecamatan" {...register("district")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Kota/Kabupaten</Label>
                  <Input id="city" placeholder="Nama kota/kabupaten" {...register("city")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Provinsi</Label>
                  <Input id="province" placeholder="Nama provinsi" {...register("province")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Kode Pos</Label>
                  <Input id="postal_code" placeholder="12345" maxLength={10} {...register("postal_code")} />
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Emergency Contact */}
            <TabsContent value="emergency" className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Informasi kontak darurat akan digunakan jika terjadi keadaan darurat pada pasien.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Nama Kontak Darurat</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="emergency_contact_name"
                    placeholder="Nama lengkap"
                    className="pl-10"
                    {...register("emergency_contact_name")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_relation">Hubungan</Label>
                  <Input
                    id="emergency_contact_relation"
                    placeholder="Istri/Suami/Anak/Orang tua/dll"
                    {...register("emergency_contact_relation")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">No. Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="emergency_contact_phone"
                      placeholder="08xxxxxxxxxx"
                      className="pl-10"
                      {...register("emergency_contact_phone")}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: Medical */}
            <TabsContent value="medical" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Alergi</Label>
                <div className="relative">
                  <Heart className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    id="allergies"
                    placeholder="Daftar alergi obat, makanan, dll (pisahkan dengan koma)"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...register("allergies")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical_notes">Catatan Medis</Label>
                <textarea
                  id="medical_notes"
                  placeholder="Riwayat penyakit, kondisi khusus, catatan penting lainnya"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  {...register("medical_notes")}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Daftarkan Pasien"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
