"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Department } from "@/types/department";
import departmentService from "@/services/department.service";
import { DepartmentIcon } from "./department-icon";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  department,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!department) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting department:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Hapus Departemen
          </DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data departemen akan dihapus
            secara permanen.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-4"
        >
          {/* Department Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <div
              className={`p-3 rounded-xl ${departmentService.getColorClass(department.color)}`}
            >
              <DepartmentIcon icon={department.icon} className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{department.name}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {department.code}
              </p>
              <div className="mt-1">
                <Badge variant={department.is_active ? "success" : "error"}>
                  {department.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            Apakah Anda yakin ingin menghapus departemen ini?
          </p>
        </motion.div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="min-w-[100px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
