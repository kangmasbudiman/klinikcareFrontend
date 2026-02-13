"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, FileCode2 } from "lucide-react";
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
import type { IcdCode } from "@/types/icd-code";
import icdCodeService from "@/services/icd-code.service";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icdCode: IcdCode | null;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  icdCode,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!icdCode) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting ICD code:", error);
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
            Hapus Kode ICD
          </DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data kode ICD akan dihapus
            secara permanen.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-4"
        >
          {/* ICD Code Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <div
              className={`p-3 rounded-xl ${icdCodeService.getTypeColorClass(icdCode.type)}`}
            >
              <FileCode2 className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <code className="font-mono font-bold">{icdCode.code}</code>
              <p className="text-sm text-muted-foreground truncate mt-1">
                {icdCode.name_id}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={icdCode.is_active ? "success" : "error"}>
                  {icdCode.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
                <Badge
                  variant="secondary"
                  className={icdCodeService.getTypeColorClass(icdCode.type)}
                >
                  {icdCodeService.formatTypeLabel(icdCode.type)}
                </Badge>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            Apakah Anda yakin ingin menghapus kode ICD ini?
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
