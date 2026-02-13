"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Camera,
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/lib/validations/user";
import type { User as UserType } from "@/types/auth";
import { getInitials } from "@/lib/utils";
import userService from "@/services/user.service";

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserType | null;
  onSuccess: () => void;
}

export function UserModal({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserModalProps) {
  const isEdit = !!user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "pasien",
      is_active: true,
      avatar: "",
    },
  });

  const watchedName = watch("name");
  const watchedIsActive = watch("is_active");

  useEffect(() => {
    if (open) {
      if (user) {
        // Edit mode - populate form with user data
        reset({
          name: user.name,
          email: user.email,
          password: "",
          phone: user.phone || "",
          role: user.role,
          is_active: user.is_active,
          avatar: user.avatar || "",
        });
        setAvatarPreview(user.avatar || "");
      } else {
        // Create mode - reset to defaults
        reset({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "pasien",
          is_active: true,
          avatar: "",
        });
        setAvatarPreview("");
      }
    }
  }, [open, user, reset]);

  // Generate avatar preview based on name
  useEffect(() => {
    if (!avatarPreview && watchedName) {
      setAvatarPreview(
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(watchedName)}`,
      );
    }
  }, [watchedName, avatarPreview]);

  const onSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    setIsSubmitting(true);
    try {
      // Set avatar if not provided
      const payload = {
        ...data,
        avatar:
          data.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      };

      if (isEdit && user) {
        // Remove empty password on update
        if (!payload.password) {
          delete (payload as UpdateUserFormData).password;
        }
        await userService.updateUser(user.id, payload);
      } else {
        await userService.createUser(payload as CreateUserFormData);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = userService.getRoleOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi pengguna di bawah ini."
              : "Isi informasi pengguna baru di bawah ini."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          {/* Avatar Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage
                  src={avatarPreview}
                  alt={watchedName || "Avatar"}
                />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {watchedName ? getInitials(watchedName) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Avatar akan dibuat otomatis berdasarkan nama
            </p>
          </motion.div>

          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="name" className="text-sm font-medium">
              Nama Lengkap <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
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

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <Label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                className="pl-10"
                {...register("email")}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="password" className="text-sm font-medium">
              Password {!isEdit && <span className="text-destructive">*</span>}
              {isEdit && (
                <span className="text-muted-foreground font-normal">
                  (kosongkan jika tidak ingin mengubah)
                </span>
              )}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder={isEdit ? "••••••••" : "Minimal 6 karakter"}
                className="pl-10"
                {...register("password")}
              />
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Phone Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <Label htmlFor="phone" className="text-sm font-medium">
              Nomor Telepon
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="081234567890"
                className="pl-10"
                {...register("phone")}
              />
            </div>
            <AnimatePresence>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Role Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="role" className="text-sm font-medium">
              Role <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Select
                value={watch("role")}
                onValueChange={(value) =>
                  setValue("role", value as CreateUserFormData["role"])
                }
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <AnimatePresence>
              {errors.role && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.role.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Status Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="space-y-0.5">
              <Label htmlFor="is_active" className="text-sm font-medium">
                Status Aktif
              </Label>
              <p className="text-xs text-muted-foreground">
                {watchedIsActive
                  ? "Pengguna dapat mengakses sistem"
                  : "Pengguna tidak dapat login"}
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
              "Tambah Pengguna"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
