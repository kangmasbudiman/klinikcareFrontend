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
import type { Service } from "@/types/service";
import serviceService from "@/services/service.service";
import { ServiceIcon } from "./service-icon";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  service,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!service) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting service:", error);
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
            Hapus Layanan
          </DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data layanan akan dihapus
            secara permanen.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-4"
        >
          {/* Service Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <div
              className={`p-3 rounded-xl ${serviceService.getColorClass(service.color)}`}
            >
              <ServiceIcon icon={service.icon} className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{service.name}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {service.code}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={service.is_active ? "success" : "error"}>
                  {service.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
                <Badge
                  variant="secondary"
                  className={serviceService.getCategoryColorClass(service.category)}
                >
                  {service.category_label}
                </Badge>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            Apakah Anda yakin ingin menghapus layanan ini?
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
