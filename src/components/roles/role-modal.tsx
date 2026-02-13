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
  Shield,
  Check,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { roleSchema, type RoleFormData } from "@/lib/validations/role";
import type { Role } from "@/types/role";
import type { PermissionGroup } from "@/types/permission";
import roleService from "@/services/role.service";
import permissionService from "@/services/permission.service";

interface RoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSuccess: () => void;
}

export function RoleModal({
  open,
  onOpenChange,
  role,
  onSuccess,
}: RoleModalProps) {
  const isEdit = !!role;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(
    [],
  );
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      display_name: "",
      description: "",
      color: "blue",
      is_active: true,
      permissions: [],
    },
  });

  const watchedColor = watch("color");
  const watchedIsActive = watch("is_active");

  // Fetch permission groups
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await roleService.getPermissionsMatrix();
        setPermissionGroups(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    if (open) {
      fetchPermissions();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (role) {
        reset({
          name: role.name,
          display_name: role.display_name,
          description: role.description || "",
          color: role.color || "blue",
          is_active: role.is_active,
          permissions: role.permissions?.map((p) => p.id) || [],
        });
        setSelectedPermissions(role.permissions?.map((p) => p.id) || []);
      } else {
        reset({
          name: "",
          display_name: "",
          description: "",
          color: "blue",
          is_active: true,
          permissions: [],
        });
        setSelectedPermissions([]);
      }
    }
  }, [open, role, reset]);

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      }
      return [...prev, permissionId];
    });
  };

  const handleModuleToggle = (
    modulePermissions: PermissionGroup["permissions"],
  ) => {
    const modulePermIds = modulePermissions.map((p) => p.id);
    const allSelected = modulePermIds.every((id) =>
      selectedPermissions.includes(id),
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !modulePermIds.includes(id)),
      );
    } else {
      setSelectedPermissions((prev) => [
        ...new Set([...prev, ...modulePermIds]),
      ]);
    }
  };

  const isModuleFullySelected = (
    modulePermissions: PermissionGroup["permissions"],
  ) => {
    return modulePermissions.every((p) => selectedPermissions.includes(p.id));
  };

  const isModulePartiallySelected = (
    modulePermissions: PermissionGroup["permissions"],
  ) => {
    const selected = modulePermissions.filter((p) =>
      selectedPermissions.includes(p.id),
    );
    return selected.length > 0 && selected.length < modulePermissions.length;
  };

  const onSubmit = async (data: RoleFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        permissions: selectedPermissions,
      };

      if (isEdit && role) {
        await roleService.updateRole(role.id, payload);
      } else {
        await roleService.createRole(payload);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorOptions = roleService.getColorOptions();
  const actionLabels = permissionService.getActionLabels();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Role" : "Tambah Role Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi role dan hak akses."
              : "Isi informasi role baru dan pilih hak akses."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-4"
          >
            <div
              className={`p-4 rounded-2xl ${roleService.getSolidColorClass(watchedColor || "blue")} text-white`}
            >
              <Shield className="h-10 w-10" />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Preview warna role
              </p>
              <p className="font-medium mt-1">
                {selectedPermissions.length} permission dipilih
              </p>
            </div>
          </motion.div>

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Role <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="admin_klinik"
                  className="pl-10 lowercase"
                  {...register("name")}
                  onChange={(e) =>
                    setValue(
                      "name",
                      e.target.value.toLowerCase().replace(/\s/g, "_"),
                    )
                  }
                  disabled={isEdit && role?.is_system}
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

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <Label htmlFor="display_name" className="text-sm font-medium">
                Nama Tampilan <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="display_name"
                  placeholder="Admin Klinik"
                  className="pl-10"
                  {...register("display_name")}
                />
              </div>
              <AnimatePresence>
                {errors.display_name && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.display_name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Description & Color Row */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-2 space-y-2"
            >
              <Label htmlFor="description" className="text-sm font-medium">
                Deskripsi
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  id="description"
                  placeholder="Deskripsi singkat role..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  {...register("description")}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium">Warna</Label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
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
                              <span className="text-xs">
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

              {/* Status Switch */}
              <div className="flex items-center justify-between rounded-lg border p-3 mt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active" className="text-sm font-medium">
                    Status Aktif
                  </Label>
                </div>
                <Switch
                  id="is_active"
                  checked={watchedIsActive}
                  onCheckedChange={(checked) => setValue("is_active", checked)}
                  disabled={isEdit && role?.is_system}
                />
              </div>
            </motion.div>
          </div>

          {/* Permissions Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Label className="text-sm font-medium">
              Hak Akses / Permissions
            </Label>
            <div className="border rounded-lg">
              <Accordion type="multiple" className="w-full">
                {permissionGroups.map((group) => (
                  <AccordionItem key={group.module} value={group.module}>
                    <div className="flex items-center">
                      {/* Checkbox di luar AccordionTrigger untuk menghindari button-in-button */}
                      <div
                        className="pl-4 pr-2 py-4 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModuleToggle(group.permissions);
                        }}
                      >
                        <Checkbox
                          checked={isModuleFullySelected(group.permissions)}
                          onCheckedChange={() =>
                            handleModuleToggle(group.permissions)
                          }
                          className={
                            isModulePartiallySelected(group.permissions)
                              ? "opacity-50"
                              : ""
                          }
                        />
                      </div>
                      <AccordionTrigger className="flex-1 pr-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{group.label}</span>
                          <span className="text-xs text-muted-foreground">
                            (
                            {
                              group.permissions.filter((p) =>
                                selectedPermissions.includes(p.id),
                              ).length
                            }
                            /{group.permissions.length})
                          </span>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {group.permissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedPermissions.includes(
                                permission.id,
                              )}
                              onCheckedChange={() =>
                                handlePermissionToggle(permission.id)
                              }
                            />
                            <span className="text-sm">
                              {actionLabels[permission.action] ||
                                permission.action}
                            </span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
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
              "Tambah Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
