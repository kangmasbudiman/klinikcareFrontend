"use client";

import { motion } from "framer-motion";
import {
  Hash,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Power,
  FileText,
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
import type { Department } from "@/types/department";
import { formatDate } from "@/lib/utils";
import departmentService from "@/services/department.service";
import { DepartmentIcon } from "./department-icon";

interface DepartmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export function DepartmentDetailModal({
  open,
  onOpenChange,
  department,
  onEdit,
  onToggleStatus,
}: DepartmentDetailModalProps) {
  if (!department) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Departemen</DialogTitle>
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
                className={`p-5 rounded-2xl ${departmentService.getColorClass(department.color)}`}
              >
                <DepartmentIcon icon={department.icon} className="h-12 w-12" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center ${
                  department.is_active ? "bg-emerald-500" : "bg-gray-400"
                }`}
              >
                {department.is_active ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <XCircle className="h-4 w-4 text-white" />
                )}
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold">{department.name}</h3>
            <p className="text-sm text-muted-foreground">{department.code}</p>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant={department.is_active ? "success" : "error"}>
                {department.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
          </motion.div>

          <Separator />

          {/* Department Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Code */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Kode</p>
                <p className="text-sm font-medium">{department.code}</p>
              </div>
            </div>

            {/* Description */}
            {department.description && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Deskripsi</p>
                  <p className="text-sm font-medium">{department.description}</p>
                </div>
              </div>
            )}

            {/* Quota */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Kuota Per Hari</p>
                <p className="text-sm font-medium">
                  {department.quota_per_day} pasien
                </p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Dibuat Pada</p>
                <p className="text-sm font-medium">
                  {formatDate(department.created_at)}
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
            <Button
              variant={department.is_active ? "destructive" : "default"}
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onToggleStatus();
              }}
            >
              <Power className="mr-2 h-4 w-4" />
              {department.is_active ? "Nonaktifkan" : "Aktifkan"}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
