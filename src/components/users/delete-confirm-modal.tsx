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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/auth";
import { ROLE_LABELS } from "@/types/auth";
import { getInitials } from "@/lib/utils";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  user,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting user:", error);
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
            Hapus Pengguna
          </DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data pengguna akan dihapus
            secara permanen.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-4"
        >
          {/* User Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <Avatar className="h-14 w-14 border-2 border-destructive/30">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-destructive/10 text-destructive">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{user.name}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {ROLE_LABELS[user.role]}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            Apakah Anda yakin ingin menghapus pengguna ini?
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
