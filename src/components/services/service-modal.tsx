"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash,
  FileText,
  Palette,
  Loader2,
  AlertCircle,
  Clock,
  Banknote,
  Building2,
  FolderOpen,
  CalendarCheck,
  ClipboardList,
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
import { serviceSchema, type ServiceFormData } from "@/lib/validations/service";
import type { Service, ServiceCategory } from "@/types/service";
import type { Department } from "@/types/department";
import serviceService from "@/services/service.service";
import departmentService from "@/services/department.service";
import { ServiceIcon } from "./service-icon";

interface ServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  onSuccess: () => void;
}

export function ServiceModal({
  open,
  onOpenChange,
  service,
  onSuccess,
}: ServiceModalProps) {
  const isEdit = !!service;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      category: "konsultasi",
      department_id: null,
      base_price: 0,
      doctor_fee: 0,
      hospital_fee: 0,
      duration: 15,
      is_active: true,
      requires_appointment: false,
      icon: "stethoscope",
      color: "blue",
    },
  });

  const watchedColor = watch("color");
  const watchedIcon = watch("icon");
  const watchedIsActive = watch("is_active");
  const watchedRequiresAppointment = watch("requires_appointment");
  const watchedBasePrice = watch("base_price") || 0;
  const watchedDoctorFee = watch("doctor_fee") || 0;
  const watchedHospitalFee = watch("hospital_fee") || 0;

  const totalPrice = watchedBasePrice + watchedDoctorFee + watchedHospitalFee;

  // Fetch departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getActiveDepartments();
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (open) {
      if (service) {
        reset({
          code: service.code,
          name: service.name,
          description: service.description || "",
          category: service.category,
          department_id: service.department_id,
          base_price: Number(service.base_price),
          doctor_fee: Number(service.doctor_fee),
          hospital_fee: Number(service.hospital_fee),
          duration: service.duration,
          is_active: service.is_active,
          requires_appointment: service.requires_appointment,
          icon: service.icon || "stethoscope",
          color: service.color || "blue",
        });
      } else {
        reset({
          code: "",
          name: "",
          description: "",
          category: "konsultasi",
          department_id: null,
          base_price: 0,
          doctor_fee: 0,
          hospital_fee: 0,
          duration: 15,
          is_active: true,
          requires_appointment: false,
          icon: "stethoscope",
          color: "blue",
        });
      }
    }
  }, [open, service, reset]);

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        department_id: data.department_id || null,
      };

      if (isEdit && service) {
        await serviceService.updateService(service.id, payload);
      } else {
        await serviceService.createService(payload);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorOptions = serviceService.getColorOptions();
  const iconOptions = serviceService.getIconOptions();
  const categoryOptions = serviceService.getCategoryOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Layanan" : "Tambah Layanan Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi layanan di bawah ini."
              : "Isi informasi layanan baru di bawah ini."}
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
              className={`p-4 rounded-2xl ${serviceService.getColorClass(watchedColor || "blue")}`}
            >
              <ServiceIcon icon={watchedIcon || "stethoscope"} className="h-10 w-10" />
            </div>
            <p className="text-xs text-muted-foreground">
              Preview ikon dan warna layanan
            </p>
          </motion.div>

          {/* Code & Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="code" className="text-sm font-medium">
                Kode Layanan <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="code"
                  placeholder="KON-001"
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

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Layanan <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Konsultasi Dokter Umum"
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
          </div>

          {/* Category & Department Row */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium">
                Kategori <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <AnimatePresence>
                {errors.category && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.category.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium">Departemen</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Controller
                  name="department_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() || "none"}
                      onValueChange={(val) =>
                        field.onChange(val === "none" ? null : Number(val))
                      }
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Pilih departemen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tidak ada</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </motion.div>
          </div>

          {/* Description Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="description" className="text-sm font-medium">
              Deskripsi
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="description"
                placeholder="Deskripsi singkat layanan..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                {...register("description")}
              />
            </div>
          </motion.div>

          {/* Pricing Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-4 p-4 rounded-lg border bg-muted/30"
          >
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Informasi Tarif</Label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="base_price" className="text-xs">
                  Tarif Dasar <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="base_price"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("base_price", { valueAsNumber: true })}
                />
                {errors.base_price && (
                  <p className="text-xs text-destructive">{errors.base_price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor_fee" className="text-xs">
                  Biaya Dokter
                </Label>
                <Input
                  id="doctor_fee"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("doctor_fee", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital_fee" className="text-xs">
                  Biaya Klinik
                </Label>
                <Input
                  id="hospital_fee"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("hospital_fee", { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Total Tarif</span>
              <span className="font-semibold text-lg">
                {serviceService.formatPrice(totalPrice)}
              </span>
            </div>
          </motion.div>

          {/* Duration & Icon/Color Row */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="duration" className="text-sm font-medium">
                Durasi (menit) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="duration"
                  type="number"
                  min={5}
                  max={480}
                  placeholder="15"
                  className="pl-10"
                  {...register("duration", { valueAsNumber: true })}
                />
              </div>
              {errors.duration && (
                <p className="text-xs text-destructive">{errors.duration.message}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium">Ikon</Label>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih ikon">
                        {field.value && (
                          <div className="flex items-center gap-2">
                            <ServiceIcon icon={field.value} className="h-4 w-4" />
                            <span className="text-xs">
                              {iconOptions.find((o) => o.value === field.value)?.label}
                            </span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <ServiceIcon icon={option.value} className="h-4 w-4" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium">Warna</Label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Pilih warna">
                          {field.value && (
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-full ${
                                  colorOptions.find((o) => o.value === field.value)?.class
                                }`}
                              />
                              <span className="text-xs">
                                {colorOptions.find((o) => o.value === field.value)?.label}
                              </span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full ${option.class}`} />
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

          {/* Status Switches */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <Label htmlFor="is_active" className="text-sm font-medium">
                  Status Aktif
                </Label>
                <p className="text-xs text-muted-foreground">
                  {watchedIsActive ? "Layanan tersedia" : "Layanan tidak tersedia"}
                </p>
              </div>
              <Switch
                id="is_active"
                checked={watchedIsActive}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <Label htmlFor="requires_appointment" className="text-sm font-medium flex items-center gap-1">
                  <CalendarCheck className="h-3.5 w-3.5" />
                  Perlu Janji Temu
                </Label>
                <p className="text-xs text-muted-foreground">
                  {watchedRequiresAppointment ? "Wajib booking" : "Tidak wajib booking"}
                </p>
              </div>
              <Switch
                id="requires_appointment"
                checked={watchedRequiresAppointment}
                onCheckedChange={(checked) => setValue("requires_appointment", checked)}
              />
            </motion.div>
          </div>
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
              "Tambah Layanan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
