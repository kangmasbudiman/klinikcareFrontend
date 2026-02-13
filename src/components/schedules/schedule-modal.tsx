"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  User,
  Building2,
  Calendar,
  Clock,
  Users,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import type { DoctorSchedule, DayOfWeek } from "@/types/schedule";
import type { User as UserType } from "@/types/auth";
import type { Department } from "@/types/department";
import scheduleService from "@/services/schedule.service";
import userService from "@/services/user.service";
import departmentService from "@/services/department.service";

const formSchema = z.object({
  doctor_id: z.string().min(1, "Pilih dokter"),
  department_id: z.string().min(1, "Pilih poli"),
  day_of_week: z.string().min(1, "Pilih hari"),
  start_time: z.string().min(1, "Pilih jam mulai"),
  end_time: z.string().min(1, "Pilih jam selesai"),
  quota: z.coerce.number().min(1, "Minimal 1").max(100, "Maksimal 100"),
  is_active: z.boolean(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: DoctorSchedule | null;
  onSuccess: () => void;
}

export function ScheduleModal({
  open,
  onOpenChange,
  schedule,
  onSuccess,
}: ScheduleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<UserType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const isEditing = !!schedule;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctor_id: "",
      department_id: "",
      day_of_week: "",
      start_time: "",
      end_time: "",
      quota: 20,
      is_active: true,
      notes: "",
    },
  });

  const watchedIsActive = watch("is_active");

  // Fetch doctors and departments
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [doctorsRes, departmentsRes] = await Promise.all([
          userService.getDoctorsByDepartment(),
          departmentService.getActiveDepartments(),
        ]);
        setDoctors(doctorsRes.data);
        setDepartments(departmentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  // Reset form when schedule changes
  useEffect(() => {
    if (open) {
      if (schedule) {
        reset({
          doctor_id: schedule.doctor_id.toString(),
          department_id: schedule.department_id.toString(),
          day_of_week: schedule.day_of_week.toString(),
          start_time: scheduleService.formatTime(schedule.start_time),
          end_time: scheduleService.formatTime(schedule.end_time),
          quota: schedule.quota,
          is_active: schedule.is_active,
          notes: schedule.notes || "",
        });
      } else {
        reset({
          doctor_id: "",
          department_id: "",
          day_of_week: "",
          start_time: "",
          end_time: "",
          quota: 20,
          is_active: true,
          notes: "",
        });
      }
    }
  }, [schedule, open, reset]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        doctor_id: parseInt(values.doctor_id),
        department_id: parseInt(values.department_id),
        day_of_week: parseInt(values.day_of_week) as DayOfWeek,
        start_time: values.start_time,
        end_time: values.end_time,
        quota: values.quota,
        is_active: values.is_active,
        notes: values.notes || null,
      };

      if (isEditing && schedule) {
        await scheduleService.updateSchedule(schedule.id, payload);
        toast.success("Jadwal berhasil diperbarui");
      } else {
        await scheduleService.createSchedule(payload);
        toast.success("Jadwal berhasil dibuat");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      const message = error.response?.data?.message || "Gagal menyimpan jadwal";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const timeOptions = scheduleService.getTimeOptions();
  const dayOptions = scheduleService.getDayOptionsStatic();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Jadwal Dokter" : "Tambah Jadwal Dokter"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui jadwal praktek dokter"
              : "Buat jadwal praktek baru untuk dokter"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Doctor */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium">
                Dokter <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Controller
                  name="doctor_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Pilih dokter" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem
                            key={doctor.id}
                            value={doctor.id.toString()}
                          >
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <AnimatePresence>
                {errors.doctor_id && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.doctor_id.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Department */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium">
                Poli <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Controller
                  name="department_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Pilih poli" />
                      </SelectTrigger>
                      <SelectContent>
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
              <AnimatePresence>
                {errors.department_id && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.department_id.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Day of Week */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium">
                Hari <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Controller
                  name="day_of_week"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Pilih hari" />
                      </SelectTrigger>
                      <SelectContent>
                        {dayOptions.map((day) => (
                          <SelectItem
                            key={day.value}
                            value={day.value.toString()}
                          >
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <AnimatePresence>
                {errors.day_of_week && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.day_of_week.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium">
                  Jam Mulai <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Controller
                    name="start_time"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Pilih jam" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <AnimatePresence>
                  {errors.start_time && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.start_time.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium">
                  Jam Selesai <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Controller
                    name="end_time"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Pilih jam" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <AnimatePresence>
                  {errors.end_time && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.end_time.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Quota */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <Label htmlFor="quota" className="text-sm font-medium">
                Kuota Pasien <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="quota"
                  type="number"
                  min={1}
                  max={100}
                  className="pl-10"
                  {...register("quota", { valueAsNumber: true })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Jumlah maksimal pasien per sesi
              </p>
              <AnimatePresence>
                {errors.quota && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.quota.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="notes" className="text-sm font-medium">
                Catatan (Opsional)
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  id="notes"
                  placeholder="Catatan tambahan..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  {...register("notes")}
                />
              </div>
            </motion.div>

            {/* Is Active */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <Label htmlFor="is_active" className="text-sm font-medium">
                  Status Aktif
                </Label>
                <p className="text-xs text-muted-foreground">
                  {watchedIsActive
                    ? "Jadwal akan ditampilkan"
                    : "Jadwal tidak akan ditampilkan"}
                </p>
              </div>
              <Switch
                id="is_active"
                checked={watchedIsActive}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
            </motion.div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : isEditing ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Jadwal"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
