"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  MapPin,
  Phone,
  Globe,
  FileText,
  Clock,
  Settings2,
  Save,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MessageCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import clinicSettingService from "@/services/clinic-setting.service";
import {
  clinicSettingSchema,
  type ClinicSettingFormData,
} from "@/lib/validations/clinic-setting";
import type {
  ClinicSetting,
  DAY_NAMES,
  DAY_LABELS,
  OperationalHours,
} from "@/types/clinic-setting";
import { useClinicSettings } from "@/providers/clinic-settings-provider";

// Default operational hours
const defaultOperationalHours: OperationalHours = {
  monday: { open: "08:00", close: "17:00", is_open: true },
  tuesday: { open: "08:00", close: "17:00", is_open: true },
  wednesday: { open: "08:00", close: "17:00", is_open: true },
  thursday: { open: "08:00", close: "17:00", is_open: true },
  friday: { open: "08:00", close: "17:00", is_open: true },
  saturday: { open: "08:00", close: "12:00", is_open: true },
  sunday: { open: "08:00", close: "12:00", is_open: false },
};

const dayNames: (keyof OperationalHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const dayLabels: Record<keyof OperationalHours, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

export default function ClinicSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<ClinicSetting | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Get refetch function from clinic settings context to update sidebar
  const { refetch: refetchClinicSettings } = useClinicSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ClinicSettingFormData>({
    resolver: zodResolver(clinicSettingSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      phone: "",
      phone_2: "",
      whatsapp: "",
      email: "",
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
      license_number: "",
      npwp: "",
      owner_name: "",
      timezone: "Asia/Jakarta",
      currency: "IDR",
      date_format: "d/m/Y",
      time_format: "H:i",
      default_queue_quota: 50,
      appointment_duration: 15,
      operational_hours: defaultOperationalHours,
    },
  });

  const operationalHours =
    watch("operational_hours") || defaultOperationalHours;

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await clinicSettingService.getSettings();
        setSettings(response.data);

        // Set form values
        reset({
          name: response.data.name || "",
          tagline: response.data.tagline || "",
          description: response.data.description || "",
          address: response.data.address || "",
          city: response.data.city || "",
          province: response.data.province || "",
          postal_code: response.data.postal_code || "",
          phone: response.data.phone || "",
          phone_2: response.data.phone_2 || "",
          whatsapp: response.data.whatsapp || "",
          email: response.data.email || "",
          website: response.data.website || "",
          facebook: response.data.facebook || "",
          instagram: response.data.instagram || "",
          twitter: response.data.twitter || "",
          license_number: response.data.license_number || "",
          npwp: response.data.npwp || "",
          owner_name: response.data.owner_name || "",
          timezone: response.data.timezone || "Asia/Jakarta",
          currency: response.data.currency || "IDR",
          date_format: response.data.date_format || "d/m/Y",
          time_format: response.data.time_format || "H:i",
          default_queue_quota: response.data.default_queue_quota || 50,
          appointment_duration: response.data.appointment_duration || 15,
          operational_hours:
            response.data.operational_hours || defaultOperationalHours,
        });

        if (response.data.logo_url) {
          setLogoPreview(response.data.logo_url);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Gagal memuat pengaturan klinik");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  // Handle form submit
  const onSubmit = async (data: ClinicSettingFormData) => {
    try {
      setIsSaving(true);
      await clinicSettingService.updateSettings(data);
      toast.success("Pengaturan berhasil disimpan");
      // Refetch clinic settings to update sidebar logo/name
      await refetchClinicSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    try {
      setIsUploadingLogo(true);
      const response = await clinicSettingService.uploadLogo(file);
      setLogoPreview(response.data.url);
      toast.success("Logo berhasil diunggah");
      // Refetch clinic settings to update sidebar logo
      await refetchClinicSettings();
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Gagal mengunggah logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Update operational hours day
  const updateDayHours = (
    day: keyof OperationalHours,
    field: "open" | "close" | "is_open",
    value: string | boolean,
  ) => {
    const currentHours = operationalHours;
    setValue(
      "operational_hours",
      {
        ...currentHours,
        [day]: {
          ...currentHours[day],
          [field]: value,
        },
      },
      { shouldDirty: true },
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-10 bg-muted animate-pulse rounded"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pengaturan Klinik</h1>
          <p className="text-muted-foreground mt-1">
            Kelola informasi dan konfigurasi klinik
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            disabled={isSaving}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan Perubahan
          </Button>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2"
        >
          {/* Basic Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                    <CardDescription>Identitas klinik</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo */}
                <div className="space-y-2">
                  <Label>Logo Klinik</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      )}
                    </div>
                    <div>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={isUploadingLogo}
                      >
                        {isUploadingLogo ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload Logo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: JPG, PNG. Maks: 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nama Klinik <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama klinik"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Tagline */}
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    placeholder="Slogan atau tagline klinik"
                    {...register("tagline")}
                  />
                  {errors.tagline && (
                    <p className="text-sm text-destructive">
                      {errors.tagline.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <textarea
                    id="description"
                    rows={3}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Deskripsi singkat tentang klinik"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Kontak & Alamat</CardTitle>
                    <CardDescription>Informasi kontak klinik</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <textarea
                    id="address"
                    rows={2}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Alamat lengkap klinik"
                    {...register("address")}
                  />
                </div>

                {/* City & Province */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota</Label>
                    <Input id="city" placeholder="Kota" {...register("city")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Select
                      value={watch("province") || ""}
                      onValueChange={(value) =>
                        setValue("province", value, { shouldDirty: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih provinsi" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinicSettingService
                          .getProvinceOptions()
                          .map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Postal Code */}
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Kode Pos</Label>
                  <Input
                    id="postal_code"
                    placeholder="Kode pos"
                    {...register("postal_code")}
                  />
                </div>

                {/* Phones */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="h-3 w-3 inline mr-1" />
                      Telepon
                    </Label>
                    <Input
                      id="phone"
                      placeholder="021-xxxxx"
                      {...register("phone")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_2">Telepon 2</Label>
                    <Input
                      id="phone_2"
                      placeholder="021-xxxxx"
                      {...register("phone_2")}
                    />
                  </div>
                </div>

                {/* WhatsApp & Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">
                      <MessageCircle className="h-3 w-3 inline mr-1" />
                      WhatsApp
                    </Label>
                    <Input
                      id="whatsapp"
                      placeholder="08xxxxxxxxxx"
                      {...register("whatsapp")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="h-3 w-3 inline mr-1" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@klinik.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website">
                    <Globe className="h-3 w-3 inline mr-1" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://www.klinik.com"
                    {...register("website")}
                  />
                  {errors.website && (
                    <p className="text-sm text-destructive">
                      {errors.website.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50">
                    <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Media Sosial</CardTitle>
                    <CardDescription>Link media sosial klinik</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">
                    <Facebook className="h-3 w-3 inline mr-1" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/klinik"
                    {...register("facebook")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">
                    <Instagram className="h-3 w-3 inline mr-1" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/klinik"
                    {...register("instagram")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">
                    <Twitter className="h-3 w-3 inline mr-1" />
                    Twitter/X
                  </Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/klinik"
                    {...register("twitter")}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Legal Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/50">
                    <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Informasi Legal</CardTitle>
                    <CardDescription>Data legalitas klinik</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="license_number">Nomor Izin Praktik</Label>
                  <Input
                    id="license_number"
                    placeholder="Nomor surat izin klinik"
                    {...register("license_number")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="npwp">NPWP</Label>
                  <Input
                    id="npwp"
                    placeholder="Nomor NPWP klinik"
                    {...register("npwp")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner_name">
                    Nama Pemilik/Penanggung Jawab
                  </Label>
                  <Input
                    id="owner_name"
                    placeholder="Nama pemilik klinik"
                    {...register("owner_name")}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Operational Hours - Full Width */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/50">
                    <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Jam Operasional</CardTitle>
                    <CardDescription>Jadwal buka tutup klinik</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center justify-between sm:w-32">
                        <span className="font-medium">{dayLabels[day]}</span>
                        <Switch
                          checked={operationalHours[day]?.is_open ?? true}
                          onCheckedChange={(checked) =>
                            updateDayHours(day, "is_open", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={operationalHours[day]?.open ?? "08:00"}
                          onChange={(e) =>
                            updateDayHours(day, "open", e.target.value)
                          }
                          disabled={!operationalHours[day]?.is_open}
                          className="w-auto"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="time"
                          value={operationalHours[day]?.close ?? "17:00"}
                          onChange={(e) =>
                            updateDayHours(day, "close", e.target.value)
                          }
                          disabled={!operationalHours[day]?.is_open}
                          className="w-auto"
                        />
                        {!operationalHours[day]?.is_open && (
                          <span className="text-sm text-muted-foreground ml-2">
                            Tutup
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Settings - Full Width */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Settings2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Pengaturan Sistem</CardTitle>
                    <CardDescription>
                      Konfigurasi format dan preferensi
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Timezone */}
                  <div className="space-y-2">
                    <Label>Zona Waktu</Label>
                    <Select
                      value={watch("timezone")}
                      onValueChange={(value) =>
                        setValue("timezone", value, { shouldDirty: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {clinicSettingService.getTimezoneOptions().map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <Label>Mata Uang</Label>
                    <Select
                      value={watch("currency")}
                      onValueChange={(value) =>
                        setValue("currency", value, { shouldDirty: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {clinicSettingService.getCurrencyOptions().map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Format */}
                  <div className="space-y-2">
                    <Label>Format Tanggal</Label>
                    <Select
                      value={watch("date_format")}
                      onValueChange={(value) =>
                        setValue("date_format", value, { shouldDirty: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {clinicSettingService
                          .getDateFormatOptions()
                          .map((df) => (
                            <SelectItem key={df.value} value={df.value}>
                              {df.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Format */}
                  <div className="space-y-2">
                    <Label>Format Waktu</Label>
                    <Select
                      value={watch("time_format")}
                      onValueChange={(value) =>
                        setValue("time_format", value, { shouldDirty: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {clinicSettingService
                          .getTimeFormatOptions()
                          .map((tf) => (
                            <SelectItem key={tf.value} value={tf.value}>
                              {tf.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Queue Quota */}
                  <div className="space-y-2">
                    <Label htmlFor="default_queue_quota">
                      Kuota Antrian Default
                    </Label>
                    <Input
                      id="default_queue_quota"
                      type="number"
                      min={1}
                      max={500}
                      {...register("default_queue_quota", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.default_queue_quota && (
                      <p className="text-sm text-destructive">
                        {errors.default_queue_quota.message}
                      </p>
                    )}
                  </div>

                  {/* Appointment Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="appointment_duration">
                      Durasi Janji Temu (menit)
                    </Label>
                    <Input
                      id="appointment_duration"
                      type="number"
                      min={5}
                      max={120}
                      {...register("appointment_duration", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.appointment_duration && (
                      <p className="text-sm text-destructive">
                        {errors.appointment_duration.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Floating Save Button for Mobile */}
        <div className="fixed bottom-4 right-4 md:hidden z-50">
          <Button
            type="submit"
            size="lg"
            className="rounded-full shadow-lg"
            disabled={isSaving || !isDirty}
          >
            {isSaving ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
