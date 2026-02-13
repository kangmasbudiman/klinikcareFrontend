"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, Shield, Users } from "lucide-react";
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
import type { Role } from "@/types/role";
import roleService from "@/services/role.service";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  role,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!role) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasUsers = (role.users_count || 0) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Hapus Role
          </DialogTitle>
          <DialogDescription>
            {hasUsers
              ? "Role ini tidak dapat dihapus karena masih memiliki pengguna."
              : "Tindakan ini tidak dapat dibatalkan. Data role akan dihapus secara permanen."}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-4"
        >
          {/* Role Preview */}
          <div className={`flex items-center gap-4 p-4 rounded-xl ${hasUsers ? "bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800" : "bg-destructive/10 border border-destructive/20"}`}>
            <div
              className={`p-3 rounded-xl ${roleService.getSolidColorClass(role.color)} text-white`}
            >
              <Shield className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{role.display_name}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {role.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={role.is_active ? "success" : "error"}>
                  {role.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
                {hasUsers && (
                  <Badge variant="outline" className="gap-1">
                    <Users className="h-3 w-3" />
                    {role.users_count} pengguna
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {hasUsers ? (
            <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 text-center">
              Hapus atau pindahkan pengguna dari role ini terlebih dahulu.
            </p>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Apakah Anda yakin ingin menghapus role ini?
            </p>
          )}
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
            disabled={isDeleting || hasUsers}
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
