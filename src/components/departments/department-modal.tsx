"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash,
  Building2,
  FileText,
  Palette,
  Users,
  Loader2,
  AlertCircle,
  Stethoscope,
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  type CreateDepartmentFormData,
  type UpdateDepartmentFormData,
} from "@/lib/validations/department";
import type {
  Department,
  DepartmentIcon as DepartmentIconType,
} from "@/types/department";
import type { Service } from "@/types/service";
import departmentService from "@/services/department.service";
import serviceService from "@/services/service.service";
import { DepartmentIcon } from "./department-icon";

interface DepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
  onSuccess: () => void;
}

export function DepartmentModal({
  open,
  onOpenChange,
  department,
  onSuccess,
}: DepartmentModalProps) {
  const isEdit = !!department;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateDepartmentFormData | UpdateDepartmentFormData>({
    resolver: zodResolver(
      isEdit ? updateDepartmentSchema : createDepartmentSchema,
    ),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      icon: "stethoscope",
      color: "blue",
      quota_per_day: 30,
      default_service_id: null,
      is_active: true,
    },
  });

  const watchedColor = watch("color");
  const watchedIcon = watch("icon");
  const watchedIsActive = watch("is_active");
  const watchedDefaultServiceId = watch("default_service_id");

  // Load services for dropdown
  useEffect(() => {
    const loadServices = async () => {
      setLoadingServices(true);
      try {
        const response = await serviceService.getActiveServices({
          category: "konsultasi",
        });
        setServices(response.data);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    if (open) {
      loadServices();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (department) {
        reset({
          code: department.code,
          name: department.name,
          description: department.description || "",
          icon: department.icon || "stethoscope",
          color: department.color || "blue",
          quota_per_day: department.quota_per_day,
          default_service_id: department.default_service_id,
          is_active: department.is_active,
        });
      } else {
        reset({
          code: "",
          name: "",
          description: "",
          icon: "stethoscope",
          color: "blue",
          quota_per_day: 30,
          default_service_id: null,
          is_active: true,
        });
      }
    }
  }, [open, department, reset]);

  const onSubmit = async (
    data: CreateDepartmentFormData | UpdateDepartmentFormData,
  ) => {
    setIsSubmitting(true);
    try {
      if (isEdit && department) {
        await departmentService.updateDepartment(department.id, data);
      } else {
        await departmentService.createDepartment(
          data as CreateDepartmentFormData,
        );
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving department:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorOptions = departmentService.getColorOptions();
  const iconOptions = departmentService.getIconOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Departemen" : "Tambah Departemen Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi departemen di bawah ini."
              : "Isi informasi departemen baru di bawah ini."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div
              className={`p-4 rounded-2xl ${departmentService.getColorClass(watchedColor || "blue")}`}
            >
              <DepartmentIcon
                icon={(watchedIcon || "stethoscope") as DepartmentIconType}
                className="h-10 w-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Preview ikon dan warna departemen
            </p>
          </motion.div>

          {/* Code Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="code" className="text-sm font-medium">
              Kode Departemen <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="code"
                placeholder="POLI-001"
                className="pl-10 uppercase"
                {...register("code")}
                onChange={(e) => setValue("code", e.target.value.toUpperCase())}
              />
            </div>
            <AnimatePresence>
              {errors.code && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.code.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <Label htmlFor="name" className="text-sm font-medium">
              Nama Departemen <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Poli Umum"
                className="pl-10"
                {...register("name")}
              />
            </div>
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Description Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="description" className="text-sm font-medium">
              Deskripsi
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="description"
                placeholder="Deskripsi singkat departemen..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                {...register("description")}
              />
            </div>
            <AnimatePresence>
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.description.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Icon & Color Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Icon Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <Label htmlFor="icon" className="text-sm font-medium">
                Ikon
              </Label>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih ikon">
                        {field.value && (
                          <div className="flex items-center gap-2">
                            <DepartmentIcon
                              icon={field.value as DepartmentIconType}
                              className="h-4 w-4"
                            />
                            <span>
                              {
                                iconOptions.find((o) => o.value === field.value)
                                  ?.label
                              }
                            </span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <DepartmentIcon
                              icon={option.value}
                              className="h-4 w-4"
                            />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </motion.div>

            {/* Color Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="color" className="text-sm font-medium">
                Warna
              </Label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Pilih warna">
                          {field.value && (
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-full ${
                                  colorOptions.find(
                                    (o) => o.value === field.value,
                                  )?.class
                                }`}
                              />
                              <span>
                                {
                                  colorOptions.find(
                                    (o) => o.value === field.value,
                                  )?.label
                                }
                              </span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-full ${option.class}`}
                              />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </motion.div>
          </div>

          {/* Quota Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-2"
          >
            <Label htmlFor="quota_per_day" className="text-sm font-medium">
              Kuota Per Hari <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="quota_per_day"
                type="number"
                min={1}
                max={1000}
                placeholder="30"
                className="pl-10"
                {...register("quota_per_day", { valueAsNumber: true })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Jumlah maksimal pasien yang dapat dilayani per hari
            </p>
            <AnimatePresence>
              {errors.quota_per_day && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.quota_per_day.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Default Service Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.37 }}
            className="space-y-2"
          >
            <Label htmlFor="default_service_id" className="text-sm font-medium">
              Layanan Konsultasi Default
            </Label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Controller
                name="default_service_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || "none"}
                    onValueChange={(val) =>
                      field.onChange(val === "none" ? null : parseInt(val))
                    }
                    disabled={loadingServices}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue
                        placeholder={
                          loadingServices
                            ? "Memuat..."
                            : "Pilih layanan konsultasi"
                        }
                      >
                        {field.value ? (
                          <span>
                            {services.find((s) => s.id === field.value)?.name ||
                              "Layanan terpilih"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Tidak ada
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <span className="text-muted-foreground">
                          Tidak ada layanan default
                        </span>
                      </SelectItem>
                      {services.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span>{service.name}</span>
                            <span className="text-xs text-muted-foreground">
                              Rp{" "}
                              {service.total_price?.toLocaleString("id-ID") ||
                                0}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Layanan ini akan otomatis ditambahkan saat dokter memulai
              pemeriksaan
            </p>
          </motion.div>

          {/* Status Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="space-y-0.5">
              <Label htmlFor="is_active" className="text-sm font-medium">
                Status Aktif
              </Label>
              <p className="text-xs text-muted-foreground">
                {watchedIsActive
                  ? "Departemen tersedia untuk pelayanan"
                  : "Departemen tidak tersedia"}
              </p>
            </div>
            <Switch
              id="is_active"
              checked={watchedIsActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
          </motion.div>
        </form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : isEdit ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Departemen"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
