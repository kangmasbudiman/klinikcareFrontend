"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Power,
  Shield,
  Users,
  Lock,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Role } from "@/types/role";
import { formatDate } from "@/lib/utils";
import roleService from "@/services/role.service";
import permissionService from "@/services/permission.service";

interface RoleDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export function RoleDetailModal({
  open,
  onOpenChange,
  role,
  onEdit,
  onToggleStatus,
}: RoleDetailModalProps) {
  if (!role) return null;

  const moduleLabels = permissionService.getModuleLabels();
  const actionLabels = permissionService.getActionLabels();

  // Group permissions by module
  const permissionsByModule =
    role.permissions?.reduce(
      (acc, perm) => {
        if (!acc[perm.module]) {
          acc[perm.module] = [];
        }
        acc[perm.module].push(perm);
        return acc;
      },
      {} as Record<string, typeof role.permissions>,
    ) || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Role</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative">
              <div
                className={`p-5 rounded-2xl ${roleService.getSolidColorClass(role.color)} text-white`}
              >
                <Shield className="h-12 w-12" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center ${
                  role.is_active ? "bg-emerald-500" : "bg-gray-400"
                }`}
              >
                {role.is_active ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <XCircle className="h-4 w-4 text-white" />
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <h3 className="text-lg font-semibold">{role.display_name}</h3>
              {role.is_system && (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{role.name}</p>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant={role.is_active ? "success" : "error"}>
                {role.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
              {role.is_system && <Badge variant="secondary">System Role</Badge>}
            </div>
          </motion.div>

          <Separator />

          {/* Role Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            {/* Description */}
            {role.description && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
                <p className="text-sm">{role.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Permissions</p>
                  <p className="text-lg font-semibold">
                    {role.permissions_count || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                  <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pengguna</p>
                  <p className="text-lg font-semibold">
                    {role.users_count || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Permissions List */}
            {Object.keys(permissionsByModule).length > 0 && (
              <div className="p-3 rounded-lg bg-muted/50 space-y-3">
                <p className="text-xs text-muted-foreground font-medium">
                  Hak Akses
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(permissionsByModule).map(
                    ([module, perms]) => (
                      <div key={module} className="flex items-start gap-2">
                        <div className="min-w-[120px] text-sm font-medium">
                          {moduleLabels[module] || module}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {perms?.map((perm) => (
                            <Badge
                              key={perm.id}
                              variant="outline"
                              className="text-xs"
                            >
                              <Check className="h-2.5 w-2.5 mr-1" />
                              {actionLabels[perm.action] || perm.action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Created At */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Dibuat Pada</p>
                <p className="text-sm font-medium">
                  {formatDate(role.created_at)}
                </p>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onEdit();
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            {!role.is_system && (
              <Button
                variant={role.is_active ? "destructive" : "default"}
                className="flex-1"
                onClick={() => {
                  onOpenChange(false);
                  onToggleStatus();
                }}
              >
                <Power className="mr-2 h-4 w-4" />
                {role.is_active ? "Nonaktifkan" : "Aktifkan"}
              </Button>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
